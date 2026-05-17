// JWT-backed session stored in localStorage

import type { UserRole } from '../types'

export const SESSION_KEY = 'salafinder_session'

export interface SessionUser {
  token: string
  expiresAt: string
  id: string
  email: string
  fullName: string
  role: UserRole
  program?: string
  isBlocked: boolean
  blockedUntil?: string
  noShowCount: number
}

export function getSessionUser(): SessionUser | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY)
    if (!raw) return null
    return JSON.parse(raw) as SessionUser
  } catch {
    return null
  }
}

export function setSessionUser(user: SessionUser): void {
  localStorage.setItem(SESSION_KEY, JSON.stringify(user))
}

export function patchSessionUser(patch: Partial<SessionUser>): void {
  const current = getSessionUser()
  if (!current) return
  setSessionUser({ ...current, ...patch })
}

export function getToken(): string | null {
  const user = getSessionUser()
  if (!user) return null
  if (new Date(user.expiresAt) <= new Date()) return null
  return user.token
}

export function isLoggedIn(): boolean {
  return getToken() !== null
}

export function isBlocked(): boolean {
  const user = getSessionUser()
  if (!user) return false
  if (user.role === 'Admin') return false
  return user.isBlocked === true
}

export function isAdmin(): boolean {
  return getSessionUser()?.role === 'Admin'
}

export function isStaff(): boolean {
  return getSessionUser()?.role === 'Staff'
}

export function isAdminOrStaff(): boolean {
  const role = getSessionUser()?.role
  return role === 'Admin' || role === 'Staff'
}

export function logout(): void {
  localStorage.removeItem(SESSION_KEY)
}
