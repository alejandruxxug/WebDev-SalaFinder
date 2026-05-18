import { useState, useEffect, useCallback, useMemo } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Button from '../components/ui/Button'
import StateMessage from '../components/ui/StateMessage'
import { fetchAuditLog } from '../api/reservations'
import { isAdmin } from '../utils/auth'
import type { AuditLog, ReservationStatus } from '../types'

const STATUS_OPTIONS: ReservationStatus[] = ['Pending', 'Approved', 'Rejected', 'Cancelled', 'NoShow']

// Backend stores DateTime.UtcNow; if the serialized string lacks a TZ marker,
// JS Date would treat it as local time. Force UTC interpretation when needed.
function parseUtcTimestamp(value: string): Date {
  const hasTz = /Z$|[+-]\d{2}:?\d{2}$/.test(value)
  return new Date(hasTz ? value : value + 'Z')
}

export default function AuditLogPage() {
  const [logs, setLogs] = useState<AuditLog[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchParams, setSearchParams] = useSearchParams()
  const reservationIdParam = searchParams.get('reservationId')
  const [reservationFilter, setReservationFilter] = useState(reservationIdParam ?? '')
  const [personFilter, setPersonFilter] = useState('')
  const [actionFilter, setActionFilter] = useState('')
  const [stateFilter, setStateFilter] = useState<'' | ReservationStatus>('')
  const [dateFilter, setDateFilter] = useState('')
  const navigate = useNavigate()

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    const res = await fetchAuditLog(
      reservationIdParam ? { reservationId: reservationIdParam } : undefined,
    )
    if (!res.ok) setError(res.error)
    else setLogs(res.data)
    setLoading(false)
  }, [reservationIdParam])

  useEffect(() => {
    if (!isAdmin()) {
      navigate('/home')
      return
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load()
  }, [navigate, load])

  function applyFilter(e: React.FormEvent) {
    e.preventDefault()
    if (reservationFilter.trim()) {
      setSearchParams({ reservationId: reservationFilter.trim() })
    } else {
      setSearchParams({})
    }
  }

  function clearFilter() {
    setReservationFilter('')
    setPersonFilter('')
    setActionFilter('')
    setStateFilter('')
    setDateFilter('')
    setSearchParams({})
  }

  const actionOptions = useMemo(
    () => Array.from(new Set(logs.map((l) => l.action))).sort(),
    [logs],
  )

  const filteredLogs = useMemo(() => {
    const person = personFilter.trim().toLowerCase()
    return logs.filter((l) => {
      if (person && !(l.userFullName ?? '').toLowerCase().includes(person)) return false
      if (actionFilter && l.action !== actionFilter) return false
      if (stateFilter && l.previousStatus !== stateFilter && l.newStatus !== stateFilter) return false
      if (dateFilter) {
        const d = parseUtcTimestamp(l.timestamp)
        if (Number.isNaN(d.getTime())) return false
        const parts = new Intl.DateTimeFormat('en-CA', {
          timeZone: 'America/Bogota',
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
        }).format(d)
        if (parts !== dateFilter) return false
      }
      return true
    })
  }, [logs, personFilter, actionFilter, stateFilter, dateFilter])

  const hasActiveFilter =
    !!reservationIdParam || !!personFilter || !!actionFilter || !!stateFilter || !!dateFilter

  if (!isAdmin()) return null

  return (
    <main className="mx-auto max-w-5xl px-4 py-6 sm:px-6">
      <h1 className="text-2xl font-semibold text-slate-800">Bitácora de auditoría</h1>
      <p className="mt-2 text-sm text-slate-500">Registro de cambios de estado y acciones administrativas.</p>

      <form onSubmit={applyFilter} className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <label className="flex flex-col gap-1">
          <span className="text-xs font-medium text-slate-500">ID de reserva</span>
          <input
            type="text"
            className="border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 rounded"
            value={reservationFilter}
            onChange={(e) => setReservationFilter(e.target.value)}
            placeholder="p. ej. edd90ade-f144-..."
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-xs font-medium text-slate-500">Persona</span>
          <input
            type="text"
            className="border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 rounded"
            value={personFilter}
            onChange={(e) => setPersonFilter(e.target.value)}
            placeholder="Nombre del usuario"
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-xs font-medium text-slate-500">Acción</span>
          <select
            className="border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 rounded"
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
          >
            <option value="">Todas</option>
            {actionOptions.map((a) => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-xs font-medium text-slate-500">Estado</span>
          <select
            className="border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 rounded"
            value={stateFilter}
            onChange={(e) => setStateFilter(e.target.value as '' | ReservationStatus)}
          >
            <option value="">Todos</option>
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-xs font-medium text-slate-500">Fecha</span>
          <input
            type="date"
            className="border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 rounded"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
          />
        </label>
        <div className="flex items-end gap-2 sm:col-span-2 lg:col-span-5">
          <Button type="submit" variant="primary">Filtrar</Button>
          {hasActiveFilter && (
            <Button type="button" variant="secondary" onClick={clearFilter}>Limpiar</Button>
          )}
        </div>
      </form>

      {loading ? (
        <div className="mt-6">
          <StateMessage type="loading" title="Cargando..." description="Obteniendo bitácora." />
        </div>
      ) : error ? (
        <div className="mt-6">
          <StateMessage type="error" title="Error" description={error} actionText="Reintentar" onAction={load} />
        </div>
      ) : filteredLogs.length === 0 ? (
        <div className="mt-6">
          <StateMessage type="empty" title="Sin registros" description="No hay entradas que coincidan con el filtro." />
        </div>
      ) : (
        <div className="mt-6 overflow-x-auto border border-slate-200 rounded-md shadow-sm">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-4 py-3 text-left font-semibold text-slate-600">Fecha</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-600">Usuario</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-600">Acción</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-600">Reserva</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-600">Transición</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-600">Detalle</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map((l) => (
                <tr key={l.id} className="border-b border-slate-100 bg-white hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 text-slate-700">{parseUtcTimestamp(l.timestamp).toLocaleString('es-CO', { timeZone: 'America/Bogota', dateStyle: 'short', timeStyle: 'medium' })}</td>
                  <td className="px-4 py-3 text-slate-700">{l.userFullName ?? '—'}</td>
                  <td className="px-4 py-3 text-slate-700">{l.action}</td>
                  <td className="px-4 py-3 text-slate-700">{l.reservationId ?? '—'}</td>
                  <td className="px-4 py-3 text-slate-700">
                    {l.previousStatus || l.newStatus
                      ? `${l.previousStatus ?? '—'} → ${l.newStatus ?? '—'}`
                      : '—'}
                  </td>
                  <td className="px-4 py-3 text-slate-700">{l.details ?? '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  )
}
