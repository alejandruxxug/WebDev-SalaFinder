import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import Button from '../components/ui/Button'
import StateMessage from '../components/ui/StateMessage'
import AlternativeSlots from '../components/spaces/AlternativeSlots'
import { fetchSpaceById } from '../api/spaces'
import { checkConflict, createReservation } from '../api/reservations'
import { isBlocked } from '../utils/auth'
import type { Space, AlternativeSlot, Reservation } from '../types'

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
  const spaceId = searchParams.get('spaceId')

  const [space, setSpace] = useState<Space | null>(null)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [date, setDate] = useState('')
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const [purpose, setPurpose] = useState('')
  const [attendeeCount, setAttendeeCount] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [alternativeSlots, setAlternativeSlots] = useState<AlternativeSlot[]>([])
  const [conflictMessage, setConflictMessage] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [created, setCreated] = useState<Reservation | null>(null)

  const navigate = useNavigate()

  useEffect(() => {
    if (!spaceId) return
    let cancelled = false
    async function load() {
      const res = await fetchSpaceById(spaceId!)
      if (cancelled) return
      if (!res.ok) setLoadError(res.error)
      else setSpace(res.data)
    }
    void load()
    return () => {
      cancelled = true
    }
  }, [spaceId])

  function validate(): boolean {
    const errs: Record<string, string> = {}
    if (!date.trim()) errs.date = 'La fecha es obligatoria'
    else if (isDateInPast(date)) errs.date = 'No puedes reservar en el pasado'
    if (!startTime || !endTime) errs.timeSlot = 'Selecciona un horario'
    if (!purpose.trim() || purpose.trim().length < 10) errs.purpose = 'El propósito debe tener al menos 10 caracteres'
    const maxCapacity = space?.capacity ?? 0
    if (!attendeeCount.trim()) errs.attendeeCount = 'El número de asistentes es obligatorio'
    else {
      const n = parseInt(attendeeCount, 10)
      if (isNaN(n) || n < 1) errs.attendeeCount = 'Debe ser al menos 1'
      else if (n > maxCapacity) errs.attendeeCount = `Capacidad máxima: ${maxCapacity}`
    }
    setFieldErrors(errs)
    return Object.keys(errs).length === 0
  }

  function pickAlternative(slot: AlternativeSlot) {
    setDate(slot.date)
    setStartTime(slot.startTime)
    setEndTime(slot.endTime)
    setAlternativeSlots([])
    setConflictMessage(null)
    setError(null)
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setAlternativeSlots([])
    setConflictMessage(null)
    if (isBlocked()) {
      setError('Tu cuenta está bloqueada. Contacta al administrador.')
      return
    }
    if (!space) {
      setError('Espacio no encontrado')
      return
    }
    if (!validate()) return

    setSubmitting(true)
    const conflict = await checkConflict({ spaceId: space.id, date, startTime, endTime })
    if (!conflict.ok) {
      setSubmitting(false)
      setError(conflict.error)
      return
    }
    if (conflict.data.hasConflict) {
      setSubmitting(false)
      setConflictMessage('Este horario ya está reservado. Elige otro o usa una de las sugerencias.')
      setAlternativeSlots(conflict.data.alternativeSlots)
      return
    }

    const res = await createReservation({
      spaceId: space.id,
      date,
      startTime,
      endTime,
      purpose: purpose.trim(),
      attendeeCount: parseInt(attendeeCount, 10),
    })
    setSubmitting(false)
    if (!res.ok) {
      setError(res.error)
      const followUp = await checkConflict({ spaceId: space.id, date, startTime, endTime })
      if (followUp.ok && followUp.data.alternativeSlots.length > 0) {
        setAlternativeSlots(followUp.data.alternativeSlots)
      }
      return
    }
    setCreated(res.data)
    setTimeout(() => navigate('/reservations'), 1500)
  }

  if (!spaceId) {
    return (
      <main className="mx-auto max-w-md px-4 py-10 sm:px-6">
        <StateMessage
          type="error"
          title="No hay espacio seleccionado"
          description="Selecciona un espacio primero."
          actionText="Ver espacios"
          onAction={() => navigate('/')}
        />
      </main>
    )
  }

  if (loadError) {
    return (
      <main className="mx-auto max-w-md px-4 py-10 sm:px-6">
        <StateMessage type="error" title="No se pudo cargar el espacio" description={loadError} actionText="Volver" onAction={() => navigate('/')} />
      </main>
    )
  }

  if (!space) {
    return (
      <main className="mx-auto max-w-md px-4 py-10 sm:px-6">
        <StateMessage type="loading" title="Cargando..." description="Obteniendo espacio..." />
      </main>
    )
  }

  if (isBlocked()) {
    return (
      <main className="mx-auto max-w-md px-4 py-10 sm:px-6">
        <StateMessage
          type="error"
          title="Cuenta bloqueada"
          description="No puedes crear reservas. Contacta al administrador."
          actionText="Volver"
          onAction={() => navigate('/')}
        />
      </main>
    )
  }

  if (created) {
    const approvedMessage = created.status === 'Approved'
      ? '¡Reserva aprobada automáticamente!'
      : 'Reserva creada. Esperando aprobación del administrador.'
    return (
      <main className="mx-auto max-w-md px-4 py-10 sm:px-6">
        <StateMessage type="empty" title="¡Reserva enviada!" description={approvedMessage} />
      </main>
    )
  }

  const inputClass = 'border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 rounded focus:outline-none focus:ring-2 focus:ring-[#003087]/30 focus:border-[#003087]'

  return (
    <main className="mx-auto max-w-md px-6 py-10">
      <section className="border border-slate-200 bg-white p-6 rounded-md shadow-sm">
        <h1 className="text-xl font-semibold text-slate-800">Crear reserva</h1>
        <p className="mt-2 text-sm text-slate-500">
          <strong className="text-slate-700">{space.name}</strong> ({space.type}) — Capacidad: {space.capacity}
          {space.requiresApproval && <span className="ml-2 text-amber-600">· Requiere aprobación</span>}
        </p>

        <form onSubmit={onSubmit} className="mt-6 flex flex-col gap-4">
          <label className="flex flex-col gap-2">
            <span className="text-xs font-medium text-slate-500">Fecha</span>
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
            <span className="text-xs font-medium text-slate-500">Horario</span>
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
              <option value="">Seleccionar...</option>
              {TIME_SLOTS.map((t) => (
                <option key={t.start} value={`${t.start}-${t.end}`}>
                  {t.start} - {t.end}
                </option>
              ))}
            </select>
            {fieldErrors.timeSlot && <span className="text-xs text-red-600">{fieldErrors.timeSlot}</span>}
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-xs font-medium text-slate-500">Propósito</span>
            <input
              className={inputClass}
              type="text"
              placeholder="p. ej. Reunión del equipo de proyecto"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              required
            />
            {fieldErrors.purpose && <span className="text-xs text-red-600">{fieldErrors.purpose}</span>}
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-xs font-medium text-slate-500">Asistentes (1–{space.capacity})</span>
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

          {conflictMessage && <p className="text-sm text-amber-700" role="alert">{conflictMessage}</p>}
          {error && <p className="text-sm text-red-600" role="alert">{error}</p>}
          <AlternativeSlots slots={alternativeSlots} onPick={pickAlternative} />

          <div className="flex gap-2">
            <Button type="submit" variant="primary" disabled={submitting}>
              {submitting ? 'Enviando...' : 'Crear reserva'}
            </Button>
            <Button type="button" variant="secondary" onClick={() => navigate('/')}>
              Cancelar
            </Button>
          </div>
        </form>
      </section>
    </main>
  )
}
