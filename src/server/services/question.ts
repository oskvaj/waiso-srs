import { type PrismaClient } from "@/../generated/prisma";
import { QUESTION_TYPE_VALUES } from "@/lib/constants";
import { extractTextFromContent } from "@/lib/tiptap-utils";
import type { JSONContent } from "@tiptap/react";
import { TRPCError } from "@trpc/server";
import z from "zod";

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

export type QuestionDetail = {
  id: string;
  name: string;
  type: string;
  content: unknown;
  moduleId: string;
  moduleName: string;
  courseId: string;
  courseName: string;
};

export async function getQuestionDetail(
  db: PrismaClient,
  questionId: string,
  teacherId: string,
): Promise<QuestionDetail> {
  const question = await db.question.findUnique({
    where: { id: questionId },
    include: {
      module: {
        include: {
          course: { select: { id: true, name: true, teacherId: true } },
        },
      },
    },
  });

  if (!question) {
    throw new TRPCError({ code: "NOT_FOUND", message: "Question not found" });
  }
  if (question.module.course.teacherId !== teacherId) {
    throw new TRPCError({ code: "FORBIDDEN", message: "Not your question" });
  }

  return {
    id: question.id,
    name: question.name,
    type: question.type,
    content: question.content,
    moduleId: question.moduleId,
    moduleName: question.module.name,
    courseId: question.module.course.id,
    courseName: question.module.course.name,
  };
}

export const createQuestionSchema = z.object({
  moduleId: z.string(),
  type: z.enum(QUESTION_TYPE_VALUES),
  content: z.unknown(),
});
export type CreateQuestionInput = z.infer<typeof createQuestionSchema>;

export async function createQuestion(
  db: PrismaClient,
  teacherId: string,
  input: CreateQuestionInput,
) {
  const mod = await db.module.findUnique({
    where: { id: input.moduleId },
    include: { course: { select: { teacherId: true } } },
  });

  if (!mod) {
    throw new TRPCError({ code: "NOT_FOUND", message: "Module not found" });
  }
  if (mod.course.teacherId !== teacherId) {
    throw new TRPCError({ code: "FORBIDDEN", message: "Not your module" });
  }

  const content = input.content as Record<string, unknown>;
  const questionContent = content.question as JSONContent | undefined;
  const name = questionContent
    ? extractTextFromContent(questionContent)
    : "Untitled question";

  return db.question.create({
    data: {
      name,
      type: input.type,
      content: input.content as object,
      moduleId: input.moduleId,
    },
    select: { id: true },
  });
}

export const updateQuestionSchema = z.object({
  id: z.string(),
  type: z.enum(QUESTION_TYPE_VALUES).optional(),
  content: z.unknown().optional(),
});
export type UpdateQuestionInput = z.infer<typeof updateQuestionSchema>;

export async function updateQuestion(
  db: PrismaClient,
  teacherId: string,
  input: UpdateQuestionInput,
) {
  const question = await db.question.findUnique({
    where: { id: input.id },
    include: {
      module: {
        include: {
          course: { select: { teacherId: true } },
        },
      },
    },
  });

  if (!question) {
    throw new TRPCError({ code: "NOT_FOUND", message: "Question not found" });
  }
  if (question.module.course.teacherId !== teacherId) {
    throw new TRPCError({ code: "FORBIDDEN", message: "Not your question" });
  }

  const content = (input.content ?? question.content) as Record<
    string,
    unknown
  >;
  const questionContent = content.question as JSONContent | undefined;
  const name = questionContent
    ? extractTextFromContent(questionContent)
    : question.name;

  return db.question.update({
    where: { id: input.id },
    data: {
      name,
      type: input.type,
      content: input.content as object | undefined,
    },
    select: { id: true },
  });
}
