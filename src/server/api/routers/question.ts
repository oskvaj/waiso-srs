import z from "zod";
import { createTRPCRouter, teacherProcedure } from "../trpc";
import { listQuestionsForModule } from "@/server/services/question";

export const questionRouter = createTRPCRouter({
  listByModule: teacherProcedure
    .input(z.object({ moduleId: z.string() }))
    .query(({ ctx, input }) => {
      return listQuestionsForModule(ctx.db, input.moduleId, ctx.teacher.userId);
    }),
});
