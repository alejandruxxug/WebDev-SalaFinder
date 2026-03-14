/**
 * types.ts - TypeScript type definitions
 *
 * Defines the shape of data used across the app.
 * Space: room/lab/court with capacity, status, etc.
 * Reservation: booking for a space by a user.
 * User: account with name, email, role.
 */
export type SpaceStatus = 'AVAILABLE' | 'UNAVAILABLE'
export type SpaceType = 'Class' | 'Lab' | 'Court'
export type ReservationStatus = 'Pending' | 'Approved' | 'Rejected' | 'Cancelled'
export type UserRole = 'Student' | 'Staff' | 'Admin'

export interface Space {
  id: number
  name: string
  type: SpaceType
  capacity: number
  status: SpaceStatus
  building: string
  resources: string[]
  allowedPrograms: string[]
  requiresApproval: boolean
}

export interface Reservation {
  id: number
  spaceId: number
  space: string
  userId: number
  date: string
  startTime: string
  endTime: string
  status: ReservationStatus
  purpose?: string
  attendeeCount?: number
}

export interface User {
  id: number
  name: string
  email: string
  password: string
  role: UserRole
  noShowCount: number
  blockedUntil?: string
}
