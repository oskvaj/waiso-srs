import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ModuleListItem } from "@/server/services/module";
import Link from "next/link";

export function ModuleCard({
  module,
  courseId,
}: {
  module: ModuleListItem;
  courseId: string;
}) {
  return (
    <Link href={`/courses/${courseId}/modules/${module.id}`}>
      <Card className="hover:border-theme-primary/40 h-full min-w-40 transition-colors">
        <CardHeader>
          <CardTitle className="font-theme-heading truncate text-sm">
            {module.name}
          </CardTitle>
          <p className="text-theme-muted text-xs">
            {module.questionsCount} questions
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <ProgressBar value={module.avgProgress} color="bg-theme-primary" />
            <ProgressBar value={module.avgMastery} color="bg-theme-action" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

function ProgressBar({ value, color }: { value: number; color: string }) {
  const percent = Math.round(value * 100);

  return (
    <div className="flex items-center gap-2">
      <div className="bg-theme-border h-1.5 flex-1 rounded-full">
        <div
          className={`${color} h-full rounded-full transition-all`}
          style={{ width: `${percent}` }}
        />
      </div>
      <span className="text-theme-muted w-8 text-right text-xs">
        {percent}%
      </span>
    </div>
  );
}
