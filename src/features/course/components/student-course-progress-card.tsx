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
      <CardHeader className="gap-0">
        <div className="flex items-baseline justify-between">
          <div className="text-theme-text font-theme-heading text-2xl font-semibold">
            Progress
          </div>
          <div className="text-theme-primary">
            {courseInfo.unlockedModuleCount}/{courseInfo.totalModuleCount}{" "}
            Modules unlocked
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex w-full items-center gap-2">
          <span className="font-theme-heading text-theme-primary w-25 shrink-0 text-left text-sm">
            Passed modules
          </span>
          <div className="bg-theme-subtle h-3 flex-1 rounded-full">
            <div
              className="bg-theme-primary h-full rounded-full"
              style={{ width: `${Math.round(progress * 100)}%` }}
            />
          </div>
          <span className="font-theme-heading text-theme-primary w-9 shrink-0 text-right text-sm">
            {Math.round(progress * 100)}%
          </span>
        </div>

        <div className="flex w-full items-center gap-2">
          <span className="font-theme-heading text-theme-secondary w-25 shrink-0 text-left text-sm">
            Course mastery
          </span>
          <div className="bg-theme-subtle h-3 flex-1 rounded-full">
            <div
              className="bg-theme-secondary h-full rounded-full"
              style={{ width: `${Math.round(mastery * 100)}%` }}
            />
          </div>
          <span className="font-theme-heading text-theme-secondary w-9 shrink-0 text-right text-sm">
            {Math.round(mastery * 100)}%
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
