'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, useTransition } from 'react';
import type { PlateCategory } from '@/lib/types';

export default function Filters({
  categories = [],
}: {
  categories?: PlateCategory[];
}) {
  const router = useRouter();
  const params = useSearchParams();
  const [, startTransition] = useTransition();

  const category = params.get('category') ?? '';
  const urlSearch = params.get('q') ?? '';
  const [search, setSearch] = useState(urlSearch);

  useEffect(() => {
    setSearch(urlSearch);
  }, [urlSearch]);

  function navigate(next: Record<string, string>) {
    const sp = new URLSearchParams(params.toString());
    for (const [k, v] of Object.entries(next)) {
      if (v) sp.set(k, v);
      else sp.delete(k);
    }
    sp.delete('page');
    startTransition(() => router.push(`/plates?${sp.toString()}`));
  }

  function submitSearch(e: React.FormEvent) {
    e.preventDefault();
    navigate({ q: search.trim() });
  }

  function clearSearch() {
    setSearch('');
    navigate({ q: '' });
  }

  return (
    <div className="space-y-4 rounded-2xl bg-ink-900 px-6 py-5 text-white shadow-card">
      <form onSubmit={submitSearch} className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
              <path d="m20 20-3.5-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </span>
          <input
            type="search"
            value={search}
            placeholder="ค้นหาเลขทะเบียน เช่น 1กก 999"
            onChange={(e) => setSearch(e.target.value)}
            className="h-11 w-full rounded-full bg-white pl-11 pr-10 text-sm text-ink-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
          />
          {search && (
            <button
              type="button"
              onClick={clearSearch}
              aria-label="Clear search"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-ink-900"
            >
              ×
            </button>
          )}
        </div>
        <button
          type="submit"
          className="h-11 rounded-full bg-cyan-400 px-6 text-sm font-semibold text-ink-900 hover:bg-cyan-300"
        >
          ค้นหา
        </button>
        <Link
          href="/#contact"
          className="h-11 rounded-full border border-white/60 px-6 text-sm font-medium leading-[2.6rem] text-white hover:bg-white hover:text-ink-900"
        >
          ติดต่อเรา
        </Link>
      </form>

      <div className="flex flex-wrap items-center gap-2">
        <span className="mr-1 text-xs uppercase tracking-[0.18em] text-white/60">
          Categories
        </span>
        <CategoryPill
          active={!category}
          label="ทั้งหมด"
          onClick={() => navigate({ category: '' })}
        />
        {categories.map((c) => (
          <CategoryPill
            key={c.category}
            active={category === c.category}
            label={`${c.category} (${c.count})`}
            onClick={() => navigate({ category: c.category })}
          />
        ))}
      </div>
    </div>
  );
}

function CategoryPill({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        'rounded-full px-4 py-1.5 text-xs font-medium transition ' +
        (active
          ? 'bg-cyan-400 text-ink-900 shadow'
          : 'bg-white/10 text-white/80 hover:bg-white/20')
      }
    >
      {label}
    </button>
  );
}
