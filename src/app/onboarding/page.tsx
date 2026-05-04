import { auth } from "@/server/auth";
import { redirect } from "next/navigation";
import { db } from "@/server/db";
import { OnboardingForm } from "@/components/onboarding-form";

export default async function OnboardingPage() {
  const session = await auth();
  console.log("ONBOARDING SESSION", session);

  if (!session?.user) {
    redirect("/");
  }
  const [student, teacher] = await Promise.all([
    db.student.findUnique({ where: { userId: session.user.id } }),
    db.teacher.findUnique({ where: { userId: session.user.id } }),
  ]);

  if (teacher) redirect("/courses");
  if (student) redirect("/course");

  return (
    <main className="bg-theme-page flex min-h-screen items-center justify-center">
      <div className="w-full max-w-sm space-y-6 px-4">
        <div className="text-center">
          <h1 className="font-theme-heading text-theme-primary text-3xl font-bold">
            Welcome to Waiso
          </h1>
          <p className="text-theme-muted mt-2 text-sm">
            What should we call you?
          </p>
        </div>
        <OnboardingForm />
      </div>
    </main>
  );
}
