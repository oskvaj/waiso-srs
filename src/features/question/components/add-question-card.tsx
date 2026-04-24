import Link from "next/link";
import { Plus } from "lucide-react";

export function AddQuestionCard({
  courseId,
  moduleId,
}: {
  courseId: string;
  moduleId: string;
}) {
  return (
    <Link href={`/courses/${courseId}/modules/${moduleId}/questions/new`}>
      <div className="border-theme-border text-theme-muted hover:border-theme-action hover:text-theme-action hover:bg-theme-action/5 flex min-h-20 items-center justify-center rounded-xl border-2 border-dashed transition-colors hover:cursor-pointer">
        <span className="flex items-center gap-2 text-sm font-medium">
          <Plus className="size-4" />
          Add question
        </span>
      </div>
    </Link>
  );
}
