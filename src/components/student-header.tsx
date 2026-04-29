"use clinet";

import { CircleUserRound, MoveLeft } from "lucide-react";
import Link from "next/link";

export function StudentHeader({
  href,
  text,
  moveLeft = false,
}: {
  href: string;
  text: string;
  moveLeft?: boolean;
}) {
  return (
    <header className="border-theme-border">
      <div className="flex h-14 items-center justify-between">
        <Link
          href={href}
          className="font-theme-heading text-theme-primary text-xl font-bold"
        >
          <div className="flex items-center gap-2">
            {moveLeft && <MoveLeft className="size-6" />}
            {text}
          </div>
        </Link>

        <div className="text-theme-muted flex items-center gap-4 text-sm">
          <button type="button" className="hover:cursor-pointer">
            <CircleUserRound className="text-theme-primary hover:text-theme-primary/70 size-8" />
          </button>
        </div>
      </div>
    </header>
  );
}
