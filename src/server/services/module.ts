import type { PrismaClient } from "@/../generated/prisma";
import { calculateAvgModuleProgress } from "./progress";
import z from "zod";
import { assertCourseOwnership } from "./course";
import { TRPCError } from "@trpc/server";
import {
  buildGraph,
  computeModuleLevels,
  getAncestors,
  getDescendants,
} from "@/lib/module-graph";

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
    orderBy: [{ level: "asc" }, { name: "asc" }],
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

export type StudentModuleListItem = {
  id: string;
  name: string;
  level: number;
  nextReveiwTime: Date | null;
  isUnlocked: boolean;
  hasReadTheory: boolean;
};

export async function listModulesForStudent(
  db: PrismaClient,
  courseId: string,
  studentId: string,
): Promise<StudentModuleListItem[]> {
  try {
    await db.studentInCourse.findUniqueOrThrow({
      where: {
        studentId_courseId: {
          studentId: studentId,
          courseId: courseId,
        },
      },
    });
  } catch {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Student not in course",
    });
  }
  const modules = await db.module.findMany({
    where: { courseId },
    select: {
      id: true,
      name: true,
      level: true,
      moduleProgresses: {
        where: { studentId: studentId },
        select: { level: true, nextReview: true, hasReadTheory: true },
      },
    },
  });

  const sorted = modules
    .map((m) => ({
      id: m.id,
      name: m.name,
      level: m.moduleProgresses[0]?.level ?? 0,
      moduleLevel: m.level,
      nextReveiwTime: m.moduleProgresses[0]?.nextReview ?? null,
      isUnlocked: m.moduleProgresses.length > 0,
      hasReadTheory: m.moduleProgresses[0]?.hasReadTheory ?? false,
    }))
    .sort((a, b) => {
      // Unlocked before locked
      if (a.isUnlocked && !b.isUnlocked) return -1;
      if (!a.isUnlocked && b.isUnlocked) return 1;

      // Both locked, sort by module level
      if (!a.isUnlocked && !b.isUnlocked) {
        return a.moduleLevel - b.moduleLevel;
      }

      // Both unlocked, unread theory first
      if (!a.hasReadTheory && b.hasReadTheory) return -1;
      if (a.hasReadTheory && !b.hasReadTheory) return 1;

      // Both unlocked, same read status — lowest progress level first
      if (a.level !== b.level) return a.level - b.level;

      // Same progress level, lower module level first
      return a.moduleLevel - b.moduleLevel;
    });

  return sorted.map(({ moduleLevel: _moduleLevel, ...rest }) => rest);
}

export const createModuleSchema = z.object({
  courseId: z.string(),
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .max(100, "Name is too long"),
});
export type CreateModuleInput = z.infer<typeof createModuleSchema>;

export async function createModule(
  db: PrismaClient,
  teacherId: string,
  input: CreateModuleInput,
): Promise<{ id: string }> {
  await assertCourseOwnership(db, input.courseId, teacherId);

  return db.module.create({
    data: {
      name: input.name,
      courseId: input.courseId,
      content: {},
    },
    select: { id: true },
  });
}

export type ModuleDetail = {
  id: string;
  name: string;
  content: unknown;
  courseId: string;
  courseName: string;
};

export async function getModuleDetail(
  db: PrismaClient,
  moduleId: string,
  teaacherId: string,
): Promise<ModuleDetail> {
  const mod = await db.module.findUnique({
    where: { id: moduleId },
    include: {
      course: {
        select: { name: true, teacherId: true },
      },
    },
  });

  if (!mod) {
    throw new TRPCError({ code: "NOT_FOUND", message: "Module not found" });
  }

  if (mod.course.teacherId !== teaacherId) {
    //TODO: No reason to check this teachers and student should be able to use this
    throw new TRPCError({ code: "FORBIDDEN", message: "Not your module" });
  }

  return {
    id: mod.id,
    name: mod.name,
    content: mod.content,
    courseId: mod.courseId,
    courseName: mod.course.name,
  };
}

export const updateModuleSchema = z.object({
  id: z.string(),
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .max(255, "Name is too long")
    .optional(),
  content: z.unknown().optional(),
});
export type UpdateModuleInput = z.infer<typeof updateModuleSchema>;

