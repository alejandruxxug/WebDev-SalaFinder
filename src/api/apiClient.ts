// Thin fetch wrapper used by every api module.
// Reads the API base URL from VITE_API_BASE_URL and attaches the JWT bearer.

import { getToken, logout } from '../utils/auth'

const BASE = (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/$/, '')

export type ApiResult<T> =
  | { ok: true; data: T; error: null }
  | { ok: false; data: null; error: string }

const fail = (error: string): { ok: false; data: null; error: string } => ({
  ok: false,
  data: null,
  error,
})
const success = <T>(data: T): { ok: true; data: T; error: null } => ({
  ok: true,
  data,
  error: null,
})

interface RequestOptions {
  body?: unknown
  query?: Record<string, string | number | boolean | undefined | null>
  headers?: Record<string, string>
}

function buildQuery(query?: RequestOptions['query']): string {
  if (!query) return ''
  const params = new URLSearchParams()
  for (const [k, v] of Object.entries(query)) {
    if (v === undefined || v === null || v === '') continue
    params.append(k, String(v))
  }
  const s = params.toString()
  return s ? `?${s}` : ''
}

async function request<T>(
  method: string,
  path: string,
  options: RequestOptions = {},
): Promise<ApiResult<T>> {
  const url = `${BASE}${path}${buildQuery(options.query)}`
  const headers: Record<string, string> = {
    Accept: 'application/json',
    ...(options.headers ?? {}),
  }
  if (options.body !== undefined) headers['Content-Type'] = 'application/json'
  const token = getToken()
  if (token) headers.Authorization = `Bearer ${token}`

  let res: Response
  try {
    res = await fetch(url, {
      method,
      headers,
      body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
    })
  } catch {
    return fail('Error de red. Verifica tu conexión.')
  }

  if (res.status === 204) return success(undefined as T)

  if (res.status === 401) {
    logout()
    return fail('Sesión expirada. Inicia sesión nuevamente.')
  }

  const text = await res.text()
  let payload: unknown = null
  if (text) {
    try {
      payload = JSON.parse(text)
    } catch {
      payload = text
    }
  }

  if (!res.ok) {
    return fail(extractError(payload, res.status))
  }

  return success(payload as T)
}

function extractError(payload: unknown, status: number): string {
  if (payload && typeof payload === 'object') {
    const obj = payload as Record<string, unknown>
    if (typeof obj.message === 'string') return obj.message
    if (typeof obj.title === 'string') return obj.title
    if (obj.errors && typeof obj.errors === 'object') {
      const all: string[] = []
      for (const v of Object.values(obj.errors as Record<string, unknown>)) {
        if (Array.isArray(v)) all.push(...v.map(String))
        else if (typeof v === 'string') all.push(v)
      }
      if (all.length) return all.join(' ')
    }
  }
  if (typeof payload === 'string' && payload.trim()) return payload
  return `Error ${status}`
}

export const apiGet = <T>(path: string, query?: RequestOptions['query']) =>
  request<T>('GET', path, { query })
export const apiPost = <T>(path: string, body?: unknown) =>
  request<T>('POST', path, { body })
export const apiPut = <T>(path: string, body?: unknown) =>
  request<T>('PUT', path, { body })
export const apiPatch = <T>(path: string, body?: unknown) =>
  request<T>('PATCH', path, { body })
export const apiDelete = <T = void>(path: string) =>
  request<T>('DELETE', path, {})

// === Date / time helpers ============================================
// Frontend keeps dates as 'YYYY-MM-DD' and times as 'HH:mm'.
// Backend expects DateTime (ISO 8601) and TimeSpan ('HH:mm:ss').

export function toApiDate(date: string): string {
  return `${date}T00:00:00`
}

export function toApiTime(time: string): string {
  return time.length === 5 ? `${time}:00` : time
}

export function fromApiDate(input: string | null | undefined): string {
  if (!input) return ''
  return input.slice(0, 10)
}

export function fromApiTime(input: string | null | undefined): string {
  if (!input) return ''
  // backend returns '14:30:00' or sometimes 'PT14H30M'-style; slice the simple form
  return input.length >= 5 ? input.slice(0, 5) : input
}
