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
        <SiteFooter />
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
          <img src={logoUrl} alt={siteName} className="h-20 w-20" />
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

function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-slate-200 bg-white">
      <div className="container-page grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand text-sm font-bold text-gold-400">
              TS
            </span>
            <span className="font-display text-lg font-bold">
              Tabien<span className="text-brand-accent">Select</span>
            </span>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-slate-600">
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
            { label: 'Premium', href: '/plates?category=Premium' },
            { label: 'Lucky', href: '/plates?category=Lucky' },
            { label: 'Standard', href: '/plates?category=Standard' },
          ]}
        />
        <div>
          <div className="text-sm font-semibold text-brand">ติดตามเรา</div>
          <p className="mt-3 text-sm text-slate-600">
            ติดต่อทีมงานผ่าน Line ได้ตลอด 24 ชม.
          </p>
          <Link href="/#contact" className="btn-ghost mt-4 text-xs">
            แชทกับทีมงาน →
          </Link>
        </div>
      </div>
      <div className="border-t border-slate-100 py-5 text-center text-xs text-slate-500">
        &copy; {new Date().getFullYear()} TabienSelect — All rights reserved.
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
      <div className="text-sm font-semibold text-brand">{title}</div>
      <ul className="mt-3 space-y-2 text-sm text-slate-600">
        {links.map((l) => (
          <li key={l.href + l.label}>
            <Link href={l.href} className="hover:text-brand-accent">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
