import { processReviewsDue } from "@/server/services/cron-reviews";
import { db } from "@/server/db";

const POLL_INTERVAL = 10_000;

async function poll() {
  try {
    const result = await processReviewsDue(db);
    if (result.processed > 0) {
      console.log(
        `[review-poller] Processed ${result.processed} reviews, notified ${result.notified} students`,
      );
    }
  } catch (error) {
    console.error("[review-poller] Error:", error);
  }
}

console.log("[review-poller] Starting, polling every 10 seconds...");
setInterval(() => void poll(), POLL_INTERVAL);
