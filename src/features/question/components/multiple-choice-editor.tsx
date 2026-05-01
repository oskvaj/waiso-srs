import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TipTapEditor } from "@/components/editor/tiptap-editor";
import type {
  MultipleChoiceContent,
  ValidationError,
} from "@/lib/question-types";
import type { JSONContent } from "@tiptap/react";

type AnswerEntry = {
  key: string;
  text: JSONContent;
  correct: boolean;
};

let nextKey = 0;
function genKey() {
  return `answer-${++nextKey}`;
}

function toEntries(answers: MultipleChoiceContent["answers"]): AnswerEntry[] {
  return answers.map((a) => ({ ...a, key: genKey() }));
}

function fromEntries(entries: AnswerEntry[]): MultipleChoiceContent["answers"] {
  return entries.map(({ text, correct }) => ({ text, correct }));
}

export function MultipleChoiceEditor({
  content,
  editing,
  onChange,
  errors = [],
}: {
  content: MultipleChoiceContent;
  editing: boolean;
  onChange: (content: MultipleChoiceContent) => void;
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
    update([
      ...entries,
      { key: genKey(), text: { type: "doc", content: [] }, correct: false },
    ]);
  }

  function removeAnswer(key: string) {
    update(entries.filter((e) => e.key !== key));
  }

  function updateAnswerText(key: string, text: JSONContent) {
    update(entries.map((e) => (e.key === key ? { ...e, text } : e)));
  }

  function toggleCorrect(key: string) {
    update(
      entries.map((e) => (e.key === key ? { ...e, correct: !e.correct } : e)),
    );
  }

  return (
    <div className="space-y-3">
      <h2 className="font-theme-heading mb-2 text-sm font-semibold">Options</h2>
      {entries.map((answer) => (
        <div
          key={answer.key}
          className={`flex ${
            errors.some((e) => e.field === `answer-${entries.indexOf(answer)}`)
              ? "border-theme-danger bg-theme-danger/5"
              : ""
          }`}
        >
          {editing && (
            <div className="mb-2 flex min-w-35 items-center">
              <button
                type="button"
                onClick={() => editing && toggleCorrect(answer.key)}
                disabled={!editing}
                className="flex items-center gap-2 text-sm"
              >
                <div
                  className={`flex size-5 items-center justify-center rounded-full border-2 ${
                    answer.correct
                      ? "border-theme-success bg-theme-success"
                      : "border-theme-border"
                  }`}
                >
                  {answer.correct && (
                    <div className="size-2 rounded-full bg-white" />
                  )}
                </div>
                <span
                  className={
                    answer.correct
                      ? "text-theme-success font-medium"
                      : "text-theme-muted"
                  }
                >
                  {answer.correct ? "Correct" : "Mark as correct"}
                </span>
              </button>
            </div>
          )}

          <div
            className={`border-theme-border flex-1 rounded-lg border ${answer.correct ? "bg-theme-success/5 border-theme-success/50" : ""}`}
          >
            <TipTapEditor
              key={editing ? `edit-${answer.key}` : `view-${answer.key}`}
              content={answer.text}
              onUpdate={(text) => updateAnswerText(answer.key, text)}
              editable={editing}
            />
          </div>

          {editing && (
            <button
              type="button"
              onClick={() => removeAnswer(answer.key)}
              className="text-theme-danger hover:text-theme-danger/80 p-2 hover:cursor-pointer"
            >
              <Trash2 className="size-4" />
            </button>
          )}
        </div>
      ))}

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
          Add option
        </Button>
      )}
    </div>
  );
}
