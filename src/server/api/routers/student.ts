import z from "zod";
import { createTRPCRouter, teacherProcedure } from "../trpc";
import { listStudentsForCourse } from "@/server/services/student";

export const studentRouter = createTRPCRouter({
  listByCourse: teacherProcedure
    .input(z.object({ courseId: z.string() }))
    .query(({ ctx, input }) => {
      return listStudentsForCourse(ctx.db, input.courseId, ctx.teacher.userId);
    }),
});
