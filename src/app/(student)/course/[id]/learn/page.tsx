import { StudentHeader } from "@/components/student-header";
import { TheoryViewer } from "@/features/module/components/student-theory-viewer";
import { api } from "@/trpc/server";

export default async function ReviewSchedulePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const unlearntContent = await api.course.getMissingTheory({ courseId: id });

  return (
    <div className="-mx-3 -mt-10 -mb-30 h-screen overflow-hidden px-3 pt-10">
      <div className="flex h-full flex-col">
        <StudentHeader
          href={`/course/${id}`}
          text={unlearntContent.courseName}
          moveLeft={true}
        />
        <div className="min-h-0 flex-1">
          <TheoryViewer
            contentList={unlearntContent.contentList}
            courseId={id}
          />
        </div>
      </div>
    </div>
  );
}
