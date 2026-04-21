import Link from 'next/link';
import type { Plate } from '@/lib/types';

export default function PlateCard({ plate }: { plate: Plate }) {
  return (
    <div className="hover-lift group animate-fade-up overflow-hidden rounded-2xl bg-ink-900 text-white shadow-card transition-shadow duration-300 hover:shadow-2xl w-[90%]">
      <div className="p-5">
        <div className="mb-3 flex items-start justify-between">
          <span className="text-[11px] font-semibold tracking-[0.2em] text-white/60">
            PLATE
          </span>
          <div className="flex flex-col items-start gap-1.5">
            <span className="rounded-full bg-cyan-400 px-3 py-0.5 text-[11px] font-medium text-ink-900">
              ผลรวม {plate.numerology_sum}
            </span>
            {/* <span className="rounded-full bg-cyan-400 px-3 py-0.5 text-[11px] font-medium text-ink-900">
              หมวดหมู่
            </span> */}
          </div>
        </div>

        <div className="plate-box mx-auto w-full transition-transform duration-300 ease-out group-hover:scale-[1.03]">
          <div className="relative text-center font-display text-3xl font-bold tracking-wider">
            {plate.full_plate}
          </div>
          <div className="relative text-center text-[11px] font-medium">
            กรุงเทพมหานคร
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-white/10 px-5 py-3">
        <span className="font-display text-lg font-semibold">
          {plate.price > 0 ? `฿ ${plate.price.toLocaleString('en-US')}.-` : 'สอบถามราคา'}
        </span>
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
