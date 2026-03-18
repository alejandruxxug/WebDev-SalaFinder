// shows when user is blocked (2 no-shows = 7-day block)
import { isBlocked, getSessionUser } from '../../utils/auth'

export default function BlockedBanner() {
  if (!isBlocked()) return null
  const user = getSessionUser()
  const until = user?.blockedUntil ?? ''

  return (
    <div className="border-b border-amber-400 bg-amber-50 px-6 py-3 text-center text-amber-800 text-sm">
      Your account is blocked until {until}. You cannot make new reservations. Contact admin.
    </div>
  )
}
