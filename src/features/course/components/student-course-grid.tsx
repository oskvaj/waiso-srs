import type { StudentCourseListItem } from "@/server/services/course";
import { StudentCourseCard } from "./student-course-card";

type CourseGridProps = {
  courses: StudentCourseListItem[];
};

export function StudentCourseGrid({ courses }: CourseGridProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {courses.map((course) => (
        <StudentCourseCard key={course.id} {...course} />
      ))}
    </div>
  );
}
