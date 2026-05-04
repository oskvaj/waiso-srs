import { ModuleEditor } from "@/features/module/components/module-editor";
import { api } from "@/trpc/server";
import { notFound } from "next/navigation";

export default async function ModuleEditorPage({
  params,
}: {
  params: Promise<{ moduleId: string }>;
}) {
  const { moduleId } = await params;

  let mod, questions, prerequisites, requiredFor;
  try {
    [mod, questions, prerequisites, requiredFor] = await Promise.all([
      api.module.getDetail({ id: moduleId }),
      api.question.listByModule({ moduleId }),
      api.module.listPrerequisites({ moduleId }),
      api.module.listRequiredFor({ moduleId }),
    ]);
  } catch {
    notFound();
  }

  return (
    <div className="h-full overflow-hidden pb-10">
      <ModuleEditor
        module={mod}
        questions={questions}
        prerequisites={prerequisites}
        requiredFor={requiredFor}
      />
    </div>
  );
}
