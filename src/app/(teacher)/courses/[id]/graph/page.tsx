import { DependencyGraph } from "@/features/course/components/dependency-graph";
import { api } from "@/trpc/server";
import { notFound } from "next/navigation";

export default async function DependencyGraphPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let modules, courseName;
  try {
    ({ modules, courseName } = await api.course.getGraph({ courseId: id }));
  } catch {
    notFound();
  }

  return (
    <div className="h-full overflow-hidden">
      <DependencyGraph
        courseId={id}
        courseName={courseName}
        modules={modules}
      />
    </div>
  );
}
