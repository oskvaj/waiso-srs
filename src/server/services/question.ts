import { type PrismaClient } from "@/../generated/prisma";
import { QUESTION_TYPE_VALUES } from "@/lib/constants";
import {
  validateQuestionContent,
  validateQuestionErrors,
  type QuestionContent,
} from "@/lib/question-types";
import { extractTextFromContent } from "@/lib/tiptap-utils";
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
  content: QuestionContent;
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
    content: validateQuestionContent(question.type, question.content),
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

  const validated = validateQuestionContent(input.type, input.content);

  const errors = validateQuestionErrors(input.type, validated);
  if (errors.length > 0) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: errors.map((e) => e.message).join(", "),
    });
  }

  const name = extractTextFromContent(validated.question);

  return db.question.create({
    data: {
      name,
      type: input.type,
      content: validated as unknown as object,
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

  const type = input.type ?? question.type;
  const rawContent = input.content ?? question.content;
  const validated = validateQuestionContent(type, rawContent);

  const errors = validateQuestionErrors(type, validated);
  if (errors.length > 0) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: errors.map((e) => e.message).join(", "),
    });
  }

  const name = extractTextFromContent(validated.question);

  return db.question.update({
    where: { id: input.id },
    data: {
      name,
      type: input.type,
      content: validated as unknown as object,
    },
    select: { id: true },
  });
}
