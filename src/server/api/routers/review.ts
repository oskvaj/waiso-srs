import { z } from "zod";
import { createTRPCRouter, studentProcedure } from "../trpc";
import { getReviewContent, updateReviewResult } from "@/server/services/review";

export const reviewRouter = createTRPCRouter({
  getReviewContent: studentProcedure
    .input(z.object({ courseIds: z.array(z.string()) }))
    .query(({ ctx, input }) => {
      return getReviewContent(ctx.db, input.courseIds, ctx.student.userId);
    }),

  updateReviewResult: studentProcedure
    .input(
      z.object({
        courseId: z.string(),
        moduleId: z.string(),
        questionId: z.string(),
        correct: z.boolean(),
        firstTry: z.boolean(),
      }),
    )
    .mutation(({ ctx, input }) => {
      return updateReviewResult(
        ctx.db,
        ctx.student.userId,
        input.courseId,
        input.moduleId,
        input.questionId,
        input.correct,
        input.firstTry,
      );
    }),
});
