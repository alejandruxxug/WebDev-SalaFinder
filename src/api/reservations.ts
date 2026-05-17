import {
  apiDelete,
  apiGet,
  apiPatch,
  apiPost,
  fromApiDate,
  fromApiTime,
  toApiDate,
  toApiTime,
  type ApiResult,
} from './apiClient'
import type {
  AlternativeSlot,
  AuditLog,
  ConflictInfo,
  Reservation,
  ReservationStatus,
} from '../types'

interface ReservationResponseDto {
  id: string
  spaceId: string
  spaceName: string
  spaceBuilding: string
  userId: string
  userFullName: string
  date: string
  startTime: string
  endTime: string
  purpose: string
  attendeeCount: number
  status: ReservationStatus
  createdAt: string
  approvedByName?: string | null
  approvedAt?: string | null
  rejectionReason?: string | null
}

interface AlternativeSlotDto {
  date: string
  startTime: string
  endTime: string
  spaceName: string
  spaceId: string
}

interface ConflictInfoDto {
  hasConflict: boolean
  conflictingReservations: ReservationResponseDto[]
  alternativeSlots: AlternativeSlotDto[]
}

interface AuditLogResponseDto {
  id: string
  reservationId?: string | null
  userFullName?: string | null
  action: string
  details?: string | null
  timestamp: string
  previousStatus?: ReservationStatus | null
  newStatus?: ReservationStatus | null
}

function mapReservation(dto: ReservationResponseDto): Reservation {
  return {
    id: dto.id,
    spaceId: dto.spaceId,
    space: dto.spaceName,
    spaceBuilding: dto.spaceBuilding,
    userId: dto.userId,
    userFullName: dto.userFullName,
    date: fromApiDate(dto.date),
    startTime: fromApiTime(dto.startTime),
    endTime: fromApiTime(dto.endTime),
    status: dto.status,
    purpose: dto.purpose,
    attendeeCount: dto.attendeeCount,
    createdAt: dto.createdAt,
    approvedByName: dto.approvedByName ?? undefined,
    approvedAt: dto.approvedAt ?? undefined,
    rejectionReason: dto.rejectionReason ?? undefined,
  }
}

function mapAlternative(dto: AlternativeSlotDto): AlternativeSlot {
  return {
    date: fromApiDate(dto.date),
    startTime: fromApiTime(dto.startTime),
    endTime: fromApiTime(dto.endTime),
    spaceName: dto.spaceName,
    spaceId: dto.spaceId,
  }
}

function mapAuditLog(dto: AuditLogResponseDto): AuditLog {
  return {
    id: dto.id,
    reservationId: dto.reservationId ?? undefined,
    userFullName: dto.userFullName ?? undefined,
    action: dto.action,
    details: dto.details ?? undefined,
    timestamp: dto.timestamp,
    previousStatus: dto.previousStatus ?? undefined,
    newStatus: dto.newStatus ?? undefined,
  }
}

export async function fetchAllReservations(params?: {
  userId?: string
  status?: ReservationStatus
}): Promise<ApiResult<Reservation[]>> {
  const res = await apiGet<ReservationResponseDto[]>('/api/reservations', params)
  if (!res.ok) return res
  return { ok: true, data: res.data.map(mapReservation), error: null }
}

export async function fetchMyReservations(params?: {
  status?: ReservationStatus
}): Promise<ApiResult<Reservation[]>> {
  const res = await apiGet<ReservationResponseDto[]>('/api/reservations/my', params)
  if (!res.ok) return res
  return { ok: true, data: res.data.map(mapReservation), error: null }
}

export async function fetchReservation(id: string): Promise<ApiResult<Reservation>> {
  const res = await apiGet<ReservationResponseDto>(`/api/reservations/${id}`)
  if (!res.ok) return res
  return { ok: true, data: mapReservation(res.data), error: null }
}

export async function checkConflict(input: {
  spaceId: string
  date: string
  startTime: string
  endTime: string
}): Promise<ApiResult<ConflictInfo>> {
  const res = await apiGet<ConflictInfoDto>('/api/reservations/check-conflict', {
    spaceId: input.spaceId,
    date: toApiDate(input.date),
    startTime: toApiTime(input.startTime),
    endTime: toApiTime(input.endTime),
  })
  if (!res.ok) return res
  const dto = res.data
  return {
    ok: true,
    error: null,
    data: {
      hasConflict: dto.hasConflict,
      conflictingReservations: dto.conflictingReservations.map(mapReservation),
      alternativeSlots: dto.alternativeSlots.map(mapAlternative),
    },
  }
}

export async function createReservation(input: {
  spaceId: string
  date: string
  startTime: string
  endTime: string
  purpose: string
  attendeeCount: number
}): Promise<ApiResult<Reservation>> {
  const res = await apiPost<ReservationResponseDto>('/api/reservations', {
    spaceId: input.spaceId,
    date: toApiDate(input.date),
    startTime: toApiTime(input.startTime),
    endTime: toApiTime(input.endTime),
    purpose: input.purpose,
    attendeeCount: input.attendeeCount,
  })
  if (!res.ok) return res
  return { ok: true, data: mapReservation(res.data), error: null }
}

export async function updateReservationStatus(
  id: string,
  input: { newStatus: ReservationStatus; reason?: string },
): Promise<ApiResult<Reservation>> {
  const res = await apiPatch<ReservationResponseDto>(`/api/reservations/${id}/status`, {
    newStatus: input.newStatus,
    reason: input.reason,
  })
  if (!res.ok) return res
  return { ok: true, data: mapReservation(res.data), error: null }
}

export async function cancelReservation(id: string): Promise<ApiResult<void>> {
  return apiDelete(`/api/reservations/${id}`)
}

export async function markNoShow(id: string): Promise<ApiResult<{ message: string }>> {
  return apiPost<{ message: string }>(`/api/reservations/${id}/no-show`)
}

export async function fetchAuditLog(params?: {
  reservationId?: string
}): Promise<ApiResult<AuditLog[]>> {
  const res = await apiGet<AuditLogResponseDto[]>('/api/reservations/audit', params)
  if (!res.ok) return res
  return { ok: true, data: res.data.map(mapAuditLog), error: null }
}

export async function unblockUsers(): Promise<ApiResult<{ message: string }>> {
  return apiPost<{ message: string }>('/api/reservations/unblock-users')
}