export async function updateModule(
  db: PrismaClient,
  teacherId: string,
  input: UpdateModuleInput,
): Promise<{ id: string }> {
  const mod = await db.module.findUnique({
    where: { id: input.id },
    include: {
      course: {
        select: { teacherId: true },
      },
    },
  });

  if (!mod) {
    throw new TRPCError({ code: "NOT_FOUND", message: "Module not found" });
  }

  if (mod.course.teacherId !== teacherId) {
    throw new TRPCError({ code: "FORBIDDEN", message: "Not your module" });
  }

  return db.module.update({
    where: { id: input.id },
    data: {
      name: input.name,
      content: input.content ?? undefined,
    },
    select: { id: true },
  });
}

export type DependencyListItem = {
  id: string;
  name: string;
};

export async function listPrerequisites(
  db: PrismaClient,
  moduleId: string,
): Promise<DependencyListItem[]> {
  const mod = await db.module.findUnique({
    where: { id: moduleId },
    include: {
      prerequisites: { select: { id: true, name: true } },
    },
  });

  if (!mod) {
    throw new TRPCError({ code: "NOT_FOUND", message: "Module not found" });
  }

  return mod.prerequisites;
}

export async function listRequiredFor(
  db: PrismaClient,
  moduleId: string,
): Promise<DependencyListItem[]> {
  const mod = await db.module.findUnique({
    where: { id: moduleId },
    include: {
      requiredFor: { select: { id: true, name: true } },
    },
  });

  if (!mod) {
    throw new TRPCError({ code: "NOT_FOUND", message: "Module not found" });
  }

  return mod.requiredFor;
}

export async function addPrerequisite(
  db: PrismaClient,
  moduleId: string,
  teacherId: string,
  prerequisiteId: string,
): Promise<{ id: string }> {
  const mod = await db.module.findUnique({
    where: { id: moduleId },
    include: { course: { select: { teacherId: true, id: true } } },
  });
  if (!mod) {
    throw new TRPCError({ code: "NOT_FOUND", message: "Module not found" });
  }
  if (mod.course.teacherId !== teacherId) {
    throw new TRPCError({ code: "FORBIDDEN", message: "Not your module" });
  }
  if (moduleId === prerequisiteId) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "A module cannot depend on itself",
    });
  }

  const modules = await getCourseModuleGraph(db, mod.course.id);
  const { requiredForMap } = buildGraph(modules);
  const descendants = getDescendants(moduleId, requiredForMap);
  if (descendants.has(prerequisiteId)) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Adding this would create a circular dependency",
    });
  }

  const result = await db.module.update({
    where: { id: moduleId },
    data: {
      prerequisites: { connect: { id: prerequisiteId } },
    },
    select: { id: true },
  });

  await recomputeModuleLevels(db, mod.course.id);

  return result;
}

export async function removePrerequisite(
  db: PrismaClient,
  moduleId: string,
  teacherId: string,
  prerequisiteId: string,
): Promise<{ id: string }> {
  const mod = await db.module.findUnique({
    where: { id: moduleId },
    include: { course: { select: { teacherId: true, id: true } } },
  });
  if (!mod) {
    throw new TRPCError({ code: "NOT_FOUND", message: "Module not found" });
  }
  if (mod.course.teacherId !== teacherId) {
    throw new TRPCError({ code: "FORBIDDEN", message: "Not your module" });
  }

  const result = await db.module.update({
    where: { id: moduleId },
    data: {
      prerequisites: { disconnect: { id: prerequisiteId } },
    },
    select: { id: true },
  });

  await recomputeModuleLevels(db, mod.course.id);

  return result;
}

async function getCourseModuleGraph(db: PrismaClient, courseId: string) {
  const modules = await db.module.findMany({
    where: { courseId },
    select: {
      id: true,
      name: true,
      prerequisites: { select: { id: true } },
    },
  });

  return modules.map((m) => ({
    id: m.id,
    name: m.name,
    prerequisiteIds: m.prerequisites.map((p) => p.id),
  }));
}

