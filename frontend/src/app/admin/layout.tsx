export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-[calc(100vh-72px)] bg-gradient-to-b from-slate-50 to-slate-100">
      <div className="admin-shell">{children}</div>
    </div>
  );
}
