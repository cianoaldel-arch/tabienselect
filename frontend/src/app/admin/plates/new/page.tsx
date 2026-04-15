'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import PlateForm, { type PlateFormValues } from '@/components/PlateForm';

export default function NewPlatePage() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    setToken(localStorage.getItem('admin_token'));
  }, []);

  async function handleSubmit(values: PlateFormValues) {
    setSuccess(false);
    if (!token) throw new Error('You must be logged in. Please sign in first.');
    await api.createPlate(token, values);
    setSuccess(true);
  }

  return (
    <div>
      <div className="mb-6">
        <span className="section-eyebrow">Admin</span>
        <h1 className="font-display mt-2 text-3xl font-bold text-brand">
          Add a new plate
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Create a license plate listing visible on the public site.
        </p>
      </div>

      {!token && (
        <div className="mb-4 rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
          You are not signed in.{' '}
          <Link href="/admin/login" className="font-medium underline">
            Sign in
          </Link>{' '}
          to submit.
        </div>
      )}

      {success && (
        <div className="mb-4 flex items-center justify-between rounded-md border border-green-200 bg-green-50 p-3 text-sm text-green-800">
          <span>Plate created successfully.</span>
          <button
            type="button"
            onClick={() => router.push('/admin/plates')}
            className="text-xs font-medium underline"
          >
            Manage plates →
          </button>
        </div>
      )}

      <PlateForm
        submitLabel="Create plate"
        onSubmit={handleSubmit}
        resetOnSubmit
      />
    </div>
  );
}
