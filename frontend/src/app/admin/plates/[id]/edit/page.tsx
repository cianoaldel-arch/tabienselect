'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import type { Plate } from '@/lib/types';
import PlateForm, { type PlateFormValues } from '@/components/PlateForm';

export default function EditPlatePage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [plate, setPlate] = useState<Plate | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    setToken(localStorage.getItem('admin_token'));
  }, []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    api
      .getPlate(params.id)
      .then((p) => {
        if (!cancelled) setPlate(p);
      })
      .catch((err) => {
        if (!cancelled) {
          setLoadError(err instanceof Error ? err.message : 'Failed to load');
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [params.id]);

  async function handleSubmit(values: PlateFormValues) {
    setSuccess(false);
    if (!token) throw new Error('You must be logged in.');
    const updated = await api.updatePlate(token, params.id, values);
    setPlate(updated);
    setSuccess(true);
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <Link
            href="/admin/plates"
            className="text-xs font-medium text-slate-500 hover:text-brand-accent"
          >
            ← Back to plates
          </Link>
          <h1 className="font-display mt-2 text-3xl font-bold text-brand">
            Edit plate
          </h1>
          {plate && (
            <p className="mt-1 text-sm text-slate-600">
              Editing{' '}
              <span className="font-semibold text-brand">{plate.full_plate}</span>
            </p>
          )}
        </div>
        {plate && (
          <Link
            href={`/plates/${plate.id}`}
            className="btn-ghost text-xs"
          >
            View public page →
          </Link>
        )}
      </div>

      {!token && (
        <div className="mb-4 rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
          You are not signed in.{' '}
          <Link href="/admin/login" className="font-medium underline">
            Sign in
          </Link>{' '}
          to save changes.
        </div>
      )}

      {success && (
        <div className="mb-4 flex items-center justify-between rounded-md border border-green-200 bg-green-50 p-3 text-sm text-green-800">
          <span>Changes saved.</span>
          <button
            type="button"
            onClick={() => router.push('/admin/plates')}
            className="text-xs font-medium underline"
          >
            Back to list →
          </button>
        </div>
      )}

      {loadError && (
        <div className="mb-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {loadError}
        </div>
      )}

      {loading ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-slate-500 shadow-soft">
          Loading plate…
        </div>
      ) : plate ? (
        <PlateForm
          initial={plate}
          submitLabel="Save changes"
          onSubmit={handleSubmit}
        />
      ) : null}
    </div>
  );
}
