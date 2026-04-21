'use client';

import { useState } from 'react';
import type { Plate } from '@/lib/types';
import { PLATE_CATEGORIES } from '@/lib/categories';

export type PlateFormValues = {
  prefix: string;
  number: string;
  full_plate: string;
  category: string;
  plate_type: string;
  numerology_sum: number;
  line_qr_url: string;
  contact_text: string;
};

type FormState = {
  prefix: string;
  number: string;
  full_plate: string;
  category: string;
  plate_type: string;
  numerology_sum: string;
  line_qr_url: string;
  contact_text: string;
};

const blankState: FormState = {
  prefix: '',
  number: '',
  full_plate: '',
  category: PLATE_CATEGORIES[0].value,
  plate_type: 'Sedan',
  numerology_sum: '',
  line_qr_url: '',
  contact_text: '',
};

function fromPlate(plate: Plate): FormState {
  return {
    prefix: plate.prefix,
    number: plate.number,
    full_plate: plate.full_plate,
    category: plate.category,
    plate_type: plate.plate_type,
    numerology_sum: String(plate.numerology_sum),
    line_qr_url: plate.line_qr_url,
    contact_text: plate.contact_text,
  };
}

export default function PlateForm({
  initial,
  submitLabel,
  onSubmit,
  onReset,
  resetOnSubmit = false,
}: {
  initial?: Plate;
  submitLabel: string;
  onSubmit: (values: PlateFormValues) => Promise<void>;
  onReset?: () => void;
  resetOnSubmit?: boolean;
}) {
  const initialState = initial ? fromPlate(initial) : blankState;
  const [form, setForm] = useState<FormState>(initialState);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  function validate(): boolean {
    const next: Partial<Record<keyof FormState, string>> = {};
    if (!form.prefix.trim()) next.prefix = 'Required';
    else if (form.prefix.length > 10) next.prefix = 'Max 10 characters';
    if (!form.number.trim()) next.number = 'Required';
    else if (form.number.length > 10) next.number = 'Max 10 characters';
    if (!form.full_plate.trim()) next.full_plate = 'Required';
    else if (form.full_plate.length > 32) next.full_plate = 'Max 32 characters';
    if (!form.category.trim()) next.category = 'Required';
    if (!form.plate_type.trim()) next.plate_type = 'Required';
    const sum = Number(form.numerology_sum);
    if (form.numerology_sum === '' || Number.isNaN(sum)) {
      next.numerology_sum = 'Must be a number';
    } else if (!Number.isInteger(sum) || sum < 0 || sum > 999) {
      next.numerology_sum = 'Integer between 0 and 999';
    }
    try {
      new URL(form.line_qr_url);
    } catch {
      next.line_qr_url = 'Must be a valid URL';
    }
    if (!form.contact_text.trim()) next.contact_text = 'Required';
    else if (form.contact_text.length > 500) next.contact_text = 'Max 500 characters';
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitError(null);
    if (!validate()) return;
    setSubmitting(true);
    try {
      await onSubmit({
        prefix: form.prefix.trim(),
        number: form.number.trim(),
        full_plate: form.full_plate.trim(),
        category: form.category.trim(),
        plate_type: form.plate_type.trim(),
        numerology_sum: Number(form.numerology_sum),
        line_qr_url: form.line_qr_url.trim(),
        contact_text: form.contact_text.trim(),
      });
      if (resetOnSubmit) setForm(blankState);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Submit failed');
    } finally {
      setSubmitting(false);
    }
  }

  function handleReset() {
    setForm(initialState);
    setErrors({});
    setSubmitError(null);
    onReset?.();
  }

  const inputCls =
    'mt-1 block w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:border-brand-accent focus:outline-none focus:ring-1 focus:ring-brand-accent';

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 rounded-2xl border border-slate-200 bg-white p-8 shadow-soft"
      noValidate
    >
      {submitError && (
        <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {submitError}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Prefix" error={errors.prefix}>
          <input
            type="text"
            value={form.prefix}
            onChange={(e) => update('prefix', e.target.value)}
            className={inputCls}
            placeholder="e.g. กก"
          />
        </Field>
        <Field label="Number" error={errors.number}>
          <input
            type="text"
            value={form.number}
            onChange={(e) => update('number', e.target.value)}
            className={inputCls}
            placeholder="e.g. 9999"
          />
        </Field>
      </div>

      <Field label="Full plate" error={errors.full_plate}>
        <input
          type="text"
          value={form.full_plate}
          onChange={(e) => update('full_plate', e.target.value)}
          className={inputCls}
          placeholder="e.g. กก 9999"
        />
      </Field>

      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Category" error={errors.category}>
          <select
            value={form.category}
            onChange={(e) => update('category', e.target.value)}
            className={inputCls}
          >
            {PLATE_CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Plate type" error={errors.plate_type}>
          <select
            value={form.plate_type}
            onChange={(e) => update('plate_type', e.target.value)}
            className={inputCls}
          >
            <option value="Sedan">Sedan</option>
            <option value="Pickup">Pickup</option>
            <option value="Motorcycle">Motorcycle</option>
          </select>
        </Field>
        <Field label="Numerology sum" error={errors.numerology_sum}>
          <input
            type="number"
            min={0}
            max={999}
            value={form.numerology_sum}
            onChange={(e) => update('numerology_sum', e.target.value)}
            className={inputCls}
            placeholder="e.g. 36"
          />
        </Field>
      </div>

      <Field label="Line QR URL" error={errors.line_qr_url}>
        <input
          type="url"
          value={form.line_qr_url}
          onChange={(e) => update('line_qr_url', e.target.value)}
          className={inputCls}
          placeholder="https://..."
        />
      </Field>

      <Field label="Contact text" error={errors.contact_text}>
        <textarea
          rows={3}
          value={form.contact_text}
          onChange={(e) => update('contact_text', e.target.value)}
          className={inputCls}
          placeholder="Brief description shown on plate detail page"
        />
      </Field>

      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={submitting}
          className="btn-accent disabled:opacity-60"
        >
          {submitting ? 'Saving…' : submitLabel}
        </button>
        <button type="button" onClick={handleReset} className="btn-ghost">
          Reset
        </button>
      </div>
    </form>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      {children}
      {error && <span className="mt-1 block text-xs text-red-600">{error}</span>}
    </label>
  );
}
