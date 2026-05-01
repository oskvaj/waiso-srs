import z from "zod";
import { createTRPCRouter, studentProcedure } from "../trpc";
import { getReviewContent } from "@/server/services/review";

export const reviewRouter = createTRPCRouter({
  getReviewContent: studentProcedure
    .input(z.object({ courseIds: z.array(z.string()) }))
    .query(({ ctx, input }) => {
      return getReviewContent(ctx.db, input.courseIds, ctx.student.userId);
    }),
});
