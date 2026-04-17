import {
  createCourse,
  createCourseSchema,
  listCoursesForTeacher,
} from "@/server/services/course";
import { createTRPCRouter, teacherProcedure } from "../trpc";

export const courseRouter = createTRPCRouter({
  listMine: teacherProcedure.query(({ ctx }) => {
    return listCoursesForTeacher(ctx.db, ctx.session.user.id);
  }),

  create: teacherProcedure
    .input(createCourseSchema)
    .mutation(({ ctx, input }) => {
      return createCourse(ctx.db, ctx.session.user.id, input);
    }),
});
