import type { PrismaClient } from "@/../generated/prisma";
import { TRPCError } from "@trpc/server";
import z from "zod";
import { calculateAvgCourseProgress } from "./progress";

export type CourseListItem = {
  id: string;
  name: string;
  published: boolean;
  modulesCount: number;
  questionsCount: number;
  studentsCount: number;
  avgProgress: number; // 0-1
  avgMastery: number; // 0-1
};

export async function listCoursesForTeacher(
  db: PrismaClient,
  teacherId: string,
): Promise<CourseListItem[]> {
  const courses = await db.course.findMany({
    where: { teacherId },
    orderBy: { createdAt: "desc" },
    include: {
      modules: {
        select: {
          id: true,
          _count: { select: { questions: true } },
          moduleProgresses: { select: { studentId: true, level: true } },
        },
      },
      studentInCourses: { select: { studentId: true } },
    },
  });

  return courses.map((course) => {
    const modulesCount = course.modules.length;

    const questionsCount = course.modules.reduce(
      (sum, mod) => sum + mod._count.questions,
      0,
    );

    const studentsCount = course.studentInCourses.length;

    const progress = calculateAvgCourseProgress(
      course.modules,
      course.studentInCourses,
    );

    return {
      id: course.id,
      name: course.name,
      published: course.published,
      modulesCount,
      questionsCount,
      studentsCount,
      ...progress,
    };
  });
}

export const createCourseSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .max(100, "Name is too long"),
  description: z
    .string()
    .trim()
    .max(2000, "Description is too long")
    .optional()
    .transform((v) => (v === "" ? undefined : v)),
});
export type CreateCourseInput = z.infer<typeof createCourseSchema>;

export async function createCourse(
  db: PrismaClient,
  teacherId: string,
  input: CreateCourseInput,
): Promise<{ id: string }> {
  return db.course.create({
    data: {
      name: input.name,
      description: input.description,
      teacherId,
    },
    select: { id: true },
  });
}

export type CourseOverview = {
  id: string;
  name: string;
  description: string | null;
  published: boolean;
  modulesCount: number;
  questionsCount: number;
  studentsCount: number;
  avgProgress: number;
  avgMastery: number;
};

export async function getCourseOverview(
  db: PrismaClient,
  courseId: string,
  teacherId: string,
): Promise<CourseOverview> {
  const course = await db.course.findUnique({
    where: { id: courseId },
    include: {
      modules: {
        select: {
          id: true,
          _count: { select: { questions: true } },
          moduleProgresses: {
            select: { studentId: true, level: true },
          },
        },
      },
      studentInCourses: { select: { studentId: true } },
    },
  });

  if (!course) {
    throw new TRPCError({ code: "NOT_FOUND", message: "Course not found" });
  }

  if (course.teacherId !== teacherId) {
    throw new TRPCError({ code: "FORBIDDEN", message: "Not your course" });
  }

  const modulesCount = course.modules.length;

  const questionsCount = course.modules.reduce(
    (sum, mod) => sum + mod._count.questions,
    0,
  );

  const studentsCount = course.studentInCourses.length;

  const progress = calculateAvgCourseProgress(
    course.modules,
    course.studentInCourses,
  );

  return {
    id: course.id,
    name: course.name,
    description: course.description,
    published: course.published,
    modulesCount,
    questionsCount,
    studentsCount,
    ...progress,
  };
}

export async function assertCourseOwnership(
  db: PrismaClient,
  courseId: string,
  teacherId: string,
): Promise<void> {
  const course = await db.course.findUnique({
    where: { id: courseId },
    select: { teacherId: true },
  });

  if (!course) {
    throw new TRPCError({ code: "NOT_FOUND", message: "Course not found" });
  }

  if (course.teacherId !== teacherId) {
    throw new TRPCError({ code: "FORBIDDEN", message: "Not your course" });
  }
}
