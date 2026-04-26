import type { JSONContent } from "@tiptap/react";
import { z } from "zod";

export type MultipleChoiceContent = {
  question: JSONContent;
  answers: { text: JSONContent; correct: boolean }[];
  explanation?: JSONContent;
};

export type FreeTextContent = {
  question: JSONContent;
  answers: { text: string; fuzzy: boolean }[];
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
  answers: z.array(
    z.object({
      text: z.string(),
      fuzzy: z.boolean(),
    }),
  ),
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

export function isContentEmpty(content: JSONContent): boolean {
  if (!content.content || content.content.length === 0) return true;
  if (
    content.content.length === 1 &&
    content.content[0]?.type === "paragraph" &&
    (!content.content[0].content || content.content[0].content.length === 0)
  ) {
    return true;
  }
  return false;
}

export type ValidationError = {
  field: string;
  message: string;
};

export function validateMultipleChoice(
  content: MultipleChoiceContent,
): ValidationError[] {
  const errors: ValidationError[] = [];

  if (isContentEmpty(content.question)) {
    errors.push({ field: "question", message: "Question text is required" });
  }
  if (content.answers.length < 2) {
    errors.push({ field: "answers", message: "At least 2 answers required" });
  }
  if (content.answers.length > 0 && !content.answers.some((a) => a.correct)) {
    errors.push({
      field: "answers",
      message: "Mark at least one answer as correct",
    });
  }
  for (let i = 0; i < content.answers.length; i++) {
    if (isContentEmpty(content.answers[i]!.text)) {
      errors.push({
        field: `answer-${i}`,
        message: `Answer ${i + 1} is empty`,
      });
    }
  }

  return errors;
}

export function validateFreeText(content: FreeTextContent): ValidationError[] {
  const errors: ValidationError[] = [];

  if (isContentEmpty(content.question)) {
    errors.push({ field: "question", message: "Question text is required" });
  }
  if (content.answers.length === 0) {
    errors.push({
      field: "answers",
      message: "At least one answer is required",
    });
  }
  for (let i = 0; i < content.answers.length; i++) {
    if (!content.answers[i]!.text.trim()) {
      errors.push({
        field: `answer-${i}`,
        message: `Answer ${i + 1} is empty`,
      });
    }
  }
  return errors;
}

export function validatePair(content: PairContent): ValidationError[] {
  const errors: ValidationError[] = [];

  if (isContentEmpty(content.question)) {
    errors.push({ field: "question", message: "Question text is required" });
  }
  if (content.pairs.length < 2) {
    errors.push({ field: "pairs", message: "At least 2 pairs required" });
  }
  for (let i = 0; i < content.pairs.length; i++) {
    if (isContentEmpty(content.pairs[i]!.left)) {
      errors.push({
        field: `pair-${i}-left`,
        message: `Pair ${i + 1} left is empty`,
      });
    }
    if (isContentEmpty(content.pairs[i]!.right)) {
      errors.push({
        field: `pair-${i}-right`,
        message: `Pair ${i + 1} right is empty`,
      });
    }
  }

  return errors;
}

export function validateQuestionErrors(
  type: string,
  content: QuestionContent,
): ValidationError[] {
  switch (type) {
    case "MULTIPLE_CHOICE":
      return validateMultipleChoice(content as MultipleChoiceContent);
    case "FREE_TEXT":
      return validateFreeText(content as FreeTextContent);
    case "PAIR":
      return validatePair(content as PairContent);
    default:
      return [{ field: "type", message: "Unknown question type" }];
  }
}
