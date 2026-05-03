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

  const percentage =
    question.totalAnswers > 0
      ? Math.round((question.correctAnswers / question.totalAnswers) * 100)
      : null;

  return (
    <Link
      href={`/courses/${courseId}/modules/${moduleId}/questions/${question.id}`}
    >
      <Card
        variant="raised"
        className="hover:bg-theme-primary/5 p-3 transition-colors"
      >
        <p className="line-clamp-3 text-sm font-medium">{question.name}</p>
        <div className="mt-2 flex items-center gap-2">
          <span
            className={`inline-block w-fit rounded-full px-2 py-0.5 text-xs font-medium ${typeInfo.class}`}
          >
            {typeInfo.label}
          </span>
          {percentage !== null && (
            <span
              className={`text-xs font-medium ${
                percentage >= 70
                  ? "text-theme-success"
                  : percentage >= 40
                    ? "text-theme-action"
                    : "text-theme-danger"
              }`}
            >
              {percentage}% correct
            </span>
          )}
        </div>
      </Card>
    </Link>
  );
}
