import type { PrismaClient } from "@/../generated/prisma";
import { calculateAvgModuleProgress } from "./progress";
import { assertCourseOwnership } from "./course";

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
  await assertCourseOwnership(db, courseId, teacherId);

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
