// conflict detection - no overlapping reservations for same space
// Pending and Approved both block; Rejected and Cancelled do not
import { getReservations } from './storage'
import type { Reservation } from '../types'

const BLOCKING_STATUSES: Reservation['status'][] = ['Pending', 'Approved']

function parseTime(date: string, time: string): number {
  return new Date(`${date}T${time}:00`).getTime()
}

export function hasConflict(
  spaceId: number,
  date: string,
  startTime: string,
  endTime: string,
  excludeReservationId?: number
): boolean {
  const reservations = getReservations()
  const start = parseTime(date, startTime)
  const end = parseTime(date, endTime)

  for (const r of reservations) {
    if (r.spaceId !== spaceId || !BLOCKING_STATUSES.includes(r.status)) continue
    if (excludeReservationId && r.id === excludeReservationId) continue

    const rStart = parseTime(r.date, r.startTime)
    const rEnd = parseTime(r.date, r.endTime)
    if (start < rEnd && end > rStart) return true
  }
  return false
}

export function getConflictingReservations(
  spaceId: number,
  date: string,
  startTime: string,
  endTime: string,
  excludeReservationId?: number
): Reservation[] {
  const reservations = getReservations()
  const start = parseTime(date, startTime)
  const end = parseTime(date, endTime)
  const conflicts: Reservation[] = []

  for (const r of reservations) {
    if (r.spaceId !== spaceId || !BLOCKING_STATUSES.includes(r.status)) continue
    if (excludeReservationId && r.id === excludeReservationId) continue

    const rStart = parseTime(r.date, r.startTime)
    const rEnd = parseTime(r.date, r.endTime)
    if (start < rEnd && end > rStart) conflicts.push(r)
  }
  return conflicts
}
