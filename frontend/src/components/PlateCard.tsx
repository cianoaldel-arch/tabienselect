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
