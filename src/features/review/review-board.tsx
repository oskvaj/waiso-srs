"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import type {
  MultipleChoiceContent,
  FreeTextContent,
  PairContent,
} from "@/lib/question-types";
import type { ReviewItem } from "@/server/services/review";
import { api } from "@/trpc/react";
import { MultipleChoiceCard } from "./multiple-choice-card";
import { FreeTextCard } from "./free-text-card";
import { PairCard } from "./pair-card";

type Props = {
  modules: ReviewItem[];
  returnHref: string;
};

function QuestionCard({
  question,
  onAnswer,
  onSubmit,
}: {
  question: ReviewItem["questions"][number];
  onAnswer: (correct: boolean) => void;
  onSubmit: (correct: boolean) => void;
}) {
  const type = question.type.toLowerCase();

  switch (type) {
    case "multiple_choice":
      return (
        <MultipleChoiceCard
          key={question.id}
          content={question.content as MultipleChoiceContent}
          onAnswer={onAnswer}
          onSubmit={onSubmit}
        />
      );
    case "free_text":
      return (
        <FreeTextCard
          key={question.id}
          content={question.content as FreeTextContent}
          onAnswer={onAnswer}
          onSubmit={onSubmit}
        />
      );
    case "pair":
      return (
        <PairCard
          key={question.id}
          content={question.content as PairContent}
          onAnswer={onAnswer}
          onSubmit={onSubmit}
        />
      );
    default:
      return <p className="text-theme-muted">Unknown question type</p>;
  }
}
export function ReviewBoard({ modules, returnHref }: Props) {
  const router = useRouter();
  const utils = api.useUtils();
  const updateResult = api.review.updateReviewResult.useMutation({
    onSuccess: () => {
      void utils.review.getReviewsDue.invalidate();
    },
  });

  const [completedModuleIds, setCompletedModuleIds] = useState<Set<string>>(
    new Set(),
  );
  const [incorrectModuleIds, setIncorrectModuleIds] = useState<Set<string>>(
    new Set(),
  );

  const [currentPick, setCurrentPick] = useState<{
    module: ReviewItem;
    question: ReviewItem["questions"][number];
  } | null>(null);

  const remainingModules = useMemo(
    () => modules.filter((m) => !completedModuleIds.has(m.moduleId)),
    [modules, completedModuleIds],
  );

  const pickNext = useCallback(() => {
    if (remainingModules.length === 0) {
      setCurrentPick(null);
      return;
    }
    const mod =
      remainingModules[Math.floor(Math.random() * remainingModules.length)]!;
    const q = mod.questions[Math.floor(Math.random() * mod.questions.length)]!;
    setCurrentPick({ module: mod, question: q });
  }, [remainingModules]);

  useEffect(() => {
    if (!currentPick && remainingModules.length > 0) {
      pickNext();
    }
  }, [currentPick, remainingModules.length, pickNext]);

  const handleSubmit = useCallback(
    (correct: boolean) => {
      if (!currentPick) return;
      const { module: mod, question } = currentPick;

      const isFirstTryForModule = !incorrectModuleIds.has(mod.moduleId);

      void updateResult.mutateAsync({
        courseId: mod.courseId,
        moduleId: mod.moduleId,
        questionId: question.id,
        correct,
        firstTry: correct && isFirstTryForModule,
      });

      if (!correct) {
        setIncorrectModuleIds((prev) => new Set(prev).add(mod.moduleId));
      }
    },
    [currentPick, incorrectModuleIds, updateResult],
  );

  const handleAnswer = useCallback(
    (correct: boolean) => {
      if (!currentPick) return;
      const { module: mod } = currentPick;

      if (correct) {
        const newCompleted = new Set(completedModuleIds);
        newCompleted.add(mod.moduleId);
        setCompletedModuleIds(newCompleted);

        if (newCompleted.size === modules.length) {
          router.push(returnHref);
          return;
        }
      }

      setCurrentPick(null);
    },
    [currentPick, completedModuleIds, modules, returnHref, router],
  );

  if (!currentPick) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-theme-muted">Loading...</p>
      </div>
    );
  }

  const progress = completedModuleIds.size;
  const total = modules.length;

  return (
    <div className="flex h-full flex-col">
      <div className="space-y-2 pt-4">
        <div className="bg-theme-border h-1.5 w-full rounded-full">
          <div
            className="bg-theme-primary h-full rounded-full transition-all duration-300"
            style={{ width: `${(progress / total) * 100}%` }}
          />
        </div>
        <div className="text-theme-muted flex justify-between text-xs">
          <span>
            {currentPick.module.courseName} — {currentPick.module.moduleName}
          </span>
          <span>
            {progress}/{total}
          </span>
        </div>
      </div>

      <div className="flex min-h-0 flex-1 items-start justify-center pt-8">
        <div className="w-full max-w-lg space-y-4">
          <QuestionCard
            key={currentPick.question.id}
            question={currentPick.question}
            onAnswer={handleAnswer}
            onSubmit={handleSubmit}
          />
        </div>
      </div>
    </div>
  );
}
