'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTransition } from 'react';

export default function Filters() {
  const router = useRouter();
  const params = useSearchParams();
  const [, startTransition] = useTransition();

  const category = params.get('category') ?? '';
  const search = params.get('q') ?? '';

  function update(next: Record<string, string>) {
    const sp = new URLSearchParams(params.toString());
    for (const [k, v] of Object.entries(next)) {
      if (v) sp.set(k, v);
      else sp.delete(k);
    }
    sp.delete('page');
    startTransition(() => router.push(`/plates?${sp.toString()}`));
  }

  return (
    <div className="flex flex-wrap items-end justify-between gap-4 rounded-2xl bg-ink-900 px-6 py-5 text-white shadow-card">
      <div className="flex flex-wrap items-end gap-6">
        <label className="flex flex-col text-sm">
          <span className="mb-1 text-white/80">หมวดหมู่</span>
          <input
            type="text"
            value={category}
            onChange={(e) => update({ category: e.target.value })}
            className="h-7 w-40 rounded bg-white text-ink-900"
          />
        </label>
        <label className="flex flex-col text-sm">
          <span className="mb-1 text-white/80">ค้นหา</span>
          <input
            type="text"
            value={search}
            placeholder="Search"
            onChange={(e) => update({ q: e.target.value })}
            className="h-7 w-56 rounded bg-white px-2 text-sm text-ink-900 placeholder:text-slate-400"
          />
        </label>
      </div>
      <Link
        href="/#contact"
        className="rounded-full bg-cyan-400 px-7 py-2 text-sm font-medium text-ink-900 hover:bg-cyan-300"
      >
        ติดต่อเรา
      </Link>
    </div>
  );
}
