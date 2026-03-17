// localStorage-backed storage, initializes from seed data if empty (prototype)
import type { Space, Reservation, User, AuditLog } from '../types'
import { spaces as seedSpaces } from '../data/spaces'
import { users as seedUsers } from '../data/users'
import { reservations as seedReservations } from '../data/reservations'
import { auditLogs as seedAuditLogs } from '../data/auditLogs'

const KEYS = {
  spaces: 'salafinder_spaces',
  users: 'salafinder_users',
  reservations: 'salafinder_reservations',
  auditLogs: 'salafinder_auditLogs',
}

function load<T>(key: string, seed: T[]): T[] {
  try {
    const raw = localStorage.getItem(key)
    if (raw) return JSON.parse(raw)
  } catch {}
  return seed
}

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

export function getAuditLogs(): AuditLog[] {
  return load(KEYS.auditLogs, seedAuditLogs)
}

export function saveAuditLogs(items: AuditLog[]) {
  save(KEYS.auditLogs, items)
}
