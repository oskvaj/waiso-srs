import { ModuleEditor } from "@/features/module/components/module-editor";
import { api } from "@/trpc/server";
import { notFound } from "next/navigation";

export default async function ModuleEditorPage({
  params,
}: {
  params: Promise<{ id: string; moduleId: string }>;
}) {
  const { id, moduleId } = await params;

  let mod, questions;
  try {
    [mod, questions] = await Promise.all([
      api.module.getDetail({ id: moduleId }),
      api.question.listByModule({ moduleId }),
    ]);
  } catch {
    notFound();
  }

  return (
    <div className="h-full overflow-hidden pb-10">
      <ModuleEditor module={mod} questions={questions} />
    </div>
  );
}
