import { StudentHeader } from "@/components/student-header";
import { StudentCourseGrid } from "@/features/course/components/student-course-grid";
import { api } from "@/trpc/server";

export default async function CoursesPage() {
  const courses = await api.course.listForStudent();

  return (
    <div>
      <StudentHeader href="/course" text="Waiso" />
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-theme-heading text-3xl font-bold">
              My courses
            </h1>

            <p className="text-theme-muted mt-1 text-sm">
              {courses.length} courses
            </p>
          </div>
        </div>

        <StudentCourseGrid courses={courses} />
      </div>
    </div>
  );
}
