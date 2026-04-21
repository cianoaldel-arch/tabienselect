import Link from 'next/link';
import { api } from '@/lib/api';
import PlateCard from '@/components/PlateCard';
import type { PromoBanner } from '@/lib/types';
import Image from 'next/image';

export default async function LandingPage() {
  const [plateData, bannerData, config] = await Promise.all([
    api.listPlates({ page: 1, limit: 8 }).catch(() => ({ items: [], total: 0 })),
    api.listPromoBanners(true).catch(() => ({ items: [] as PromoBanner[] })),
    api.listConfig().catch(() => ({} as Record<string, string>)),
  ]);

    const ImageSite = '/porcheslanding.png';


  return (
    <div className="container-page py-8">
      <Hero heroCarImageUrl={ImageSite || null} />
      <Tagline />
      <FeatureBar />
      <PromoBanners banners={bannerData.items} />
      <FeaturedPlates plates={plateData.items} />
      <Contact />
    </div>
  );
}

function PromoBanners({ banners }: { banners: PromoBanner[] }) {
  const withImages = banners.filter((b) => !!b.image_url);
  if (withImages.length === 0) return null;
  return (
    <section className="py-12">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {withImages.map((b) => (
          <PromoBannerCard key={b.id} banner={b} />
        ))}
      </div>
    </section>
  );
}

function PromoBannerCard({ banner }: { banner: PromoBanner }) {
  return (
    <article className="animate-fade-up hover-lift group relative aspect-square overflow-hidden rounded-3xl bg-ink-900 shadow-card">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={banner.image_url ?? ''}
        alt={banner.headline || 'Promotion'}
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
      />
    </article>
  );
}

