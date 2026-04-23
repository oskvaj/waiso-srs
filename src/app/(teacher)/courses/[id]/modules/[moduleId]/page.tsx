import { ModuleEditor } from "@/features/module/components/module-editor";
import { api } from "@/trpc/server";
import { notFound } from "next/navigation";

export default async function ModuleEditorPage({
  params,
}: {
  params: Promise<{ id: string; moduleId: string }>;
}) {
  const { id, moduleId } = await params;

  let mod;
  try {
    mod = await api.module.getDetail({ id: moduleId });
  } catch {
    notFound();
  }

  return <ModuleEditor module={mod} />;
}
