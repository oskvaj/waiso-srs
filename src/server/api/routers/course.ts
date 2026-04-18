import {
  createCourse,
  createCourseSchema,
  getCourseOverview,
  listCoursesForTeacher,
} from "@/server/services/course";
import { createTRPCRouter, teacherProcedure } from "../trpc";
import z from "zod";

export const courseRouter = createTRPCRouter({
  listMine: teacherProcedure.query(({ ctx }) => {
    return listCoursesForTeacher(ctx.db, ctx.teacher.userId);
  }),

  create: teacherProcedure
    .input(createCourseSchema)
    .mutation(({ ctx, input }) => {
      return createCourse(ctx.db, ctx.teacher.userId, input);
    }),

  getOverview: teacherProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      return getCourseOverview(ctx.db, input.id, ctx.teacher.userId);
    }),
});
