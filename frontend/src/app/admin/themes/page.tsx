'use client';

import { useCallback, useEffect, useState } from 'react';
import { api } from '@/lib/api';
import type { Theme, ThemeInput } from '@/lib/types';

const EMPTY: ThemeInput = {
  name: '',
  primary: '#172c5c',
  accent: '#d4af37',
  background: '#f4f6fa',
  foreground: '#0a1628',
  muted: '#64748b',
  is_active: false,
};

export default function AdminThemesPage() {
  const [token, setToken] = useState<string | null>(null);
  const [themes, setThemes] = useState<Theme[]>([]);
  const [form, setForm] = useState<ThemeInput>(EMPTY);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [flash, setFlash] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setToken(localStorage.getItem('admin_token'));
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.listThemes();
      setThemes(data.items);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Load failed');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  function notify(msg: string) {
    setFlash(msg);
    setTimeout(() => setFlash(null), 2000);
  }

  function reset() {
    setEditingId(null);
    setForm(EMPTY);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!token) return setError('Login required');
    setError(null);
    try {
      if (editingId) {
        await api.updateTheme(token, editingId, form);
        notify('Theme updated');
      } else {
        await api.createTheme(token, form);
        notify('Theme created');
      }
      reset();
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed');
    }
  }

  async function activate(id: string) {
    if (!token) return;
    await api.activateTheme(token, id);
    notify('Theme activated');
    await load();
  }

  async function remove(id: string) {
    if (!token) return;
    if (!confirm('Delete this theme?')) return;
    await api.deleteTheme(token, id);
    notify('Theme deleted');
    await load();
  }

  function edit(t: Theme) {
    setEditingId(t.id);
    setForm({
      name: t.name,
      primary: t.primary,
      accent: t.accent,
      background: t.background,
      foreground: t.foreground,
      muted: t.muted,
      is_active: t.is_active,
    });
  }

  const fields: (keyof ThemeInput)[] = [
    'primary',
    'accent',
    'background',
    'foreground',
    'muted',
  ];

  return (
    <div>
      <h1 className="font-display mb-6 text-3xl font-bold text-brand">Themes</h1>

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

      <form
        onSubmit={submit}
        className="mb-6 grid gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-soft"
      >
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-slate-800">
            {editingId ? 'Edit theme' : 'New theme'}
          </h2>
          {editingId && (
            <button type="button" onClick={reset} className="btn-ghost text-xs">
              Cancel
            </button>
          )}
        </div>

        <label className="flex flex-col text-xs text-slate-600">
          Name
          <input
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="mt-1 rounded-md border border-slate-200 px-3 py-1.5 text-sm focus:border-brand-accent focus:outline-none"
          />
        </label>

        <div className="grid gap-3 sm:grid-cols-5">
          {fields.map((k) => (
            <label key={k} className="flex flex-col text-xs text-slate-600">
              {k}
              <div className="mt-1 flex items-center gap-2">
                <input
                  type="color"
                  value={form[k] as string}
                  onChange={(e) => setForm({ ...form, [k]: e.target.value })}
                  className="h-8 w-10 cursor-pointer rounded border border-slate-200"
                />
                <input
                  type="text"
                  value={form[k] as string}
                  onChange={(e) => setForm({ ...form, [k]: e.target.value })}
                  className="w-full rounded-md border border-slate-200 px-2 py-1 text-xs"
                />
              </div>
            </label>
          ))}
        </div>

        <label className="flex items-center gap-2 text-sm text-slate-700">
          <input
            type="checkbox"
            checked={!!form.is_active}
            onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
          />
          Activate
        </label>

        <button type="submit" className="btn-accent w-fit">
          {editingId ? 'Save changes' : 'Create theme'}
        </button>
      </form>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-soft">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Colors</th>
              <th className="px-4 py-3">Active</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading && themes.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-10 text-center text-slate-500">
                  Loading…
                </td>
              </tr>
            ) : themes.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-10 text-center text-slate-500">
                  No themes yet.
                </td>
              </tr>
            ) : (
              themes.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-800">{t.name}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      {fields.map((k) => (
                        <span
                          key={k}
                          title={`${k}: ${t[k]}`}
                          className="inline-block h-5 w-5 rounded border border-slate-200"
                          style={{ background: t[k] as string }}
                        />
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {t.is_active ? (
                      <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-800">
                        Active
                      </span>
                    ) : (
                      <span className="text-xs text-slate-400">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      {!t.is_active && (
                        <button
                          onClick={() => activate(t.id)}
                          className="rounded-md border border-brand-accent/40 bg-gold-50 px-3 py-1 text-xs font-semibold text-brand-accent hover:bg-gold-100"
                        >
                          Activate
                        </button>
                      )}
                      <button
                        onClick={() => edit(t)}
                        className="rounded-md border border-slate-200 px-3 py-1 text-xs font-medium text-slate-600 hover:bg-slate-50"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => remove(t.id)}
                        className="rounded-md border border-red-200 bg-red-50 px-3 py-1 text-xs font-semibold text-red-700 hover:bg-red-100"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
