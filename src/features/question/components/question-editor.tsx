"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MoveLeft, SquarePen } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { TipTapEditor } from "@/components/editor/tiptap-editor";
import { api } from "@/trpc/react";
import type { QuestionDetail } from "@/server/services/question";
import type { QuestionType } from "@/../generated/prisma";
import {
  type FreeTextContent,
  type MultipleChoiceContent,
  type PairContent,
  type QuestionContent,
  type ValidationError,
  validateQuestionErrors,
} from "@/lib/question-types";
import { MultipleChoiceEditor } from "./multiple-choice-editor";
import { FreeTextEditor } from "./free-text-editor";
import { PairEditor } from "./pair-editor";
import { DeleteQuestionDialog } from "./delete-question-dialog";

const TYPES: { value: QuestionType; label: string }[] = [
  { value: "MULTIPLE_CHOICE", label: "Multiple choice" },
  { value: "FREE_TEXT", label: "Free text" },
  { value: "PAIR", label: "Pair" },
];

function getEmptyContent(type: QuestionType): QuestionContent {
  const emptyDoc = { type: "doc" as const, content: [] };
  switch (type) {
    case "MULTIPLE_CHOICE":
      return { question: emptyDoc, answers: [] };
    case "FREE_TEXT":
      return { question: emptyDoc, answers: [] };
    case "PAIR":
      return { question: emptyDoc, pairs: [] };
  }
}

