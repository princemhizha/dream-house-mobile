import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// ─── Base URL ────────────────────────────────────────────────────────────────
// Android emulator uses 10.0.2.2 to reach host; web/iOS use localhost
const getBaseUrl = (): string => {
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL;
  }
  if (Platform.OS === 'android') return 'http://10.0.2.2:8000/api/v1';
  return 'http://localhost:8000/api/v1';
};

const BASE_URL = getBaseUrl();

// ─── Token keys ──────────────────────────────────────────────────────────────
const TOKEN_KEYS = {
  access: 'dh_access_token',
  refresh: 'dh_refresh_token',
};

// ─── Snake ↔ Camel case converters ───────────────────────────────────────────
function snakeToCamelStr(str: string): string {
  return str.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
}

function camelToSnakeStr(str: string): string {
  return str.replace(/[A-Z]/g, (c) => `_${c.toLowerCase()}`);
}

export function snakeToCamel(obj: any): any {
  if (Array.isArray(obj)) return obj.map(snakeToCamel);
  if (obj !== null && typeof obj === 'object' && !(obj instanceof File) && !(obj instanceof Blob)) {
    return Object.keys(obj).reduce((acc: any, key: string) => {
      acc[snakeToCamelStr(key)] = snakeToCamel(obj[key]);
      return acc;
    }, {});
  }
  return obj;
}

export function camelToSnake(obj: any): any {
  if (Array.isArray(obj)) return obj.map(camelToSnake);
  if (obj !== null && typeof obj === 'object' && !(obj instanceof File) && !(obj instanceof Blob) && !(obj instanceof FormData)) {
    return Object.keys(obj).reduce((acc: any, key: string) => {
      acc[camelToSnakeStr(key)] = camelToSnake(obj[key]);
      return acc;
    }, {});
  }
  return obj;
}

// ─── Token helpers ───────────────────────────────────────────────────────────
export async function getAccessToken(): Promise<string | null> {
  return AsyncStorage.getItem(TOKEN_KEYS.access);
}

export async function getRefreshToken(): Promise<string | null> {
  return AsyncStorage.getItem(TOKEN_KEYS.refresh);
}

export async function setTokens(access: string, refresh: string): Promise<void> {
  await AsyncStorage.multiSet([
    [TOKEN_KEYS.access, access],
    [TOKEN_KEYS.refresh, refresh],
  ]);
}

export async function clearTokens(): Promise<void> {
  await AsyncStorage.multiRemove([TOKEN_KEYS.access, TOKEN_KEYS.refresh]);
}

// ─── Refresh flow ────────────────────────────────────────────────────────────
let refreshPromise: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
  // Deduplicate concurrent refresh calls
  if (refreshPromise) return refreshPromise;

  refreshPromise = (async () => {
    try {
      const refresh = await getRefreshToken();
      if (!refresh) return null;

      const res = await fetch(`${BASE_URL}/auth/token/refresh/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh }),
      });

      if (!res.ok) {
        await clearTokens();
        return null;
      }

      const data = await res.json();
      const newAccess = data.access;
      await AsyncStorage.setItem(TOKEN_KEYS.access, newAccess);
      return newAccess as string;
    } catch {
      await clearTokens();
      return null;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

// ─── Core request function ───────────────────────────────────────────────────
interface RequestOptions {
  method: string;
  path: string;
  body?: any;
  isFormData?: boolean;
  skipAuth?: boolean;
  params?: Record<string, string | number | boolean | undefined | null>;
}

async function request<T = any>(opts: RequestOptions): Promise<T> {
  const { method, path, body, isFormData = false, skipAuth = false, params } = opts;

  // Build URL with query params
  let url = `${BASE_URL}${path}`;
  if (params) {
    const searchParams = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(camelToSnakeStr(key), String(value));
      }
    }
    const qs = searchParams.toString();
    if (qs) url += `?${qs}`;
  }

  // Headers
  const headers: Record<string, string> = {};
  if (!isFormData) {
    headers['Content-Type'] = 'application/json';
  }

  if (!skipAuth) {
    const token = await getAccessToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  // Body
  let fetchBody: string | FormData | undefined;
  if (body) {
    if (isFormData) {
      fetchBody = body as FormData;
    } else {
      fetchBody = JSON.stringify(camelToSnake(body));
    }
  }

  let res = await fetch(url, { method, headers, body: fetchBody });

  // Auto-refresh on 401
  if (res.status === 401 && !skipAuth) {
    const newToken = await refreshAccessToken();
    if (newToken) {
      headers['Authorization'] = `Bearer ${newToken}`;
      res = await fetch(url, { method, headers, body: fetchBody });
    }
  }

  // 204 No Content
  if (res.status === 204) {
    return undefined as T;
  }

  const json = await res.json();

  if (!res.ok) {
    const error: any = new Error(json.detail || json.message || 'Request failed');
    error.status = res.status;
    error.data = snakeToCamel(json);
    throw error;
  }

  return snakeToCamel(json) as T;
}

// ─── Public API ──────────────────────────────────────────────────────────────
export const api = {
  get: <T = any>(path: string, params?: Record<string, any>, skipAuth?: boolean) =>
    request<T>({ method: 'GET', path, params, skipAuth }),

  post: <T = any>(path: string, body?: any, skipAuth?: boolean) =>
    request<T>({ method: 'POST', path, body, skipAuth }),

  put: <T = any>(path: string, body?: any) =>
    request<T>({ method: 'PUT', path, body }),

  patch: <T = any>(path: string, body?: any) =>
    request<T>({ method: 'PATCH', path, body }),

  delete: <T = any>(path: string) =>
    request<T>({ method: 'DELETE', path }),

  postForm: <T = any>(path: string, formData: FormData) =>
    request<T>({ method: 'POST', path, body: formData, isFormData: true }),

  putForm: <T = any>(path: string, formData: FormData) =>
    request<T>({ method: 'PUT', path, body: formData, isFormData: true }),
};

export { BASE_URL, TOKEN_KEYS };
