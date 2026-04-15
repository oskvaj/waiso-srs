import type { PrismaClient } from "@/../generated/prisma";
import { MAX_LEVEL, PASSED_LEVEL } from "@/lib/constants";

export type CourseListItem = {
  id: string;
  name: string;
  published: boolean;
  modulesCount: number;
  questionsCount: number;
  studentsCount: number;
  avgProgress: number; // 0-1
  avgMastery: number; // 0-1
};

export async function listCoursesForTeacher(
  db: PrismaClient,
  teacherId: string,
): Promise<CourseListItem[]> {
  const courses = await db.course.findMany({
    where: { teacherId },
    orderBy: { createdAt: "desc" },
    include: {
      modules: {
        select: {
          id: true,
          _count: { select: { questions: true } },
          moduleProgresses: { select: { studentId: true, level: true } },
        },
      },
      studentInCourses: { select: { studentId: true } },
    },
  });

  return courses.map((course) => {
    const modulesCount = course.modules.length;

    const questionsCount = course.modules.reduce(
      (sum, mod) => sum + mod._count.questions,
      0,
    );

    const studentsCount = course.studentInCourses.length;

    if (studentsCount === 0 || modulesCount === 0) {
      return {
        id: course.id,
        name: course.name,
        published: course.published,
        modulesCount,
        questionsCount,
        studentsCount,
        avgProgress: 0,
        avgMastery: 0,
      };
    }

    const progressByStudent = new Map<
      string,
      { passed: number; levelSum: number }
    >();

    for (const student of course.studentInCourses) {
      progressByStudent.set(student.studentId, { passed: 0, levelSum: 0 });
    }

    for (const mod of course.modules) {
      for (const moduleProgress of mod.moduleProgresses) {
        const entry = progressByStudent.get(moduleProgress.studentId);

        if (!entry) continue;

        if (moduleProgress.level >= PASSED_LEVEL) entry.passed += 1;

        entry.levelSum += moduleProgress.level;
      }
    }

    let progressSum = 0;
    let masterySum = 0;

    for (const { passed, levelSum } of progressByStudent.values()) {
      progressSum += passed / modulesCount;
      masterySum += levelSum / (modulesCount * MAX_LEVEL);
    }

    return {
      id: course.id,
      name: course.name,
      published: course.published,
      modulesCount,
      questionsCount,
      studentsCount,
      avgProgress: progressSum / studentsCount,
      avgMastery: masterySum / studentsCount,
    };
  });
}
