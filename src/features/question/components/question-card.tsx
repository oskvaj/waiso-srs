import Link from "next/link";
import { Card } from "@/components/ui/card";
import type { QuestionListItem } from "@/server/services/question";

const TYPE_LABELS: Record<string, { label: string; class: string }> = {
  MULTIPLE_CHOICE: {
    label: "Multiple choice",
    class: "bg-theme-primary/15 text-theme-primary",
  },
  FREE_TEXT: {
    label: "Free text",
    class: "bg-theme-action/15 text-theme-action",
  },
  PAIR: {
    label: "Pair",
    class: "bg-theme-secondary/15 text-theme-secondary",
  },
};

export function QuestionCard({
  question,
  courseId,
  moduleId,
}: {
  question: QuestionListItem;
  courseId: string;
  moduleId: string;
}) {
  const typeInfo = TYPE_LABELS[question.type] ?? {
    label: question.type,
    class: "bg-theme-subtle text-theme-muted",
  };

  return (
    <Link
      href={`/courses/${courseId}/modules/${moduleId}/questions/${question.id}`}
    >
      <Card
        variant="raised"
        className="hover:bg-theme-primary/5 p-3 transition-colors"
      >
        <p className="line-clamp-3 text-sm font-medium">{question.name}</p>
        <span
          className={`mt-2 inline-block w-fit rounded-full px-2 py-0.5 text-xs font-medium ${typeInfo.class}`}
        >
          {typeInfo.label}
        </span>
      </Card>
    </Link>
  );
}
