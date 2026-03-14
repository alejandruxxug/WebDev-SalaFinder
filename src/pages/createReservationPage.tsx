/**
 * CreateReservationPage.tsx - Reservation form
 *
 * Business rules:
 * - No conflict with approved reservations (alternate scenario 1)
 * - Blocked users cannot reserve (alternate scenario 2)
 * - requiresApproval → status Pending, else Approved
 * Uses Fake API: createReservation with loading/success/error.
 * Accessible: labels, focus-visible, keyboard nav.
 */
import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import Button from '../components/ui/Button'
import StateMessage from '../components/ui/StateMessage'
import { getSpaces } from '../services/storage'
import { createReservation } from '../api/fakeApi'
import { hasConflict, getConflictingReservations } from '../services/conflictService'
import { getSessionUser, isBlocked } from '../utils/auth'
import { useToast } from '../contexts/ToastContext'
import type { Space, Reservation } from '../types'

function getTodayString(): string {
  return new Date().toISOString().slice(0, 10)
}

function isDateInPast(dateStr: string): boolean {
  if (!dateStr) return false
  const chosen = new Date(dateStr)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  chosen.setHours(0, 0, 0, 0)
  return chosen < today
}

const TIME_SLOTS = [
  { start: '09:00', end: '10:00' },
  { start: '10:00', end: '11:00' },
  { start: '11:00', end: '12:00' },
  { start: '14:00', end: '15:00' },
  { start: '15:00', end: '16:00' },
]

const inputBase = 'border border-[#444] bg-[#111] px-3 py-2 text-sm text-[#ddd] rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-[#555]'

