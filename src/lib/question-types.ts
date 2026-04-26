import type { JSONContent } from "@tiptap/react";
import { z } from "zod";

export type MultipleChoiceContent = {
  question: JSONContent;
  answers: { text: JSONContent; correct: boolean }[];
  explanation?: JSONContent;
};

export type FreeTextContent = {
  question: JSONContent;
  answer: JSONContent;
  explanation?: JSONContent;
};

export type PairContent = {
  question: JSONContent;
  pairs: { left: JSONContent; right: JSONContent }[];
  explanation?: JSONContent;
};

export type QuestionContent =
  | MultipleChoiceContent
  | FreeTextContent
  | PairContent;

const jsonContent = z.record(z.unknown());

export const multipleChoiceContentSchema = z.object({
  question: jsonContent,
  answers: z.array(
    z.object({
      text: jsonContent,
      correct: z.boolean(),
    }),
  ),
  explanation: jsonContent.optional(),
});

export const freeTextContentSchema = z.object({
  question: jsonContent,
  answer: jsonContent,
  explanation: jsonContent.optional(),
});

export const pairContentSchema = z.object({
  question: jsonContent,
  pairs: z.array(
    z.object({
      left: jsonContent,
      right: jsonContent,
    }),
  ),
  explanation: jsonContent.optional(),
});

export function validateQuestionContent(
  type: string,
  content: unknown,
): QuestionContent {
  switch (type) {
    case "MULTIPLE_CHOICE":
      return multipleChoiceContentSchema.parse(
        content,
      ) as MultipleChoiceContent;
    case "FREE_TEXT":
      return freeTextContentSchema.parse(content) as FreeTextContent;
    case "PAIR":
      return pairContentSchema.parse(content) as PairContent;
    default:
      throw new Error(`Unknown question type: ${type}`);
  }
}
