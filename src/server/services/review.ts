import type { PrismaClient, QuestionType } from "@/../generated/prisma";
import { TRPCError } from "@trpc/server";

export type ReviewItem = {
  moduleName: string;
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
    },
  });

  return moduleIds.map((m) => ({
    moduleName: m.module.name,
    moduleId: m.moduleId,
    questions: m.module.questions.map((q) => ({
      id: q.id,
      type: q.type,
      content: q.content,
    })),
  }));
}
