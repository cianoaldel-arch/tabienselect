import Link from 'next/link';
import Image from 'next/image';
import { api } from '@/lib/api';
import PlateCard from '@/components/PlateCard';
import type { Plate } from '@/lib/types';

const FEATURED_LIMIT = 8;

export default async function LandingPage() {
  let featured: Plate[] = [];
  let total = 0;
  try {
    const data = await api.listPlates({ page: 1, limit: FEATURED_LIMIT });
    featured = data.items;
    total = data.total;
  } catch {
    featured = [];
  }

  return (
    <div className="space-y-24">
      <Hero />
      <Stats total={total} />
      <Featured plates={featured} />
      <HowItWorks />
      <WhyChooseUs />
      <Testimonials />
      <Contact />
    </div>
  );
}

function Hero() {
  return (
    <section className="relative -mt-10 overflow-hidden rounded-3xl border border-white/10 bg-brand text-white shadow-soft">
      <div className="absolute inset-0 bg-grid opacity-30" />
      <div className="absolute -top-32 -right-24 h-96 w-96 animate-float rounded-full bg-brand-accent/30 blur-3xl" />
      <div className="absolute -bottom-32 -left-24 h-96 w-96 rounded-full bg-blue-400/20 blur-3xl" />

      <div className="relative grid gap-12 px-6 py-20 sm:px-12 lg:grid-cols-[1.2fr_1fr] lg:py-24">
        <div className="animate-fade-up">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-semibold tracking-widest text-gold-200">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-gold-300" />
            TABIEN SELECT · 2026
          </span>
          <h1 className="heading-display mt-6">
            ทะเบียนสวย <span className="text-gradient-gold">เลขมงคล</span>
            <br />
            คัดพิเศษเพื่อคุณ
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-300 sm:text-lg">
            เลือกทะเบียนที่ใช่ เสริมดวง เสริมความมั่นใจ
            ทุกหมายเลขผ่านการตรวจสอบตามหลักเลขศาสตร์ พร้อมเอกสารครบ
            โอนปลอดภัย
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link href="/plates" className="btn-accent">
              ดูทะเบียนทั้งหมด →
            </Link>
            <a href="#contact" className="btn border border-white/30 text-white hover:bg-white/10">
              ปรึกษาฟรี
            </a>
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-6 text-xs text-slate-400">
            <Trust label="โอนลอยปลอดภัย" />
            <Trust label="เอกสารครบถ้วน" />
            <Trust label="ดูแลหลังการขาย" />
          </div>
        </div>

        <div className="relative hidden lg:block">
          <FloatingPlate
            text="9กก 9999"
            className="absolute right-0 top-4 rotate-3"
            tag="Premium"
          />
          <FloatingPlate
            text="ฮง 888"
            className="absolute right-24 top-44 -rotate-6 animate-float"
            tag="Lucky"
          />
          <FloatingPlate
            text="ษฎ 5"
            className="absolute right-4 top-72 rotate-2"
            tag="Rare"
          />
        </div>
      </div>
    </section>
  );
}

function Trust({ label }: { label: string }) {
  return (
    <span className="flex items-center gap-2">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-gold-300">
        <path
          d="M20 6L9 17l-5-5"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {label}
    </span>
  );
}

function FloatingPlate({
  text,
  tag,
  className = '',
}: {
  text: string;
  tag: string;
  className?: string;
}) {
  return (
    <div
      className={`w-64 rounded-2xl border border-white/20 bg-white/95 p-5 text-brand shadow-2xl ${className}`}
    >
      <div className="flex items-center justify-between text-[10px] font-semibold uppercase tracking-widest text-slate-500">
        <span>Thailand</span>
        <span className="rounded-full bg-gold-100 px-2 py-0.5 text-gold-700">
          {tag}
        </span>
      </div>
      <div className="mt-2 text-center font-display text-4xl font-bold tracking-widest">
        {text}
      </div>
      <div className="mt-2 text-center text-[10px] text-slate-400">
        TABIEN · SELECT
      </div>
    </div>
  );
}

