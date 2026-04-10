import NextAuth, { type Session } from "next-auth";
import { cache } from "react";
import { cookies } from "next/headers";
import { env } from "@/env";
import { db } from "@/server/db";

import { authConfig } from "./config";

const { auth: uncachedAuth, handlers, signIn, signOut } = NextAuth(authConfig);

const auth =
  env.NODE_ENV !== "development"
    ? cache(uncachedAuth)
    : cache(async () => {
        const cookieStore = await cookies();
        const devUserId = cookieStore.get("dev-user-id")?.value;

        if (!devUserId) return null;

        const user = await db.user.findUnique({ where: { id: devUserId } });
        if (!user) return null;

        return {
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            image: user.image,
          },
          expires: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
        } satisfies Session;
      });

export { auth, handlers, signIn, signOut };
