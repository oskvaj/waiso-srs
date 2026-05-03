import { StudentHeader } from "@/components/student-header";
import { api } from "@/trpc/server";
import { AvailableCourseCard } from "@/features/course/components/available-course-card";

export default async function AddCoursePage() {
  const courses = await api.course.listAvailable();

  return (
    <div>
      <StudentHeader href="/course" text="Courses" moveLeft={true} />
      <div className="space-y-6">
        <div>
          <h1 className="font-theme-heading text-3xl font-bold">
            Available courses
          </h1>
          <p className="text-theme-muted mt-1 text-sm">
            {courses.length} {courses.length === 1 ? "course" : "courses"}{" "}
            available to join
          </p>
        </div>
        {courses.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((course) => (
              <AvailableCourseCard key={course.id} course={course} />
            ))}
          </div>
        ) : (
          <p className="text-theme-muted py-8 text-center text-sm">
            No courses available to join right now
          </p>
        )}
      </div>
    </div>
  );
}
