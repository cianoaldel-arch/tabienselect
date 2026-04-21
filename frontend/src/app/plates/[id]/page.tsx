import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { api } from '@/lib/api';
import type { Plate } from '@/lib/types';

export default async function PlateDetailPage({
  params,
}: {
  params: { id: string };
}) {
  let plate: Plate;
  try {
    plate = await api.getPlate(params.id);
  } catch {
    notFound();
  }

    const lineUrl = process.env.NEXT_PUBLIC_LINE_URL ?? 'https://lin.ee/WFUSWAW';
    const lineQr =
      '/line-qr-not.png';


  return (
    <div className="container-page py-10">
      <Link
        href="/plates"
        className="text-sm text-slate-500 transition hover:opacity-80"
        style={{ color: 'var(--color-muted)' }}
      >
        ← Back to listing
      </Link>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <section
          className="rounded-2xl p-8 text-white shadow-card"
          style={{ background: 'var(--color-primary)' }}
        >
          <div className="grid grid-cols-[1fr_auto] items-start gap-8">
            <div className="plate-box py-6">
              <div className="relative text-center font-display text-5xl font-bold tracking-wider sm:text-6xl">
                {plate!.full_plate}
              </div>
              <div className="relative mt-1 text-center text-sm font-medium">
                กรุงเทพมหานคร
              </div>
            </div>

            <div className="flex flex-col items-start gap-3">
              <span
                className="rounded-xl px-5 py-2 text-start text-[15px] font-medium"
                style={{
                  background: 'var(--color-accent)',
                  color: 'var(--color-foreground)',
                }}
              >
                ผลรวม {plate!.numerology_sum}
              </span>
            </div>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-[1.4fr_1fr] sm:items-end">
            <div>
              <div className="text-lg font-semibold">Description</div>
              <div className="mt-3 rounded-xl bg-white/5 p-4 text-sm leading-relaxed text-white/90 ring-1 ring-white/10">
                {plate!.contact_text}
              </div>
            </div>
            <div className="text-right font-display text-4xl font-bold">
            {plate.price > 0 ? `฿ ${plate.price.toLocaleString('en-US')}.-` : 'สอบถามราคา'}
            </div>
          </div>
        </section>

        <aside className="rounded-2xl bg-white p-6 text-center shadow-card">
          <div
            className="mb-4 text-lg font-semibold"
            style={{ color: 'var(--color-foreground)' }}
          >
            สนใจติดต่อ
          </div>
          <div className="mx-auto flex aspect-square w-full max-w-[260px] items-center justify-center rounded-xl bg-slate-200 text-slate-500">
            {plate!.line_qr_url ? (
              <Image
                src={lineQr}
                alt="LINE QR"
                width={260}
                height={260}
                className="h-full w-full rounded-xl object-cover"
                unoptimized
              />
            ) : (
              <span className="text-xl font-semibold">LINE QR</span>
            )}
          </div>
          <div
            className="mt-5 flex items-center justify-center gap-2"
            style={{ color: 'var(--color-foreground)' }}
          >
            <span
              className="flex h-8 w-8 items-center justify-center rounded-full text-white"
              style={{ background: 'var(--color-primary)' }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.05-.24 11.72 11.72 0 003.66.59 1 1 0 011 1v3.5a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1 11.72 11.72 0 00.59 3.66 1 1 0 01-.24 1.05z" />
              </svg>
            </span>
            <span className="text-[15px]">082-416-6551 คุณน็อต</span>
          </div>
        </aside>
      </div>
    </div>
  );
}
