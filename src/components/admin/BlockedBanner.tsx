/**
 * BlockedBanner.tsx - Shown when user is blocked
 *
 * Business rule: blocked users cannot create reservations.
 * Displayed at top of app when isBlocked() is true.
 */
import { isBlocked } from '../../utils/auth'

export default function BlockedBanner() {
  if (!isBlocked()) return null

  return (
    <div
      className="bg-red-900/80 px-6 py-3 text-center text-sm text-red-100"
      role="alert"
      aria-live="assertive"
    >
      Your account is temporarily blocked. You cannot create new reservations. Contact admin for assistance.
    </div>
  )
}