export default function CreateReservationPage() {
  const [searchParams] = useSearchParams()
  const spaceIdParam = searchParams.get('spaceId')
  const spaceId = spaceIdParam ? Number(spaceIdParam) : null

  const [space, setSpace] = useState<Space | null>(null)
  const [date, setDate] = useState('')
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const [purpose, setPurpose] = useState('')
  const [attendeeCount, setAttendeeCount] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const navigate = useNavigate()
  const toast = useToast()

  useEffect(() => {
    if (!spaceId || !Number.isFinite(spaceId)) return
    const spaces = getSpaces()
    setSpace(spaces.find((s) => s.id === spaceId) ?? null)
  }, [spaceId])

  function validate(): boolean {
    const errs: Record<string, string> = {}
    if (!date.trim()) errs.date = 'Date is required'
    else if (isDateInPast(date)) errs.date = "Can't book in the past"
    if (!startTime || !endTime) errs.timeSlot = 'Time slot is required'
    if (!purpose.trim()) errs.purpose = 'Purpose is required'
    const maxCapacity = space?.capacity ?? 0
    if (!attendeeCount.trim()) errs.attendeeCount = 'Attendee count is required'
    else {
      const n = parseInt(attendeeCount, 10)
      if (isNaN(n) || n < 1) errs.attendeeCount = 'Must be at least 1'
      else if (n > maxCapacity) errs.attendeeCount = `Max capacity: ${maxCapacity}`
    }
    if (spaceId && startTime && endTime && date && hasConflict(spaceId, date, startTime, endTime)) {
      errs.timeSlot = 'Time slot conflicts with an approved reservation'
    }
    setFieldErrors(errs)
    return Object.keys(errs).length === 0
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    const user = getSessionUser()
    if (!user) {
      setError('Not logged in')
      return
    }
    if (isBlocked()) {
      setError('Your account is blocked. Contact admin.')
      toast.showToast('Blocked users cannot create reservations.', 'error')
      return
    }
    if (!space) {
      setError('Space not found')
      return
    }
    if (!validate()) return

    setSubmitting(true)
    const status = space.requiresApproval ? 'Pending' : 'Approved'
    const newReservation: Omit<Reservation, 'id'> = {
      spaceId: space.id,
      space: space.name,
      userId: user.id,
      date,
      startTime,
      endTime,
      status,
      purpose: purpose.trim(),
      attendeeCount: parseInt(attendeeCount, 10),
    }

    const result = await createReservation(newReservation)
    setSubmitting(false)

    if (result.error) {
      setError(result.error)
      toast.showToast(result.error, 'error')
    } else {
      setSubmitted(true)
      toast.showToast(
        status === 'Pending' ? 'Reservation created. Awaiting approval.' : 'Reservation created and approved.',
        'success'
      )
      setTimeout(() => navigate('/reservations'), 1500)
    }
  }

  if (!spaceId || !Number.isFinite(spaceId)) {
    return (
      <main className="mx-auto max-w-md px-6 py-10">
        <StateMessage
          type="error"
          title="No space selected"
          description="Select a space from the list first."
          actionText="Browse spaces"
          onAction={() => navigate('/')}
        />
      </main>
    )
  }

  if (!space) {
    return (
      <main className="mx-auto max-w-md px-6 py-10">
        <StateMessage type="loading" title="Loading..." description="Fetching space..." />
      </main>
    )
  }

  if (isBlocked()) {
    return (
      <main className="mx-auto max-w-md px-6 py-10">
        <StateMessage
          type="error"
          title="Account blocked"
          description="You cannot make reservations. Contact admin."
          actionText="Go back"
          onAction={() => navigate('/')}
        />
      </main>
    )
  }

  if (submitted) {
    return (
      <main className="mx-auto max-w-md px-6 py-10">
        <StateMessage
          type="empty"
          title="Reservation created!"
          description={space.requiresApproval ? 'Awaiting approval.' : 'Approved automatically.'}
        />
      </main>
    )
  }

  const conflicts = startTime && endTime && date
    ? getConflictingReservations(spaceId, date, startTime, endTime)
    : []

  return (
    <main className="mx-auto max-w-md px-6 py-10">
      <section className="border border-[#333] bg-[#222] p-6">
        <h1 className="text-xl font-semibold text-[#ddd]">Create Reservation</h1>
        <p className="mt-2 text-sm text-[#888]">
          <strong>{space.name}</strong> ({space.type}) — Capacity: {space.capacity}
          {space.requiresApproval && ' — Requires approval'}
        </p>

        <form onSubmit={onSubmit} className="mt-6 flex flex-col gap-4" noValidate>
          <label htmlFor="res-date" className="flex flex-col gap-2">
            <span className="text-xs text-[#888]">Date</span>
            <input
              id="res-date"
              className={inputBase}
              type="date"
              min={getTodayString()}
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              aria-invalid={!!fieldErrors.date}
              aria-describedby={fieldErrors.date ? 'res-date-error' : undefined}
            />
            {fieldErrors.date && (
              <span id="res-date-error" className="text-xs text-red-400" role="alert">
                {fieldErrors.date}
              </span>
            )}
          </label>

          <label htmlFor="res-time" className="flex flex-col gap-2">
            <span className="text-xs text-[#888]">Time slot</span>
            <select
              id="res-time"
              className={inputBase}
              value={startTime ? `${startTime}-${endTime}` : ''}
              onChange={(e) => {
                const v = e.target.value
                if (v) {
                  const [s, e2] = v.split('-')
                  setStartTime(s)
                  setEndTime(e2)
                } else {
                  setStartTime('')
                  setEndTime('')
                }
              }}
              required
              aria-invalid={!!fieldErrors.timeSlot}
              aria-describedby={fieldErrors.timeSlot || conflicts.length ? 'res-time-error' : undefined}
            >
              <option value="">Select...</option>
              {TIME_SLOTS.map((t) => (
                <option key={t.start} value={`${t.start}-${t.end}`}>
                  {t.start} - {t.end}
                </option>
              ))}
            </select>
            {fieldErrors.timeSlot && (
              <span id="res-time-error" className="text-xs text-red-400" role="alert">
                {fieldErrors.timeSlot}
              </span>
            )}
            {conflicts.length > 0 && !fieldErrors.timeSlot && (
              <span className="text-xs text-amber-400">
                Conflicts with: {conflicts.map((c) => `${c.space} ${c.date} ${c.startTime}-${c.endTime}`).join(', ')}
              </span>
            )}
          </label>

          <label htmlFor="res-purpose" className="flex flex-col gap-2">
            <span className="text-xs text-[#888]">Purpose</span>
            <input
              id="res-purpose"
              className={inputBase}
              type="text"
              placeholder="e.g. Team meeting"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              required
              aria-invalid={!!fieldErrors.purpose}
            />
            {fieldErrors.purpose && (
              <span className="text-xs text-red-400" role="alert">{fieldErrors.purpose}</span>
            )}
          </label>

          <label htmlFor="res-attendees" className="flex flex-col gap-2">
            <span className="text-xs text-[#888]">Attendees (1–{space.capacity})</span>
            <input
              id="res-attendees"
              className={inputBase}
              type="number"
              min={1}
              max={space.capacity}
              value={attendeeCount}
              onChange={(e) => setAttendeeCount(e.target.value)}
              required
              aria-invalid={!!fieldErrors.attendeeCount}
            />
            {fieldErrors.attendeeCount && (
              <span className="text-xs text-red-400" role="alert">{fieldErrors.attendeeCount}</span>
            )}
          </label>

          {error && (
            <p className="text-sm text-red-400" role="alert">
              {error}
            </p>
          )}

          <div className="flex gap-2">
            <Button type="submit" variant="primary" disabled={submitting}>
              {submitting ? 'Creating...' : 'Create reservation'}
            </Button>
            <Button type="button" variant="secondary" onClick={() => navigate('/')}>
              Cancel
            </Button>
          </div>
        </form>
      </section>
    </main>
  )
}
