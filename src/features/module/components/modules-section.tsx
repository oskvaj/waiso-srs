"use client";

import { Button } from "@/components/ui/button";
import type { ModuleListItem } from "@/server/services/module";
import { ChevronDown, ChevronUp, Plus } from "lucide-react";
import { ModuleCard } from "./module-card";
import { useState } from "react";
import { AddModuleCard } from "./add-module-card";
import { AddModuleDialog } from "./add-module-dialog";

const VISIBLE_COUNT = 12;

export function ModulesSection({
  modules,
  courseId,
}: {
  modules: ModuleListItem[];
  courseId: string;
}) {
  const [expanded, setExpanded] = useState(false);

  const hasMore = modules.length > VISIBLE_COUNT - 1;
  const visibleModules = expanded
    ? modules
    : modules.slice(0, VISIBLE_COUNT - 1);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-theme-heading text-xl font-semibold">
          Modules ({modules.length})
        </h2>
        <div className="space-x-4">
          <Button variant="secondary" className="items-center">
            Dependency graph
          </Button>
          <AddModuleDialog courseId={courseId}>
            <Button
              variant="action"
              className="hover:bg-theme-action/80 items-center hover:cursor-pointer"
            >
              <Plus className="size-3" />
              Add module
            </Button>
          </AddModuleDialog>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        <AddModuleCard courseId={courseId} />
        {visibleModules.map((m) => (
          <ModuleCard key={m.id} module={m} courseId={courseId} />
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
