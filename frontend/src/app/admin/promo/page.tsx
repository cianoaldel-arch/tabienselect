'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { api } from '@/lib/api';
import type { PromoBanner, PromoBannerInput } from '@/lib/types';

const EMPTY: PromoBannerInput = {
  headline: '',
  highlight: '',
  subheadline: null,
  plate_code: '',
  plate_region: '',
  image_url: null,
  footer_title: '',
  footer_tagline: '',
  phone: '',
  line_id: '',
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
  const addFileRef = useRef<HTMLInputElement>(null);

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

  async function onAddImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (addFileRef.current) addFileRef.current.value = '';
    if (!file) return;
    if (!token) return setError('Login required');
    if (!file.type.startsWith('image/')) return setError('Please choose an image file');
    if (file.size > MAX_IMAGE_BYTES)
      return setError(`Image too large (max ${Math.round(MAX_IMAGE_BYTES / 1024 / 1024)}MB)`);

    setBusy(true);
    setError(null);
    try {
      const dataUrl = await fileToDataUrl(file);
      const nextOrder = banners.length
        ? Math.max(...banners.map((b) => b.sort_order)) + 1
        : 0;
      await api.createPromoBanner(token, {
        ...EMPTY,
        image_url: dataUrl,
        sort_order: nextOrder,
      });
      notify('Added banner');
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Create failed');
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
        <label className="btn-accent cursor-pointer disabled:opacity-60">
          {busy ? 'Uploading…' : '+ Add image'}
          <input
            ref={addFileRef}
            type="file"
            accept="image/*"
            onChange={onAddImage}
            disabled={busy}
            className="hidden"
          />
        </label>
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
          No banners yet. Click "Add image" to upload one.
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
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-1.5 text-xs text-slate-600">
            <input
              type="checkbox"
              checked={draft.is_active ?? true}
              onChange={(e) => set('is_active', e.target.checked)}
            />
            Active
          </label>
          <label className="flex items-center gap-1.5 text-xs text-slate-600">
            Sort
            <input
              type="number"
              value={draft.sort_order ?? 0}
              onChange={(e) => set('sort_order', Number(e.target.value) || 0)}
              className="w-16 rounded-md border border-slate-200 px-2 py-1 text-sm"
            />
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

      <div className="flex flex-col gap-3 md:flex-row md:items-start">
        <div className="flex aspect-square w-full items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-slate-50 md:w-60">
          {draft.image_url ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={draft.image_url}
              alt="preview"
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="text-xs text-slate-400">No image</span>
          )}
        </div>
        <div className="flex flex-1 flex-col gap-2">
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            onChange={onFilePick}
            className="block w-full text-xs text-slate-600 file:mr-2 file:rounded-md file:border-0 file:bg-brand file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-white hover:file:bg-brand-700"
            disabled={uploading}
          />
          {draft.image_url && (
            <button
              type="button"
              onClick={() => set('image_url', null)}
              className="self-start text-xs text-slate-500 hover:text-red-600"
            >
              Remove image
            </button>
          )}
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

