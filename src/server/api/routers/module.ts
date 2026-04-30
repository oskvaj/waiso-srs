import z from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  studentProcedure,
  teacherProcedure,
} from "../trpc";
import {
  createModule,
  createModuleSchema,
  getModuleDetail,
  listModulesForTeacher,
  listModulesForStudent,
  updateModule,
  updateModuleSchema,
  listPrerequisites,
  listRequiredFor,
  addPrerequisite,
  removePrerequisite,
} from "@/server/services/module";

export const moduleRouter = createTRPCRouter({
  listForTeacher: teacherProcedure
    .input(z.object({ courseId: z.string() }))
    .query(({ ctx, input }) => {
      return listModulesForTeacher(ctx.db, input.courseId, ctx.teacher.userId);
    }),

  listForStudent: studentProcedure
    .input(z.object({ courseId: z.string() }))
    .query(({ ctx, input }) => {
      return listModulesForStudent(ctx.db, input.courseId, ctx.student.userId);
    }),

  create: teacherProcedure
    .input(createModuleSchema)
    .mutation(({ ctx, input }) => {
      return createModule(ctx.db, ctx.teacher.userId, input);
    }),

  getDetail: teacherProcedure // TODO: this can be normal protected procedure and used for both teacher and student
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      return getModuleDetail(ctx.db, input.id, ctx.teacher.userId);
    }),

  update: teacherProcedure
    .input(updateModuleSchema)
    .mutation(({ ctx, input }) => {
      return updateModule(ctx.db, ctx.teacher.userId, input);
    }),

  listPrerequisites: protectedProcedure
    .input(z.object({ moduleId: z.string() }))
    .query(({ ctx, input }) => {
      return listPrerequisites(ctx.db, input.moduleId);
    }),

  listRequiredFor: protectedProcedure
    .input(z.object({ moduleId: z.string() }))
    .query(({ ctx, input }) => {
      return listRequiredFor(ctx.db, input.moduleId);
    }),

  addPrerequisite: teacherProcedure
    .input(z.object({ moduleId: z.string(), prerequisiteId: z.string() }))
    .mutation(({ ctx, input }) => {
      return addPrerequisite(
        ctx.db,
        input.moduleId,
        ctx.teacher.userId,
        input.prerequisiteId,
      );
    }),

  removePrerequisite: teacherProcedure
    .input(z.object({ moduleId: z.string(), prerequisiteId: z.string() }))
    .mutation(({ ctx, input }) => {
      return removePrerequisite(
        ctx.db,
        input.moduleId,
        ctx.teacher.userId,
        input.prerequisiteId,
      );
    }),

  addRequiredFor: teacherProcedure
    .input(z.object({ moduleId: z.string(), targetModuleId: z.string() }))
    .mutation(({ ctx, input }) => {
      return addPrerequisite(
        ctx.db,
        input.targetModuleId,
        ctx.teacher.userId,
        input.moduleId,
      );
    }),

  removeRequiredFor: teacherProcedure
    .input(z.object({ moduleId: z.string(), targetModuleId: z.string() }))
    .mutation(({ ctx, input }) => {
      return removePrerequisite(
        ctx.db,
        input.targetModuleId,
        ctx.teacher.userId,
        input.moduleId,
      );
    }),
});
