// seed reservations - 30 for prototype, uses startTime/endTime
import type { Reservation } from '../types'
import { spaces } from './spaces'

const spaceName = (id: number) => spaces.find(s => s.id === id)?.name ?? 'Unknown'

export const reservations: Reservation[] = [
  { id: 1, spaceId: 1, space: spaceName(1), userId: 1, date: '2026-03-10', startTime: '09:00', endTime: '10:00', status: 'Approved', purpose: 'Meeting', attendeeCount: 5 },
  { id: 2, spaceId: 2, space: spaceName(2), userId: 4, date: '2026-03-11', startTime: '10:00', endTime: '11:00', status: 'Approved', purpose: 'Lab', attendeeCount: 10 },
  { id: 3, spaceId: 3, space: spaceName(3), userId: 5, date: '2026-03-11', startTime: '11:00', endTime: '12:00', status: 'Rejected', purpose: 'Practice', attendeeCount: 8 },
  { id: 4, spaceId: 1, space: spaceName(1), userId: 4, date: '2026-03-12', startTime: '09:00', endTime: '10:00', status: 'Cancelled', purpose: 'Study', attendeeCount: 3 },
  { id: 5, spaceId: 5, space: spaceName(5), userId: 2, date: '2026-03-12', startTime: '14:00', endTime: '16:00', status: 'Approved', purpose: 'Workshop', attendeeCount: 20 },
  { id: 6, spaceId: 1, space: spaceName(1), userId: 7, date: '2026-03-13', startTime: '10:00', endTime: '11:00', status: 'Approved', purpose: 'Class', attendeeCount: 15 },
  { id: 7, spaceId: 2, space: spaceName(2), userId: 8, date: '2026-03-13', startTime: '11:00', endTime: '12:00', status: 'Pending', purpose: 'Lab', attendeeCount: 12 },
  { id: 8, spaceId: 3, space: spaceName(3), userId: 9, date: '2026-03-13', startTime: '13:00', endTime: '14:00', status: 'Pending', purpose: 'Practice', attendeeCount: 10 },
  { id: 9, spaceId: 5, space: spaceName(5), userId: 10, date: '2026-03-13', startTime: '14:00', endTime: '15:00', status: 'Approved', purpose: 'Tutorial', attendeeCount: 18 },
  { id: 10, spaceId: 1, space: spaceName(1), userId: 11, date: '2026-03-13', startTime: '10:30', endTime: '11:30', status: 'Rejected', purpose: 'Conflict test', attendeeCount: 5 },
  { id: 11, spaceId: 6, space: spaceName(6), userId: 11, date: '2026-03-13', startTime: '16:00', endTime: '17:00', status: 'Approved', purpose: 'Match', attendeeCount: 22 },
  { id: 12, spaceId: 2, space: spaceName(2), userId: 12, date: '2026-03-14', startTime: '09:00', endTime: '10:00', status: 'Cancelled', purpose: 'Lab', attendeeCount: 8 },
  { id: 13, spaceId: 1, space: spaceName(1), userId: 13, date: '2026-03-14', startTime: '10:00', endTime: '11:00', status: 'Pending', purpose: 'Study', attendeeCount: 6 },
  { id: 14, spaceId: 3, space: spaceName(3), userId: 14, date: '2026-03-14', startTime: '14:00', endTime: '15:00', status: 'Approved', purpose: 'Training', attendeeCount: 15 },
  { id: 15, spaceId: 5, space: spaceName(5), userId: 15, date: '2026-03-14', startTime: '15:00', endTime: '16:00', status: 'Approved', purpose: 'Seminar', attendeeCount: 20 },
  { id: 16, spaceId: 1, space: spaceName(1), userId: 4, date: '2026-03-15', startTime: '09:00', endTime: '10:00', status: 'Approved', purpose: 'Class', attendeeCount: 12 },
  { id: 17, spaceId: 2, space: spaceName(2), userId: 5, date: '2026-03-15', startTime: '11:00', endTime: '12:00', status: 'Pending', purpose: 'Lab', attendeeCount: 10 },
  { id: 18, spaceId: 6, space: spaceName(6), userId: 7, date: '2026-03-15', startTime: '13:00', endTime: '14:00', status: 'Approved', purpose: 'Match', attendeeCount: 30 },
  { id: 19, spaceId: 1, space: spaceName(1), userId: 8, date: '2026-03-16', startTime: '10:00', endTime: '11:00', status: 'Approved', purpose: 'Tutorial', attendeeCount: 15 },
  { id: 20, spaceId: 3, space: spaceName(3), userId: 9, date: '2026-03-16', startTime: '14:00', endTime: '15:00', status: 'Pending', purpose: 'Practice', attendeeCount: 8 },
  { id: 21, spaceId: 5, space: spaceName(5), userId: 10, date: '2026-03-16', startTime: '09:00', endTime: '10:00', status: 'Approved', purpose: 'Workshop', attendeeCount: 22 },
  { id: 22, spaceId: 2, space: spaceName(2), userId: 11, date: '2026-03-17', startTime: '10:00', endTime: '11:00', status: 'Rejected', purpose: 'Lab', attendeeCount: 14 },
  { id: 23, spaceId: 1, space: spaceName(1), userId: 12, date: '2026-03-17', startTime: '11:00', endTime: '12:00', status: 'Approved', purpose: 'Study', attendeeCount: 8 },
  { id: 24, spaceId: 6, space: spaceName(6), userId: 13, date: '2026-03-17', startTime: '15:00', endTime: '16:00', status: 'Approved', purpose: 'Match', attendeeCount: 25 },
  { id: 25, spaceId: 3, space: spaceName(3), userId: 14, date: '2026-03-18', startTime: '09:00', endTime: '10:00', status: 'Pending', purpose: 'Training', attendeeCount: 12 },
  { id: 26, spaceId: 5, space: spaceName(5), userId: 15, date: '2026-03-18', startTime: '14:00', endTime: '15:00', status: 'Approved', purpose: 'Seminar', attendeeCount: 18 },
  { id: 27, spaceId: 1, space: spaceName(1), userId: 4, date: '2026-03-19', startTime: '10:00', endTime: '11:00', status: 'Approved', purpose: 'Class', attendeeCount: 10 },
  { id: 28, spaceId: 2, space: spaceName(2), userId: 7, date: '2026-03-19', startTime: '13:00', endTime: '14:00', status: 'Pending', purpose: 'Lab', attendeeCount: 11 },
  { id: 29, spaceId: 6, space: spaceName(6), userId: 8, date: '2026-03-19', startTime: '16:00', endTime: '17:00', status: 'Approved', purpose: 'Match', attendeeCount: 20 },
  { id: 30, spaceId: 3, space: spaceName(3), userId: 9, date: '2026-03-20', startTime: '11:00', endTime: '12:00', status: 'Approved', purpose: 'Practice', attendeeCount: 6 },
]
