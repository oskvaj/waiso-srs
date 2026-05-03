import { StudentHeader } from "@/components/student-header";
import { api } from "@/trpc/server";
import Link from "next/link";

export default async function ReviewSchedulePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [reviewsDue, course] = await Promise.all([
    api.review.getReviewSchedule({ courseId: id }),
    api.course.getStudentOverview({ id: id }),
  ]);

  function formatReviewTime(date: Date | null): string {
    if (!date) return "Now";

    const now = new Date();
    const d = new Date(date);
    d.setMinutes(0, 0, 0);

    const diffMs = d.getTime() - now.getTime();
    const diffHours = Math.round(diffMs / (1000 * 60 * 60));
    const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays < 1) {
      return `In ${Math.max(diffHours, 0)}h`;
    }

    if (diffDays < 7) {
      return `In ${diffDays} days`;
    }

    return d.toLocaleString("en-GB", {
      month: "short",
      day: "numeric",
    });
  }

  return (
    <div>
      <div>
        <StudentHeader
          href={`/course/${id}`}
          text={course.name}
          moveLeft={true}
        />
      </div>
      <div className="grid grid-cols-2 gap-2">
        {reviewsDue.moduleTimes.map((mt) => (
          <Link
            key={mt.moduleId}
            href={`/course/${id}/module/${mt.moduleId}`}
            className="hover:bg-theme-primary/5 border-theme-primary/20 text-theme-text col-span-2 grid grid-cols-[7fr_3fr] rounded border p-2"
          >
            <span className="truncate">{mt.module.name}</span>
            <span className="text-right">
              {formatReviewTime(mt.nextReview)}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
