"use client";

import { Card } from "@/components/ui/card";
import { api } from "@/trpc/react";

export function StudentReviewButton({ courseIds }: { courseIds: string[] }) {
  const { data: reviewsDue } = api.course.getReviewsDue.useQuery({
    courseIds,
  });

  return (
    <div className="grid grid-cols-1 gap-4 space-y-4 sm:grid-cols-2 lg:grid-cols-3">
      <Card
        variant="raised"
        className={`group h-full p-6 transition-colors ${
          reviewsDue && reviewsDue.totalForAllCoursesSent > 0
            ? "bg-theme-action/25 hover:bg-theme-action/15 text-theme-action"
            : "text-theme-text"
        }`}
      >
        <div className="flex items-baseline justify-between">
          <span className="font-theme-heading text-xl font-semibold">
            Reviews
          </span>
          <span className="font-theme-heading text-xl">
            {reviewsDue ? (
              reviewsDue.totalForAllCoursesSent > 0 ? (
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
    </div>
  );
}
