// conflict detection - no overlapping approved reservations for same space
import { getReservations } from './storage'
import type { Reservation } from '../types'

function parseTime(date: string, time: string): number {
  const [h, m] = time.split(':').map(Number)
  return new Date(`${date}T${h}:${m ?? 0}:00`).getTime()
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
    if (r.spaceId !== spaceId || r.status !== 'Approved') continue
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
    if (r.spaceId !== spaceId || r.status !== 'Approved') continue
    if (excludeReservationId && r.id === excludeReservationId) continue

    const rStart = parseTime(r.date, r.startTime)
    const rEnd = parseTime(r.date, r.endTime)
    if (start < rEnd && end > rStart) conflicts.push(r)
  }
  return conflicts
}
