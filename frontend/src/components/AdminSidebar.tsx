'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

type NavItem = {
  href: string;
  icon: string;
  label: string;
  exact?: boolean;
};

const NAV_ITEMS: NavItem[] = [
  { href: '/admin/plates', icon: '≡', label: 'Manage plates', exact: true },
  { href: '/admin/plates/new', icon: '+', label: 'Add plate' },
  { href: '/admin/themes', icon: '◐', label: 'Themes' },
  { href: '/admin/promo', icon: '◆', label: 'Promo banners' },
  { href: '/admin/site', icon: '▤', label: 'Site images' },
  { href: '/admin/config', icon: '⚙', label: 'Config' },
  { href: '/plates', icon: '◰', label: 'Public site' },
];

export function AdminSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const [hasToken, setHasToken] = useState(false);

  useEffect(() => {
    setHasToken(!!localStorage.getItem('admin_token'));
  }, []);

  function handleLogout() {
    localStorage.removeItem('admin_token');
    setHasToken(false);
    router.replace('/admin/login');
  }

  function isActive(item: NavItem) {
    if (!pathname) return false;
    if (item.exact) return pathname === item.href;
    return pathname === item.href || pathname.startsWith(item.href + '/');
  }

  return (
    <aside className="h-fit overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-soft">
      <div className="bg-gradient-to-br from-brand to-brand-700 px-5 py-5 text-white">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-accent text-sm font-bold text-brand shadow">
            TS
          </span>
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gold-200/80">
              Admin
            </div>
            <div className="font-display text-base font-bold">Dashboard</div>
          </div>
        </div>
      </div>

      <nav className="flex flex-col gap-1 p-3 text-sm">
        {NAV_ITEMS.map((item) => (
          <SideLink
            key={item.href}
            href={item.href}
            icon={item.icon}
            active={isActive(item)}
          >
            {item.label}
          </SideLink>
        ))}

        <div className="my-2 border-t border-slate-100" />

        {hasToken ? (
          <button
            type="button"
            onClick={handleLogout}
            className="group flex items-center gap-3 rounded-lg px-3 py-2 text-left font-medium text-slate-600 transition hover:bg-red-50 hover:text-red-700"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-slate-100 text-xs text-slate-500 transition group-hover:bg-red-100 group-hover:text-red-700">
              ⎋
            </span>
            Logout
          </button>
        ) : (
          <SideLink href="/admin/login" icon="→" active={pathname === '/admin/login'}>
            Login
          </SideLink>
        )}
      </nav>
    </aside>
  );
}

function SideLink({
  href,
  icon,
  active,
  children,
}: {
  href: string;
  icon: string;
  active?: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={
        active
          ? 'group flex items-center gap-3 rounded-lg bg-gold-50 px-3 py-2 font-semibold text-brand-accent'
          : 'group flex items-center gap-3 rounded-lg px-3 py-2 font-medium text-slate-600 transition hover:bg-gold-50 hover:text-brand-accent'
      }
    >
      <span
        className={
          active
            ? 'flex h-7 w-7 items-center justify-center rounded-md bg-gold-100 text-xs text-brand-accent'
            : 'flex h-7 w-7 items-center justify-center rounded-md bg-slate-100 text-xs text-slate-500 transition group-hover:bg-gold-100 group-hover:text-brand-accent'
        }
      >
        {icon}
      </span>
      {children}
    </Link>
  );
}
