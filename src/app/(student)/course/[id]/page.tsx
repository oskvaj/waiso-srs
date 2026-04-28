import { StudentCourseHeader } from "@/features/course/components/student-course-header";
import { StudentModulesSection } from "@/features/module/components/student-module-selection";
import { api } from "@/trpc/server";

export default async function CourseOverviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let course, modules;
  [course, modules] = await Promise.all([
    api.course.getStudentOverview({ id: id }),
    api.module.listForStudent({ courseId: id }),
  ]);

  return (
    <div className="h-full space-y-4 pb-20">
      <div>
        <StudentCourseHeader course={course} />
      </div>
      <div>
        <StudentModulesSection modules={modules} courseId={course.id} />
      </div>
    </div>
  );
}
