// no-show policy: 2 no-shows = 7-day block; marking no-show cancels the reservation
import { getUsers, saveUsers, getReservations, saveReservations } from './storage'
import { logAudit } from './auditService'

export function markNoShow(userId: number, reservationId: number, adminUserId: number): void {
  const users = getUsers()
  const idx = users.findIndex((u) => u.id === userId)
  if (idx === -1) return
  users[idx].noShowCount += 1
  if (users[idx].noShowCount >= 2 && users[idx].role !== 'Admin') {
    const d = new Date()
    d.setDate(d.getDate() + 7)
    users[idx].blockedUntil = d.toISOString().slice(0, 10)
  }
  saveUsers(users)
  logAudit(adminUserId, 'NO_SHOW', 'user', userId, `No-show #${users[idx].noShowCount}`)

  // Cancel the reservation so it's removed from calendar and frees the slot
  const reservations = getReservations()
  const resIdx = reservations.findIndex((r) => r.id === reservationId)
  if (resIdx !== -1) {
    reservations[resIdx] = { ...reservations[resIdx], status: 'Cancelled' }
    saveReservations(reservations)
    logAudit(adminUserId, 'NO_SHOW', 'reservation', reservationId, 'Cancelled due to no-show')
  }
}
