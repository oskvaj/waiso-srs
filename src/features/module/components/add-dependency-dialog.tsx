"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";

export function AddDependencyDialog({
  open,
  onOpenChange,
  moduleId,
  courseId,
  existingIds,
  mode,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  moduleId: string;
  courseId: string;
  existingIds: string[];
  mode: "prerequisite" | "requiredFor";
}) {
  const router = useRouter();

  const { data: modules } = api.module.listForTeacher.useQuery(
    { courseId },
    { enabled: open },
  );

  const addPrerequisite = api.module.addPrerequisite.useMutation({
    onSuccess: () => {
      router.refresh();
      onOpenChange(false);
    },
  });

  const addRequiredFor = api.module.addRequiredFor.useMutation({
    onSuccess: () => {
      router.refresh();
      onOpenChange(false);
    },
  });

  function handleSelect(targetId: string) {
    if (mode === "prerequisite") {
      addPrerequisite.mutate({ moduleId, prerequisiteId: targetId });
    } else {
      addRequiredFor.mutate({ moduleId, targetModuleId: targetId });
    }
  }

  const isPending = addPrerequisite.isPending || addRequiredFor.isPending;

  const availableModules = modules?.filter(
    (m) => m.id !== moduleId && !existingIds.includes(m.id),
  ); // TODO: add an endpoint for a better calculation of this

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>
            {mode === "prerequisite" ? "Add prerequisite" : "Add required for"}
          </DialogTitle>
        </DialogHeader>

        <div className="max-h-64 space-y-1 overflow-y-auto">
          {availableModules?.length === 0 && (
            <p className="text-theme-muted py-4 text-center text-sm">
              No available modules
            </p>
          )}
          {availableModules?.map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => handleSelect(m.id)}
              disabled={isPending}
              className="text-theme-text hover:bg-theme-subtle w-full rounded-lg px-3 py-2 text-left text-sm transition-colors"
            >
              {m.name}
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
