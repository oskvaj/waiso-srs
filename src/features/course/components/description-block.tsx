import { useEffect, useRef, useState } from "react";
import { ChevronDown, ChevronUp, SquarePen } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

export function DescriptionBlock({
  description,
  onSave,
}: {
  description: string | null;
  onSave: (value: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(description ?? "");
  const [isClamped, setIsClamped] = useState(false);
  const textRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const el = textRef.current;
    if (!el) return;

    const check = () => setIsClamped(el.scrollHeight > el.clientHeight);
    check();

    const observer = new ResizeObserver(check);
    observer.observe(el);
    return () => observer.disconnect();
  }, [description]);

  if (editing) {
    return (
      <div className="mt-3 flex items-start gap-2">
        <Textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          className="min-w-0 text-sm"
          autoFocus
          rows={3}
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              setDraft(description ?? "");
              setEditing(false);
            }
          }}
        />
        <button
          type="button"
          onClick={() => {
            onSave(draft.trim());
            setEditing(false);
          }}
          className="text-theme-success hover:text-theme-success/80 p-1 text-xs font-medium"
        >
          Save
        </button>
        <button
          type="button"
          onClick={() => {
            setDraft(description ?? "");
            setEditing(false);
          }}
          className="text-theme-danger hover:text-theme-danger/80 p-1 text-xs font-medium"
        >
          Cancel
        </button>
      </div>
    );
  }

  return (
    <div className="mt-3">
      <div className="group flex items-start gap-2">
        {description ? (
          <p
            ref={textRef}
            className={`text-theme-muted text-sm ${!expanded ? "line-clamp-2" : ""}`}
          >
            {description}
          </p>
        ) : (
          <span className="text-theme-muted text-sm italic">
            No description
          </span>
        )}
        <button
          type="button"
          onClick={() => {
            setDraft(description ?? "");
            setEditing(true);
          }}
          className="text-theme-muted hover:text-theme-text shrink-0 opacity-50 transition-opacity group-hover:opacity-100 hover:cursor-pointer"
        >
          <SquarePen className="size-3.5" />
        </button>
      </div>
      {(isClamped || expanded) && (
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="text-theme-primary hover:text-theme-primary/80 mt-1 flex items-center gap-1 text-sm font-medium transition-colors"
        >
          {expanded ? (
            <>
              Show less <ChevronUp className="size-3.5" />
            </>
          ) : (
            <>
              Show more <ChevronDown className="size-3.5" />
            </>
          )}
        </button>
      )}
    </div>
  );
}
