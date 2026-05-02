import z from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { subscribe, unsubscribe } from "@/server/services/push-subscription";

export const pushSubscriptionRouter = createTRPCRouter({
  subscribe: protectedProcedure
    .input(
      z.object({
        endpoint: z.string().url(),
        p256dh: z.string(),
        auth: z.string(),
      }),
    )
    .mutation(({ ctx, input }) => {
      return subscribe(
        ctx.db,
        input.endpoint,
        ctx.session.user.id,
        input.p256dh,
        input.auth,
      );
    }),

  unsubscribe: protectedProcedure
    .input(z.object({ endpoint: z.string().url() }))
    .mutation(({ ctx, input }) => {
      return unsubscribe(ctx.db, input.endpoint, ctx.session.user.id);
    }),
});
