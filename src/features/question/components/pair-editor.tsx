import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TipTapEditor } from "@/components/editor/tiptap-editor";
import type { PairContent } from "@/lib/question-types";
import type { ValidationError } from "@/lib/question-types";
import type { JSONContent } from "@tiptap/react";

type PairEntry = {
  key: string;
  left: JSONContent;
  right: JSONContent;
};

let nextKey = 0;
function genKey() {
  return `pair-${++nextKey}`;
}

function toEntries(pairs: PairContent["pairs"]): PairEntry[] {
  return pairs.map((p) => ({ ...p, key: genKey() }));
}

function fromEntries(entries: PairEntry[]): PairContent["pairs"] {
  return entries.map(({ left, right }) => ({ left, right }));
}

export function PairEditor({
  content,
  editing,
  onChange,
  errors = [],
}: {
  content: PairContent;
  editing: boolean;
  onChange: (content: PairContent) => void;
  errors?: ValidationError[];
}) {
  const [entries, setEntries] = useState<PairEntry[]>(toEntries(content.pairs));

  function update(newEntries: PairEntry[]) {
    setEntries(newEntries);
    onChange({ ...content, pairs: fromEntries(newEntries) });
  }

  function addPair() {
    update([
      ...entries,
      {
        key: genKey(),
        left: { type: "doc", content: [] },
        right: { type: "doc", content: [] },
      },
    ]);
  }

  function removePair(key: string) {
    update(entries.filter((e) => e.key !== key));
  }

  function updateLeft(key: string, left: JSONContent) {
    update(entries.map((e) => (e.key === key ? { ...e, left } : e)));
  }

  function updateRight(key: string, right: JSONContent) {
    update(entries.map((e) => (e.key === key ? { ...e, right } : e)));
  }

  return (
    <div className="space-y-3">
      <h2 className="font-theme-heading mb-2 text-sm font-semibold">Pairs</h2>
      {entries.map((pair, index) => {
        const leftError = errors.some((e) => e.field === `pair-${index}-left`);
        const rightError = errors.some(
          (e) => e.field === `pair-${index}-right`,
        );

        return (
          <div
            key={pair.key}
            className="flex flex-row items-start justify-start"
          >
            <div className="grid grid-cols-2 gap-3">
              <div>
                <div
                  className={`rounded-lg border ${
                    leftError ? "border-theme-danger" : "border-theme-border"
                  } ${editing ? "bg-theme-card" : ""}`}
                >
                  <TipTapEditor
                    key={editing ? `edit-l-${pair.key}` : `view-l-${pair.key}`}
                    content={pair.left}
                    onUpdate={(left) => updateLeft(pair.key, left)}
                    editable={editing}
                  />
                </div>
              </div>
              <div>
                <div
                  className={`rounded-lg border ${
                    rightError ? "border-theme-danger" : "border-theme-border"
                  } ${editing ? "bg-theme-card" : ""}`}
                >
                  <TipTapEditor
                    key={editing ? `edit-r-${pair.key}` : `view-r-${pair.key}`}
                    content={pair.right}
                    onUpdate={(right) => updateRight(pair.key, right)}
                    editable={editing}
                  />
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between p-2">
              {editing && (
                <button
                  type="button"
                  onClick={() => removePair(pair.key)}
                  className="text-theme-danger hover:text-theme-danger/80 p-1 hover:cursor-pointer"
                >
                  <Trash2 className="size-4" />
                </button>
              )}
            </div>
          </div>
        );
      })}

      {entries.length === 0 && !editing && (
        <p className="text-theme-muted py-4 text-center text-sm">
          No pairs added
        </p>
      )}

      {editing && (
        <Button variant="outline" size="sm" onClick={addPair} className="gap-1">
          <Plus className="size-3.5" />
          Add pair
        </Button>
      )}
    </div>
  );
}
