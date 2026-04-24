import { CourseHeader } from "@/features/course/components/course-header";
import { ModulesSection } from "@/features/module/components/modules-section";
import { StudentsSection } from "@/features/student/components/students-section";
import { api } from "@/trpc/server";
import { notFound } from "next/navigation";

export default async function CourseOverviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let course, modules, students;
  try {
    [course, modules, students] = await Promise.all([
      api.course.getOverview({ id }),
      api.module.listForTeacher({ courseId: id }),
      api.student.listByCourse({ courseId: id }),
    ]);
  } catch {
    notFound();
  }

  return (
    <div className="h-full space-y-4 pb-20">
      <CourseHeader course={course} />
      <ModulesSection modules={modules} courseId={id} />
      <StudentsSection students={students} />
    </div>
  );
}
