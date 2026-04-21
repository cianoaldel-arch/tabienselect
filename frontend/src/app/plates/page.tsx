import Link from 'next/link';
import { api } from '@/lib/api';
import Filters from '@/components/Filters';
import PlateCard from '@/components/PlateCard';

type SearchParams = {
  category?: string;
  plate_type?: string;
  q?: string;
  page?: string;
};

const LIMIT = 12;

export default async function PlatesPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const page = Math.max(1, Number(searchParams.page ?? 1) || 1);
  const data = await api.listPlates({
    category: searchParams.category,
    plate_type: searchParams.plate_type,
    q: searchParams.q,
    page,
    limit: LIMIT,
  });

  const totalPages = Math.max(1, Math.ceil(data.total / LIMIT));

  return (
    <div className="container-page py-10">
      <h1 className="mb-6 font-display text-3xl font-bold text-ink-900 sm:text-4xl">
        ทะเบียนทั้งหมด
      </h1>

      <Filters />

      <div className="mt-8">
        {data.items.length === 0 ? (
          <div className="rounded-2xl bg-white p-12 text-center text-slate-500 shadow-card">
            ไม่มีทะเบียนตามเงื่อนไขนี้
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {data.items.map((plate) => (
              <PlateCard key={plate.id} plate={plate} />
            ))}
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <Pagination page={page} totalPages={totalPages} params={searchParams} />
      )}
    </div>
  );
}

function Pagination({
  page,
  totalPages,
  params,
}: {
  page: number;
  totalPages: number;
  params: SearchParams;
}) {
  function hrefFor(p: number) {
    const sp = new URLSearchParams();
    if (params.category) sp.set('category', params.category);
    if (params.plate_type) sp.set('plate_type', params.plate_type);
    if (params.q) sp.set('q', params.q);
    sp.set('page', String(p));
    return `/plates?${sp.toString()}`;
  }

  return (
    <nav className="mt-10 flex items-center justify-center gap-3">
      {page > 1 && (
        <Link
          href={hrefFor(page - 1)}
          className="rounded-full bg-ink-900 px-4 py-1.5 text-sm text-white hover:bg-ink-700"
        >
          ← Prev
        </Link>
      )}
      <span className="text-sm text-slate-600">
        Page {page} of {totalPages}
      </span>
      {page < totalPages && (
        <Link
          href={hrefFor(page + 1)}
          className="rounded-full bg-ink-900 px-4 py-1.5 text-sm text-white hover:bg-ink-700"
        >
          Next →
        </Link>
      )}
    </nav>
  );
}
