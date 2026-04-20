import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';
import { getThemeVars, getConfigMap } from '@/components/ThemeProvider';

export const metadata: Metadata = {
  title: 'TABIEN SELECT — รับจองทะเบียนรถยนต์หมวดใหม่',
  description:
    'รับจองทะเบียนรถยนต์หมวดใหม่ เลขมงคล เลขศาสตร์ เลขวันเกิด',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [themeVars, config] = await Promise.all([getThemeVars(), getConfigMap()]);
  const logoUrl = config.logo_url || '/logo-ts.svg';
  const siteName = config.site_name || 'TABIEN SELECT';

  return (
    <html lang="th" style={themeVars}>
      <body className="font-sans" style={{ background: 'var(--color-background)', color: 'var(--color-foreground)' }}>
        <SiteHeader logoUrl={logoUrl} siteName={siteName} />
        <main>{children}</main>
      </body>
    </html>
  );
}

function SiteHeader({ logoUrl, siteName }: { logoUrl: string; siteName: string }) {
  return (
    <header
      className="sticky top-0 z-40 text-white"
      style={{ background: 'var(--color-primary)' }}
    >
      <div className="container-page flex h-[72px] items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={logoUrl} alt={siteName} className="h-10 w-auto" />
          <span className="text-[17px] font-semibold tracking-[0.2em]">
            {siteName}
          </span>
        </Link>

        <nav className="hidden items-center gap-8 text-[15px] text-white/90 md:flex">
          <NavLink href="/">หน้าแรก</NavLink>
          <NavLink href="/plates">ทะเบียน</NavLink>
          <NavLink href="/#why">จุดเด่น</NavLink>
          <NavLink href="/#contact">ติดต่อ</NavLink>
        </nav>

        <Link
          href="/plates"
          className="rounded-full px-7 py-2 text-sm font-medium"
          style={{
            background: 'var(--color-accent)',
            color: 'var(--color-foreground)',
          }}
        >
          ดูทะเบียน
        </Link>
      </div>
    </header>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="transition"
      style={{ color: 'inherit' }}
    >
      {children}
    </Link>
  );
}
