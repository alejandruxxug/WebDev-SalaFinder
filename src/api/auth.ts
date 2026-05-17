import { apiGet, apiPost, type ApiResult } from './apiClient'
import { getSessionUser, setSessionUser, patchSessionUser, type SessionUser } from '../utils/auth'
import type { UserRole } from '../types'

interface AuthResponseDto {
  token: string
  email: string
  fullName: string
  role: UserRole
  expiresAt: string
}

interface MeResponseDto {
  id: string
  fullName: string
  email: string
  program?: string
  isBlocked: boolean
  blockedUntil?: string | null
  noShowCount: number
  role: UserRole
}

interface RegisterResponseDto {
  message: string
  userId: string
  role: UserRole
}

export async function login(
  email: string,
  password: string,
): Promise<ApiResult<SessionUser>> {
  const res = await apiPost<AuthResponseDto>('/api/auth/login', { email, password })
  if (!res.ok) return res
  const auth = res.data
  setSessionUser({
    token: auth.token,
    expiresAt: auth.expiresAt,
    id: '',
    email: auth.email,
    fullName: auth.fullName,
    role: auth.role,
    isBlocked: false,
    noShowCount: 0,
  })
  return fetchMe()
}

export async function register(input: {
  fullName: string
  email: string
  password: string
  program: string
  role?: UserRole
}): Promise<ApiResult<RegisterResponseDto>> {
  return apiPost<RegisterResponseDto>('/api/auth/register', {
    fullName: input.fullName,
    email: input.email,
    password: input.password,
    program: input.program,
    role: input.role ?? 'Student',
  })
}

export async function fetchMe(): Promise<ApiResult<SessionUser>> {
  const res = await apiGet<MeResponseDto>('/api/auth/me')
  if (!res.ok) return res
  const me = res.data
  patchSessionUser({
    id: me.id,
    fullName: me.fullName,
    email: me.email,
    role: me.role,
    program: me.program,
    isBlocked: me.isBlocked,
    blockedUntil: me.blockedUntil ?? undefined,
    noShowCount: me.noShowCount,
  })
  const fresh = getSessionUser()
  if (!fresh) {
    return { ok: false, data: null, error: 'No se pudo obtener la sesión' }
  }
  return { ok: true, data: fresh, error: null }
}

export interface AdminUser {
  id: string
  fullName: string
  email: string
  program?: string
  isBlocked: boolean
  blockedUntil?: string | null
  noShowCount: number
}

export async function listUsers(): Promise<ApiResult<AdminUser[]>> {
  return apiGet<AdminUser[]>('/api/auth/users')
}
