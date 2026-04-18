import { CourseHeader } from "@/features/course/components/course-header";
import { api } from "@/trpc/server";
import { notFound } from "next/navigation";

export default async function CourseOverviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let course;
  try {
    course = await api.course.getOverview({ id });
  } catch {
    notFound();
  }

  return (
    <div className="space-y-8">
      <CourseHeader course={course} />
      <div className="text-theme-muted">Modules grid placeholder</div>
      <div className="text-theme-muted">Students table placeholder</div>
    </div>
  );
}
