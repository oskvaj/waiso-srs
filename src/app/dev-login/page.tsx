import { notFound, redirect } from "next/navigation";
import { cookies } from "next/headers";
import { env } from "@/env";
import { db } from "@/server/db";

export default async function DevLoginPage() {
  if (env.NODE_ENV !== "development") notFound();

  const users = await db.user.findMany({
    include: { student: true, teacher: true },
  });

  async function loginAs(userId: string) {
    "use server";
    const cookieStore = await cookies();
    cookieStore.set("dev-user-id", userId, { httpOnly: true, path: "/" });
    redirect("/");
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex flex-col gap-3">
        {users.map((u) => (
          <form key={u.id} action={loginAs.bind(null, u.id)}>
            <button
              type="submit"
              className="w-full rounded-lg border border-gray-300 bg-white px-6 py-3 text-left hover:bg-gray-100"
            >
              {u.name}
            </button>
          </form>
        ))}
      </div>
    </div>
  );
}
