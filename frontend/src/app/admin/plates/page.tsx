'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import type { Plate } from '@/lib/types';

const LIMIT = 20;

export default function AdminPlatesListPage() {
  const [token, setToken] = useState<string | null>(null);
  const [plates, setPlates] = useState<Plate[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [deleting, setDeleting] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [flash, setFlash] = useState<string | null>(null);

  useEffect(() => {
    setToken(localStorage.getItem('admin_token'));
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.listPlates({
        page,
        limit: LIMIT,
        category: category || undefined,
      });
      setPlates(data.items);
      setTotal(data.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load plates');
    } finally {
      setLoading(false);
    }
  }, [page, category]);

  useEffect(() => {
    load();
  }, [load]);

  async function handleDelete(id: string) {
    if (!token) {
      setError('You must be logged in to delete plates.');
      return;
    }
    setDeleting(id);
    setError(null);
    try {
      await api.deletePlate(token, id);
      setConfirmId(null);
      setFlash('Plate deleted.');
      setTimeout(() => setFlash(null), 2500);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Delete failed');
    } finally {
      setDeleting(null);
    }
  }

  const filtered = search
    ? plates.filter((p) =>
        p.full_plate.toLowerCase().includes(search.toLowerCase()),
      )
    : plates;

  const totalPages = Math.max(1, Math.ceil(total / LIMIT));

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="section-eyebrow">Admin</span>
          <h1 className="font-display mt-2 text-3xl font-bold text-brand">
            Manage plates
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            {total} plate{total === 1 ? '' : 's'} in the catalog.
          </p>
        </div>
        <Link href="/admin/plates/new" className="btn-accent">
          + Add plate
        </Link>
      </div>

      {!token && (
        <div className="mb-4 rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
          You are not signed in.{' '}
          <Link href="/admin/login" className="font-medium underline">
            Sign in
          </Link>{' '}
          to edit or delete plates.
        </div>
      )}

      {flash && (
        <div className="mb-4 rounded-md border border-green-200 bg-green-50 p-3 text-sm text-green-800">
          {flash}
        </div>
      )}

      {error && (
        <div className="mb-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="mb-4 flex flex-wrap items-end gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-soft">
        <label className="flex flex-col text-xs text-slate-600">
          Search
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter on this page…"
            className="mt-1 w-56 rounded-md border border-slate-200 px-3 py-1.5 text-sm focus:border-brand-accent focus:outline-none"
          />
        </label>
        <label className="flex flex-col text-xs text-slate-600">
          Category
          <select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setPage(1);
            }}
            className="mt-1 w-40 rounded-md border border-slate-200 px-3 py-1.5 text-sm focus:border-brand-accent focus:outline-none"
          >
            <option value="">All</option>
            <option value="Premium">Premium</option>
            <option value="Standard">Standard</option>
            <option value="Lucky">Lucky</option>
          </select>
        </label>
        <button
          type="button"
          onClick={load}
          className="btn-ghost text-xs"
          disabled={loading}
        >
          {loading ? 'Loading…' : 'Refresh'}
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-soft">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
            <tr>
              <th className="px-4 py-3">Plate</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Sum</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading && plates.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-slate-500">
                  Loading plates…
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-slate-500">
                  No plates found.
                </td>
              </tr>
            ) : (
              filtered.map((plate) => (
                <tr key={plate.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <div className="font-display text-lg font-bold tracking-wider text-brand">
                      {plate.full_plate}
                    </div>
                    <div className="text-xs text-slate-500">
                      {plate.prefix} · {plate.number}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="chip bg-gold-50 text-gold-700">
                      {plate.category}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-700">{plate.plate_type}</td>
                  <td className="px-4 py-3 text-slate-700">
                    {plate.numerology_sum}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/plates/${plate.id}`}
                        className="rounded-md border border-slate-200 px-3 py-1 text-xs font-medium text-slate-600 hover:bg-slate-50"
                      >
                        View
                      </Link>
                      <Link
                        href={`/admin/plates/${plate.id}/edit`}
                        className="rounded-md border border-brand-accent/40 bg-gold-50 px-3 py-1 text-xs font-semibold text-brand-accent hover:bg-gold-100"
                      >
                        Edit
                      </Link>
                      {confirmId === plate.id ? (
                        <>
                          <button
                            type="button"
                            onClick={() => handleDelete(plate.id)}
                            disabled={deleting === plate.id}
                            className="rounded-md bg-red-600 px-3 py-1 text-xs font-semibold text-white hover:bg-red-700 disabled:opacity-60"
                          >
                            {deleting === plate.id ? 'Deleting…' : 'Confirm'}
                          </button>
                          <button
                            type="button"
                            onClick={() => setConfirmId(null)}
                            className="rounded-md border border-slate-200 px-3 py-1 text-xs text-slate-600 hover:bg-slate-50"
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setConfirmId(plate.id)}
                          className="rounded-md border border-red-200 bg-red-50 px-3 py-1 text-xs font-semibold text-red-700 hover:bg-red-100"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <nav className="mt-6 flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1 || loading}
            className="btn-ghost text-xs disabled:opacity-50"
          >
            ← Prev
          </button>
          <span className="text-sm text-slate-600">
            Page {page} of {totalPages}
          </span>
          <button
            type="button"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages || loading}
            className="btn-ghost text-xs disabled:opacity-50"
          >
            Next →
          </button>
        </nav>
      )}
    </div>
  );
}
