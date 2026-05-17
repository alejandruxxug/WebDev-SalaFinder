// type definitions — aligned with backend DTOs

export type SpaceStatus = 'AVAILABLE' | 'UNAVAILABLE'
export type SpaceType = 'Class' | 'Lab' | 'Court' | 'Classroom' | 'Auditorium' | 'MeetingRoom' | string
export type ReservationStatus = 'Pending' | 'Approved' | 'Rejected' | 'Cancelled' | 'NoShow'
export type UserRole = 'Student' | 'Staff' | 'Admin'

export interface Space {
  id: string
  name: string
  type: SpaceType
  capacity: number
  status: SpaceStatus
  building: string
  resources: string[]
  allowedPrograms: string[]
  requiresApproval: boolean
  isActive?: boolean
}

export interface Reservation {
  id: string
  spaceId: string
  space: string
  spaceBuilding?: string
  userId: string
  userFullName?: string
  date: string
  startTime: string
  endTime: string
  status: ReservationStatus
  purpose?: string
  attendeeCount?: number
  createdAt?: string
  approvedByName?: string
  approvedAt?: string
  rejectionReason?: string
}

export interface User {
  id: string
  fullName: string
  email: string
  role: UserRole
  program?: string
  noShowCount: number
  isBlocked?: boolean
  blockedUntil?: string
}

export interface AuditLog {
  id: string
  reservationId?: string
  userFullName?: string
  action: string
  details?: string
  timestamp: string
  previousStatus?: ReservationStatus | null
  newStatus?: ReservationStatus | null
}

export interface AlternativeSlot {
  date: string
  startTime: string
  endTime: string
  spaceName: string
  spaceId: string
}

export interface ConflictInfo {
  hasConflict: boolean
  conflictingReservations: Reservation[]
  alternativeSlots: AlternativeSlot[]
}
