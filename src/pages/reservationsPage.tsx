import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../components/ui/Button'
import StateMessage from '../components/ui/StateMessage'
import { cancelReservation, fetchMyReservations } from '../api/reservations'
import { getSessionUser } from '../utils/auth'
import type { Reservation } from '../types'

function getStatusColor(status: string) {
  if (status === 'Pending') return 'text-amber-600'
  if (status === 'Approved') return 'text-green-700'
  if (status === 'Rejected' || status === 'Cancelled' || status === 'NoShow') return 'text-red-600'
  return 'text-slate-500'
}

export default function ReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()
  const user = getSessionUser()

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    const res = await fetchMyReservations()
    if (!res.ok) setError(res.error)
    else setReservations(res.data)
    setLoading(false)
  }, [])

  useEffect(() => {
    if (!user) return
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load()
  }, [user, load])

  async function handleCancel(r: Reservation) {
    if (!confirm('¿Cancelar esta reserva?')) return
    const res = await cancelReservation(r.id)
    if (!res.ok) {
      alert(res.error)
      return
    }
    void load()
  }

  if (!user) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-6 sm:px-6">
        <StateMessage
          type="error"
          title="No has iniciado sesión"
          description="Inicia sesión para ver tus reservas."
          actionText="Iniciar sesión"
          onAction={() => navigate('/login')}
        />
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-4xl px-6 py-6">
      <h1 className="text-2xl font-semibold text-slate-800">Mis reservas</h1>
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
          <StateMessage
            type="empty"
            title="Aún no tienes reservas"
            description="Crea una desde la lista de espacios."
            actionText="Ver espacios"
            onAction={() => navigate('/')}
          />
        </div>
      ) : (
        <div className="mt-6 overflow-x-auto border border-slate-200 rounded-md shadow-sm">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-4 py-3 text-left font-semibold text-slate-600">Espacio</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-600">Fecha</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-600">Hora</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-600">Propósito</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-600">Estado</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-600">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {reservations.map((r) => (
                <tr key={r.id} className="border-b border-slate-100 bg-white hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 text-slate-700">{r.space}</td>
                  <td className="px-4 py-3 text-slate-700">{r.date}</td>
                  <td className="px-4 py-3 text-slate-700">{r.startTime} - {r.endTime}</td>
                  <td className="px-4 py-3 text-slate-700">{r.purpose ?? '—'}</td>
                  <td className={`px-4 py-3 font-medium ${getStatusColor(r.status)}`}>{r.status}</td>
                  <td className="px-4 py-3">
                    {(r.status === 'Pending' || r.status === 'Approved') && (
                      <Button variant="secondary" onClick={() => handleCancel(r)}>Cancelar</Button>
                    )}
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
