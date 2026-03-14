/**
 * storage.ts - localStorage data layer
 *
 * Provides get/save functions for spaces, users, and reservations.
 * On first load, if localStorage is empty, seeds from data files.
 * This simulates a backend - in a real app you'd call an API instead.
 */
import type { Space, Reservation, User } from '../types'
import { spaces as seedSpaces } from '../data/spaces'
import { users as seedUsers } from '../data/users'
import { reservations as seedReservations } from '../data/reservations'

const KEYS = {
  spaces: 'salafinder_spaces',
  users: 'salafinder_users',
  reservations: 'salafinder_reservations',
}

/** Load from localStorage or return seed data if empty */
function load<T>(key: string, seed: T[]): T[] {
  try {
    const raw = localStorage.getItem(key)
    if (raw) return JSON.parse(raw)
  } catch {}
  return seed
}

/** Save array to localStorage */
function save<T>(key: string, data: T[]) {
  localStorage.setItem(key, JSON.stringify(data))
}

export function getSpaces(): Space[] {
  return load(KEYS.spaces, seedSpaces)
}

export function saveSpaces(items: Space[]) {
  save(KEYS.spaces, items)
}

export function getUsers(): User[] {
  return load(KEYS.users, seedUsers)
}

export function saveUsers(items: User[]) {
  save(KEYS.users, items)
}

export function getReservations(): Reservation[] {
  return load(KEYS.reservations, seedReservations)
}

export function saveReservations(items: Reservation[]) {
  save(KEYS.reservations, items)
}
