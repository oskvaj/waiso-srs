import { useState, useMemo } from "react";
import { TipTapEditor } from "@/components/editor/tiptap-editor";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Check, X, ArrowRight } from "lucide-react";
import type { JSONContent } from "@tiptap/react";
import type { MultipleChoiceContent } from "@/lib/question-types";

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

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j]!, copy[i]!];
  }
  return copy;
}

export function MultipleChoiceCard({
  content,
  onAnswer,
  onSubmit,
}: {
  content: MultipleChoiceContent;
  onAnswer: (correct: boolean) => void;
  onSubmit: (correct: boolean) => void;
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
    onSubmit(correct);
  };

  return (
    <div className="space-y-4">
      <Viewer content={content.question} />

      {multipleCorrect && (
        <p className="text-theme-muted text-xs">Select all that apply</p>
      )}

      <div className="space-y-2">
        {shuffledAnswers.map((answer, i) => {
          const isSelected = selected.has(i);

          return (
            <button
              key={answer.originalIndex}
              onClick={() => handleToggle(i)}
              disabled={submitted}
              className={cn(
                "w-full rounded-lg border p-3 text-left transition-colors",
                !submitted &&
                  isSelected &&
                  "border-theme-primary bg-theme-primary/5",
                !submitted &&
                  !isSelected &&
                  "border-theme-border hover:border-theme-primary/50",
                submitted &&
                  answer.correct &&
                  "border-theme-success bg-theme-success/10",
                submitted &&
                  isSelected &&
                  !answer.correct &&
                  "border-theme-danger bg-theme-danger/10",
                submitted &&
                  !isSelected &&
                  !answer.correct &&
                  "border-theme-border opacity-50",
              )}
            >
              <div className="flex items-center gap-2">
                {submitted &&
                  (answer.correct ? (
                    <Check className="text-theme-success h-4 w-4 shrink-0" />
                  ) : isSelected ? (
                    <X className="text-theme-danger h-4 w-4 shrink-0" />
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
          Submit answer
        </Button>
      ) : (
        <div className="space-y-3">
          {content.explanation && (
            <div className="border-theme-secondary/30 bg-theme-secondary/5 rounded-lg border p-3">
              <p className="text-theme-secondary mb-1 text-xs font-medium">
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
