// no-show policy: 2 no-shows = 7-day block
import { getUsers, saveUsers } from './storage'
import { logAudit } from './auditService'

export function markNoShow(userId: number, _reservationId: number, adminUserId: number): void {
  const users = getUsers()
  const idx = users.findIndex((u) => u.id === userId)
  if (idx === -1) return
  users[idx].noShowCount += 1
  if (users[idx].noShowCount >= 2) {
    const d = new Date()
    d.setDate(d.getDate() + 7)
    users[idx].blockedUntil = d.toISOString().slice(0, 10)
  }
  saveUsers(users)
  logAudit(adminUserId, 'NO_SHOW', 'user', userId, `No-show #${users[idx].noShowCount}`)
}
