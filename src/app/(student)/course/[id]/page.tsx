import { StudentCourseHeader } from "@/features/course/components/student-course-header";
import { StudentLearnButton } from "@/features/course/components/student-learn-button";
import { StudentModulesSection } from "@/features/module/components/student-module-selection";
import { StudentReviewScheduleButton } from "@/features/module/components/student-module-timeline-button";
import { StudentReviewButton } from "@/features/module/components/student-review-button";
import { api } from "@/trpc/server";

export default async function CourseOverviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [course, modules, missingTheory] = await Promise.all([
    api.course.getStudentOverview({ id: id }),
    api.module.listForStudent({ courseId: id }),
    api.course.getMissingTheoryNumber({ courseId: id }),
  ]);

  return (
    <div className="h-full space-y-4 pb-20">
      <div>
        <StudentCourseHeader course={course} />
      </div>
      <div className="w-full max-w-100">
        <StudentReviewButton courseIds={[course.id]} />
      </div>
      {missingTheory.missingTheoryCount > 0 && (
        <div className="w-full max-w-100">
          <StudentLearnButton id={id} />
        </div>
      )}
      <div>
        <StudentModulesSection modules={modules} courseId={course.id} />
      </div>
      <div className="w-full max-w-100">
        <StudentReviewScheduleButton id={id} />
      </div>
    </div>
  );
}
