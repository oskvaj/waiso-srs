"use client";

import { CircleUserRound, MoveLeft } from "lucide-react";
import Link from "next/link";
import { AccountDialog } from "./account-dialog";
import { api } from "@/trpc/react";

export function StudentHeader({
  href,
  text,
  moveLeft = false,
}: {
  href: string;
  text: string;
  moveLeft?: boolean;
}) {
  const { data: profile } = api.student.getProfile.useQuery();

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
        {profile ? (
          <AccountDialog
            email={profile.email ?? ""}
            initialName={profile.name ?? ""}
          />
        ) : (
          <CircleUserRound className="text-theme-primary hover:text-theme-primary/70 size-8" />
        )}
      </div>
    </header>
  );
}
