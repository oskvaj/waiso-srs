"use client";

import type { StudentModuleListItem } from "@/server/services/module";
import { ChevronDown, ChevronUp } from "lucide-react";
import { StudentModuleCard } from "./student-module-card";
import { useState } from "react";
const VISIBLE_COUNT = 6;

export function StudentModulesSection({
  modules,
  courseId,
}: {
  modules: StudentModuleListItem[];
  courseId: string;
}) {
  const [expanded, setExpanded] = useState(false);

  const hasMore = modules.length > VISIBLE_COUNT;
  const visibleModules = expanded ? modules : modules.slice(0, VISIBLE_COUNT);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-theme-heading text-xl font-semibold">Modules</h2>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {visibleModules.map((m) => (
          <StudentModuleCard key={m.id} module={m} courseId={courseId} />
        ))}
      </div>

      {hasMore && (
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="text-theme-primary hover:text-theme-primary/80 flex items-center gap-1 text-sm font-medium transition-colors hover:cursor-pointer"
        >
          {expanded ? (
            <>
              Show less
              <ChevronUp className="size-4" />
            </>
          ) : (
            <>
              Show all {modules.length} modules
              <ChevronDown className="size-4" />
            </>
          )}
        </button>
      )}
    </div>
  );
}
