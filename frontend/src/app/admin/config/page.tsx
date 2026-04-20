'use client';

import { useCallback, useEffect, useState } from 'react';
import { api } from '@/lib/api';
import type { ConfigMap } from '@/lib/types';

export default function AdminConfigPage() {
  const [token, setToken] = useState<string | null>(null);
  const [config, setConfig] = useState<ConfigMap>({});
  const [newKey, setNewKey] = useState('');
  const [newValue, setNewValue] = useState('');
  const [edits, setEdits] = useState<ConfigMap>({});
  const [error, setError] = useState<string | null>(null);
  const [flash, setFlash] = useState<string | null>(null);

  useEffect(() => {
    setToken(localStorage.getItem('admin_token'));
  }, []);

  const load = useCallback(async () => {
    try {
      const data = await api.listConfig();
      setConfig(data);
      setEdits(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Load failed');
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  function notify(msg: string) {
    setFlash(msg);
    setTimeout(() => setFlash(null), 2000);
  }

  async function save(key: string) {
    if (!token) return setError('Login required');
    const value = edits[key] ?? '';
    await api.setConfig(token, key, value);
    notify(`Saved ${key}`);
    await load();
  }

  async function remove(key: string) {
    if (!token) return;
    if (!confirm(`Delete config "${key}"?`)) return;
    await api.deleteConfig(token, key);
    notify(`Deleted ${key}`);
    await load();
  }

  async function add(e: React.FormEvent) {
    e.preventDefault();
    if (!token) return setError('Login required');
    if (!newKey.trim()) return;
    await api.setConfig(token, newKey.trim(), newValue);
    setNewKey('');
    setNewValue('');
    notify('Added');
    await load();
  }

  const keys = Object.keys(config).sort();

  return (
    <div>
      <h1 className="font-display mb-6 text-3xl font-bold text-brand">Config</h1>

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
        onSubmit={add}
        className="mb-6 flex flex-wrap items-end gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-soft"
      >
        <label className="flex flex-col text-xs text-slate-600">
          Key
          <input
            value={newKey}
            onChange={(e) => setNewKey(e.target.value)}
            placeholder="logo_url"
            className="mt-1 w-56 rounded-md border border-slate-200 px-3 py-1.5 text-sm"
          />
        </label>
        <label className="flex flex-1 flex-col text-xs text-slate-600">
          Value
          <input
            value={newValue}
            onChange={(e) => setNewValue(e.target.value)}
            placeholder="https://…"
            className="mt-1 rounded-md border border-slate-200 px-3 py-1.5 text-sm"
          />
        </label>
        <button type="submit" className="btn-accent">
          Add / update
        </button>
      </form>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-soft">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
            <tr>
              <th className="px-4 py-3">Key</th>
              <th className="px-4 py-3">Value</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {keys.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-4 py-10 text-center text-slate-500">
                  No config entries.
                </td>
              </tr>
            ) : (
              keys.map((k) => (
                <tr key={k} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-mono text-xs text-slate-700">{k}</td>
                  <td className="px-4 py-3">
                    <input
                      value={edits[k] ?? ''}
                      onChange={(e) =>
                        setEdits({ ...edits, [k]: e.target.value })
                      }
                      className="w-full rounded-md border border-slate-200 px-3 py-1.5 text-sm"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => save(k)}
                        disabled={edits[k] === config[k]}
                        className="rounded-md border border-brand-accent/40 bg-gold-50 px-3 py-1 text-xs font-semibold text-brand-accent hover:bg-gold-100 disabled:opacity-40"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => remove(k)}
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
