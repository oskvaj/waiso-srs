import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CourseGrid } from "@/features/course/components/course-grid";
import { api } from "@/trpc/server";
import { NewCourseDialog } from "@/features/course/components/new-course-dialog";

export default async function CoursesPage() {
  const courses = await api.course.listMine();

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-theme-heading text-3xl font-bold">My courses</h1>

          <p className="text-theme-muted mt-1 text-sm">
            {courses.length} courses
          </p>
        </div>

        <NewCourseDialog>
          <Button variant="action" className="px-5 py-3">
            <Plus />
            New course
          </Button>
        </NewCourseDialog>
      </div>

      <CourseGrid courses={courses} />
    </div>
  );
}
