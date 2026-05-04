import { useState, useMemo } from "react";
import { TipTapEditor } from "@/components/editor/tiptap-editor";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import type { JSONContent } from "@tiptap/react";
import type { PairContent } from "@/lib/question-types";

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

export function PairCard({
  content,
  onAnswer,
  onSubmit,
}: {
  content: PairContent;
  onAnswer: (correct: boolean) => void;
  onSubmit: (correct: boolean) => void;
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
    onSubmit(correct);
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

      <p className="text-theme-muted text-xs">
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
                  !submitted && isSelected && "ring-theme-primary ring-2",
                  !submitted && isConnected && color,
                  !submitted &&
                    !isConnected &&
                    !isSelected &&
                    "border-theme-border hover:border-theme-primary/50",
                  showCorrect && "border-theme-success bg-theme-success/10",
                  showIncorrect && "border-theme-danger bg-theme-danger/10",
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
                    "border-theme-border hover:border-theme-primary/50",
                  !submitted &&
                    !isConnected &&
                    !canSelect &&
                    "border-theme-border opacity-70",
                  submitted && "border-theme-border",
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
          className="w-full py-6"
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
          <Button onClick={() => onAnswer(isCorrect)} className="w-full py-6">
            Continue <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
