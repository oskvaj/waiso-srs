"use client";

import { Button } from "@/components/ui/button";
import type { DependencyListItem } from "@/server/services/module";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AddDependencyCard } from "./add-dependency-card";
import { DependencyCard } from "./dependency-card";
import { AddDependencyDialog } from "./add-dependency-dialog";
import { api } from "@/trpc/react";

export function DependencyPanel({
  prerequisites,
  requiredFor,
  moduleId,
}: {
  prerequisites: DependencyListItem[];
  requiredFor: DependencyListItem[];
  moduleId: string;
}) {
  const router = useRouter();
  const [prereqDialogOpen, setPrereqDialogOpen] = useState(false);
  const [requiredForDialogOpen, setRequiredForDialogOpen] = useState(false);

  const removePrerequisite = api.module.removePrerequisite.useMutation({
    onSuccess: () => router.refresh(),
  });

  const removeRequiredFor = api.module.removeRequiredFor.useMutation({
    onSuccess: () => router.refresh(),
  });

  return (
    <div className="flex min-h-0 w-64 shrink-0 flex-col gap-6">
      <div className="flex max-h-[48.5%] flex-col">
        <div className="mb-3 flex h-10 shrink-0 items-center justify-between">
          <h2 className="font-theme-heading text-lg font-semibold">
            Prerequisites ({prerequisites.length})
          </h2>
          <Button
            variant="link"
            className="gap-1"
            onClick={() => setPrereqDialogOpen(true)}
          >
            <Plus className="size-4" />
            Add
          </Button>
        </div>

        <div className="flex min-h-0 flex-col gap-2 overflow-y-auto pr-0.5 pb-2">
          <AddDependencyCard
            label="Add prerequisite"
            onClick={() => setPrereqDialogOpen(true)}
          />
          {prerequisites.map((dep) => (
            <DependencyCard
              key={dep.id}
              dependency={dep}
              onRemove={() =>
                removePrerequisite.mutate({
                  moduleId,
                  prerequisiteId: dep.id,
                })
              }
            />
          ))}
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col">
        <div className="mb-3 flex h-10 shrink-0 items-center justify-between">
          <h2 className="font-theme-heading text-lg font-semibold">
            Required for ({requiredFor.length})
          </h2>
          <Button
            variant="link"
            className="gap-1"
            onClick={() => setRequiredForDialogOpen(true)}
          >
            <Plus className="size-4" />
            Add
          </Button>
        </div>

        <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto pr-0.5 pb-2">
          <AddDependencyCard
            label="Add required for"
            onClick={() => setRequiredForDialogOpen(true)}
          />
          {requiredFor.map((dep) => (
            <DependencyCard
              key={dep.id}
              dependency={dep}
              onRemove={() =>
                removeRequiredFor.mutate({
                  moduleId,
                  targetModuleId: dep.id,
                })
              }
            />
          ))}
        </div>
      </div>

      <AddDependencyDialog
        open={prereqDialogOpen}
        onOpenChange={setPrereqDialogOpen}
        moduleId={moduleId}
        mode="prerequisite"
      />
      <AddDependencyDialog
        open={requiredForDialogOpen}
        onOpenChange={setRequiredForDialogOpen}
        moduleId={moduleId}
        mode="requiredFor"
      />
    </div>
  );
}
