"use client";

import type {
  StudentCourseOverview,
  StudentCourseProgress,
} from "@/server/services/course";
import { usePathname } from "next/navigation";
import { StudentHeader } from "@/components/student-header";
import { StudentCourseProgressCard } from "./student-course-progress-card";

export function StudentCourseHeader({
  course,
}: {
  course: StudentCourseOverview;
}) {
  const parent = usePathname().split("/").slice(0, -1).join("/");

  const courseInfo: StudentCourseProgress = {
    passedModuleCount: course.unlockedModules,
    totalModuleCount: course.modulesCount,
    passedLevelCount: course.passedLevels,
    totalLevelCount: course.levelsCount,
  };

  return (
    <div>
      <div>
        <StudentHeader href={parent} text={course.name} moveLeft={true} />
      </div>
      <div>
        <StudentCourseProgressCard courseInfo={courseInfo} />
      </div>
    </div>
  );
}
