import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import type { StudentModuleListItem } from "@/server/services/module";
import Link from "next/link";

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
      <CardHeader className="relative flex h-full flex-col items-center justify-center gap-2 py-[10%]">
        {module.isUnlocked && !module.hasReadTheory && (
          <span className="text-theme-secondary absolute -top-3 right-3 text-xs font-semibold">
            New
          </span>
        )}
        <CardTitle className="font-theme-heading line-clamp-2 text-center text-sm">
          {module.name}
        </CardTitle>
        <div className="text-theme-primary text-center">
          Level {module.level}
        </div>
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
