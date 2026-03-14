/**
 * auth.ts - Session helpers
 *
 * Session is stored in localStorage under SESSION_KEY.
 * getSessionUser() returns the logged-in user or null.
 * isLoggedIn() is a convenience check. logout() clears the session.
 */
export const SESSION_KEY = 'salafinder_session'

export interface SessionUser {
  id: number
  name: string
  email: string
  role: string
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

export function logout(): void {
  localStorage.removeItem(SESSION_KEY)
}
