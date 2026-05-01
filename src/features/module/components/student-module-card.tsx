import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { StudentModuleListItem } from "@/server/services/module";
import Link from "next/link";

const levelLabels: Record<number, string> = {
  0: "Learning I",
  1: "Learning II",
  2: "Learning III",
  3: "Learning IV",
  4: "Intermediate I",
  5: "Intermediate II",
  6: "Intermediate III",
  7: "Intermediate IV",
  8: "Advanced I",
  9: "Advanced II",
  10: "Mastered",
};

const levelStyles: Record<number, string> = {
  0: "bg-theme-muted/15 text-theme-muted border-theme-muted/25",
  1: "bg-theme-muted/15 text-theme-muted border-theme-muted/25",
  2: "bg-theme-muted/15 text-theme-muted border-theme-muted/25",
  3: "bg-theme-muted/15 text-theme-muted border-theme-muted/25",
  4: "bg-theme-secondary/15 text-theme-secondary border-theme-secondary/25",
  5: "bg-theme-secondary/15 text-theme-secondary border-theme-secondary/25",
  6: "bg-theme-secondary/15 text-theme-secondary border-theme-secondary/25",
  7: "bg-theme-secondary/15 text-theme-secondary border-theme-secondary/25",
  8: "bg-theme-primary/15 text-theme-primary border-theme-primary/25",
  9: "bg-theme-primary/15 text-theme-primary border-theme-primary/25",
  10: "bg-theme-action/15 text-theme-action border-theme-action/25",
};

export function StudentModuleCard({
  module,
  courseId,
}: {
  module: StudentModuleListItem;
  courseId: string;
}) {
  const content = (
    <Card
      variant="raised"
      className={`aspect-square w-40 transition-colors ${
        module.isUnlocked && !module.hasReadTheory
          ? "bg-theme-secondary/20 hover:bg-theme-secondary/30 cursor-pointer"
          : module.isUnlocked
            ? "hover:bg-theme-primary/5 cursor-pointer"
            : "opacity-50"
      }`}
    >
      <CardHeader className="relative flex h-full flex-col items-center justify-center p-4 pb-10">
        {module.isUnlocked && !module.hasReadTheory && (
          <span className="text-theme-secondary absolute -top-3 right-3 text-xs font-semibold">
            New
          </span>
        )}
        <CardTitle className="font-theme-heading line-clamp-2 text-center text-sm">
          {module.name}
        </CardTitle>
        <span
          className={cn(
            "absolute bottom-2.5 rounded-full border px-2.5 py-1 text-xs font-medium",
            levelStyles[module.level],
          )}
        >
          {levelLabels[module.level]}
        </span>
      </CardHeader>
    </Card>
  );
  if (module.isUnlocked) {
    return (
      <Link href={`/course/${courseId}/module/${module.id}`}>{content}</Link>
    );
  }

  return content;
}
