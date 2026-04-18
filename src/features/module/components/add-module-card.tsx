import { Plus } from "lucide-react";

export function AddModuleCard() {
  return (
    <button
      type="button"
      className="border-theme-border text-theme-muted hover:border-theme-action hover:text-theme-action hover:bg-theme-action/5 flex h-full min-h-45 items-center justify-center rounded-xl border-2 border-dashed transition-colors hover:cursor-pointer"
    >
      <span className="text-md flex items-center gap-2 font-medium">
        <Plus className="size-4" />
        Add module
      </span>
    </button>
  );
}
