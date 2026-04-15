import { TeacherHeader } from "@/components/teacher-header";

export default function TeacherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-theme-page text-theme-text min-h-screen">
      <TeacherHeader />
      <main className="mx-auto max-w-7xl px-10 pt-10 pb-5">{children}</main>
    </div>
  );
}
