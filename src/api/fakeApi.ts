/**
 * fakeApi.ts - Simulated backend API
 *
 * Wraps storage with async promises, loading delay, and optional error simulation.
 * All calls return: loading → success (data) or error (message).
 * Business rules (conflicts, blocked users) are enforced in the frontend.
 */
import * as storage from '../services/storage'
import type { Space, Reservation, User } from '../types'

const DELAY_MS = 400

/** Simulate network delay */
function delay(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms))
}

/** Simulate random failure (5% chance) - for testing error states */
function shouldSimulateError(): boolean {
  return typeof window !== 'undefined' && window.location.search.includes('simulateError=1')
}

export type ApiResult<T> = { data: T; error: null } | { data: null; error: string }

/** Fetch all spaces. Returns loading then success/error. */
export async function fetchSpaces(): Promise<ApiResult<Space[]>> {
  await delay(DELAY_MS)
  if (shouldSimulateError()) {
    return { data: null, error: 'Network error: Could not load spaces. Please try again.' }
  }
  const data = storage.getSpaces()
  return { data: [...data], error: null }
}

/** Fetch single space by ID */
export async function fetchSpaceById(id: number): Promise<ApiResult<Space | null>> {
  await delay(DELAY_MS)
  if (shouldSimulateError()) {
    return { data: null, error: 'Network error: Could not load space details.' }
  }
  const spaces = storage.getSpaces()
  const space = spaces.find((s) => s.id === id) ?? null
  return { data: space, error: null }
}

/** Fetch all reservations */
export async function fetchReservations(): Promise<ApiResult<Reservation[]>> {
  await delay(DELAY_MS)
  if (shouldSimulateError()) {
    return { data: null, error: 'Network error: Could not load reservations.' }
  }
  const data = storage.getReservations()
  return { data: [...data], error: null }
}

/** Create reservation. Business rules (conflict, blocked) checked by caller. */
export async function createReservation(reservation: Omit<Reservation, 'id'>): Promise<ApiResult<Reservation>> {
  await delay(DELAY_MS)
  if (shouldSimulateError()) {
    return { data: null, error: 'Network error: Could not save reservation. Please try again.' }
  }
  const all = storage.getReservations()
  const nextId = all.length ? Math.max(...all.map((r) => r.id)) + 1 : 1
  const newRes: Reservation = { ...reservation, id: nextId }
  all.push(newRes)
  storage.saveReservations(all)
  return { data: newRes, error: null }
}

/** Update reservation status (approve/reject/cancel) */
export async function updateReservationStatus(id: number, status: Reservation['status']): Promise<ApiResult<Reservation>> {
  await delay(DELAY_MS)
  if (shouldSimulateError()) {
    return { data: null, error: 'Network error: Could not update reservation.' }
  }
  const all = storage.getReservations()
  const idx = all.findIndex((r) => r.id === id)
  if (idx === -1) return { data: null, error: 'Reservation not found.' }
  all[idx] = { ...all[idx], status }
  storage.saveReservations(all)
  return { data: all[idx], error: null }
}

/** Fetch users (for login validation) */
export async function fetchUsers(): Promise<ApiResult<User[]>> {
  await delay(DELAY_MS)
  if (shouldSimulateError()) {
    return { data: null, error: 'Network error: Could not authenticate.' }
  }
  const data = storage.getUsers()
  return { data: [...data], error: null }
}
