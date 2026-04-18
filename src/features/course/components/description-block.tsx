"use client";

import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

export function DescriptionBlock({ description }: { description: string }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="mt-3">
      <p
        className={`text-theme-muted text-sm ${expanded ? "" : "line-clamp-2"}`}
      >
        {description}
      </p>
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="text-theme-primary hover:text-theme-primary/80 mt-1 flex items-center gap-1 text-sm font-medium transition-colors"
      >
        {expanded ? (
          <>
            Show less <ChevronUp className="size-3" />
          </>
        ) : (
          <>
            Show more <ChevronDown className="size-3" />
          </>
        )}
      </button>
    </div>
  );
}
