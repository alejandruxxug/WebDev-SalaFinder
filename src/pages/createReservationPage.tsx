// reservation form: date, time, capacity, conflict check; all reservations require admin approval
import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import Button from '../components/ui/Button'
import StateMessage from '../components/ui/StateMessage'
import { getSpaces } from '../services/storage'
import { getReservations, saveReservations } from '../services/storage'
import { logAudit } from '../services/auditService'
import { hasConflict, getConflictingReservations } from '../services/conflictService'
import { getSessionUser, isBlocked } from '../utils/auth'
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

  const navigate = useNavigate()

  useEffect(() => {
    if (!spaceId || !Number.isFinite(spaceId)) return
    const spaces = getSpaces()
    const found = spaces.find((s) => s.id === spaceId)
    setSpace(found ?? null)
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
    if (startTime && endTime && date && hasConflict(spaceId!, date, startTime, endTime)) {
      errs.timeSlot = 'This time slot is already reserved. Choose another.'
    }
    setFieldErrors(errs)
    return Object.keys(errs).length === 0
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    const user = getSessionUser()
    if (!user) {
      setError('Not logged in')
      return
    }
    if (isBlocked()) {
      setError('Your account is blocked. Contact admin.')
      return
    }
    if (!space) {
      setError('Space not found')
      return
    }
    if (!validate()) return

    // Final check: block if space is already reserved (Pending or Approved)
    if (hasConflict(space.id, date, startTime, endTime)) {
      setError('This time slot was just reserved. Please choose another.')
      return
    }

    const reservations = getReservations()
    const nextId = reservations.length ? Math.max(...reservations.map((r) => r.id)) + 1 : 1
    const status = 'Pending'

    const newReservation: Reservation = {
      id: nextId,
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
    reservations.push(newReservation)
    saveReservations(reservations)
    logAudit(user.id, 'CREATE', 'reservation', newReservation.id, `Created ${status}`)
    setSubmitted(true)
    setTimeout(() => navigate('/reservations'), 1500)
  }

  if (!spaceId || !Number.isFinite(spaceId)) {
    return (
      <main className="mx-auto max-w-md px-4 py-10 sm:px-6">
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
      <main className="mx-auto max-w-md px-4 py-10 sm:px-6">
        <StateMessage type="loading" title="Loading..." description="Fetching space..." />
      </main>
    )
  }

  if (isBlocked()) {
    return (
      <main className="mx-auto max-w-md px-4 py-10 sm:px-6">
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
      <main className="mx-auto max-w-md px-4 py-10 sm:px-6">
        <StateMessage
          type="empty"
          title="Reservation created!"
          description="Awaiting admin approval."
        />
      </main>
    )
  }

  const conflicts = startTime && endTime && date && spaceId
    ? getConflictingReservations(spaceId, date, startTime, endTime)
    : []

  const inputClass = 'border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 rounded focus:outline-none focus:ring-2 focus:ring-[#003087]/30 focus:border-[#003087]'

  return (
    <main className="mx-auto max-w-md px-6 py-10">
      <section className="border border-slate-200 bg-white p-6 rounded-md shadow-sm">
        <h1 className="text-xl font-semibold text-slate-800">Create Reservation</h1>
        <p className="mt-2 text-sm text-slate-500">
          <strong className="text-slate-700">{space.name}</strong> ({space.type}) — Capacity: {space.capacity}
        </p>

        <form onSubmit={onSubmit} className="mt-6 flex flex-col gap-4">
          <label className="flex flex-col gap-2">
            <span className="text-xs font-medium text-slate-500">Date</span>
            <input
              className={inputClass}
              type="date"
              min={getTodayString()}
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
            {fieldErrors.date && <span className="text-xs text-red-600">{fieldErrors.date}</span>}
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-xs font-medium text-slate-500">Time slot</span>
            <select
              className={inputClass}
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
            >
              <option value="">Select...</option>
              {TIME_SLOTS.map((t) => {
                const taken = date && spaceId
                  ? hasConflict(spaceId, date, t.start, t.end)
                  : false
                return (
                  <option key={t.start} value={`${t.start}-${t.end}`} disabled={taken}>
                    {t.start} - {t.end}{taken ? ' (taken)' : ''}
                  </option>
                )
              })}
            </select>
            {fieldErrors.timeSlot && <span className="text-xs text-red-600">{fieldErrors.timeSlot}</span>}
            {conflicts.length > 0 && (
              <span className="text-xs text-amber-600">
                Already reserved: {conflicts.map((c) => `${c.date} ${c.startTime}-${c.endTime} (${c.status})`).join(', ')}
              </span>
            )}
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-xs font-medium text-slate-500">Purpose</span>
            <input
              className={inputClass}
              type="text"
              placeholder="e.g. Team meeting"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              required
            />
            {fieldErrors.purpose && <span className="text-xs text-red-600">{fieldErrors.purpose}</span>}
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-xs font-medium text-slate-500">Attendees (1–{space.capacity})</span>
            <input
              className={inputClass}
              type="number"
              min={1}
              max={space.capacity}
              value={attendeeCount}
              onChange={(e) => setAttendeeCount(e.target.value)}
              required
            />
            {fieldErrors.attendeeCount && <span className="text-xs text-red-600">{fieldErrors.attendeeCount}</span>}
          </label>

          {error && <p className="text-sm text-red-600" role="alert">{error}</p>}

          <div className="flex gap-2">
            <Button type="submit" variant="primary" disabled={conflicts.length > 0}>
              Create reservation
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
