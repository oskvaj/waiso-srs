"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { TipTapEditor } from "@/components/editor/tiptap-editor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Check, X, ArrowRight } from "lucide-react";
import type { JSONContent } from "@tiptap/react";
import type {
  MultipleChoiceContent,
  FreeTextContent,
  PairContent,
} from "@/lib/question-types";
import type { ReviewItem } from "@/server/services/review";
import { api } from "@/trpc/react";

type Props = {
  modules: ReviewItem[];
  returnHref: string;
};

type QuestionResult = {
  questionId: string;
  correct: boolean;
};

type ModuleResult = {
  moduleId: string;
  firstTry: boolean;
  questions: QuestionResult[];
};

function levenshtein(a: string, b: string): number {
  const la = a.length;
  const lb = b.length;
  const dp: number[][] = Array.from({ length: la + 1 }, () =>
    Array.from({ length: lb + 1 }, () => 0),
  );
  for (let i = 0; i <= la; i++) dp[i]![0] = i;
  for (let j = 0; j <= lb; j++) dp[0]![j] = j;
  for (let i = 1; i <= la; i++) {
    for (let j = 1; j <= lb; j++) {
      dp[i]![j] =
        a[i - 1] === b[j - 1]
          ? dp[i - 1]![j - 1]!
          : 1 + Math.min(dp[i - 1]![j]!, dp[i]![j - 1]!, dp[i - 1]![j - 1]!);
    }
  }
  return dp[la]![lb]!;
}

function fuzzyMatch(input: string, target: string): boolean {
  const a = input.trim().toLowerCase();
  const b = target.trim().toLowerCase();
  if (a === b) return true;
  const maxDist = Math.max(1, Math.floor(b.length * 0.2));
  return levenshtein(a, b) <= maxDist;
}

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j]!, copy[i]!];
  }
  return copy;
}

function Viewer({ content }: { content: JSONContent }) {
  return (
    <TipTapEditor
      content={content}
      onUpdate={() => {
        return;
      }}
      editable={false}
    />
  );
}

