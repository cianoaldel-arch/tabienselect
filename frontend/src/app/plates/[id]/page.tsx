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

  return (
    <article className="mx-auto max-w-4xl">
      <Link href="/plates" className="text-sm text-slate-500 hover:text-brand-accent">
        ← Back to listing
      </Link>

      <div className="mt-4 grid gap-8 md:grid-cols-[1fr_18rem]">
        <section className="rounded-lg border bg-white p-8">
          <div className="text-5xl font-bold tracking-widest">{plate!.full_plate}</div>
          <dl className="mt-6 grid grid-cols-2 gap-4 text-sm">
            <div>
              <dt className="text-slate-500">Prefix</dt>
              <dd className="font-medium">{plate!.prefix}</dd>
            </div>
            <div>
              <dt className="text-slate-500">Number</dt>
              <dd className="font-medium">{plate!.number}</dd>
            </div>
            <div>
              <dt className="text-slate-500">Category</dt>
              <dd className="font-medium">{plate!.category}</dd>
            </div>
            <div>
              <dt className="text-slate-500">Plate type</dt>
              <dd className="font-medium">{plate!.plate_type}</dd>
            </div>
            <div>
              <dt className="text-slate-500">Numerology sum</dt>
              <dd className="font-medium">{plate!.numerology_sum}</dd>
            </div>
          </dl>

          <div className="mt-6 rounded-md bg-slate-50 p-4 text-sm text-slate-700">
            {plate!.contact_text}
          </div>
        </section>

        <aside className="rounded-lg border bg-white p-4 text-center">
          <div className="mb-2 text-sm font-medium text-slate-700">Scan to contact</div>
          <Image
            src={plate!.line_qr_url}
            alt="LINE contact QR code"
            width={260}
            height={260}
            className="mx-auto h-auto w-full max-w-[240px] rounded"
            unoptimized
          />
        </aside>
      </div>
    </article>
  );
}
