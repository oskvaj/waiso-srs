import { MAX_LEVEL, PASSED_LEVEL } from "@/lib/constants";

type ModuleWithProgress = {
  moduleProgresses: { studentId: string; level: number }[];
};

type EnrolledStudent = {
  studentId: string;
};

export type ProgressStats = {
  avgProgress: number;
  avgMastery: number;
};

export function calculateCourseProgress(
  modules: ModuleWithProgress[],
  students: EnrolledStudent[],
): ProgressStats {
  const moudlesCount = modules.length;
  const studentsCount = students.length;

  if (studentsCount === 0 || moudlesCount === 0) {
    return { avgProgress: 0, avgMastery: 0 };
  }

  const progressByStudent = new Map<
    string,
    { passed: number; levelSum: number }
  >();

  for (const student of students) {
    progressByStudent.set(student.studentId, { passed: 0, levelSum: 0 });
  }

  for (const m of modules) {
    for (const p of m.moduleProgresses) {
      const entry = progressByStudent.get(p.studentId);
      if (!entry) continue;

      if (p.level >= PASSED_LEVEL) entry.passed += 1;
      entry.levelSum += p.level;
    }
  }

  let progressSum = 0;
  let masterySum = 0;

  for (const { passed, levelSum } of progressByStudent.values()) {
    progressSum += passed / studentsCount;
    masterySum += levelSum / (moudlesCount * MAX_LEVEL);
  }

  return {
    avgProgress: progressSum / studentsCount,
    avgMastery: masterySum / studentsCount,
  };
}
