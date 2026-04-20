'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { api } from '@/lib/api';
import type { PromoBanner, PromoBannerInput } from '@/lib/types';

const EMPTY: PromoBannerInput = {
  headline: 'หัวข้อใหม่',
  highlight: 'ไฮไลต์',
  subheadline: null,
  plate_code: '7บข',
  plate_region: 'กรุงเทพมหานคร',
  image_url: null,
  footer_title: 'รับจองทะเบียน',
  footer_tagline: 'รถยนต์หมวดใหม่',
  phone: '082-416-6551 คุณน็อต',
  line_id: '@tabienselect',
  sort_order: 0,
  is_active: true,
};

const MAX_IMAGE_BYTES = 2_500_000;

async function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

export default function AdminPromoPage() {
  const [token, setToken] = useState<string | null>(null);
  const [banners, setBanners] = useState<PromoBanner[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [flash, setFlash] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setToken(localStorage.getItem('admin_token'));
  }, []);

  const load = useCallback(async () => {
    try {
      const data = await api.listPromoBanners();
      setBanners(data.items);
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

  async function addBanner() {
    if (!token) return setError('Login required');
    setBusy(true);
    setError(null);
    try {
      const nextOrder = banners.length
        ? Math.max(...banners.map((b) => b.sort_order)) + 1
        : 0;
      await api.createPromoBanner(token, { ...EMPTY, sort_order: nextOrder });
      notify('Added banner');
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Create failed');
    } finally {
      setBusy(false);
    }
  }

  async function saveBanner(id: string, patch: Partial<PromoBannerInput>) {
    if (!token) return setError('Login required');
    setBusy(true);
    setError(null);
    try {
      await api.updatePromoBanner(token, id, patch);
      notify('Saved');
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Save failed');
    } finally {
      setBusy(false);
    }
  }

  async function removeBanner(id: string) {
    if (!token) return;
    if (!confirm('Delete this banner?')) return;
    setBusy(true);
    setError(null);
    try {
      await api.deletePromoBanner(token, id);
      notify('Deleted');
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Delete failed');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-3xl font-bold text-brand">Promo banners</h1>
        <button
          onClick={addBanner}
          disabled={busy}
          className="btn-accent disabled:opacity-60"
        >
          + Add banner
        </button>
      </div>

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

      {banners.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-500">
          No banners yet. Click "Add banner" to create one.
        </div>
      ) : (
        <div className="space-y-4">
          {banners.map((b) => (
            <BannerEditor
              key={b.id}
              banner={b}
              onSave={(patch) => saveBanner(b.id, patch)}
              onDelete={() => removeBanner(b.id)}
              onError={setError}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function BannerEditor({
  banner,
  onSave,
  onDelete,
  onError,
}: {
  banner: PromoBanner;
  onSave: (patch: Partial<PromoBannerInput>) => Promise<void>;
  onDelete: () => Promise<void>;
  onError: (msg: string) => void;
}) {
  const [draft, setDraft] = useState<PromoBannerInput>(toInput(banner));
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setDraft(toInput(banner));
  }, [banner]);

  const dirty = JSON.stringify(draft) !== JSON.stringify(toInput(banner));

  function set<K extends keyof PromoBannerInput>(key: K, value: PromoBannerInput[K]) {
    setDraft((d) => ({ ...d, [key]: value }));
  }

  async function onFilePick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      onError('Please choose an image file');
      return;
    }
    if (file.size > MAX_IMAGE_BYTES) {
      onError(`Image too large (max ${Math.round(MAX_IMAGE_BYTES / 1024 / 1024)}MB)`);
      return;
    }
    setUploading(true);
    try {
      const dataUrl = await fileToDataUrl(file);
      set('image_url', dataUrl);
    } catch {
      onError('Failed to read image');
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="font-display text-sm font-semibold text-slate-700">
            {banner.headline || 'Untitled'}
          </span>
          <label className="flex items-center gap-1.5 text-xs text-slate-600">
            <input
              type="checkbox"
              checked={draft.is_active ?? true}
              onChange={(e) => set('is_active', e.target.checked)}
            />
            Active
          </label>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onSave(draft)}
            disabled={!dirty}
            className="rounded-md border border-brand-accent/40 bg-gold-50 px-3 py-1 text-xs font-semibold text-brand-accent hover:bg-gold-100 disabled:opacity-40"
          >
            Save
          </button>
          <button
            onClick={onDelete}
            className="rounded-md border border-red-200 bg-red-50 px-3 py-1 text-xs font-semibold text-red-700 hover:bg-red-100"
          >
            Delete
          </button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-[200px_1fr]">
        <div className="flex flex-col gap-2">
          <div className="flex h-40 w-full items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
            {draft.image_url ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={draft.image_url}
                alt="preview"
                className="max-h-full max-w-full object-contain"
              />
            ) : (
              <span className="text-xs text-slate-400">No image</span>
            )}
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            onChange={onFilePick}
            className="block w-full text-xs text-slate-600 file:mr-2 file:rounded-md file:border-0 file:bg-brand file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-white hover:file:bg-brand-700"
            disabled={uploading}
          />
          <input
            value={draft.image_url ?? ''}
            onChange={(e) => set('image_url', e.target.value || null)}
            placeholder="or paste an image URL"
            className="w-full rounded-md border border-slate-200 px-2 py-1 text-xs"
          />
          {draft.image_url && (
            <button
              type="button"
              onClick={() => set('image_url', null)}
              className="text-xs text-slate-500 hover:text-red-600"
            >
              Remove image
            </button>
          )}
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <Field label="Headline">
            <TextInput value={draft.headline} onChange={(v) => set('headline', v)} />
          </Field>
          <Field label="Highlight (cyan)">
            <TextInput value={draft.highlight} onChange={(v) => set('highlight', v)} />
          </Field>
          <Field label="Subheadline" full>
            <TextInput
              value={draft.subheadline ?? ''}
              onChange={(v) => set('subheadline', v || null)}
            />
          </Field>
          <Field label="Plate code">
            <TextInput value={draft.plate_code} onChange={(v) => set('plate_code', v)} />
          </Field>
          <Field label="Plate region">
            <TextInput
              value={draft.plate_region}
              onChange={(v) => set('plate_region', v)}
            />
          </Field>
          <Field label="Footer title">
            <TextInput
              value={draft.footer_title}
              onChange={(v) => set('footer_title', v)}
            />
          </Field>
          <Field label="Footer tagline">
            <TextInput
              value={draft.footer_tagline}
              onChange={(v) => set('footer_tagline', v)}
            />
          </Field>
          <Field label="Phone">
            <TextInput value={draft.phone} onChange={(v) => set('phone', v)} />
          </Field>
          <Field label="LINE ID">
            <TextInput value={draft.line_id} onChange={(v) => set('line_id', v)} />
          </Field>
          <Field label="Sort order">
            <input
              type="number"
              value={draft.sort_order ?? 0}
              onChange={(e) => set('sort_order', Number(e.target.value) || 0)}
              className="w-full rounded-md border border-slate-200 px-3 py-1.5 text-sm"
            />
          </Field>
        </div>
      </div>
    </div>
  );
}

function toInput(b: PromoBanner): PromoBannerInput {
  return {
    headline: b.headline,
    highlight: b.highlight,
    subheadline: b.subheadline,
    plate_code: b.plate_code,
    plate_region: b.plate_region,
    image_url: b.image_url,
    footer_title: b.footer_title,
    footer_tagline: b.footer_tagline,
    phone: b.phone,
    line_id: b.line_id,
    sort_order: b.sort_order,
    is_active: b.is_active,
  };
}

function Field({
  label,
  full,
  children,
}: {
  label: string;
  full?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label
      className={`flex flex-col text-xs text-slate-600 ${full ? 'md:col-span-2' : ''}`}
    >
      {label}
      <span className="mt-1">{children}</span>
    </label>
  );
}

function TextInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-md border border-slate-200 px-3 py-1.5 text-sm"
    />
  );
}