export async function getAvailablePrerequisites(
  db: PrismaClient,
  moduleId: string,
  teacherId: string,
): Promise<DependencyListItem[]> {
  const mod = await db.module.findUnique({
    where: { id: moduleId },
    include: {
      course: { select: { id: true, teacherId: true } },
      prerequisites: { select: { id: true } },
    },
  });

  if (!mod) {
    throw new TRPCError({ code: "NOT_FOUND", message: "Module not found" });
  }
  if (mod.course.teacherId !== teacherId) {
    throw new TRPCError({ code: "FORBIDDEN", message: "Not your module" });
  }

  const modules = await getCourseModuleGraph(db, mod.course.id);

  const { requiredForMap } = buildGraph(modules);

  const descendants = getDescendants(moduleId, requiredForMap);

  const existingPrereqIds = new Set(mod.prerequisites.map((p) => p.id));

  return modules
    .filter(
      (m) =>
        m.id !== moduleId &&
        !existingPrereqIds.has(m.id) &&
        !descendants.has(m.id),
    )
    .map((m) => ({ id: m.id, name: m.name }));
}

export async function getAvailableRequiredFor(
  db: PrismaClient,
  moduleId: string,
  teacherId: string,
): Promise<DependencyListItem[]> {
  const mod = await db.module.findUnique({
    where: { id: moduleId },
    include: {
      course: { select: { id: true, teacherId: true } },
      requiredFor: { select: { id: true } },
    },
  });

  if (!mod) {
    throw new TRPCError({ code: "NOT_FOUND", message: "Module not found" });
  }
  if (mod.course.teacherId !== teacherId) {
    throw new TRPCError({ code: "FORBIDDEN", message: "Not your module" });
  }

  const modules = await getCourseModuleGraph(db, mod.course.id);

  const { prerequisiteMap } = buildGraph(modules);

  const ancestors = getAncestors(moduleId, prerequisiteMap);

  const existingRequiredForIds = new Set(mod.requiredFor.map((r) => r.id));

  return modules
    .filter(
      (m) =>
        m.id !== moduleId &&
        !existingRequiredForIds.has(m.id) &&
        !ancestors.has(m.id),
    )
    .map((m) => ({ id: m.id, name: m.name }));
}

export type StudentModuleOverview = {
  courseName: string;
  moduleName: string;
  moduleLevel: number;
  content: unknown; //tiptap JSON content
  hasRead: boolean;
};

export async function getStudentModuleOverview(
  db: PrismaClient,
  courseId: string,
  moduleId: string,
  studentId: string,
): Promise<StudentModuleOverview> {
  try {
    await db.studentInCourse.findUniqueOrThrow({
      where: {
        studentId_courseId: {
          studentId: studentId,
          courseId: courseId,
        },
      },
    });
  } catch {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Student not in course",
    });
  }

  const moduleData = await db.moduleProgress.findUnique({
    where: {
      studentId_courseId_moduleId: {
        studentId: studentId,
        courseId: courseId,
        moduleId: moduleId,
      },
    },
    select: {
      enrollment: { select: { course: { select: { name: true } } } },
      level: true,
      module: { select: { content: true, name: true } },
      hasReadTheory: true,
    },
  });

  if (!moduleData) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "No ModuleProgress for this module",
    });
  }

  return {
    courseName: moduleData.enrollment.course.name,
    moduleName: moduleData.module.name,
    moduleLevel: moduleData.level,
    content: moduleData.module.content,
    hasRead: moduleData.hasReadTheory,
  };
}

export async function setStudentHasRead(
  db: PrismaClient,
  courseId: string,
  moduleId: string,
  studentId: string,
) {
  try {
    await db.studentInCourse.findUniqueOrThrow({
      where: {
        studentId_courseId: {
          studentId: studentId,
          courseId: courseId,
        },
      },
    });
  } catch {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Student not in course",
    });
  }

  await db.moduleProgress.update({
    where: {
      studentId_courseId_moduleId: {
        studentId: studentId,
        courseId: courseId,
        moduleId: moduleId,
      },
    },
    data: {
      hasReadTheory: true,
    },
  });
}

async function recomputeModuleLevels(db: PrismaClient, courseId: string) {
  const modules = await getCourseModuleGraph(db, courseId);
  const levels = computeModuleLevels(modules);

  await Promise.all(
    modules.map((m) =>
      db.module.update({
        where: { id: m.id },
        data: { level: levels.get(m.id) ?? 0 },
      }),
    ),
  );
}
