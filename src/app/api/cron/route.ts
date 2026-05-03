import { processReviewsDue } from "@/server/services/cron-reviews";
import { db } from "@/server/db";
import { env } from "@/env";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");

  if (authHeader !== `Bearer ${env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const result = await processReviewsDue(db);
  return NextResponse.json(result);
}
