import z from "zod";
import { createTRPCRouter, teacherProcedure } from "../trpc";
import {
  createQuestion,
  createQuestionSchema,
  deleteQuestion,
  getQuestionDetail,
  listQuestionsForModule,
  updateQuestion,
  updateQuestionSchema,
} from "@/server/services/question";

export const questionRouter = createTRPCRouter({
  listByModule: teacherProcedure
    .input(z.object({ moduleId: z.string() }))
    .query(({ ctx, input }) => {
      return listQuestionsForModule(ctx.db, input.moduleId, ctx.teacher.userId);
    }),

  getDetail: teacherProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      return getQuestionDetail(ctx.db, input.id, ctx.teacher.userId);
    }),

  create: teacherProcedure
    .input(createQuestionSchema)
    .mutation(({ ctx, input }) => {
      return createQuestion(ctx.db, ctx.teacher.userId, input);
    }),

  update: teacherProcedure
    .input(updateQuestionSchema)
    .mutation(({ ctx, input }) => {
      return updateQuestion(ctx.db, ctx.teacher.userId, input);
    }),

  delete: teacherProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ ctx, input }) => {
      return deleteQuestion(ctx.db, ctx.teacher.userId, input.id);
    }),
});
