import { StudentHeader } from "@/components/student-header";
import { Button } from "@/components/ui/button";
import { StudentCourseGrid } from "@/features/course/components/student-course-grid";
import { StudentReviewButton } from "@/features/module/components/student-review-button";
import { api } from "@/trpc/server";
import { Plus } from "lucide-react";
import Link from "next/link";

export default async function CoursesPage() {
  const courses = await api.course.listForStudent();
  const courseIds = courses.map((course) => course.id);

  return (
    <div>
      <StudentHeader href="/course" text="Waiso" />
      <div className="py-2">
        <StudentReviewButton courseIds={courseIds} />
      </div>
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-theme-heading text-3xl font-bold">
              My courses
            </h1>
            <Link href="/course/add">
              <Button variant="link" className="gap-1">
                <Plus className="size-4" />
                Add course
              </Button>
            </Link>
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
