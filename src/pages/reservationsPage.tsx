// reservations list from storage, filtered by current user
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import StateMessage from '../components/ui/StateMessage'
import { getReservations } from '../services/storage'
import { getSessionUser } from '../utils/auth'
import type { Reservation } from '../types'

function getStatusColor(status: string) {
  if (status === 'Pending') return 'text-amber-600'
  if (status === 'Approved') return 'text-green-700'
  if (status === 'Rejected' || status === 'Cancelled') return 'text-red-600'
  return 'text-slate-500'
}

export default function ReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([])
  const navigate = useNavigate()
  const user = getSessionUser()

  useEffect(() => {
    const all = getReservations()
    const mine = user ? all.filter((r) => r.userId === user.id) : []
    setReservations(mine)
  }, [user?.id])

  if (!user) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-6 sm:px-6">
        <StateMessage type="error" title="Not logged in" description="Log in to see your reservations." actionText="Log in" onAction={() => navigate('/login')} />
      </main>
    )
  }

  if (reservations.length === 0) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-6 sm:px-6">
        <h1 className="text-2xl font-semibold text-slate-800">My Reservations</h1>
        <div className="mt-6">
          <StateMessage
            type="empty"
            title="No reservations yet"
            description="Create a reservation from the spaces list."
            actionText="Browse spaces"
            onAction={() => navigate('/')}
          />
        </div>
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-4xl px-6 py-6">
      <h1 className="text-2xl font-semibold text-slate-800">My Reservations</h1>
      <div className="mt-6 overflow-x-auto border border-slate-200 rounded-md shadow-sm">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              <th className="px-4 py-3 text-left font-semibold text-slate-600">Space</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-600">Date</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-600">Time</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-600">Purpose</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-600">Status</th>
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  )
}
