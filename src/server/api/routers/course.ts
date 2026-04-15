import { listCoursesForTeacher } from "@/server/services/course";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const courseRouter = createTRPCRouter({
  listMine: protectedProcedure.query(({ ctx }) => {
    return listCoursesForTeacher(ctx.db, ctx.session.user.id);
  }),
});
