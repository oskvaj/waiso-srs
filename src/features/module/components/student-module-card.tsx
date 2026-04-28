import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { StudentModuleListItem } from "@/server/services/module";
import Link from "next/link";

export function StudentModuleCard({
  module,
  courseId,
}: {
  module: StudentModuleListItem;
  courseId: string;
}) {
  return (
    <Link href={`/courses/${courseId}/modules/${module.id}`}>
      <Card
        variant="raised"
        className="hover:bg-theme-primary/5 h-full min-w-40 transition-colors"
      >
        <CardHeader>
          <CardTitle className="font-theme-heading truncate text-sm">
            {module.name}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-color-primary space-y-2">
            Level {module.level}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
