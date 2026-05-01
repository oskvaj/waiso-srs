import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { FreeTextContent } from "@/lib/question-types";
import type { ValidationError } from "@/lib/question-types";

type AnswerEntry = {
  key: string;
  text: string;
  fuzzy: boolean;
};

let nextKey = 0;
function genKey() {
  return `ft-${++nextKey}`;
}

function toEntries(answers: FreeTextContent["answers"]): AnswerEntry[] {
  return answers.map((a) => ({ ...a, key: genKey() }));
}

function fromEntries(entries: AnswerEntry[]): FreeTextContent["answers"] {
  return entries.map(({ text, fuzzy }) => ({ text, fuzzy }));
}

export function FreeTextEditor({
  content,
  editing,
  onChange,
  errors = [],
}: {
  content: FreeTextContent;
  editing: boolean;
  onChange: (content: FreeTextContent) => void;
  errors?: ValidationError[];
}) {
  const [entries, setEntries] = useState<AnswerEntry[]>(
    toEntries(content.answers),
  );

  function update(newEntries: AnswerEntry[]) {
    setEntries(newEntries);
    onChange({ ...content, answers: fromEntries(newEntries) });
  }

  function addAnswer() {
    update([...entries, { key: genKey(), text: "", fuzzy: false }]);
  }

  function removeAnswer(key: string) {
    update(entries.filter((e) => e.key !== key));
  }

  function updateText(key: string, text: string) {
    update(entries.map((e) => (e.key === key ? { ...e, text } : e)));
  }

  function toggleFuzzy(key: string) {
    update(entries.map((e) => (e.key === key ? { ...e, fuzzy: !e.fuzzy } : e)));
  }

  return (
    <div className="space-y-3">
      <h2 className="font-theme-heading mb-2 text-sm font-semibold">Answers</h2>
      {entries.map((answer, index) => {
        const hasError = errors.some((e) => e.field === `answer-${index}`);

        return (
          <div
            key={answer.key}
            className={`flex items-center gap-4 ${
              hasError ? "bg-theme-danger/5" : ""
            }`}
          >
            <Input
              value={answer.text}
              onChange={(e) => updateText(answer.key, e.target.value)}
              placeholder="Accepted answer..."
              disabled={!editing}
              autoComplete="off"
              className={`min-h-10 flex-1 ${editing ? "bg-theme-card" : ""}`}
            />

            <button
              type="button"
              onClick={() => editing && toggleFuzzy(answer.key)}
              disabled={!editing}
              title={answer.fuzzy ? "Fuzzy matching on" : "Exact match"}
              className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium transition-colors ${
                answer.fuzzy
                  ? "bg-theme-secondary/15 text-theme-secondary"
                  : "bg-theme-subtle text-theme-muted"
              } ${editing ? "hover:cursor-pointer" : ""}`}
            >
              {answer.fuzzy ? "Fuzzy" : "Exact"}
            </button>

            {editing && (
              <button
                type="button"
                onClick={() => removeAnswer(answer.key)}
                className="text-theme-danger hover:text-theme-danger/80 shrink-0 p-1 hover:cursor-pointer"
              >
                <Trash2 className="size-4" />
              </button>
            )}
          </div>
        );
      })}

      {entries.length === 0 && !editing && (
        <p className="text-theme-muted py-4 text-center text-sm">
          No answers added
        </p>
      )}

      {editing && (
        <Button
          variant="outline"
          size="sm"
          onClick={addAnswer}
          className="gap-1"
        >
          <Plus className="size-3.5" />
          Add accepted answer
        </Button>
      )}
    </div>
  );
}
