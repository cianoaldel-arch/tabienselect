'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import type { ImportPlatesResult } from '@/lib/types';

const TEMPLATE_COLUMNS = [
  'Prefix',
  'Number',
  'Full Plate',
  'Category',
  'Plate Type',
  'Numerology',
  'Price',
  'Contact text',
];

export default function ImportPlatesPage() {
  const [token, setToken] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [defaultLineQr, setDefaultLineQr] = useState('');
  const [defaultContact, setDefaultContact] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ImportPlatesResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setToken(localStorage.getItem('admin_token'));
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setResult(null);
    if (!token) {
      setError('You must be logged in to import plates.');
      return;
    }
    if (!file) {
      setError('Please choose an Excel file (.xlsx).');
      return;
    }
    setSubmitting(true);
    try {
      const data = await api.importPlates(token, file, {
        line_qr_url: defaultLineQr.trim() || undefined,
        contact_text: defaultContact.trim() || undefined,
      });
      setResult(data);
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Import failed');
    } finally {
      setSubmitting(false);
    }
  }

  function downloadTemplate() {
    const csv = TEMPLATE_COLUMNS.join(',') + '\n';
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'plates-template.csv';
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div>
      <div className="mb-6">
        <span className="section-eyebrow">Admin</span>
        <h1 className="font-display mt-2 text-3xl font-bold text-brand">
          Import plates from Excel
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Upload an .xlsx file. Existing plates (matched by Full Plate) will be
          updated; new ones will be created.
        </p>
      </div>

      {!token && (
        <div className="mb-4 rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
          You are not signed in.{' '}
          <Link href="/admin/login" className="font-medium underline">
            Sign in
          </Link>{' '}
          to import.
        </div>
      )}

      {error && (
        <div className="mb-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-5 rounded-2xl border border-slate-200 bg-white p-8 shadow-soft"
      >
        <section>
          <h2 className="text-sm font-semibold text-slate-700">
            Expected columns
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            The first row should be a header. Column names are case-insensitive.
          </p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {TEMPLATE_COLUMNS.map((c) => (
              <span
                key={c}
                className="rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 text-xs text-slate-600"
              >
                {c}
              </span>
            ))}
          </div>
          <button
            type="button"
            onClick={downloadTemplate}
            className="btn-ghost mt-3 text-xs"
          >
            ↓ Download CSV template
          </button>
        </section>

        <div className="border-t border-slate-100 pt-5">
          <label className="block text-sm font-medium text-slate-700">
            Excel file (.xlsx)
          </label>
          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.xls,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            className="mt-2 block w-full text-sm text-slate-600 file:mr-3 file:rounded-md file:border-0 file:bg-brand file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-brand-700"
          />
          {file && (
            <p className="mt-1 text-xs text-slate-500">
              {file.name} · {(file.size / 1024).toFixed(1)} KB
            </p>
          )}
        </div>

        <div className="grid gap-4 border-t border-slate-100 pt-5 sm:grid-cols-2">
          <label className="block">
            <span className="text-sm font-medium text-slate-700">
              Default Line QR URL
            </span>
            <span className="mt-0.5 block text-xs text-slate-500">
              Used when the row has no Line QR URL.
            </span>
            <input
              type="url"
              value={defaultLineQr}
              onChange={(e) => setDefaultLineQr(e.target.value)}
              placeholder="https://..."
              className="mt-1 block w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:border-brand-accent focus:outline-none focus:ring-1 focus:ring-brand-accent"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-slate-700">
              Default contact text
            </span>
            <span className="mt-0.5 block text-xs text-slate-500">
              Used when the row has no Contact text.
            </span>
            <textarea
              rows={2}
              value={defaultContact}
              onChange={(e) => setDefaultContact(e.target.value)}
              className="mt-1 block w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:border-brand-accent focus:outline-none focus:ring-1 focus:ring-brand-accent"
            />
          </label>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={submitting || !file || !token}
            className="btn-accent disabled:opacity-60"
          >
            {submitting ? 'Importing…' : 'Upload & import'}
          </button>
          <Link href="/admin/plates" className="btn-ghost">
            Back to plates
          </Link>
        </div>
      </form>

      {result && (
        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
          <h2 className="font-display text-xl font-bold text-brand">
            Import summary
          </h2>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <SummaryStat label="Rows" value={result.total} tone="neutral" />
            <SummaryStat label="Inserted" value={result.inserted} tone="good" />
            <SummaryStat label="Updated" value={result.updated} tone="info" />
            <SummaryStat label="Failed" value={result.failed} tone="bad" />
          </div>
          {result.errors.length > 0 && (
            <div className="mt-5">
              <h3 className="text-sm font-semibold text-slate-700">
                Errors ({result.errors.length})
              </h3>
              <div className="mt-2 max-h-72 overflow-auto rounded-md border border-slate-200">
                <table className="min-w-full text-xs">
                  <thead className="bg-slate-50 text-left font-semibold text-slate-600">
                    <tr>
                      <th className="px-3 py-2 w-20">Row</th>
                      <th className="px-3 py-2">Message</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {result.errors.map((e, i) => (
                      <tr key={i}>
                        <td className="px-3 py-1.5 text-slate-500">{e.row}</td>
                        <td className="px-3 py-1.5 text-slate-700">
                          {e.message}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function SummaryStat({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: 'neutral' | 'good' | 'info' | 'bad';
}) {
  const toneCls =
    tone === 'good'
      ? 'border-green-200 bg-green-50 text-green-800'
      : tone === 'info'
        ? 'border-sky-200 bg-sky-50 text-sky-800'
        : tone === 'bad'
          ? 'border-red-200 bg-red-50 text-red-800'
          : 'border-slate-200 bg-slate-50 text-slate-700';
  return (
    <div className={`rounded-lg border px-4 py-3 ${toneCls}`}>
      <div className="text-xs uppercase tracking-wide opacity-70">{label}</div>
      <div className="mt-1 text-2xl font-bold">{value}</div>
    </div>
  );
}
