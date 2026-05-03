"use client";

import { Card } from "@/components/ui/card";
import Link from "next/link";

export function StudentReviewScheduleButton({ id }: { id: string }) {
  return (
    <div>
      <Link href={`${id}/review-schedule`}>
        <Card
          variant="raised"
          className="text-theme-text group hover:bg-theme-primary/15 h-full justify-center p-6 text-xl font-bold"
        >
          <div>Upcoming Reviews</div>
        </Card>
      </Link>
    </div>
  );
}
