"use client";

import type { CourseOverview } from "@/server/services/course";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api } from "@/trpc/react";
import { DescriptionBlock } from "./description-block";
import { EditableName } from "./editable-name";
import { DeleteCourseDialog } from "./delete-course-dialog";
import { PublishCourseDialog } from "./publish-course-dialog";

export function CourseHeader({ course }: { course: CourseOverview }) {
  const router = useRouter();

  const updateCourse = api.course.update.useMutation({
    onSuccess: () => {
      router.refresh();
    },
  });

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
        <div className="min-w-0 flex-1">
          <EditableName
            value={course.name}
            onSaveAction={(name) =>
              updateCourse.mutate({ id: course.id, name })
            }
          />

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

          <DescriptionBlock
            description={course.description}
            onSaveAction={(description) =>
              updateCourse.mutate({ id: course.id, description })
            }
          />
        </div>

        <div className="flex shrink-0 items-center gap-2">
          {!course.published && (
            <PublishCourseDialog
              courseId={course.id}
              courseName={course.name}
            />
          )}
          <DeleteCourseDialog courseId={course.id} courseName={course.name} />
        </div>
      </div>
    </div>
  );
}
