import Link from 'next/link';
import type { Plate } from '@/lib/types';

export default function PlateCard({ plate }: { plate: Plate }) {
  return (
    <div className="overflow-hidden rounded-2xl bg-ink-900 text-white shadow-card">
      <div className="p-5">
        <div className="mb-3 flex items-start justify-between">
          <span className="text-[11px] font-semibold tracking-[0.2em] text-white/60">
            PLATE
          </span>
          <div className="flex flex-col items-end gap-1.5">
            <span className="rounded-full bg-white px-3 py-0.5 text-[11px] font-medium text-ink-900">
              ผลรวม {plate.numerology_sum}
            </span>
            <span className="rounded-full bg-cyan-400 px-3 py-0.5 text-[11px] font-medium text-ink-900">
              หมวดหมู่
            </span>
          </div>
        </div>

        <div className="plate-box mx-auto w-full">
          <svg
            aria-hidden
            className="absolute inset-x-3 top-1/2 -translate-y-1/2 opacity-50"
            height="10"
            viewBox="0 0 200 10"
            preserveAspectRatio="none"
          >
            <path
              d="M0 5 Q25 0 50 5 T100 5 T150 5 T200 5"
              stroke="#0a1628"
              strokeWidth="1"
              fill="none"
            />
          </svg>
          <div className="relative text-center font-display text-3xl font-bold tracking-wider">
            {plate.full_plate}
          </div>
          <div className="relative text-center text-[11px] font-medium">
            กรุงเทพมหานคร
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-white/10 px-5 py-3">
        <span className="font-display text-lg font-semibold">฿ 60,000.-</span>
        <Link
          href={`/plates/${plate.id}`}
          className="text-sm text-cyan-400 hover:text-cyan-300"
        >
          ดูรายละเอียด
        </Link>
      </div>
    </div>
  );
}
