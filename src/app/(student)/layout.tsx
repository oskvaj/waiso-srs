export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-theme-page text-theme-text min-h-screen">
      <main className="mx-auto max-w-7xl px-10 pt-10 pb-30">{children}</main>
    </div>
  );
}
