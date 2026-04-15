import Link from 'next/link';
import { api } from '@/lib/api';
import Filters from '@/components/Filters';
import PlateCard from '@/components/PlateCard';

type SearchParams = {
  category?: string;
  plate_type?: string;
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
    page,
    limit: LIMIT,
  });

  const totalPages = Math.max(1, Math.ceil(data.total / LIMIT));

  return (
    <>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Premium license plates</h1>
        <p className="mt-1 text-slate-600">
          {data.total} plate{data.total === 1 ? '' : 's'} available
        </p>
      </div>

      <Filters />

      {data.items.length === 0 ? (
        <div className="rounded-lg border bg-white p-10 text-center text-slate-500">
          No plates match these filters.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.items.map((plate) => (
            <PlateCard key={plate.id} plate={plate} />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <Pagination
          page={page}
          totalPages={totalPages}
          params={searchParams}
        />
      )}
    </>
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
    sp.set('page', String(p));
    return `/plates?${sp.toString()}`;
  }

  return (
    <nav className="mt-8 flex items-center justify-center gap-2">
      {page > 1 && (
        <Link
          href={hrefFor(page - 1)}
          className="rounded border bg-white px-3 py-1 text-sm hover:bg-slate-50"
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
          className="rounded border bg-white px-3 py-1 text-sm hover:bg-slate-50"
        >
          Next →
        </Link>
      )}
    </nav>
  );
}
