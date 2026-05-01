import { StudentHeader } from "@/components/student-header";
import { ReviewBoard } from "@/features/review/review-board";
import { api } from "@/trpc/server";
import { redirect } from "next/navigation";

export default async function ReviewPage({
  searchParams,
}: {
  searchParams: Promise<{ courses?: string }>;
}) {
  const { courses } = await searchParams;
  const courseIds = courses?.split(",") ?? [];

  if (courseIds.length === 0) {
    redirect("/course");
  }

  const [modulesThatNeedReview] = await Promise.all([
    api.review.getReviewContent({ courseIds }),
  ]);

  if (modulesThatNeedReview.length === 0) {
    redirect("/course");
  }

  return (
    <div className="-mx-3 -mt-10 -mb-30 h-screen overflow-hidden px-3 pt-10">
      <div className="flex h-full flex-col">
        <StudentHeader
          href={courseIds.length === 1 ? `/course/${courseIds[0]}` : "/course"}
          text={
            courseIds.length === 1
              ? `${modulesThatNeedReview[0]!.courseName}`
              : "Waiso"
          }
          moveLeft={courseIds.length === 1}
        />
        <div className="min-h-0 flex-1">
          <ReviewBoard
            modules={modulesThatNeedReview}
            returnHref={
              courseIds.length === 1 ? `/course/${courseIds[0]}` : "/course"
            }
          ></ReviewBoard>
        </div>
      </div>
    </div>
  );
}
