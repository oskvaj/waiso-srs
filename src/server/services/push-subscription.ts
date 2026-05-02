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
