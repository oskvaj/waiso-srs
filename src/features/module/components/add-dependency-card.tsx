import { Plus } from "lucide-react";

export function AddDependencyCard({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="border-theme-border text-theme-muted hover:border-theme-action hover:text-theme-action hover:bg-theme-action/5 flex min-h-12 items-center justify-center rounded-xl border-2 border-dashed transition-colors hover:cursor-pointer"
    >
      <span className="flex items-center gap-2 text-sm font-medium">
        <Plus className="size-4" />
        {label}
      </span>
    </button>
  );
}
