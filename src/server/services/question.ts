import type { PrismaClient } from "@/../generated/prisma";
import { TRPCError } from "@trpc/server";

export type QuestionListItem = {
  id: string;
  name: string;
  type: string;
};

export async function listQuestionsForModule(
  db: PrismaClient,
  moduleId: string,
  teacherId: string,
): Promise<QuestionListItem[]> {
  const mod = await db.module.findUnique({
    where: { id: moduleId },
    include: { course: { select: { teacherId: true } } },
  });

  if (!mod) {
    throw new TRPCError({ code: "NOT_FOUND", message: "Module not found" });
  }

  if (mod.course.teacherId !== teacherId) {
    throw new TRPCError({ code: "FORBIDDEN", message: "Not your module" });
  }

  const questions = await db.question.findMany({
    where: { moduleId },
    orderBy: { createdAt: "asc" },
    select: {
      id: true,
      name: true,
      type: true,
    },
  });

  return questions;
}
