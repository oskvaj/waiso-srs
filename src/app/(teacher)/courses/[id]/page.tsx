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

  let course;
  try {
    course = await api.course.getOverview({ id });
  } catch {
    notFound();
  }

  const modules = await api.module.listForTeacher({ courseId: id });
  const students = await api.student.listByCourse({ courseId: id });

  return (
    <div className="space-y-8">
      <CourseHeader course={course} />
      <ModulesSection modules={modules} courseId={id} />
      <StudentsSection students={students} />
    </div>
  );
}
