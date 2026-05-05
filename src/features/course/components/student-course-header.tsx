"use client";

import type {
  StudentCourseOverview,
  StudentCourseProgress,
} from "@/server/services/course";
import { usePathname } from "next/navigation";
import { StudentHeader } from "@/components/student-header";
import { StudentCourseProgressCard } from "./student-course-progress-card";
import { CourseNameDescription } from "./course-name-description";

export function StudentCourseHeader({
  course,
}: {
  course: StudentCourseOverview;
}) {
  const parent = usePathname().split("/").slice(0, -1).join("/");

  const courseInfo: StudentCourseProgress = {
    unlockedModuleCount: course.unlockedModules,
    passedModuleCount: course.passedModules,
    totalModuleCount: course.modulesCount,
    passedLevelCount: course.passedLevels,
    totalLevelCount: course.levelsCount,
  };

  return (
    <div>
      <div className="py-1">
        <StudentHeader href={parent} text={"Courses"} moveLeft={true} />
        <CourseNameDescription
          name={course.name}
          description={course.description}
        />
      </div>
      <div>
        <StudentCourseProgressCard courseInfo={courseInfo} />
      </div>
    </div>
  );
}
