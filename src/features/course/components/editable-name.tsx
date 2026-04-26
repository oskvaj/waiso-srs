import { useState } from "react";
import { SquarePen } from "lucide-react";
import { Input } from "@/components/ui/input";

export function EditableName({
  value,
  onSave,
}: {
  value: string;
  onSave: (name: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);

  if (editing) {
    return (
      <Input
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        className="font-theme-heading text-3xl font-bold"
        autoFocus
        onKeyDown={(e) => {
          if (e.key === "Enter" && draft.trim()) {
            onSave(draft.trim());
            setEditing(false);
          }
          if (e.key === "Escape") {
            setDraft(value);
            setEditing(false);
          }
        }}
        onBlur={() => {
          setDraft(value);
          setEditing(false);
        }}
      />
    );
  }

  return (
    <div className="group inline-flex items-center gap-2">
      <h1 className="font-theme-heading text-3xl font-bold">{value}</h1>
      <button
        type="button"
        onClick={() => {
          setDraft(value);
          setEditing(true);
        }}
        className="text-theme-muted hover:text-theme-text opacity-50 transition-opacity group-hover:opacity-100 hover:cursor-pointer"
      >
        <SquarePen className="size-4" />
      </button>
    </div>
  );
}
