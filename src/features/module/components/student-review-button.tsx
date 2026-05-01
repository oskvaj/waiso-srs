"use client";

import { Card } from "@/components/ui/card";
import { api } from "@/trpc/react";
import Link from "next/link";

export function StudentReviewButton({ courseIds }: { courseIds: string[] }) {
  const { data: reviewsDue } = api.course.getReviewsDue.useQuery({
    courseIds,
  });

  const hasReviews = reviewsDue && reviewsDue.totalForAllCoursesSent > 0;

  const card = (
    <Card
      variant="raised"
      className={`group h-full p-6 transition-colors ${
        hasReviews
          ? "bg-theme-action/25 hover:bg-theme-action/35 text-theme-action"
          : "text-theme-text"
      }`}
    >
      <div className="flex items-baseline justify-between">
        <span className="font-theme-heading text-xl font-semibold">
          Reviews
        </span>
        <span className="font-theme-heading text-xl">
          {reviewsDue ? (
            hasReviews ? (
              <div>{reviewsDue.totalForAllCoursesSent}</div>
            ) : (
              "None, good job!"
            )
          ) : (
            "Loading"
          )}
        </span>
      </div>
    </Card>
  );

  return hasReviews ? (
    <Link href={`/review?courses=${courseIds.join(",")}`}>{card}</Link>
  ) : (
    card
  );
}
