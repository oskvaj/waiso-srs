"use client";

import { Card } from "@/components/ui/card";
import Link from "next/link";

export function StudentLearnButton({ id }: { id: string }) {
  return (
    <Link href={`/course/${id}/learn`}>
      <Card
        variant="raised"
        className="group bg-theme-primary/25 hover:bg-theme-primary/35 text-theme-bg-theme-primary h-full p-6 transition-colors"
      >
        <div className="text-center">
          <span className="font-theme-heading text-xl font-semibold">
            Learn
          </span>
        </div>
      </Card>
    </Link>
  );
}
