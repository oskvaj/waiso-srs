import type { PrismaClient } from "@/../generated/prisma";
import { sendPushNotification } from "./notification";

export async function processReviewsDue(db: PrismaClient) {
  const now = new Date();

  const due = await db.moduleProgress.findMany({
    where: {
      nextReview: { not: null, lte: now },
    },
    select: {
      studentId: true,
      courseId: true,
      moduleId: true,
    },
  });

  if (due.length === 0) return { processed: 0, notified: 0 };

  await db.$transaction(
    due.map((d) =>
      db.moduleProgress.update({
        where: {
          studentId_courseId_moduleId: {
            studentId: d.studentId,
            courseId: d.courseId,
            moduleId: d.moduleId,
          },
        },
        data: { nextReview: null },
      }),
    ),
  );

  const studentIds = [...new Set(due.map((d) => d.studentId))];

  let notified = 0;
  for (const studentId of studentIds) {
    const count = due.filter((d) => d.studentId === studentId).length;
    try {
      await sendPushNotification(db, studentId, {
        title: "Reviews ready!",
        body: `You have ${count} ${count === 1 ? "module" : "modules"} ready for review.`,
        url: "/course",
      });
      notified++;
    } catch (error) {
      console.error(`Failed to notify student ${studentId}:`, error);
    }
  }

  return { processed: due.length, notified };
}
