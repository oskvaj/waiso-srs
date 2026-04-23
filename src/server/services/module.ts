import type { PrismaClient } from "@/../generated/prisma";
import { calculateAvgModuleProgress } from "./progress";
import z from "zod";
import { assertCourseOwnership } from "./course";
import { TRPCError } from "@trpc/server";

export type ModuleListItem = {
  id: string;
  name: string;
  questionsCount: number;
  avgProgress: number;
  avgMastery: number;
};

export async function listModulesForTeacher(
  db: PrismaClient,
  courseId: string,
  teacherId: string,
): Promise<ModuleListItem[]> {
  await assertCourseOwnership(db, courseId, teacherId);

  const enrolledCount = await db.studentInCourse.count({
    where: { courseId },
  });

  const modules = await db.module.findMany({
    where: { courseId },
    orderBy: { createdAt: "asc" }, // TODO: order by something based on prerequisites in future
    select: {
      id: true,
      name: true,
      _count: { select: { questions: true } },
      moduleProgresses: {
        select: { studentId: true, level: true },
      },
    },
  });

  return modules.map((m) => {
    const progress = calculateAvgModuleProgress(
      m.moduleProgresses,
      enrolledCount,
    );

    return {
      id: m.id,
      name: m.name,
      questionsCount: m._count.questions,
      ...progress,
    };
  });
}

export const createModuleSchema = z.object({
  courseId: z.string(),
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .max(100, "Name is too long"),
});
export type CreateModuleInput = z.infer<typeof createModuleSchema>;

export async function createModule(
  db: PrismaClient,
  teacherId: string,
  input: CreateModuleInput,
): Promise<{ id: string }> {
  await assertCourseOwnership(db, input.courseId, teacherId);

  return db.module.create({
    data: {
      name: input.name,
      courseId: input.courseId,
      content: {},
    },
    select: { id: true },
  });
}

export type ModuleDetail = {
  id: string;
  name: string;
  content: unknown;
  courseId: string;
  courseName: string;
};

export async function getModuleDetail(
  db: PrismaClient,
  moduleId: string,
  teaacherId: string,
): Promise<ModuleDetail> {
  const mod = await db.module.findUnique({
    where: { id: moduleId },
    include: {
      course: {
        select: { name: true, teacherId: true },
      },
    },
  });

  if (!mod) {
    throw new TRPCError({ code: "NOT_FOUND", message: "Module not found" });
  }

  if (mod.course.teacherId !== teaacherId) {
    throw new TRPCError({ code: "FORBIDDEN", message: "Not your module" });
  }

  return {
    id: mod.id,
    name: mod.name,
    content: mod.content,
    courseId: mod.courseId,
    courseName: mod.course.name,
  };
}

export const updateModuleSchema = z.object({
  id: z.string(),
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .max(255, "Name is too long")
    .optional(),
  content: z.unknown().optional(),
});
export type UpdateModuleInput = z.infer<typeof updateModuleSchema>;

export async function updateModule(
  db: PrismaClient,
  teacherId: string,
  input: UpdateModuleInput,
): Promise<{ id: string }> {
  const mod = await db.module.findUnique({
    where: { id: input.id },
    include: {
      course: {
        select: { teacherId: true },
      },
    },
  });

  if (!mod) {
    throw new TRPCError({ code: "NOT_FOUND", message: "Module not found" });
  }

  if (mod.course.teacherId !== teacherId) {
    throw new TRPCError({ code: "FORBIDDEN", message: "Not your module" });
  }

  return db.module.update({
    where: { id: input.id },
    data: {
      name: input.name,
      content: input.content ?? undefined,
    },
    select: { id: true },
  });
}
