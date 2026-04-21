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
  const logoUrl = config.logo_url || '/logo-ts.png';
  const siteName = config.site_name || 'TABIEN SELECT';

  return (
    <html lang="th" style={themeVars}>
      <body className="font-sans" style={{ background: 'var(--color-background)', color: 'var(--color-foreground)' }}>
        <SiteHeader logoUrl={logoUrl} siteName={siteName} />
        <main>{children}</main>
        <SiteFooter logoUrl={logoUrl} siteName={siteName} />
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
          <img
            src={logoUrl}
            alt={siteName}
            className="h-11 w-auto max-w-[160px] object-contain"
          />
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

function SiteFooter({ logoUrl, siteName }: { logoUrl: string; siteName: string }) {
  return (
    <footer className="mt-24 bg-ink-900 text-white">
      <div className="container-page grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Link href="/" className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={logoUrl}
              alt={siteName}
              className="h-11 w-auto max-w-[160px] object-contain"
            />
            <span className="text-[17px] font-semibold tracking-[0.2em]">
              {siteName}
            </span>
          </Link>
          <p className="mt-4 text-sm leading-relaxed text-white/70">
            ทะเบียนสวย เลขมงคล คัดพิเศษ สำหรับลูกค้าที่ใส่ใจรายละเอียด
          </p>
        </div>
        <FooterCol
          title="เมนู"
          links={[
            { label: 'หน้าแรก', href: '/' },
            { label: 'ทะเบียนทั้งหมด', href: '/plates' },
            { label: 'จุดเด่น', href: '/#why' },
            { label: 'ติดต่อ', href: '/#contact' },
          ]}
        />
        <FooterCol
          title="หมวดทะเบียน"
          links={[
            { label: '2-digit numbers', href: '/plates?category=2-digit' },
            { label: '3-digit numbers', href: '/plates?category=3-digit' },
            { label: 'Popular numbers', href: '/plates?category=popular' },
          ]}
        />
        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-400">
            ติดตามเรา
          </div>
          <p className="mt-4 text-sm leading-relaxed text-white/70">
            ติดต่อทีมงานผ่าน Line ได้ตลอด 24 ชม.
          </p>
          <Link
            href="/#contact"
            className="mt-5 inline-flex h-10 items-center rounded-full bg-cyan-400 px-5 text-xs font-semibold text-ink-900 hover:bg-cyan-300"
          >
            แชทกับทีมงาน →
          </Link>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-xs text-white/50">
        &copy; {new Date().getFullYear()} {siteName} — All rights reserved.
      </div>
    </footer>
  );
}

function FooterCol({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div>
      <div className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-400">
        {title}
      </div>
      <ul className="mt-4 space-y-2.5 text-sm text-white/70">
        {links.map((l) => (
          <li key={l.href + l.label}>
            <Link href={l.href} className="transition hover:text-cyan-400">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
