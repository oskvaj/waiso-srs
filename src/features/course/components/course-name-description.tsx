"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

export function CourseNameDescription({
  name,
  description,
}: {
  name: string;
  description: string | null;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <h1 className="font-theme-heading text-lg font-bold">{name}</h1>
      {description && (
        <>
          <button
            type="button"
            onClick={() => setOpen(!open)}
            className="text-theme-muted hover:text-theme-text flex items-center gap-0.5 text-xs transition-colors"
          >
            {open ? "Hide" : "Show"} description
            {open ? (
              <ChevronUp className="size-3" />
            ) : (
              <ChevronDown className="size-3" />
            )}
          </button>
          {open && (
            <div className="bg-theme-card border-theme-border mt-1 max-h-32 overflow-y-auto rounded-lg border p-3">
              <p className="text-theme-muted text-sm">{description}</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