function Stats({ total }: { total: number }) {
  const items = [
    { label: 'ทะเบียนพร้อมขาย', value: total > 0 ? `${total}+` : '500+' },
    { label: 'ลูกค้าที่ไว้วางใจ', value: '1,200+' },
    { label: 'รีวิว 5 ดาว', value: '98%' },
    { label: 'ปีที่ให้บริการ', value: '8+' },
  ];
  return (
    <section className="grid grid-cols-2 gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-soft sm:grid-cols-4 sm:p-8">
      {items.map((s) => (
        <div key={s.label} className="text-center">
          <div className="font-display text-3xl font-bold text-brand sm:text-4xl">
            {s.value}
          </div>
          <div className="mt-1 text-xs text-slate-500 sm:text-sm">{s.label}</div>
        </div>
      ))}
    </section>
  );
}

function Featured({ plates }: { plates: Plate[] }) {
  return (
    <section>
      <div className="mb-10 flex flex-col items-start gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="section-eyebrow">Featured</span>
          <h2 className="heading-display mt-3">ทะเบียนแนะนำ</h2>
          <p className="mt-2 max-w-xl text-slate-600">
            คัดเลขเด่นที่ลูกค้าให้ความสนใจมากที่สุดในเดือนนี้
          </p>
        </div>
        <Link href="/plates" className="btn-ghost">
          ดูทั้งหมด →
        </Link>
      </div>

      {plates.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center text-slate-500">
          ยังไม่มีทะเบียนพร้อมแสดง
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {plates.map((plate) => (
            <PlateCard key={plate.id} plate={plate} />
          ))}
        </div>
      )}
    </section>
  );
}

