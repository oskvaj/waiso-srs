import { processReviewsDue } from "@/server/services/cron-reviews";
import { db } from "@/server/db";
import { env } from "@/env";
import { NextResponse } from "next/server";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");

  if (authHeader !== `Bearer ${env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  for (let attempt = 0; attempt < 4; attempt++) {
    try {
      const result = await processReviewsDue(db);
      return NextResponse.json(result);
    } catch (error) {
      console.error(`Cron attempt ${attempt + 1} failed:`, error);
      if (attempt < 3) {
        await sleep(2000);
      }
    }
  }

  return NextResponse.json(
    { error: "Failed after 4 attempts" },
    { status: 500 },
  );
}
