import { useState } from "react";
import { TipTapEditor } from "@/components/editor/tiptap-editor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import type { JSONContent } from "@tiptap/react";
import type { FreeTextContent } from "@/lib/question-types";

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

export function FreeTextCard({
  content,
  onAnswer,
  onSubmit,
}: {
  content: FreeTextContent;
  onAnswer: (correct: boolean) => void;
  onSubmit: (correct: boolean) => void;
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
    onSubmit(correct);
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
          submitted && isCorrect && "border-theme-success",
          submitted && !isCorrect && "border-theme-danger",
        )}
      />

      {submitted && !isCorrect && (
        <p className="text-theme-muted text-sm">
          Accepted answer{content.answers.length > 1 ? "s" : ""}:{" "}
          {content.answers.map((a) => a.text).join(", ")}
        </p>
      )}

      {!submitted ? (
        <Button
          onClick={handleSubmit}
          disabled={!input.trim()}
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
