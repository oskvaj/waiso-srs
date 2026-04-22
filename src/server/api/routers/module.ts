import z from "zod";
import { createTRPCRouter, teacherProcedure } from "../trpc";
import {
  createModule,
  createModuleSchema,
  getModuleDetail,
  listModulesForTeacher,
} from "@/server/services/module";

export const moduleRouter = createTRPCRouter({
  listForTeacher: teacherProcedure
    .input(z.object({ courseId: z.string() }))
    .query(({ ctx, input }) => {
      return listModulesForTeacher(ctx.db, input.courseId, ctx.teacher.userId);
    }),

  create: teacherProcedure
    .input(createModuleSchema)
    .mutation(({ ctx, input }) => {
      return createModule(ctx.db, ctx.teacher.userId, input);
    }),

  getDetail: teacherProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      return getModuleDetail(ctx.db, input.id, ctx.teacher.userId);
    }),
});
