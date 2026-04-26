import { notFound } from "next/navigation";
import { api } from "@/trpc/server";
import { QuestionEditor } from "@/features/question/components/question-editor";

export default async function QuestionEditorPage({
  params,
}: {
  params: Promise<{ id: string; moduleId: string; questionId: string }>;
}) {
  const { id, moduleId, questionId } = await params;
  const isNew = questionId === "new";

  if (isNew) {
    return (
      <div className="h-full overflow-hidden">
        <QuestionEditor courseId={id} moduleId={moduleId} question={null} />
      </div>
    );
  }

  let question;
  try {
    question = await api.question.getDetail({ id: questionId });
  } catch {
    notFound();
  }

  return (
    <div className="h-full overflow-hidden">
      <QuestionEditor courseId={id} moduleId={moduleId} question={question} />
    </div>
  );
}
