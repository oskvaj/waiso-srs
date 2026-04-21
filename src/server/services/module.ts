import type { PrismaClient } from "@/../generated/prisma";
import { calculateAvgModuleProgress } from "./progress";
import z from "zod";
import { assertCourseOwnership } from "./course";

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