export function QuestionEditor({
  courseId,
  moduleId,
  question,
}: {
  courseId: string;
  moduleId: string;
  question: QuestionDetail | null;
}) {
  const router = useRouter();
  const isNew = question === null;

  const [editing, setEditing] = useState(isNew);
  const [hasChanges, setHasChanges] = useState(false);
  const [type, setType] = useState<QuestionType>(
    (question?.type as QuestionType) ?? "MULTIPLE_CHOICE",
  );
  const [content, setContent] = useState<QuestionContent>(
    question?.content ?? getEmptyContent("MULTIPLE_CHOICE"),
  );
  const [errors, setErrors] = useState<ValidationError[]>([]);

  const createQuestion = api.question.create.useMutation({
    onSuccess: (data) => {
      void router.replace(
        `/courses/${courseId}/modules/${moduleId}/questions/${data.id}`,
      );
      router.refresh();
    },
  });

  const updateQuestion = api.question.update.useMutation({
    onSuccess: () => {
      setHasChanges(false);
      setEditing(false);
      router.refresh();
    },
  });

  function handleSave() {
    const validationErrors = validateQuestionErrors(type, content);
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors([]);

    if (isNew) {
      createQuestion.mutate({
        moduleId,
        type,
        content,
      });
    } else {
      updateQuestion.mutate({
        id: question.id,
        type,
        content,
      });
    }
  }

  function handleCancel() {
    if (isNew) {
      void router.push(`/courses/${courseId}/modules/${moduleId}`);
    } else {
      setContent(question.content);
      setType(question.type as QuestionType);
      setHasChanges(false);
      setEditing(false);
    }
  }

  const isPending = createQuestion.isPending || updateQuestion.isPending;

  return (
    <div className="flex h-full flex-col gap-6">
      <div className="shrink-0">
        <Link
          href={`/courses/${courseId}/modules/${moduleId}`}
          className="text-theme-muted hover:text-theme-text mb-2 inline-flex items-center gap-1 text-sm transition-colors"
        >
          <MoveLeft className="text-theme-primary size-6" />
          Back to module
        </Link>

        <div className="flex items-center justify-between">
          <h1 className="font-theme-heading truncate text-2xl font-bold">
            {isNew ? "New question" : question.name}
          </h1>

          {editing ? (
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleCancel}>
                Cancel
              </Button>
              <Button
                variant="success"
                size="sm"
                onClick={handleSave}
                disabled={isPending || !hasChanges}
              >
                {isPending ? "Saving..." : "Save"}
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Button
                variant="link"
                onClick={() => setEditing(true)}
                className="gap-1 px-2 py-1"
              >
                <SquarePen className="size-4" />
                Edit
              </Button>
              {!isNew && (
                <>
                  <DeleteQuestionDialog
                    questionId={question.id}
                    questionName={question.name}
                    courseId={courseId}
                    moduleId={moduleId}
                  />
                </>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="flex min-h-0 flex-1 gap-6">
        <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto">
          {editing && (
            <div className="flex shrink-0 gap-2">
              {TYPES.map((t) => (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => {
                    setType(t.value);
                    setContent((prev) => {
                      const empty = getEmptyContent(t.value);
                      return {
                        ...empty,
                        question: prev.question,
                        explanation: prev.explanation,
                      };
                    });
                    setHasChanges(true);
                  }}
                  className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${
                    type === t.value
                      ? "bg-theme-primary text-theme-inverse"
                      : "bg-theme-subtle text-theme-muted hover:text-theme-text"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          )}

          <div>
            <h2 className="font-theme-heading mb-2 text-sm font-semibold">
              Question
            </h2>
            <div
              className={`border-theme-border min-h-30 rounded-lg border ${editing ? "bg-theme-card" : ""}`}
            >
              <TipTapEditor
                key={editing ? "edit-q" : "view-q"}
                content={content.question}
                onUpdate={(q) => {
                  setContent((prev) => ({ ...prev, question: q }));
                  setErrors((prev) =>
                    prev.filter((e) => e.field !== "question"),
                  );
                  setHasChanges(true);
                }}
                editable={editing}
              />
            </div>
            {/* TODO: some bugs with errors not clearing here  */}
            {errors.find((e) => e.field === "question") && (
              <p className="text-theme-danger mt-1 text-sm">
                {errors.find((e) => e.field === "question")!.message}
              </p>
            )}
          </div>

          <div>
            {type === "MULTIPLE_CHOICE" && (
              <>
                <MultipleChoiceEditor
                  key={editing ? "edit-mc" : "view-mc"}
                  content={content as MultipleChoiceContent}
                  editing={editing}
                  onChange={(updated) => {
                    setContent(updated);
                    setErrors((prev) =>
                      prev.filter((e) => !e.field.startsWith("answer")),
                    );
                    setHasChanges(true);
                  }}
                  errors={errors}
                />
                {errors.find((e) => e.field === "answers") && (
                  <p className="text-theme-danger mt-1 text-sm">
                    {errors.find((e) => e.field === "answers")!.message}
                  </p>
                )}
              </>
            )}
            {type === "FREE_TEXT" && (
              <>
                <FreeTextEditor
                  key={editing ? "edit-ft" : "view-ft"}
                  content={content as FreeTextContent}
                  editing={editing}
                  onChange={(updated) => {
                    setContent(updated);
                    setErrors((prev) =>
                      prev.filter((e) => !e.field.startsWith("answer")),
                    );
                    setHasChanges(true);
                  }}
                  errors={errors}
                />
                {errors.find((e) => e.field === "answers") && (
                  <p className="text-theme-danger mt-1 text-sm">
                    {errors.find((e) => e.field === "answers")!.message}
                  </p>
                )}
              </>
            )}
            {type === "PAIR" && (
              <>
                <PairEditor
                  key={editing ? "edit-pair" : "view-pair"}
                  content={content as PairContent}
                  editing={editing}
                  onChange={(updated) => {
                    setContent(updated);
                    setErrors((prev) =>
                      prev.filter((e) => !e.field.startsWith("pair")),
                    );
                    setHasChanges(true);
                  }}
                  errors={errors}
                />
                {errors.find((e) => e.field === "pairs") && (
                  <p className="text-theme-danger mt-1 text-sm">
                    {errors.find((e) => e.field === "pairs")!.message}
                  </p>
                )}
              </>
            )}
          </div>

          <div>
            <h2 className="font-theme-heading mb-2 text-sm font-semibold">
              Explanation{" "}
              <span className="text-theme-muted font-normal">(optional)</span>
            </h2>
            <div
              className={`border-theme-border min-h-14 rounded-lg border ${editing ? "bg-theme-card" : ""}`}
            >
              <TipTapEditor
                key={editing ? "edit-e" : "view-e"}
                content={content.explanation ?? { type: "doc", content: [] }}
                onUpdate={(e) => {
                  setContent((prev) => ({ ...prev, explanation: e }));
                  setHasChanges(true);
                }}
                editable={editing}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