function MultipleChoiceCard({
  content,
  onAnswer,
}: {
  content: MultipleChoiceContent;
  onAnswer: (correct: boolean) => void;
}) {
  const shuffledAnswers = useMemo(
    () => shuffle(content.answers.map((a, i) => ({ ...a, originalIndex: i }))),
    [content.answers],
  );

  const multipleCorrect = content.answers.filter((a) => a.correct).length > 1;
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const handleToggle = (idx: number) => {
    if (submitted) return;
    setSelected((prev) => {
      const next = new Set(prev);
      if (multipleCorrect) {
        if (next.has(idx)) next.delete(idx);
        else next.add(idx);
      } else {
        return new Set([idx]);
      }
      return next;
    });
  };

  const handleSubmit = () => {
    const correct = shuffledAnswers.every(
      (a, i) => a.correct === selected.has(i),
    );
    setIsCorrect(correct);
    setSubmitted(true);
  };

  return (
    <div className="space-y-4">
      <Viewer content={content.question} />

      {multipleCorrect && (
        <p className="text-muted-foreground text-xs">Select all that apply</p>
      )}

      <div className="space-y-2">
        {shuffledAnswers.map((answer, i) => {
          const isSelected = selected.has(i);
          const showResult = submitted;

          return (
            <button
              key={answer.originalIndex}
              onClick={() => handleToggle(i)}
              disabled={submitted}
              className={cn(
                "w-full rounded-lg border p-3 text-left transition-colors",
                !submitted && isSelected && "border-primary bg-primary/5",
                !submitted &&
                  !isSelected &&
                  "border-border hover:border-primary/50",
                submitted &&
                  answer.correct &&
                  "border-green-500 bg-green-500/10",
                submitted &&
                  isSelected &&
                  !answer.correct &&
                  "border-red-500 bg-red-500/10",
                submitted &&
                  !isSelected &&
                  !answer.correct &&
                  "border-border opacity-50",
              )}
            >
              <div className="flex items-center gap-2">
                {showResult &&
                  (answer.correct ? (
                    <Check className="h-4 w-4 shrink-0 text-green-500" />
                  ) : isSelected ? (
                    <X className="h-4 w-4 shrink-0 text-red-500" />
                  ) : null)}
                <Viewer content={answer.text} />
              </div>
            </button>
          );
        })}
      </div>

      {!submitted ? (
        <Button
          onClick={handleSubmit}
          disabled={selected.size === 0}
          className="w-full"
        >
          Check answer
        </Button>
      ) : (
        <div className="space-y-3">
          {content.explanation && (
            <div className="rounded-lg border border-blue-200 bg-blue-50 p-3 dark:border-blue-800 dark:bg-blue-950">
              <p className="mb-1 text-xs font-medium text-blue-600 dark:text-blue-400">
                Explanation
              </p>
              <Viewer content={content.explanation} />
            </div>
          )}
          <Button onClick={() => onAnswer(isCorrect)} className="w-full">
            Continue <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}

function FreeTextCard({
  content,
  onAnswer,
}: {
  content: FreeTextContent;
  onAnswer: (correct: boolean) => void;
}) {
  const [input, setInput] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const handleSubmit = () => {
    const correct = content.answers.some((a) =>
      a.fuzzy
        ? fuzzyMatch(input, a.text)
        : input.trim().toLowerCase() === a.text.trim().toLowerCase(),
    );
    setIsCorrect(correct);
    setSubmitted(true);
  };

  return (
    <div className="space-y-4">
      <Viewer content={content.question} />

      <Input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && input.trim() && !submitted) handleSubmit();
        }}
        placeholder="Type your answer..."
        disabled={submitted}
        className={cn(
          submitted && isCorrect && "border-green-500",
          submitted && !isCorrect && "border-red-500",
        )}
      />

      {submitted && !isCorrect && (
        <p className="text-muted-foreground text-sm">
          Accepted answer{content.answers.length > 1 ? "s" : ""}:{" "}
          {content.answers.map((a) => a.text).join(", ")}
        </p>
      )}

      {!submitted ? (
        <Button
          onClick={handleSubmit}
          disabled={!input.trim()}
          className="w-full"
        >
          Check answer
        </Button>
      ) : (
        <div className="space-y-3">
          {content.explanation && (
            <div className="rounded-lg border border-blue-200 bg-blue-50 p-3 dark:border-blue-800 dark:bg-blue-950">
              <p className="mb-1 text-xs font-medium text-blue-600 dark:text-blue-400">
                Explanation
              </p>
              <Viewer content={content.explanation} />
            </div>
          )}
          <Button onClick={() => onAnswer(isCorrect)} className="w-full">
            Continue <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}

function PairCard({
  content,
  onAnswer,
}: {
  content: PairContent;
  onAnswer: (correct: boolean) => void;
}) {
  const shuffledRight = useMemo(
    () =>
      shuffle(
        content.pairs.map((p, i) => ({ content: p.right, originalIndex: i })),
      ),
    [content.pairs],
  );

  const [connections, setConnections] = useState<Map<number, number>>(
    new Map(),
  );
  const [selectedLeft, setSelectedLeft] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const connectedRightIndices = new Set(connections.values());

  const handleLeftClick = (leftIdx: number) => {
    if (submitted) return;
    if (selectedLeft === leftIdx) {
      setSelectedLeft(null);
      return;
    }
    setSelectedLeft(leftIdx);
  };

  const handleRightClick = (rightOriginalIdx: number) => {
    if (submitted) return;
    if (selectedLeft === null) return;

    setConnections((prev) => {
      const next = new Map(prev);
      for (const [k, v] of next) {
        if (v === rightOriginalIdx) next.delete(k);
      }
      next.set(selectedLeft, rightOriginalIdx);
      return next;
    });
    setSelectedLeft(null);
  };

  const handleDisconnect = (leftIdx: number) => {
    if (submitted) return;
    setConnections((prev) => {
      const next = new Map(prev);
      next.delete(leftIdx);
      return next;
    });
  };

  const handleSubmit = () => {
    const correct =
      connections.size === content.pairs.length &&
      content.pairs.every((_, i) => connections.get(i) === i);
    setIsCorrect(correct);
    setSubmitted(true);
  };

  const pairColors = [
    "border-blue-500 bg-blue-500/10",
    "border-purple-500 bg-purple-500/10",
    "border-amber-500 bg-amber-500/10",
    "border-emerald-500 bg-emerald-500/10",
    "border-pink-500 bg-pink-500/10",
    "border-cyan-500 bg-cyan-500/10",
  ];

  const getColorForLeft = (leftIdx: number) => {
    if (!connections.has(leftIdx)) return "";
    const connectedKeys = [...connections.keys()].sort();
    const colorIdx = connectedKeys.indexOf(leftIdx);
    return pairColors[colorIdx % pairColors.length] ?? "";
  };

  const getColorForRight = (rightOriginalIdx: number) => {
    for (const [leftIdx, rightIdx] of connections) {
      if (rightIdx === rightOriginalIdx) return getColorForLeft(leftIdx);
    }
    return "";
  };

  return (
    <div className="space-y-4">
      <Viewer content={content.question} />

      <p className="text-muted-foreground text-xs">
        Click a left item, then click the matching right item
      </p>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          {content.pairs.map((pair, i) => {
            const isConnected = connections.has(i);
            const isSelected = selectedLeft === i;
            const color = getColorForLeft(i);
            const showCorrect = submitted && connections.get(i) === i;
            const showIncorrect =
              submitted && connections.has(i) && connections.get(i) !== i;

            return (
              <button
                key={`left-${i}`}
                onClick={() =>
                  isConnected ? handleDisconnect(i) : handleLeftClick(i)
                }
                disabled={submitted}
                className={cn(
                  "w-full rounded-lg border p-2 text-left text-sm transition-colors",
                  !submitted && isSelected && "ring-primary ring-2",
                  !submitted && isConnected && color,
                  !submitted &&
                    !isConnected &&
                    !isSelected &&
                    "border-border hover:border-primary/50",
                  showCorrect && "border-green-500 bg-green-500/10",
                  showIncorrect && "border-red-500 bg-red-500/10",
                )}
              >
                <Viewer content={pair.left} />
              </button>
            );
          })}
        </div>

        <div className="space-y-2">
          {shuffledRight.map((item) => {
            const isConnected = connectedRightIndices.has(item.originalIndex);
            const color = getColorForRight(item.originalIndex);
            const canSelect = selectedLeft !== null && !submitted;

            return (
              <button
                key={`right-${item.originalIndex}`}
                onClick={() => handleRightClick(item.originalIndex)}
                disabled={submitted || !canSelect}
                className={cn(
                  "w-full rounded-lg border p-2 text-left text-sm transition-colors",
                  !submitted && isConnected && color,
                  !submitted &&
                    !isConnected &&
                    canSelect &&
                    "border-border hover:border-primary/50",
                  !submitted &&
                    !isConnected &&
                    !canSelect &&
                    "border-border opacity-70",
                  submitted && "border-border",
                )}
              >
                <Viewer content={item.content} />
              </button>
            );
          })}
        </div>
      </div>

      {!submitted ? (
        <Button
          onClick={handleSubmit}
          disabled={connections.size !== content.pairs.length}
          className="w-full"
        >
          Check answer
        </Button>
      ) : (
        <div className="space-y-3">
          {content.explanation && (
            <div className="rounded-lg border border-blue-200 bg-blue-50 p-3 dark:border-blue-800 dark:bg-blue-950">
              <p className="mb-1 text-xs font-medium text-blue-600 dark:text-blue-400">
                Explanation
              </p>
              <Viewer content={content.explanation} />
            </div>
          )}
          <Button onClick={() => onAnswer(isCorrect)} className="w-full">
            Continue <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}

function QuestionCard({
  question,
  onAnswer,
}: {
  question: ReviewItem["questions"][number];
  onAnswer: (correct: boolean) => void;
}) {
  const type = question.type.toLowerCase();

  switch (type) {
    case "multiple_choice":
      return (
        <MultipleChoiceCard
          key={question.id}
          content={question.content as MultipleChoiceContent}
          onAnswer={onAnswer}
        />
      );
    case "free_text":
      return (
        <FreeTextCard
          key={question.id}
          content={question.content as FreeTextContent}
          onAnswer={onAnswer}
        />
      );
    case "pair":
      return (
        <PairCard
          key={question.id}
          content={question.content as PairContent}
          onAnswer={onAnswer}
        />
      );
    default:
      return <p className="text-muted-foreground">Unknown question type</p>;
  }
}

export function ReviewBoard({ modules, returnHref }: Props) {
  const router = useRouter();
  const updateReviews = api.review.updateReviewResults.useMutation();

  const [completedModuleIds, setCompletedModuleIds] = useState<Set<string>>(
    new Set(),
  );
  const [incorrectModuleIds, setIncorrectModuleIds] = useState<Set<string>>(
    new Set(),
  );
  const [questionResults, setQuestionResults] = useState<
    Map<string, QuestionResult[]>
  >(new Map());

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

  const submitResults = useCallback(async () => {
    const results: ModuleResult[] = modules.map((m) => ({
      moduleId: m.moduleId,
      firstTry: !incorrectModuleIds.has(m.moduleId),
      questions: questionResults.get(m.moduleId) ?? [],
    }));
    await updateReviews.mutateAsync({ results });

    console.log("Review results:", results);
    router.push(returnHref);
  }, [modules, incorrectModuleIds, questionResults, returnHref, router]);

  const handleAnswer = useCallback(
    (correct: boolean) => {
      if (!currentPick) return;
      const { module: mod, question } = currentPick;

      const updatedResults = new Map(questionResults);
      const existing = updatedResults.get(mod.moduleId) ?? [];
      updatedResults.set(mod.moduleId, [
        ...existing,
        { questionId: question.id, correct },
      ]);
      setQuestionResults(updatedResults);

      if (correct) {
        const newCompleted = new Set(completedModuleIds);
        newCompleted.add(mod.moduleId);
        setCompletedModuleIds(newCompleted);

        if (newCompleted.size === modules.length) {
          // Build results from the local variable, not stale state
          const results: ModuleResult[] = modules.map((m) => ({
            moduleId: m.moduleId,
            firstTry: !incorrectModuleIds.has(m.moduleId),
            questions: updatedResults.get(m.moduleId) ?? [],
          }));
          void updateReviews.mutateAsync({ results }).then(() => {
            router.push(returnHref);
          });
          return;
        }
      } else {
        setIncorrectModuleIds((prev) => new Set(prev).add(mod.moduleId));
      }

      setCurrentPick(null);
    },
    [
      currentPick,
      completedModuleIds,
      questionResults,
      incorrectModuleIds,
      modules,
      updateReviews,
      returnHref,
      router,
    ],
  );

  if (!currentPick) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  const progress = completedModuleIds.size;
  const total = modules.length;

  return (
    <div className="flex h-full flex-col">
      <div className="space-y-2 pt-4">
        <div className="bg-muted h-1.5 w-full rounded-full">
          <div
            className="bg-primary h-full rounded-full transition-all duration-300"
            style={{ width: `${(progress / total) * 100}%` }}
          />
        </div>
        <div className="text-muted-foreground flex justify-between text-xs">
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
          />
        </div>
      </div>
    </div>
  );
}
