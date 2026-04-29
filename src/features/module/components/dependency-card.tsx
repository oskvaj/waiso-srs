import { Card } from "@/components/ui/card";
import type { DependencyListItem } from "@/server/services/module";
import { Trash2 } from "lucide-react";

export function DependencyCard({
  dependency,
  onRemove,
}: {
  dependency: DependencyListItem;
  onRemove?: () => void;
}) {
  return (
    <Card
      variant="raised"
      className="flex flex-row items-center justify-between p-5"
    >
      <span className="truncate text-sm font-medium">{dependency.name}</span>
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="text-theme-muted hover:text-theme-danger shrink-0 p-1"
        >
          <Trash2 className="size-4" />
        </button>
      )}
    </Card>
  );
}
