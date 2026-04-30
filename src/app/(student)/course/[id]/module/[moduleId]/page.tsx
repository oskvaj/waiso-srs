import { StudentHeader } from "@/components/student-header";
import { MarkAsRead } from "@/features/module/components/update-student-has-read";
import { api } from "@/trpc/server";
import { generateHTML } from "@tiptap/html";
import type { JSONContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

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
      <div
        className="prose"
        dangerouslySetInnerHTML={{
          __html: generateHTML(info.content as JSONContent, [StarterKit]),
        }}
      />
    </div>
  );
}
