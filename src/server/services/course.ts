import type { PrismaClient } from "@/../generated/prisma";
import { TRPCError } from "@trpc/server";
import z from "zod";
import { calculateAvgCourseProgress } from "./progress";
import { PASSED_LEVEL, MAX_LEVEL } from "@/lib/constants";

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

export type StudentCourseListItem = {
  id: string;
  name: string;
  modulesCount: number;
  modulesUnlocked: number;
  Progress: number; // 0-1
  Mastery: number; // 0-1
};

export async function listCoursesForStudent(
  db: PrismaClient,
  studentId: string,
): Promise<StudentCourseListItem[]> {
  const studentCoursePairs = await db.studentInCourse.findMany({
    where: { studentId },
    orderBy: { createdAt: "desc" },
    include: {
      course: {
        select: {
          id: true,
          name: true,
          _count: { select: { modules: true } },
        },
      },
      ModuleProgress: {
        select: { level: true },
      },
    },
  });

  return studentCoursePairs.map((studentCoursePair) => {
    const totalLevels = studentCoursePair.ModuleProgress.reduce(
      (sum, mp) => sum + mp.level,
      0,
    );

    return {
      id: studentCoursePair.course.id,
      name: studentCoursePair.course.name,
      modulesCount: studentCoursePair.course._count.modules,
      modulesUnlocked: studentCoursePair.ModuleProgress.length,
      Progress:
        studentCoursePair.course._count.modules > 0
          ? studentCoursePair.ModuleProgress.filter(
              (mp) => mp.level >= PASSED_LEVEL,
            ).length / studentCoursePair.course._count.modules
          : 0,
      Mastery:
        totalLevels / (studentCoursePair.course._count.modules * MAX_LEVEL),
    };
  });
}

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

export type StudentCourseOverview = {
  id: string;
  name: string;
  description: string | null;
  unlockedModules: number;
  passedModules: number;
  modulesCount: number;
  levelsCount: number;
  passedLevels: number;
};

export async function getStudentCourseOverview(
  db: PrismaClient,
  courseId: string,
  studentId: string,
): Promise<StudentCourseOverview> {
  try {
    await db.studentInCourse.findUniqueOrThrow({
      where: {
        studentId_courseId: {
          studentId: studentId,
          courseId: courseId,
        },
      },
    });
  } catch (e) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Student not in course",
    });
  }

  const course = await db.course.findUnique({
    where: { id: courseId },
    select: {
      description: true,
      name: true,
      id: true,
      _count: { select: { modules: true } },
      modules: {
        select: {
          moduleProgresses: {
            where: { studentId: studentId },
            select: { level: true },
          },
        },
      },
    },
  });

  if (!course) {
    throw new TRPCError({ code: "NOT_FOUND", message: "Course not found" });
  }

  const modulesCount = course._count.modules;
  const levelsCount = modulesCount * MAX_LEVEL;
  const unlockedModules = course.modules.filter(
    (m) => m.moduleProgresses.length > 0,
  ).length;
  const passedModules = course.modules.reduce(
    (sum, m) =>
      sum + ((m.moduleProgresses[0]?.level ?? 0) >= PASSED_LEVEL ? 1 : 0),
    0,
  );
  const passedLevels = course.modules.reduce(
    (sum, m) => sum + (m.moduleProgresses[0]?.level ?? 0),
    0,
  );

  return {
    id: course.id,
    name: course.name,
    description: course.description,
    unlockedModules: unlockedModules,
    passedModules: passedModules,
    modulesCount: modulesCount,
    levelsCount: levelsCount,
    passedLevels: passedLevels,
  };
}

export const updateCourseSchema = z.object({
  id: z.string(),
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .max(100, "Name is too long")
    .optional(),
  description: z
    .string()
    .trim()
    .max(2000, "Description is too long")
    .optional()
    .transform((v) => (v === "" ? undefined : v)),
});
export type UpdateCourseInput = z.infer<typeof updateCourseSchema>;

export async function updateCourse(
  db: PrismaClient,
  teacherId: string,
  input: UpdateCourseInput,
): Promise<{ id: string }> {
  const course = await db.course.findUnique({
    where: { id: input.id },
    select: { teacherId: true, published: true },
  });

  if (!course) {
    throw new TRPCError({ code: "NOT_FOUND", message: "Course not found" });
  }

  if (course.teacherId !== teacherId) {
    throw new TRPCError({ code: "FORBIDDEN", message: "Not your course" });
  }

  return db.course.update({
    where: { id: input.id },
    data: {
      name: input.name,
      description: input.description,
    },
    select: { id: true },
  });
}

export async function deleteCourse(
  db: PrismaClient,
  courseId: string,
  teacherId: string,
): Promise<{ id: string }> {
  const course = await db.course.findUnique({
    where: { id: courseId },
    select: {
      teacherId: true,
      _count: { select: { studentInCourses: true } },
    },
  });

  if (!course) {
    throw new TRPCError({ code: "NOT_FOUND", message: "Course not found" });
  }
  if (course.teacherId !== teacherId) {
    throw new TRPCError({ code: "FORBIDDEN", message: "Not your course" });
  }
  if (course._count.studentInCourses > 0) {
    throw new TRPCError({
      code: "PRECONDITION_FAILED",
      message: "Cannot delete a course with enrolled students",
    });
  }

  await db.course.delete({ where: { id: courseId } });

  return { id: courseId };
}

export async function publishCourse(
  db: PrismaClient,
  courseId: string,
  teacherId: string,
): Promise<{ id: string }> {
  const course = await db.course.findUnique({
    where: { id: courseId },
    select: { teacherId: true, published: true },
  });

  if (!course) {
    throw new TRPCError({ code: "NOT_FOUND", message: "Course not found" });
  }
  if (course.teacherId !== teacherId) {
    throw new TRPCError({ code: "FORBIDDEN", message: "Not your course" });
  }
  if (course.published) {
    throw new TRPCError({ code: "BAD_REQUEST", message: "ALready published" });
  }

  return db.course.update({
    where: { id: courseId },
    data: { published: true },
    select: { id: true },
  });
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

export type StudentCourseProgress = {
  unlockedModuleCount: number;
  passedModuleCount: number;
  totalModuleCount: number;
  passedLevelCount: number;
  totalLevelCount: number;
};

export type StudentReviewsNeeded = {
  totalForAllCoursesSent: number;
};

export async function reviewsDueNow(
  db: PrismaClient,
  courseIds: string[],
  studentId: string,
): Promise<StudentReviewsNeeded> {
  await Promise.all(
    courseIds.map(async (courseId) => {
      try {
        await db.studentInCourse.findUniqueOrThrow({
          where: {
            studentId_courseId: {
              studentId: studentId,
              courseId: courseId,
            },
          },
        });
      } catch (e) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Student not in course",
        });
      }
    }),
  );

  const courses = await Promise.all(
    courseIds.map((courseId) =>
      db.moduleProgress.findMany({
        where: {
          studentId: studentId,
          courseId: courseId,
        },
        select: {
          nextReview: true,
        },
      }),
    ),
  );

  return {
    totalForAllCoursesSent: courses
      .flat()
      .filter((mp) => mp.nextReview === null).length,
  };
}
