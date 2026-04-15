import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CourseGrid } from "@/features/course/components/course-grid";

export default function CoursesPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-theme-heading text-3xl font-bold">My courses</h1>

          {/* TODO: placeholder */}
          <p className="text-theme-muted mt-1 text-sm">
            0 courses • 0 students
          </p>
        </div>

        <Button variant="action" className="px-5 py-3">
          <Plus />
          New course
        </Button>
      </div>

      <CourseGrid />
    </div>
  );
}
