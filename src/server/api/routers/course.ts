import {
  createCourse,
  createCourseSchema,
  deleteCourse,
  getCourseOverview,
  listCoursesForTeacher,
  updateCourse,
  updateCourseSchema,
  publishCourse,
  listCoursesForStudent,
  getStudentCourseOverview,
  reviewsDueNow,
  getStudentReviewSchedule,
  numberOfCoursesWithoutTheoryRead,
} from "@/server/services/course";
import { createTRPCRouter, studentProcedure, teacherProcedure } from "../trpc";
import z from "zod";

export const courseRouter = createTRPCRouter({
  listMine: teacherProcedure.query(({ ctx }) => {
    return listCoursesForTeacher(ctx.db, ctx.teacher.userId);
  }),

  listForStudent: studentProcedure.query(({ ctx }) => {
    return listCoursesForStudent(ctx.db, ctx.student.userId);
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

  getStudentOverview: studentProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      return getStudentCourseOverview(ctx.db, input.id, ctx.student.userId);
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

  publish: teacherProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ ctx, input }) => {
      return publishCourse(ctx.db, input.id, ctx.teacher.userId);
    }),

  getReviewsDue: studentProcedure
    .input(z.object({ courseIds: z.array(z.string()) }))
    .query(({ ctx, input }) => {
      return reviewsDueNow(ctx.db, input.courseIds, ctx.student.userId);
    }),

  getReviewSchedule: studentProcedure
    .input(z.object({ courseId: z.string() }))
    .query(({ ctx, input }) => {
      return getStudentReviewSchedule(
        ctx.db,
        input.courseId,
        ctx.student.userId,
      );
    }),

  getMissingTheoryNumber: studentProcedure
    .input(z.object({ courseId: z.string() }))
    .query(({ ctx, input }) => {
      return numberOfCoursesWithoutTheoryRead(
        ctx.db,
        input.courseId,
        ctx.student.userId,
      );
    }),
});
