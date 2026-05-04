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

  createAccount: protectedProcedure
    .input(z.object({ name: z.string().min(1).max(100) }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.user.update({
        where: { id: ctx.session.user.id },
        data: { name: input.name },
      });
      await ctx.db.student.upsert({
        where: { userId: ctx.session.user.id },
        create: { userId: ctx.session.user.id },
        update: {},
      });
    }),
});
