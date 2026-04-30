import { TeacherHeader } from "@/components/teacher-header";

export default function TeacherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-theme-page text-theme-text flex h-dvh flex-col">
      <TeacherHeader />
      <main className="mx-auto h-0 w-full max-w-7xl flex-1 px-10 py-5">
        {children}
      </main>
    </div>
  );
}
