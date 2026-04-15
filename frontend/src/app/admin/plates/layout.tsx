import Link from 'next/link';

export default function AdminPlatesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid gap-6 md:grid-cols-[16rem_1fr]">
      <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
        <div className="mb-4 flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand text-sm font-bold text-gold-400">
            TS
          </span>
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Admin
            </div>
            <div className="font-display text-sm font-bold text-brand">
              Dashboard
            </div>
          </div>
        </div>
        <nav className="flex flex-col gap-1 text-sm">
          <SideLink href="/admin/plates" icon="≡">
            Manage plates
          </SideLink>
          <SideLink href="/admin/plates/new" icon="+">
            Add plate
          </SideLink>
          <SideLink href="/plates" icon="◰">
            Public site
          </SideLink>
          <SideLink href="/admin/login" icon="→">
            Login
          </SideLink>
        </nav>
      </aside>
      <section>{children}</section>
    </div>
  );
}

function SideLink({
  href,
  icon,
  children,
}: {
  href: string;
  icon: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-3 rounded-lg px-3 py-2 font-medium text-slate-600 transition hover:bg-gold-50 hover:text-brand-accent"
    >
      <span className="flex h-7 w-7 items-center justify-center rounded-md bg-slate-100 text-xs text-slate-500 transition group-hover:bg-gold-100 group-hover:text-brand-accent">
        {icon}
      </span>
      {children}
    </Link>
  );
}
