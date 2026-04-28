"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { StudentCourseProgress } from "@/server/services/course";

export function StudentCourseProgressCard({
  courseInfo,
}: {
  courseInfo: StudentCourseProgress;
}) {
  const progress = courseInfo.passedModuleCount / courseInfo.totalModuleCount;
  const mastery = courseInfo.passedLevelCount / courseInfo.totalLevelCount;

  return (
    <Card variant={"raised"} className="gap-2 py-3">
      <CardHeader className="text-theme-text font-theme-heading gap-0 text-2xl font-semibold">
        Progress
      </CardHeader>
      <CardContent>
        <div className="flex w-full items-center">
          <div className="bg-theme-subtle h-3 flex-1 rounded-full">
            <div
              className="bg-theme-primary text-theme-primary h-full rounded-full"
              style={{ width: `${Math.round(progress * 100)}%` }}
            />
          </div>
          <span className="font-theme-heading w-9 shrink-0 text-right text-sm">
            {Math.round(progress * 100)}%
          </span>
          <span className="font-theme-heading text-theme-primary w-9 shrink-0 text-right text-sm">
            {courseInfo.passedModuleCount}/{courseInfo.totalModuleCount}
          </span>
        </div>

        <div className="flex w-full items-center gap-2">
          <div className="bg-theme-subtle h-3 flex-1 rounded-full">
            <div
              className="bg-theme-secondary text-theme-secondary h-full rounded-full"
              style={{ width: `${Math.round(mastery * 100)}%` }}
            />
          </div>
          <span className="font-theme-heading w-9 shrink-0 text-right text-sm">
            {Math.round(mastery * 100)}%
          </span>
          <span className="font-theme-heading text-theme-secondary w-9 shrink-0 text-right text-sm">
            {courseInfo.passedLevelCount}/{courseInfo.totalLevelCount}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
