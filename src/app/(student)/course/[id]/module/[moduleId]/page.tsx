import { StudentHeader } from "@/components/student-header";
import { ContentViewer } from "@/features/module/components/student-content-viewer";
import { MarkAsRead } from "@/features/module/components/update-student-has-read";
import { api } from "@/trpc/server";

export default async function CourseOverviewPage({
  params,
}: {
  params: Promise<{ id: string; moduleId: string }>;
}) {
  const { id, moduleId } = await params;

  const info = await api.module.studentModuleOverview({
    courseId: id,
    moduleId: moduleId,
  });

  return (
    <div>
      <StudentHeader
        href={`/course/${id}`}
        text={info.courseName}
        moveLeft={true}
      />
      <MarkAsRead courseId={id} moduleId={moduleId} hasRead={info.hasRead} />
      <ContentViewer content={info.content} />
    </div>
  );
}
