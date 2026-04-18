import { Button } from "@/components/ui/button";
import type { ModuleListItem } from "@/server/services/module";
import { Plus } from "lucide-react";
import { ModuleCard } from "./module-card";

export function ModulesSection({
  modules,
  courseId,
}: {
  modules: ModuleListItem[];
  courseId: string;
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-theme-heading text-xl font-semibold">
          Modules ({modules.length})
        </h2>
        <Button variant="outline" size="sm">
          <Plus className="size-4" />
          Add module
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {modules.map((m) => (
          <ModuleCard key={m.id} module={m} courseId={courseId} />
        ))}
      </div>
    </div>
  );
}
