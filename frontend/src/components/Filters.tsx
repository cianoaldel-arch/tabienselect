'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useTransition } from 'react';

export default function Filters() {
  const router = useRouter();
  const params = useSearchParams();
  const [pending, startTransition] = useTransition();

  const category = params.get('category') ?? '';
  const plate_type = params.get('plate_type') ?? '';

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
    <div className="mb-6 flex flex-wrap items-end gap-3 rounded-lg border bg-white p-4">
      <label className="flex flex-col text-xs text-slate-600">
        Category
        <select
          className="mt-1 min-w-[10rem] rounded border px-2 py-1 text-sm"
          value={category}
          onChange={(e) => update({ category: e.target.value })}
        >
          <option value="">All</option>
          <option value="Premium">Premium</option>
          <option value="Standard">Standard</option>
          <option value="Lucky">Lucky</option>
        </select>
      </label>
      <label className="flex flex-col text-xs text-slate-600">
        Plate type
        <select
          className="mt-1 min-w-[10rem] rounded border px-2 py-1 text-sm"
          value={plate_type}
          onChange={(e) => update({ plate_type: e.target.value })}
        >
          <option value="">All</option>
          <option value="Sedan">Sedan</option>
          <option value="Pickup">Pickup</option>
          <option value="Motorcycle">Motorcycle</option>
        </select>
      </label>
      {(category || plate_type) && (
        <button
          type="button"
          onClick={() => update({ category: '', plate_type: '' })}
          className="rounded border px-3 py-1 text-sm text-slate-600 hover:bg-slate-50"
        >
          Clear
        </button>
      )}
      {pending && <span className="text-xs text-slate-400">Updating…</span>}
    </div>
  );
}
