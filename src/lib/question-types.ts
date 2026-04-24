import type { JSONContent } from "@tiptap/react";

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

export type QuestionsContent =
  | MultipleChoiceContent
  | FreeTextContent
  | PairContent;
