import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../components/ui/Button'
import StateMessage from '../components/ui/StateMessage'
import { fetchAllReservations, updateReservationStatus } from '../api/reservations'
import { isAdminOrStaff } from '../utils/auth'
import type { Reservation } from '../types'

export default function ApprovalsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    const res = await fetchAllReservations({ status: 'Pending' })
    if (!res.ok) setError(res.error)
    else setReservations(res.data)
    setLoading(false)
  }, [])

  useEffect(() => {
    if (!isAdminOrStaff()) {
      navigate('/')
      return
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load()
  }, [navigate, load])

  async function handleApprove(r: Reservation) {
    const res = await updateReservationStatus(r.id, { newStatus: 'Approved' })
    if (!res.ok) {
      alert(res.error)
      return
    }
    void load()
  }

  async function handleReject(r: Reservation) {
    const reason = window.prompt('Motivo del rechazo (opcional):') ?? undefined
    const res = await updateReservationStatus(r.id, { newStatus: 'Rejected', reason })
    if (!res.ok) {
      alert(res.error)
      return
    }
    void load()
  }

  if (!isAdminOrStaff()) return null

  return (
    <main className="mx-auto max-w-4xl px-6 py-6">
      <h1 className="text-2xl font-semibold text-slate-800">Aprobaciones pendientes</h1>

      {loading ? (
        <div className="mt-6">
          <StateMessage type="loading" title="Cargando..." description="Obteniendo reservas pendientes." />
        </div>
      ) : error ? (
        <div className="mt-6">
          <StateMessage type="error" title="Error" description={error} actionText="Reintentar" onAction={load} />
        </div>
      ) : reservations.length === 0 ? (
        <div className="mt-6">
          <StateMessage type="empty" title="Sin pendientes" description="Todas las reservas han sido procesadas." />
        </div>
      ) : (
        <div className="mt-6 overflow-x-auto border border-slate-200 rounded-md shadow-sm">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-4 py-3 text-left font-semibold text-slate-600">Espacio</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-600">Usuario</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-600">Fecha</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-600">Hora</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-600">Propósito</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-600">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {reservations.map((r) => (
                <tr key={r.id} className="border-b border-slate-100 bg-white hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 text-slate-700">{r.space}</td>
                  <td className="px-4 py-3 text-slate-700">{r.userFullName ?? '—'}</td>
                  <td className="px-4 py-3 text-slate-700">{r.date}</td>
                  <td className="px-4 py-3 text-slate-700">{r.startTime} - {r.endTime}</td>
                  <td className="px-4 py-3 text-slate-700">{r.purpose ?? '—'}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <Button variant="primary" onClick={() => handleApprove(r)}>Aprobar</Button>
                      <Button variant="secondary" onClick={() => handleReject(r)}>Rechazar</Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  )
}
