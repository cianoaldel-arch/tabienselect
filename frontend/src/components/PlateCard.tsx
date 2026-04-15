import Link from 'next/link';
import type { Plate } from '@/lib/types';

export default function PlateCard({ plate }: { plate: Plate }) {
  return (
    <Link
      href={`/plates/${plate.id}`}
      className="group relative block overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-soft transition hover:-translate-y-1 hover:border-brand-accent hover:shadow-glow"
    >
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-gold-300 via-brand-accent to-gold-300 opacity-0 transition group-hover:opacity-100" />
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-xs uppercase tracking-widest text-slate-400">
            Plate
          </div>
          <div className="mt-1 font-display text-3xl font-bold tracking-wider text-brand">
            {plate.full_plate}
          </div>
        </div>
        <span className="rounded-full bg-gold-100 px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-gold-700">
          {plate.category}
        </span>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <span className="chip">{plate.plate_type}</span>
        <span className="chip bg-amber-50 text-amber-800">
          ผลรวม {plate.numerology_sum}
        </span>
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-dashed border-slate-100 pt-3 text-sm">
        <span className="text-slate-400">เลขมงคล</span>
        <span className="font-semibold text-brand-accent transition group-hover:translate-x-1">
          ดูรายละเอียด →
        </span>
      </div>
    </Link>
  );
}
