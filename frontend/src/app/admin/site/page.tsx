'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { api } from '@/lib/api';

type ImageSetting = {
  key: string;
  label: string;
  help?: string;
};

type TextSetting = {
  key: string;
  label: string;
  help?: string;
  placeholder?: string;
};

const IMAGE_SETTINGS: ImageSetting[] = [
  {
    key: 'hero_car_image_url',
    label: 'Hero car image',
    help: 'Shown on the landing page hero. Falls back to built-in SVG if empty.',
  },
  {
    key: 'logo_url',
    label: 'Site logo',
    help: 'Shown in the header. Falls back to /logo-ts.png.',
  },
  {
    key: 'plate_bg_url',
    label: 'Plate showcase background',
    help: 'Background for the hero plate preview. Falls back to /plate-bg.png.',
  },
];

const TEXT_SETTINGS: TextSetting[] = [
  {
    key: 'plate_showcase_code',
    label: 'Plate showcase code',
    help: 'Plate number shown on the hero preview.',
    placeholder: '7บข 28',
  },
  {
    key: 'plate_showcase_region',
    label: 'Plate showcase region',
    help: 'Region label shown under the plate number.',
    placeholder: 'กรุงเทพมหานคร',
  },
];

const MAX_IMAGE_BYTES = 2_500_000;

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

export default function AdminSitePage() {
  const [token, setToken] = useState<string | null>(null);
  const [values, setValues] = useState<Record<string, string>>({});
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [flash, setFlash] = useState<string | null>(null);

  useEffect(() => {
    setToken(localStorage.getItem('admin_token'));
  }, []);

  const load = useCallback(async () => {
    try {
      const data = await api.listConfig();
      const next: Record<string, string> = {};
      for (const { key } of IMAGE_SETTINGS) next[key] = data[key] ?? '';
      for (const { key } of TEXT_SETTINGS) next[key] = data[key] ?? '';
      setValues(next);
      setDrafts(next);
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
    setError(null);
    try {
      const value = drafts[key] ?? '';
      if (value) await api.setConfig(token, key, value);
      else await api.deleteConfig(token, key).catch(() => undefined);
      notify('Saved');
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Save failed');
    }
  }

  return (
    <div>
      <h1 className="font-display mb-6 text-3xl font-bold text-brand">Site images</h1>

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

      <div className="space-y-4">
        {IMAGE_SETTINGS.map((s) => (
          <ImageSettingEditor
            key={s.key}
            setting={s}
            value={drafts[s.key] ?? ''}
            dirty={(drafts[s.key] ?? '') !== (values[s.key] ?? '')}
            onChange={(v) => setDrafts((d) => ({ ...d, [s.key]: v }))}
            onSave={() => save(s.key)}
            onError={setError}
          />
        ))}
      </div>

      <h2 className="font-display mt-10 mb-4 text-2xl font-bold text-brand">
        Plate showcase text
      </h2>
      <div className="space-y-4">
        {TEXT_SETTINGS.map((s) => (
          <TextSettingEditor
            key={s.key}
            setting={s}
            value={drafts[s.key] ?? ''}
            dirty={(drafts[s.key] ?? '') !== (values[s.key] ?? '')}
            onChange={(v) => setDrafts((d) => ({ ...d, [s.key]: v }))}
            onSave={() => save(s.key)}
          />
        ))}
      </div>
    </div>
  );
}

function TextSettingEditor({
  setting,
  value,
  dirty,
  onChange,
  onSave,
}: {
  setting: TextSetting;
  value: string;
  dirty: boolean;
  onChange: (v: string) => void;
  onSave: () => void | Promise<void>;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <div className="font-display text-sm font-semibold text-slate-700">
            {setting.label}
          </div>
          {setting.help && (
            <div className="text-xs text-slate-500">{setting.help}</div>
          )}
          <div className="mt-0.5 font-mono text-[10px] text-slate-400">
            {setting.key}
          </div>
        </div>
        <button
          onClick={onSave}
          disabled={!dirty}
          className="rounded-md border border-brand-accent/40 bg-gold-50 px-3 py-1 text-xs font-semibold text-brand-accent hover:bg-gold-100 disabled:opacity-40"
        >
          Save
        </button>
      </div>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={setting.placeholder}
        className="w-full rounded-md border border-slate-200 px-3 py-1.5 text-sm"
      />
    </div>
  );
}

function ImageSettingEditor({
  setting,
  value,
  dirty,
  onChange,
  onSave,
  onError,
}: {
  setting: ImageSetting;
  value: string;
  dirty: boolean;
  onChange: (v: string) => void;
  onSave: () => void | Promise<void>;
  onError: (msg: string) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

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
      onChange(dataUrl);
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
        <div>
          <div className="font-display text-sm font-semibold text-slate-700">
            {setting.label}
          </div>
          {setting.help && (
            <div className="text-xs text-slate-500">{setting.help}</div>
          )}
          <div className="mt-0.5 font-mono text-[10px] text-slate-400">
            {setting.key}
          </div>
        </div>
        <button
          onClick={onSave}
          disabled={!dirty}
          className="rounded-md border border-brand-accent/40 bg-gold-50 px-3 py-1 text-xs font-semibold text-brand-accent hover:bg-gold-100 disabled:opacity-40"
        >
          Save
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-[220px_1fr]">
        <div className="flex h-48 w-full items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
          {value ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={value}
              alt="preview"
              className="max-h-full max-w-full object-contain"
            />
          ) : (
            <span className="text-xs text-slate-400">No image</span>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            onChange={onFilePick}
            disabled={uploading}
            className="block w-full text-xs text-slate-600 file:mr-2 file:rounded-md file:border-0 file:bg-brand file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-white hover:file:bg-brand-700"
          />
          <input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="or paste an image URL"
            className="w-full rounded-md border border-slate-200 px-3 py-1.5 text-sm"
          />
          {value && (
            <button
              type="button"
              onClick={() => onChange('')}
              className="self-start text-xs text-slate-500 hover:text-red-600"
            >
              Clear image
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
