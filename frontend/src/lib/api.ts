import type { Plate, PlateListResponse, Theme, ThemeInput, ConfigMap } from './types';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api';

type Query = Record<string, string | number | undefined>;

function buildUrl(path: string, query?: Query) {
  const url = new URL(API_URL + path);
  if (query) {
    for (const [k, v] of Object.entries(query)) {
      if (v !== undefined && v !== '') url.searchParams.set(k, String(v));
    }
  }
  return url.toString();
}

async function request<T>(path: string, init?: RequestInit & { query?: Query }): Promise<T> {
  const { query, ...rest } = init ?? {};
  const res = await fetch(buildUrl(path, query), {
    ...rest,
    headers: {
      'Content-Type': 'application/json',
      ...(rest.headers ?? {}),
    },
    cache: 'no-store',
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`${res.status} ${res.statusText}: ${body}`);
  }
  if (res.status === 204) return undefined as T;
  return res.json();
}

export const api = {
  listPlates: (query: Query = {}) =>
    request<PlateListResponse>('/plates', { query }),
  getPlate: (id: string) => request<Plate>(`/plates/${id}`),
  login: (email: string, password: string) =>
    request<{ token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
  createPlate: (token: string, data: Omit<Plate, 'id' | 'created_at' | 'updated_at'>) =>
    request<Plate>('/plates', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(data),
    }),
  updatePlate: (token: string, id: string, data: Partial<Plate>) =>
    request<Plate>(`/plates/${id}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(data),
    }),
  deletePlate: (token: string, id: string) =>
    request<void>(`/plates/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    }),

  listThemes: () => request<{ items: Theme[] }>('/themes'),
  getActiveTheme: () => request<Theme | null>('/themes/active'),
  createTheme: (token: string, data: ThemeInput) =>
    request<Theme>('/themes', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(data),
    }),
  updateTheme: (token: string, id: string, data: Partial<ThemeInput>) =>
    request<Theme>(`/themes/${id}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(data),
    }),
  activateTheme: (token: string, id: string) =>
    request<Theme>(`/themes/${id}/activate`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    }),
  deleteTheme: (token: string, id: string) =>
    request<void>(`/themes/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    }),

  listConfig: () => request<ConfigMap>('/config'),
  setConfig: (token: string, key: string, value: string) =>
    request<{ key: string; value: string }>('/config', {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({ key, value }),
    }),
  deleteConfig: (token: string, key: string) =>
    request<void>(`/config/${encodeURIComponent(key)}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    }),
};
