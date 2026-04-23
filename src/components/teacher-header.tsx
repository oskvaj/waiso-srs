import { CircleUserRound } from "lucide-react";
import Link from "next/link";

export function TeacherHeader() {
  return (
    <header className="border-theme-border bg-theme-card border-b">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-8">
        <Link
          href="/courses"
          className="font-theme-heading text-theme-primary text-xl font-bold"
        >
          Waiso
        </Link>

        <div className="text-theme-muted flex items-center gap-4 text-sm">
          <span>Student view</span>
          <button type="button" className="hover:cursor-pointer">
            <CircleUserRound className="text-theme-primary hover:text-theme-primary/70 size-8" />
          </button>
        </div>
      </div>
    </header>
  );
}
