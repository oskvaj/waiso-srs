import { auth } from "@/server/auth";
import { redirect } from "next/navigation";
import { db } from "@/server/db";
import { TeacherHeader } from "@/components/teacher-header";

export default async function TeacherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/");
  }

  const teacher = await db.teacher.findUnique({
    where: { userId: session.user.id },
  });

  if (!teacher) {
    redirect("/");
  }

  return (
    <div className="bg-theme-page text-theme-text flex h-dvh flex-col">
      <TeacherHeader />
      <main className="mx-auto h-0 w-full max-w-7xl flex-1 px-10 py-5">
        {children}
      </main>
    </div>
  );
}
