import { env } from "@/env";
import webpush from "web-push";
import type { PrismaClient } from "@/../generated/prisma";

export async function subscribe(
  db: PrismaClient,
  endpoint: string,
  userId: string,
  p256dh: string,
  auth: string,
) {
  return await db.pushSubscription.upsert({
    where: { endpoint },
    create: {
      userId,
      endpoint,
      p256dh,
      auth,
    },
    update: {
      p256dh,
      auth,
    },
  });
}

export async function unsubscribe(
  db: PrismaClient,
  endpoint: string,
  userId: string,
) {
  return await db.pushSubscription.deleteMany({
    where: {
      userId,
      endpoint,
    },
  });
}

webpush.setVapidDetails(
  "mailto:" + env.EMAIL_FROM,
  env.VAPID_PUBLIC_KEY,
  env.VAPID_PRIVATE_KEY,
);

export async function sendPushNotification(
  db: PrismaClient,
  userId: string,
  payload: { title: string; body: string; url?: string },
) {
  const subscriptions = await db.pushSubscription.findMany({
    where: { userId },
  });

  const results = await Promise.allSettled(
    subscriptions.map(async (sub) => {
      try {
        await webpush.sendNotification(
          {
            endpoint: sub.endpoint,
            keys: {
              p256dh: sub.p256dh,
              auth: sub.auth,
            },
          },
          JSON.stringify(payload),
        );
      } catch (error) {
        if (
          error instanceof webpush.WebPushError &&
          (error.statusCode === 404 || error.statusCode === 410)
        ) {
          await db.pushSubscription.delete({ where: { id: sub.id } });
        }
        throw error;
      }
    }),
  );

  return results;
}
