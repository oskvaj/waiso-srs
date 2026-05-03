import type { PrismaClient, QuestionType } from "@/../generated/prisma";
import { MAX_LEVEL, PASSED_LEVEL } from "@/lib/constants";
import { TRPCError } from "@trpc/server";

export type ReviewItem = {
  moduleName: string;
  courseName: string;
  courseId: string;
  moduleId: string;
  questions: {
    id: string;
    type: QuestionType;
    content: unknown;
  }[];
};

export async function getReviewContent(
  db: PrismaClient,
  courseIds: string[],
  studentId: string,
): Promise<ReviewItem[]> {
  const enrolledCount = await db.studentInCourse.count({
    where: { studentId, courseId: { in: courseIds } },
  });
  if (enrolledCount !== courseIds.length) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Student not enrolled in all requested courses",
    });
  }
  const moduleIds = await db.moduleProgress.findMany({
    where: { studentId, courseId: { in: courseIds }, nextReview: null },
    select: {
      moduleId: true,
      courseId: true,
      module: {
        select: {
          questions: { select: { id: true, type: true, content: true } },
          name: true,
        },
      },
      enrollment: {
        select: { course: { select: { name: true } } },
      },
    },
  });
  return moduleIds.map((m) => ({
    courseName: m.enrollment.course.name,
    moduleName: m.module.name,
    courseId: m.courseId,
    moduleId: m.moduleId,
    questions: m.module.questions.map((q) => ({
      id: q.id,
      type: q.type,
      content: q.content,
    })),
  }));
}

function howManyHoursFromNow(level: number): number {
  switch (level) {
    case 0:
      return 2;
    case 1:
      return 4;
    case 2:
      return 12;
    case 3:
      return 24;
    case 4:
      return 48;
    case 5:
      return 168;
    case 6:
      return 336;
    case 7:
      return 731;
    case 8:
      return 2191;
    case 9:
      return 4383;
    case 10:
      return 17532;
  }
  return 0;
}
export async function updateReviewResult(
  db: PrismaClient,
  studentId: string,
  courseId: string,
  moduleId: string,
  questionId: string,
  correct: boolean,
  firstTry: boolean,
) {
  const progress = await db.moduleProgress.findUnique({
    where: {
      studentId_courseId_moduleId: {
        studentId,
        courseId,
        moduleId,
      },
    },
    select: { level: true },
  });

  if (!progress) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Module progress not found",
    });
  }

  const newLevel = correct
    ? firstTry
      ? Math.min(MAX_LEVEL, progress.level + 1)
      : Math.max(0, progress.level - 1)
    : progress.level;

  await Promise.all([
    db.question.update({
      where: { id: questionId },
      data: {
        totalAnswers: { increment: 1 },
        correctAnswers: correct ? { increment: 1 } : undefined,
      },
    }),
    correct
      ? db.moduleProgress.update({
          where: {
            studentId_courseId_moduleId: {
              studentId,
              moduleId,
              courseId,
            },
          },
          data: {
            nextReview: new Date(Date.now() + newLevel * 60 * 60 * 1000),
            level: newLevel,
          },
        })
      : Promise.resolve(),
  ]);

  if (correct && newLevel >= PASSED_LEVEL && progress.level < PASSED_LEVEL) {
    await unlockDependentModules(db, studentId, courseId, moduleId);
  }
}

async function unlockDependentModules(
  db: PrismaClient,
  studentId: string,
  courseId: string,
  moduleId: string,
) {
  // Find modules that have this module as a prerequisite
  const dependents = await db.module.findMany({
    where: {
      courseId,
      prerequisites: { some: { id: moduleId } },
    },
    select: {
      id: true,
      prerequisites: { select: { id: true } },
    },
  });

  for (const dependent of dependents) {
    // Check if all prerequisites are at PASSED_LEVEL
    const prereqProgresses = await db.moduleProgress.findMany({
      where: {
        studentId,
        courseId,
        moduleId: { in: dependent.prerequisites.map((p) => p.id) },
      },
      select: { level: true },
    });

    const allPassed =
      prereqProgresses.length === dependent.prerequisites.length &&
      prereqProgresses.every((p) => p.level >= PASSED_LEVEL);

    if (allPassed) {
      // Only create if not already unlocked
      const existing = await db.moduleProgress.findUnique({
        where: {
          studentId_courseId_moduleId: {
            studentId,
            courseId,
            moduleId: dependent.id,
          },
        },
      });

      if (!existing) {
        await db.moduleProgress.create({
          data: {
            studentId,
            courseId,
            moduleId: dependent.id,
          },
        });
      }
    }
  }
}

export type StudentReviewsNeeded = {
  totalForAllCoursesSent: number;
};

export async function reviewsDueNow(
  db: PrismaClient,
  courseIds: string[],
  studentId: string,
): Promise<StudentReviewsNeeded> {
  const enrolledCount = await db.studentInCourse.count({
    where: { studentId, courseId: { in: courseIds } },
  });

  if (enrolledCount !== courseIds.length) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Student not enrolled in all requested courses",
    });
  }

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

export type StudentReviewschedule = {
  moduleTimes: {
    module: { name: string };
    nextReview: Date | null;
    moduleId: string;
  }[];
};

export async function getStudentReviewSchedule(
  db: PrismaClient,
  courseId: string,
  studentId: string,
): Promise<StudentReviewschedule> {
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

  const moduleTimes = await db.moduleProgress.findMany({
    where: { courseId, studentId },
    orderBy: { nextReview: "asc" },
    select: {
      module: { select: { name: true } },
      nextReview: true,
      moduleId: true,
    },
  });

  moduleTimes.sort((a, b) => {
    if (!a.nextReview) return -1;
    if (!b.nextReview) return 1;
    return a.nextReview.getTime() - b.nextReview.getTime();
  });

  return { moduleTimes };
}