function HowItWorks() {
  const steps = [
    {
      n: '01',
      title: 'เลือกทะเบียน',
      desc: 'เลือกหมายเลขที่ถูกใจจากคลังที่คัดมาแล้ว',
    },
    {
      n: '02',
      title: 'ปรึกษาทีมงาน',
      desc: 'แชทผ่าน Line ตรวจสอบรายละเอียด ราคา และความพร้อม',
    },
    {
      n: '03',
      title: 'รับทะเบียน',
      desc: 'ดำเนินการเอกสารครบถ้วน ส่งมอบถึงมือคุณอย่างปลอดภัย',
    },
  ];
  return (
    <section>
      <div className="mb-10 text-center">
        <span className="section-eyebrow">Process</span>
        <h2 className="heading-display mt-3">3 ขั้นตอนง่ายๆ</h2>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {steps.map((s, i) => (
          <div
            key={s.n}
            className="relative rounded-2xl border border-slate-200 bg-white p-6 shadow-soft transition hover:-translate-y-1 hover:shadow-glow"
          >
            <div className="font-display text-5xl font-bold text-gold-200">
              {s.n}
            </div>
            <h3 className="mt-3 text-lg font-semibold text-brand">{s.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              {s.desc}
            </p>
            {i < steps.length - 1 && (
              <div className="absolute -right-3 top-1/2 hidden h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white text-brand-accent md:flex">
                →
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

function WhyChooseUs() {
  const items = [
    {
      icon: '✦',
      title: 'คัดสรรพิเศษ',
      desc: 'ตรวจสอบเลขมงคลและความสวยตามหลักเลขศาสตร์ทุกหมายเลข',
    },
    {
      icon: '✓',
      title: 'ของแท้ ถูกต้อง',
      desc: 'เอกสารครบถ้วน โอนลอยปลอดภัย ตรวจสอบได้ทุกขั้นตอน',
    },
    {
      icon: '◈',
      title: 'ตัวเลือกหลากหลาย',
      desc: 'ทั้งรถเก๋ง กระบะ และมอเตอร์ไซค์ ตอบโจทย์ทุกไลฟ์สไตล์',
    },
    {
      icon: '♥',
      title: 'ดูแลหลังการขาย',
      desc: 'ทีมงานพร้อมให้คำปรึกษาตลอดกระบวนการ ตั้งแต่เลือกจนถึงโอน',
    },
  ];

  return (
    <section id="why">
      <div className="mb-10 text-center">
        <span className="section-eyebrow">Why us</span>
        <h2 className="heading-display mt-3">ทำไมต้องเลือกเรา</h2>
        <p className="mx-auto mt-2 max-w-xl text-slate-600">
          มาตรฐานบริการที่ลูกค้ากว่า 1,200 คนวางใจ
        </p>
      </div>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item) => (
          <div
            key={item.title}
            className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-soft transition hover:-translate-y-1 hover:border-brand-accent hover:shadow-glow"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-gold-100 to-gold-200 text-xl font-bold text-brand-accent transition group-hover:scale-110">
              {item.icon}
            </div>
            <h3 className="mt-4 text-base font-semibold text-brand">
              {item.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              {item.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Testimonials() {
  const reviews = [
    {
      quote:
        'ได้ทะเบียนถูกใจในราคาที่คุยได้ เอกสารครบ โอนเร็วมาก ประทับใจครับ',
      name: 'คุณภาคิน',
      role: 'เจ้าของรถ SUV',
    },
    {
      quote:
        'ทีมงานให้คำปรึกษาดี อธิบายเรื่องเลขมงคลละเอียด ตัดสินใจง่ายขึ้น',
      name: 'คุณนภัสสร',
      role: 'นักธุรกิจ',
    },
    {
      quote: 'ราคาโปร่งใส ไม่มีบวกเพิ่มทีหลัง บริการหลังการขายดีจริง',
      name: 'คุณวรพล',
      role: 'ลูกค้าประจำ',
    },
  ];
  return (
    <section>
      <div className="mb-10 text-center">
        <span className="section-eyebrow">Reviews</span>
        <h2 className="heading-display mt-3">เสียงจากลูกค้า</h2>
      </div>
      <div className="grid gap-5 md:grid-cols-3">
        {reviews.map((r) => (
          <figure
            key={r.name}
            className="relative rounded-2xl border border-slate-200 bg-white p-6 shadow-soft"
          >
            <div className="absolute -top-4 left-6 flex h-8 w-8 items-center justify-center rounded-full bg-brand-accent font-display text-lg font-bold text-white">
              "
            </div>
            <div className="mt-2 flex gap-0.5 text-gold-500">
              {Array.from({ length: 5 }).map((_, i) => (
                <span key={i}>★</span>
              ))}
            </div>
            <blockquote className="mt-3 text-sm leading-relaxed text-slate-700">
              {r.quote}
            </blockquote>
            <figcaption className="mt-4 border-t border-slate-100 pt-3 text-xs">
              <div className="font-semibold text-brand">{r.name}</div>
              <div className="text-slate-500">{r.role}</div>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

function Contact() {
  const lineUrl = process.env.NEXT_PUBLIC_LINE_URL ?? 'https://line.me/';
  const lineQr =
    process.env.NEXT_PUBLIC_LINE_QR_URL ??
    'https://placehold.co/280x280/png?text=LINE+QR';

  return (
    <section
      id="contact"
      className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-brand via-brand-800 to-brand-700 p-8 text-white shadow-soft sm:p-12"
    >
      <div className="absolute -top-20 -right-20 h-72 w-72 rounded-full bg-brand-accent/20 blur-3xl" />
      <div className="absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-blue-400/15 blur-3xl" />

      <div className="relative grid items-center gap-10 md:grid-cols-2">
        <div>
          <span className="section-eyebrow">Contact</span>
          <h2 className="heading-display mt-3">พร้อมให้บริการ 24 ชม.</h2>
          <p className="mt-3 max-w-md text-slate-300">
            สแกน QR หรือกดปุ่มด้านล่างเพื่อแชทกับทีมงานผ่าน Line
            สอบถามข้อมูลเพิ่มเติมหรือจองทะเบียนที่คุณสนใจได้ทันที
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href={lineUrl}
              target="_blank"
              rel="noreferrer"
              className="btn bg-green-500 text-white shadow-soft hover:bg-green-600"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314"/>
              </svg>
              ติดต่อผ่าน Line
            </a>
            <a
              href="tel:+66"
              className="btn border border-white/30 text-white hover:bg-white/10"
            >
              โทรสอบถาม
            </a>
          </div>
        </div>

        <div className="flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 -m-2 rounded-3xl bg-gradient-to-br from-gold-300 to-brand-accent opacity-50 blur-xl" />
            <div className="relative rounded-2xl border border-white/20 bg-white p-5 text-center shadow-2xl">
              <Image
                src={lineQr}
                alt="Line QR code"
                width={240}
                height={240}
                className="mx-auto h-auto w-[220px] rounded-lg"
                unoptimized
              />
              <div className="mt-3 text-xs font-semibold text-slate-700">
                สแกนเพื่อเพิ่มเพื่อน
              </div>
              <div className="text-[10px] text-slate-500">@tabienselect</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
