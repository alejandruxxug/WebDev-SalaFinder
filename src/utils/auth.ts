// session check, logout, blocked check - prototype

export const SESSION_KEY = 'salafinder_session'

export interface SessionUser {
  id: number
  name: string
  email: string
  role: string
  noShowCount: number
  blockedUntil?: string
  major?: string
}

export function getSessionUser(): SessionUser | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    return parsed?.user ?? null
  } catch {
    return null
  }
}

export function isLoggedIn(): boolean {
  const user = getSessionUser()
  return !!(user?.email)
}

export function isBlocked(): boolean {
  const user = getSessionUser()
  if (!user?.blockedUntil) return false
  if (user.role === 'Admin') return false // admins cannot be blocked
  return new Date(user.blockedUntil) > new Date()
}

export function isAdmin(): boolean {
  return getSessionUser()?.role === 'Admin'
}

export function logout(): void {
  localStorage.removeItem(SESSION_KEY)
}
