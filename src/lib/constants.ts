import { QuestionType } from "@/../generated/prisma";

export const PASSED_LEVEL = 5;
export const MAX_LEVEL = 10;

export const QUESTION_TYPE_VALUES = Object.values(QuestionType) as [
  QuestionType,
  ...QuestionType[],
];
