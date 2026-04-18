import type { PrismaClient } from "@/../generated/prisma";
import { TRPCError } from "@trpc/server";
import { calculateAvgModuleProgress } from "./progress";

export type ModuleListItem = {
  id: string;
  name: string;
  questionsCount: number;
  avgProgress: number;
  avgMastery: number;
};

export async function listModulesForTeacher(
  db: PrismaClient,
  courseId: string,
  teacherId: string,
): Promise<ModuleListItem[]> {
  const course = await db.course.findUnique({
    where: { id: courseId },
    select: { teacherId: true },
  });

  if (!course) {
    throw new TRPCError({ code: "NOT_FOUND", message: "Course not found" });
  }

  if (course.teacherId !== teacherId) {
    throw new TRPCError({ code: "FORBIDDEN", message: "Not your course" });
  }

  const enrolledCount = await db.studentInCourse.count({
    where: { courseId },
  });

  const modules = await db.module.findMany({
    where: { courseId },
    orderBy: { createdAt: "asc" }, // TODO: order by something based on prerequisites in future
    select: {
      id: true,
      name: true,
      _count: { select: { questions: true } },
      moduleProgresses: {
        select: { studentId: true, level: true },
      },
    },
  });

  return modules.map((m) => {
    const progress = calculateAvgModuleProgress(
      m.moduleProgresses,
      enrolledCount,
    );

    return {
      id: m.id,
      name: m.name,
      questionsCount: m._count.questions,
      ...progress,
    };
  });
}
