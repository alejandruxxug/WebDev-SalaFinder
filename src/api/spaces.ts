import { apiDelete, apiGet, apiPost, apiPut, toApiDate, toApiTime, type ApiResult } from './apiClient'
import type { Space } from '../types'

interface SpaceResponseDto {
  id: string
  name: string
  type: string
  capacity: number
  building: string
  resources: string[] | null
  allowedPrograms: string[] | null
  requiresApproval: boolean
  isActive: boolean
}

export interface SpaceFilters {
  type?: string
  minCapacity?: number
  building?: string
  resource?: string
  date?: string
  startTime?: string
  endTime?: string
}

function mapSpace(dto: SpaceResponseDto): Space {
  return {
    id: dto.id,
    name: dto.name,
    type: dto.type,
    capacity: dto.capacity,
    building: dto.building,
    resources: dto.resources ?? [],
    allowedPrograms: dto.allowedPrograms ?? [],
    requiresApproval: dto.requiresApproval,
    isActive: dto.isActive,
    status: dto.isActive ? 'AVAILABLE' : 'UNAVAILABLE',
  }
}

function filterQuery(filters?: SpaceFilters) {
  if (!filters) return {}
  return {
    type: filters.type,
    minCapacity: filters.minCapacity,
    building: filters.building,
    resource: filters.resource,
    date: filters.date ? toApiDate(filters.date) : undefined,
    startTime: filters.startTime ? toApiTime(filters.startTime) : undefined,
    endTime: filters.endTime ? toApiTime(filters.endTime) : undefined,
  }
}

export async function fetchSpaces(filters?: SpaceFilters): Promise<ApiResult<Space[]>> {
  const res = await apiGet<SpaceResponseDto[]>('/api/spaces', filterQuery(filters))
  if (!res.ok) return res
  return { ok: true, data: res.data.map(mapSpace), error: null }
}

export async function fetchSpaceById(id: string): Promise<ApiResult<Space>> {
  const res = await apiGet<SpaceResponseDto>(`/api/spaces/${id}`)
  if (!res.ok) return res
  return { ok: true, data: mapSpace(res.data), error: null }
}

export async function fetchAvailableSpaces(filters?: SpaceFilters): Promise<ApiResult<Space[]>> {
  const res = await apiGet<SpaceResponseDto[]>('/api/spaces/available', filterQuery(filters))
  if (!res.ok) return res
  return { ok: true, data: res.data.map(mapSpace), error: null }
}

export interface CreateSpaceInput {
  name: string
  type: string
  capacity: number
  building: string
  resources?: string
  allowedPrograms?: string
  requiresApproval?: boolean
}

export async function createSpace(input: CreateSpaceInput): Promise<ApiResult<Space>> {
  const res = await apiPost<SpaceResponseDto>('/api/spaces', input)
  if (!res.ok) return res
  return { ok: true, data: mapSpace(res.data), error: null }
}

export interface UpdateSpaceInput {
  name?: string
  type?: string
  capacity?: number
  building?: string
  resources?: string
  allowedPrograms?: string
  requiresApproval?: boolean
  isActive?: boolean
}

export async function updateSpace(id: string, input: UpdateSpaceInput): Promise<ApiResult<Space>> {
  const res = await apiPut<SpaceResponseDto>(`/api/spaces/${id}`, input)
  if (!res.ok) return res
  return { ok: true, data: mapSpace(res.data), error: null }
}

export async function deleteSpace(id: string): Promise<ApiResult<void>> {
  return apiDelete(`/api/spaces/${id}`)
}
