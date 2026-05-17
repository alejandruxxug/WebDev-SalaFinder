import { useState, useEffect, useCallback } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Button from '../components/ui/Button'
import StateMessage from '../components/ui/StateMessage'
import { fetchAuditLog } from '../api/reservations'
import { isAdmin } from '../utils/auth'
import type { AuditLog } from '../types'

export default function AuditLogPage() {
  const [logs, setLogs] = useState<AuditLog[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchParams, setSearchParams] = useSearchParams()
  const reservationIdParam = searchParams.get('reservationId')
  const [reservationFilter, setReservationFilter] = useState(reservationIdParam ?? '')
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
      navigate('/')
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
    setSearchParams({})
  }

  if (!isAdmin()) return null

  return (
    <main className="mx-auto max-w-5xl px-4 py-6 sm:px-6">
      <h1 className="text-2xl font-semibold text-slate-800">Bitácora de auditoría</h1>
      <p className="mt-2 text-sm text-slate-500">Registro de cambios de estado y acciones administrativas.</p>

      <form onSubmit={applyFilter} className="mt-4 flex flex-wrap items-end gap-2">
        <label className="flex flex-col gap-1">
          <span className="text-xs font-medium text-slate-500">Filtrar por ID de reserva</span>
          <input
            type="number"
            min={1}
            className="border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 rounded"
            value={reservationFilter}
            onChange={(e) => setReservationFilter(e.target.value)}
            placeholder="p. ej. 42"
          />
        </label>
        <Button type="submit" variant="primary">Filtrar</Button>
        {reservationIdParam && (
          <Button type="button" variant="secondary" onClick={clearFilter}>Limpiar</Button>
        )}
      </form>

      {loading ? (
        <div className="mt-6">
          <StateMessage type="loading" title="Cargando..." description="Obteniendo bitácora." />
        </div>
      ) : error ? (
        <div className="mt-6">
          <StateMessage type="error" title="Error" description={error} actionText="Reintentar" onAction={load} />
        </div>
      ) : logs.length === 0 ? (
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
              {logs.map((l) => (
                <tr key={l.id} className="border-b border-slate-100 bg-white hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 text-slate-700">{new Date(l.timestamp).toLocaleString()}</td>
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
