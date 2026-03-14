/**
 * conflictService.ts - Business rule: no overlapping reservations
 *
 * A space cannot have two approved reservations at the same date/time.
 * Only Approved reservations block; Pending/Rejected/Cancelled do not.
 */
import { getReservations } from './storage'
import type { Reservation } from '../types'

export function hasConflict(spaceId: number, date: string, startTime: string, endTime: string): boolean {
  const reservations = getReservations()
  const approved = reservations.filter((r) => r.spaceId === spaceId && r.status === 'Approved')
  return approved.some((r) => timesOverlap(r.date, r.startTime, r.endTime, date, startTime, endTime))
}

function timesOverlap(
  d1: string,
  s1: string,
  e1: string,
  d2: string,
  s2: string,
  e2: string
): boolean {
  if (d1 !== d2) return false
  const toMin = (s: string) => {
    const [h, m] = s.split(':').map(Number)
    return h * 60 + m
  }
  const start1 = toMin(s1)
  const end1 = toMin(e1)
  const start2 = toMin(s2)
  const end2 = toMin(e2)
  return start1 < end2 && start2 < end1
}

export function getConflictingReservations(
  spaceId: number,
  date: string,
  startTime: string,
  endTime: string
): Reservation[] {
  const reservations = getReservations()
  return reservations.filter(
    (r) =>
      r.spaceId === spaceId &&
      r.status === 'Approved' &&
      timesOverlap(r.date, r.startTime, r.endTime, date, startTime, endTime)
  )
}
