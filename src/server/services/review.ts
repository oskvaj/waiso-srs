import type { PrismaClient, QuestionType } from "@/../generated/prisma";
import { TRPCError } from "@trpc/server";

export type ReviewItem = {
  moduleName: string;
  courseName: string;
  moduleId: string;
  questions: {
    id: string;
    type: QuestionType;
    content: unknown; //JSONContent, verified as questions on input
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

export async function updateReviews(
  db: PrismaClient,
  results: {
    moduleId: string;
    firstTry: boolean;
    questions: {
      questionId: string;
      correct: boolean;
    }[];
  }[],
  studentId: string,
) {
  const progresses = await db.moduleProgress.findMany({
    where: {
      studentId: studentId,
      moduleId: { in: results.map((r) => r.moduleId) },
    },
    select: { moduleId: true, courseId: true, level: true },
  });

  const progressMap = new Map(progresses.map((p) => [p.moduleId, p]));

  await Promise.all(
    results.map((result) => {
      const progress = progressMap.get(result.moduleId)!;
      return db.moduleProgress.update({
        where: {
          studentId_courseId_moduleId: {
            studentId: studentId,
            moduleId: result.moduleId,
            courseId: progress.courseId,
          },
        },
        data: {
          nextReview: new Date(Date.now() + progress.level * 60 * 60 * 1000),
          level: result.firstTry
            ? Math.min(10, progress.level + 1)
            : Math.max(0, progress.level - 1),
        },
      });
    }),
  );

  results.map((result) =>
    result.questions.map((question) =>
      db.question.update({
        where: {
          id: question.questionId,
        },
        data: {
          totalAnswers: { increment: 1 },
          correctAnswers: question.correct ? { increment: 1 } : undefined,
        },
      }),
    ),
  );
}
