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
  listDependenciesForModule,
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

  listDependencies: protectedProcedure
    .input(z.object({ moduleId: z.string() }))
    .query(({ ctx, input }) => {
      return listDependenciesForModule(ctx.db, input.moduleId);
    }),
});
