import z from "zod";
import { createTRPCRouter, studentProcedure } from "../trpc";
import { getReviewContent, updateReviews } from "@/server/services/review";

export const reviewRouter = createTRPCRouter({
  getReviewContent: studentProcedure
    .input(z.object({ courseIds: z.array(z.string()) }))
    .query(({ ctx, input }) => {
      return getReviewContent(ctx.db, input.courseIds, ctx.student.userId);
    }),

  updateReviewResults: studentProcedure
    .input(
      z.object({
        results: z.array(
          z.object({
            moduleId: z.string(),
            firstTry: z.boolean(),
            questions: z.array(
              z.object({
                questionId: z.string(),
                correct: z.boolean(),
              }),
            ),
          }),
        ),
      }),
    )
    .mutation(({ ctx, input }) => {
      return updateReviews(ctx.db, input.results, ctx.student.userId);
    }),
});
