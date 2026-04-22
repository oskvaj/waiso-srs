import {
  createCourse,
  createCourseSchema,
  deleteCourse,
  getCourseOverview,
  listCoursesForTeacher,
  updateCourse,
  updateCourseSchema,
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

  update: teacherProcedure
    .input(updateCourseSchema)
    .mutation(({ ctx, input }) => {
      return updateCourse(ctx.db, ctx.teacher.userId, input);
    }),

  delete: teacherProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ ctx, input }) => {
      return deleteCourse(ctx.db, input.id, ctx.teacher.userId);
    }),
});
