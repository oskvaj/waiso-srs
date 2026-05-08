"use client";

import { api } from "@/trpc/react";
import { CircleUserRound } from "lucide-react";
import Link from "next/link";
import { AccountDialog } from "./account-dialog";

export function TeacherHeader() {
  const { data: profile } = api.student.getProfile.useQuery();

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
          {profile ? (
            <AccountDialog
              email={profile.email ?? ""}
              initialName={profile.name ?? ""}
            />
          ) : (
            <CircleUserRound className="text-theme-primary hover:text-theme-primary/70 size-8" />
          )}
        </div>
      </div>
    </header>
  );
}
