import z from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  teacherProcedure,
} from "../trpc";
import {
  listStudentsForCourse,
  updateUserName,
} from "@/server/services/student";

export const studentRouter = createTRPCRouter({
  listByCourse: teacherProcedure
    .input(z.object({ courseId: z.string() }))
    .query(({ ctx, input }) => {
      return listStudentsForCourse(ctx.db, input.courseId, ctx.teacher.userId);
    }),

  updateName: protectedProcedure
    .input(z.object({ name: z.string().min(1).max(100) }))
    .mutation(({ ctx, input }) => {
      return updateUserName(ctx.db, ctx.session.user.id, input.name);
    }),

  getProfile: protectedProcedure.query(({ ctx }) => {
    return ctx.db.user.findUnique({
      where: { id: ctx.session.user.id },
      select: { name: true, email: true },
    });
  }),
});
