'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import { api } from '@/lib/api';

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-sm rounded-2xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-500 shadow-soft">
          Loading…
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnToRaw = searchParams.get('returnTo');
  const returnTo =
    returnToRaw && returnToRaw.startsWith('/admin') && !returnToRaw.startsWith('/admin/login')
      ? returnToRaw
      : '/admin/plates';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (localStorage.getItem('admin_token')) {
      router.replace(returnTo);
      return;
    }
    setChecking(false);
  }, [router, returnTo]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const { token } = await api.login(email, password);
      localStorage.setItem('admin_token', token);
      router.push(returnTo);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setSubmitting(false);
    }
  }

  if (checking) {
    return (
      <div className="mx-auto max-w-sm rounded-2xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-500 shadow-soft">
        Checking session…
      </div>
    );
  }

  const inputCls =
    'mt-1 block w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand-accent focus:outline-none focus:ring-2 focus:ring-brand-accent/30';

  return (
    <div className="mx-auto flex min-h-[calc(100vh-12rem)] max-w-md flex-col justify-center">
      <div className="mb-5 text-center">
        <span className="section-eyebrow">Admin</span>
        <h1 className="font-display mt-3 text-3xl font-bold text-brand">
          Sign in to continue
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Use your admin credentials to manage the catalog.
        </p>
      </div>
      <form
        onSubmit={handleSubmit}
        className="admin-card space-y-4 p-7"
      >
        <label className="block">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Email
          </span>
          <input
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@example.com"
            className={inputCls}
          />
        </label>
        <label className="block">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Password
          </span>
          <input
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className={inputCls}
          />
        </label>
        {error && (
          <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}
        <button
          type="submit"
          disabled={submitting}
          className="btn-accent w-full py-2.5 disabled:opacity-60"
        >
          {submitting ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </div>
  );
}
