import Link from "next/link";

import { Module } from "@/features/module/module";
import { auth } from "@/server/auth";
import { HydrateClient } from "@/trpc/server";
import { env } from "@/env";

export default async function Home() {
  const session = await auth();

  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col items-center justify-center bg-linear-to-b from-[#2e026d] to-[#15162c] text-white">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
          <div>
            <Module />
          </div>
          <div>{session ? "You are signed in" : "You are not signed in"}</div>
          <div className="flex flex-col items-center gap-2">
            <div className="flex flex-col items-center justify-center gap-4">
              <p className="text-center text-2xl text-white">
                {session && <span>Logged in as {session.user?.name}</span>}
              </p>
              <Link
                href={
                  session
                    ? env.NODE_ENV === "development"
                      ? "/api/dev-logout"
                      : "/api/auth/signout"
                    : env.NODE_ENV === "development"
                      ? "/dev-login"
                      : "/api/auth/signin"
                }
                className="rounded-full bg-white/10 px-10 py-3 font-semibold no-underline transition hover:bg-white/20"
              >
                {session ? "Sign out" : "Sign in"}
              </Link>
            </div>
          </div>
        </div>
      </main>
    </HydrateClient>
  );
}
