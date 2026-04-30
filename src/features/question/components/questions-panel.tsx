import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { QuestionListItem } from "@/server/services/question";
import { QuestionCard } from "./question-card";
import { AddQuestionCard } from "./add-question-card";

export function QuestionsPanel({
  questions,
  moduleId,
  courseId,
}: {
  questions: QuestionListItem[];
  moduleId: string;
  courseId: string;
}) {
  return (
    <div className="flex min-h-0 w-80 shrink-0 flex-col">
      <div className="flex h-10 shrink-0 items-center justify-between">
        <h2 className="font-theme-heading text-lg font-semibold">
          Questions ({questions.length})
        </h2>
        <Link href={`/courses/${courseId}/modules/${moduleId}/questions/new`}>
          <Button variant="link" className="gap-0.5">
            <Plus className="size-4" />
            Add
          </Button>
        </Link>
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto pr-0.5 pb-2">
        <AddQuestionCard courseId={courseId} moduleId={moduleId} />
        {questions.map((q) => (
          <QuestionCard
            key={q.id}
            question={q}
            courseId={courseId}
            moduleId={moduleId}
          />
        ))}

        {questions.length === 0 && (
          <p className="text-theme-muted py-8 text-center text-sm">
            No questions yet
          </p>
        )}
      </div>
    </div>
  );
}
