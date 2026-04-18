import type { CourseOverview } from "@/server/services/course";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export function CourseHeader({ course }: { course: CourseOverview }) {
  return (
    <div>
      <Link
        href="/courses"
        className="text-theme-muted hover:text-theme-text mb-4 inline-flex items-center gap-1 text-sm transition-colors"
      >
        <ArrowLeft className="text-theme-primary size-4" />
        Back to courses
      </Link>

      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-theme-heading text-3xl font-bold">
            {course.name}
          </h1>
          <p className="text-theme-muted mt-1 text-sm">
            {course.modulesCount} modules • {course.questionsCount} questions
            {course.studentsCount > 0 && (
              <>
                {" • "} {course.studentsCount} students •{" "}
                {Math.round(course.avgProgress * 100)}% avg progress •{" "}
                {Math.round(course.avgMastery * 100)}% avg mastery
              </>
            )}
          </p>
        </div>

        {!course.published && (
          <span className="bg-theme-action/15 text-theme-action rounded-full px-4 py-1 text-sm font-medium">
            Draft
          </span>
        )}
      </div>
    </div>
  );
}
