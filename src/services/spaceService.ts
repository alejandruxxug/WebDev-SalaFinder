/**
 * spaceService.ts - Async space fetching
 *
 * Wraps storage with a simulated delay (e.g. network request).
 * getSpaces() returns all spaces; getSpaceById(id) returns one by ID.
 */
import type { Space } from '../types'
import { getSpaces as getFromStorage } from './storage'

const FAKE_DELAY_MS = 400

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export async function getSpaces(): Promise<Space[]> {
  await delay(FAKE_DELAY_MS)
  return [...getFromStorage()]
}

export async function getSpaceById(id: number): Promise<Space | null> {
  await delay(FAKE_DELAY_MS)
  const spaces = getFromStorage()
  return spaces.find((s) => s.id === id) ?? null
}
