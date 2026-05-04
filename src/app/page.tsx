import { LandingPage } from "@/components/landing";
import { auth } from "@/server/auth";
import { db } from "@/server/db";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await auth();
  console.log("HOME SESSION", session);

  if (session?.user) {
    const [student, teacher] = await Promise.all([
      db.student.findUnique({ where: { userId: session.user.id } }),
      db.teacher.findUnique({ where: { userId: session.user.id } }),
    ]);

    if (teacher) redirect("/courses");
    if (student) redirect("/course");
    redirect("/onboarding");
  }

  return <LandingPage />;
}
