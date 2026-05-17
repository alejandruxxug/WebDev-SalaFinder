import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../components/ui/Button'
import StateMessage from '../components/ui/StateMessage'
import { fetchAllReservations, markNoShow, unblockUsers } from '../api/reservations'
import { isAdmin, isAdminOrStaff } from '../utils/auth'
import type { Reservation } from '../types'

function getStatusColor(status: string) {
  if (status === 'Pending') return 'text-amber-600'
  if (status === 'Approved') return 'text-green-700'
  if (status === 'Rejected' || status === 'Cancelled' || status === 'NoShow') return 'text-red-600'
  return 'text-slate-500'
}

export default function AdminReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    const res = await fetchAllReservations()
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

  async function handleNoShow(r: Reservation) {
    if (r.status !== 'Approved') return
    if (!confirm('¿Marcar no-show? Si el usuario acumula 2 no-shows, será bloqueado por 7 días.')) return
    const res = await markNoShow(r.id)
    if (!res.ok) {
      alert(res.error)
      return
    }
    void load()
  }

  async function handleUnblock() {
    const res = await unblockUsers()
    if (!res.ok) {
      alert(res.error)
      return
    }
    alert(res.data.message)
  }

  if (!isAdminOrStaff()) return null

  return (
    <main className="mx-auto max-w-5xl px-4 py-6 sm:px-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-slate-800">Todas las reservas</h1>
          <p className="mt-2 text-sm text-slate-500">
            Marca no-show en reservas aprobadas. 2 no-shows = bloqueo de 7 días.
          </p>
        </div>
        {isAdmin() && (
          <Button variant="secondary" onClick={handleUnblock}>Desbloquear usuarios con plazo vencido</Button>
        )}
      </div>

      {loading ? (
        <div className="mt-6">
          <StateMessage type="loading" title="Cargando..." description="Obteniendo reservas." />
        </div>
      ) : error ? (
        <div className="mt-6">
          <StateMessage type="error" title="Error" description={error} actionText="Reintentar" onAction={load} />
        </div>
      ) : reservations.length === 0 ? (
        <div className="mt-6">
          <StateMessage type="empty" title="Sin reservas" description="No hay reservas registradas." />
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
                <th className="px-4 py-3 text-left font-semibold text-slate-600">Estado</th>
                {isAdmin() && (
                  <th className="px-4 py-3 text-left font-semibold text-slate-600">Acciones</th>
                )}
              </tr>
            </thead>
            <tbody>
              {reservations.map((r) => (
                <tr key={r.id} className="border-b border-slate-100 bg-white hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 text-slate-700">{r.space}</td>
                  <td className="px-4 py-3 text-slate-700">{r.userFullName ?? '—'}</td>
                  <td className="px-4 py-3 text-slate-700">{r.date}</td>
                  <td className="px-4 py-3 text-slate-700">{r.startTime} - {r.endTime}</td>
                  <td className={`px-4 py-3 font-medium ${getStatusColor(r.status)}`}>{r.status}</td>
                  {isAdmin() && (
                    <td className="px-4 py-3">
                      {r.status === 'Approved' && (
                        <Button variant="secondary" onClick={() => handleNoShow(r)}>
                          Marcar no-show
                        </Button>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  )
}
