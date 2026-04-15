import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';

export const metadata: Metadata = {
  title: 'TabienSelect — ทะเบียนสวย เลขมงคล คัดพิเศษ',
  description:
    'แพลตฟอร์มทะเบียนรถพรีเมียม คัดเลขมงคล ราคาโปร่งใส โอนปลอดภัย ดูแลครบวงจร',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th">
      <body className="font-sans">
        <SiteHeader />
        <main className="container-page py-10">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}

function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/40 bg-white/70 backdrop-blur-lg">
      <div className="container-page flex h-16 items-center justify-between">
        <Link href="/" className="group flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand text-sm font-bold text-gold-400 shadow-soft transition group-hover:scale-105">
            TS
          </span>
          <span className="font-display text-lg font-bold tracking-tight">
            Tabien<span className="text-brand-accent">Select</span>
          </span>
        </Link>
        <nav className="hidden items-center gap-1 text-sm font-medium text-slate-600 md:flex">
          <NavLink href="/">หน้าแรก</NavLink>
          <NavLink href="/plates">ทะเบียน</NavLink>
          <NavLink href="/#why">จุดเด่น</NavLink>
          <NavLink href="/#contact">ติดต่อ</NavLink>
        </nav>
        <div className="flex items-center gap-2">
          <Link
            href="/admin/login"
            className="hidden text-sm font-medium text-slate-500 hover:text-brand sm:inline"
          >
            Admin
          </Link>
          <Link href="/plates" className="btn-accent text-xs sm:text-sm">
            ดูทะเบียน
          </Link>
        </div>
      </div>
    </header>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="rounded-full px-3 py-1.5 transition hover:bg-slate-100 hover:text-brand"
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