function FeaturedPlates({ plates }: { plates: Awaited<ReturnType<typeof api.listPlates>>['items'] }) {
  return (
    <section className="py-12">
      <div className="mb-6 flex items-end justify-between">
        <div>
          <span className="section-eyebrow">ทะเบียนแนะนำ</span>
          <h2 className="mt-2 font-display text-3xl font-bold text-ink-900 sm:text-4xl">
            ทะเบียนยอดนิยม
          </h2>
        </div>
        <Link
          href="/plates"
          className="text-sm font-medium text-ink-900 underline-offset-4 hover:underline"
        >
          ดูทั้งหมด →
        </Link>
      </div>

      {plates.length === 0 ? (
        <div className="rounded-2xl bg-white p-12 text-center text-slate-500 shadow-card">
          ยังไม่มีทะเบียนให้แสดง
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

function Hero({ heroCarImageUrl }: { heroCarImageUrl: string | null }) {
  return (
    <section className="relative overflow-hidden rounded-[28px] bg-ink-900 text-white">
      <div className="absolute inset-0 hero-waves" />
      <div className="absolute inset-0 wave-lines opacity-60" />
      {/* decorative wavy stripe */}
      <svg
        aria-hidden
        className="absolute bottom-10 left-0 w-[120%] opacity-30"
        viewBox="0 0 1200 160"
        fill="none"
      >
        <path
          d="M0 80 Q150 20 300 80 T600 80 T900 80 T1200 80"
          stroke="#4ac8dc"
          strokeWidth="2"
          fill="none"
        />
        <path
          d="M0 110 Q150 60 300 110 T600 110 T900 110 T1200 110"
          stroke="#ffffff"
          strokeOpacity="0.15"
          strokeWidth="2"
          fill="none"
        />
      </svg>

      <div className="relative grid items-center gap-10 px-10 py-16 lg:grid-cols-[1.1fr_1fr] lg:px-16 lg:py-20">
        <div>
          <h1 className="animate-fade-up font-display text-5xl font-bold leading-[1.1] sm:text-6xl">
            รับจอง<span className="text-cyan-400">ทะเบียน</span>
            <br />
            <span className="text-white/95">รถยนต์หมวดใหม่</span>
          </h1>
          <div className="animate-fade-up animate-delay-200 mt-5 flex flex-wrap items-center gap-3 text-lg text-cyan-400">
            <span>เลขมงคล</span>
            <span className="text-white/40">|</span>
            <span>เลขศาสตร์</span>
            <span className="text-white/40">|</span>
            <span>เลขวันเกิด</span>
          </div>

          <div className="animate-fade-up animate-delay-300 mt-10 flex flex-wrap gap-4">
            <Link
              href="/plates"
              className="rounded-full bg-cyan-400 px-8 py-3 text-[15px] font-medium text-ink-900 transition hover:-translate-y-0.5 hover:bg-cyan-300 hover:shadow-lg"
            >
              ดูทะเบียน
            </Link>
            <a
              href="#contact"
              className="rounded-full border border-white/90 px-8 py-3 text-[15px] font-medium text-white transition hover:-translate-y-0.5 hover:bg-white hover:text-ink-900"
            >
              ติดต่อเรา
            </a>
          </div>

          <div className="mt-12 flex flex-wrap items-center gap-6 text-[15px]">
            <span className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.05-.24 11.72 11.72 0 003.66.59 1 1 0 011 1v3.5a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1 11.72 11.72 0 00.59 3.66 1 1 0 01-.24 1.05z" />
                </svg>
              </span>
              082-416-6551 คุณน็อต
            </span>
            <span className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#06c755] text-white">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596a.615.615 0 01-.199.031c-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595a.603.603 0 01.194-.033c.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
                </svg>
              </span>
              @tabienselect
            </span>
          </div>
        </div>

        <div className="relative flex items-center justify-center">
          <PlateShowcase />
          {heroCarImageUrl ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={heroCarImageUrl}
              alt="Hero car"
              className="animate-fade-up animate-delay-500 animate-float relative mt-32 w-full max-w-[460px] object-contain drop-shadow-[0_30px_30px_rgba(0,0,0,0.45)]"
            />
          ) : (
            <CarIllustration />
          )}
        </div>
      </div>
    </section>
  );
}

function PlateShowcase() {
  return (
    <div
      className="animate-pop-in animate-delay-300 absolute right-4 top-0 z-10 overflow-hidden rounded-2xl bg-white bg-cover bg-center px-6 py-3 shadow-2xl ring-2 ring-ink-900 sm:right-16"
      style={{ backgroundImage: "url('/plate-bg.png')" }}
    >
      <div className="relative">
        <div className="relative font-display text-5xl font-bold tracking-wider text-ink-900 sm:text-6xl">
          7บข <span className="ml-2">28</span>
        </div>
        <div className="relative mt-1 text-center text-sm font-medium text-ink-900">
          กรุงเทพมหานคร
        </div>
      </div>
    </div>
  );
}

function CarIllustration() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 420 240"
      className="relative mt-32 w-full max-w-[460px] drop-shadow-[0_30px_30px_rgba(0,0,0,0.45)]"
    >
      <defs>
        <linearGradient id="body" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f6f8fc" />
          <stop offset="60%" stopColor="#d3dae4" />
          <stop offset="100%" stopColor="#8b95a6" />
        </linearGradient>
        <linearGradient id="glass" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1b2d4a" />
          <stop offset="100%" stopColor="#0a1628" />
        </linearGradient>
      </defs>
      <ellipse cx="210" cy="210" rx="190" ry="12" fill="#000" opacity="0.35" />
      <path
        d="M30 170 Q50 120 120 100 Q180 70 250 80 Q320 85 360 120 Q395 140 400 170 L400 190 Q400 200 390 200 L40 200 Q30 200 30 190 Z"
        fill="url(#body)"
      />
      <path
        d="M120 100 Q180 70 250 80 Q320 85 355 115 L350 145 L130 145 Z"
        fill="url(#glass)"
        opacity="0.85"
      />
      <path
        d="M120 100 Q180 70 250 80 L250 78 Q180 68 120 100 Z"
        fill="#ffffff"
        opacity="0.6"
      />
      <rect x="205" y="150" width="55" height="22" rx="3" fill="#ffffff" stroke="#0a1628" strokeWidth="1.5" />
      <text x="232" y="166" textAnchor="middle" fontSize="9" fontWeight="700" fill="#0a1628" fontFamily="sans-serif">TABIEN SELECT</text>
      <circle cx="110" cy="200" r="26" fill="#0a1628" />
      <circle cx="110" cy="200" r="16" fill="#3a4556" />
      <circle cx="110" cy="200" r="7" fill="#7a8597" />
      <circle cx="320" cy="200" r="26" fill="#0a1628" />
      <circle cx="320" cy="200" r="16" fill="#3a4556" />
      <circle cx="320" cy="200" r="7" fill="#7a8597" />
      <path d="M60 180 L90 180" stroke="#5fd0e3" strokeWidth="2" opacity="0.9" />
    </svg>
  );
}

function Tagline() {
  return (
    <div className="animate-fade-up py-10 text-center">
      <p className="font-display text-2xl font-semibold text-ink-900 sm:text-3xl">
        จองง่าย| เลือกได้ | ได้จริง
      </p>
    </div>
  );
}

function FeatureBar() {
  const items = [
    {
      top: '10,000+',
      bottom: 'ทะเบียนพร้อมจอง',
      isStat: true,
    },
    {
      icon: (
        <svg width="34" height="34" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 2l8 3v6c0 5-3.5 9-8 11-4.5-2-8-6-8-11V5l8-3z"
            stroke="#ffffff"
            strokeWidth="1.6"
          />
          <path d="M8.5 12l2.5 2.5 4.5-5" stroke="#5fd0e3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
      bottom: 'เลขแท้ ถูกต้องตามกฎหมาย',
    },
    {
      icon: (
        <svg width="40" height="34" viewBox="0 0 28 22" fill="none">
          <path
            d="M8 2c-3 0-5 2.2-5 5 0 4.5 5 7 8 10 3-3 8-5.5 8-10 0-2.8-2-5-5-5-1.8 0-3 1-3 2.5C11 3 9.8 2 8 2z"
            fill="#ffffff"
            opacity="0.95"
          />
          <path
            d="M17 8c-2.2 0-3.8 1.6-3.8 3.7 0 3.4 3.8 5.2 6 7.5 2.3-2.3 6.1-4.1 6.1-7.5C25.3 9.6 23.7 8 21.5 8c-1.3 0-2.2.7-2.3 1.9C19.1 8.7 18.2 8 17 8z"
            fill="#5fd0e3"
            transform="translate(-2 0)"
          />
        </svg>
      ),
      bottom: 'ดำเนินการครบทุกขั้นตอน',
    },
    {
      top: '90%',
      bottom: 'โอกาสได้สูงสุด',
      isStat: true,
    },
  ];

  return (
    <section className="animate-fade-up rounded-2xl bg-ink-900 px-6 py-7 text-white shadow-card sm:px-10">
      <div className="grid grid-cols-2 items-center gap-6 lg:grid-cols-4 lg:divide-x lg:divide-white/15">
        {items.map((it, i) => (
          <div
            key={i}
            className={`animate-fade-up flex items-center justify-center gap-4 ${i > 0 ? 'lg:pl-6' : ''}`}
            style={{ animationDelay: `${i * 120}ms` }}
          >
            {it.isStat ? (
              <div className="text-center">
                <div className="font-display text-3xl font-bold sm:text-4xl">{it.top}</div>
                <div className="mt-1 text-xs text-cyan-400 sm:text-sm">{it.bottom}</div>
              </div>
            ) : (
              <>
                <div className="shrink-0">{it.icon}</div>
                <div className="text-xs text-cyan-400 sm:text-sm">{it.bottom}</div>
              </>
            )}
          </div>
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
