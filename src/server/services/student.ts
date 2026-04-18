import type { PrismaClient } from "@/../generated/prisma";
import { MAX_LEVEL, PASSED_LEVEL } from "@/lib/constants";
import { TRPCError } from "@trpc/server";

export type StudentListItem = {
  id: string;
  name: string;
  modulesCompleted: number;
  totalModules: number;
  mastery: number; // 0-1
};

export async function listStudentsForCourse(
  db: PrismaClient,
  courseId: string,
  teacherId: string,
): Promise<StudentListItem[]> {
  const course = await db.course.findUnique({
    where: { id: courseId },
    select: { teacherId: true, _count: { select: { modules: true } } },
  });

  if (!course) {
    throw new TRPCError({ code: "NOT_FOUND", message: "Course not found" });
  }

  if (course.teacherId !== teacherId) {
    throw new TRPCError({ code: "FORBIDDEN", message: "Not your course" });
  }

  const totalModules = course._count.modules;

  const enrollments = await db.studentInCourse.findMany({
    where: { courseId },
    include: {
      student: {
        include: {
          user: { select: { name: true } },
        },
      },
      ModuleProgress: {
        select: { level: true },
      },
    },
    orderBy: { student: { user: { name: "asc" } } },
  });

  return enrollments.map((e) => {
    const passed = e.ModuleProgress.filter(
      (p) => p.level >= PASSED_LEVEL,
    ).length;

    const levelSum = e.ModuleProgress.reduce((sum, p) => sum + p.level, 0);

    return {
      id: e.studentId,
      name: e.student.user.name ?? "Unknown",
      modulesCompleted: passed,
      totalModules,
      mastery: totalModules > 0 ? levelSum / (totalModules * MAX_LEVEL) : 0,
    };
  });
}
