import { auth } from "@/server/auth";
import { redirect } from "next/navigation";
import { db } from "@/server/db";

export default async function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/");
  }

  const student = await db.student.findUnique({
    where: { userId: session.user.id },
  });

  if (!student) {
    redirect("/onboarding");
  }

  return (
    <div className="bg-theme-page text-theme-text min-h-screen">
      <main className="mx-auto max-w-7xl px-3 pt-10 pb-30">{children}</main>
    </div>
  );
}
