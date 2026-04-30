import { StudentHeader } from "@/components/student-header";
import { api } from "@/trpc/server";

export default async function ReviewSchedulePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  let unlearntContent;
  [unlearntContent] = await Promise.all([
    api.course.getMissingTheory({ courseId: id }),
  ]);

  return (
    <div>
      <div>
        <StudentHeader
          href={`/course/${id}`}
          text={unlearntContent.courseName}
          moveLeft={true}
        />
      </div>
    </div>
  );
}
