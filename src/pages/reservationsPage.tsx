/**
 * ReservationsPage.tsx - List of current user's reservations
 *
 * Uses getSessionUser() to get the logged-in user, then filters reservations by userId.
 * Data comes from localStorage via getReservations(). If not logged in, shows a message.
 */
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import StateMessage from '../components/ui/StateMessage'
import { getReservations } from '../services/storage'
import { getSessionUser } from '../utils/auth'
import type { Reservation } from '../types'

function getStatusColor(status: string) {
  if (status === 'Pending') return 'text-amber-400'
  if (status === 'Approved') return 'text-green-400'
  if (status === 'Rejected' || status === 'Cancelled') return 'text-red-400'
  return 'text-[#888]'
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
      <main className="mx-auto max-w-4xl px-6 py-6">
        <StateMessage type="error" title="Not logged in" description="Log in to see your reservations." actionText="Log in" onAction={() => navigate('/login')} />
      </main>
    )
  }

  if (reservations.length === 0) {
    return (
      <main className="mx-auto max-w-4xl px-6 py-6">
        <h1 className="text-2xl font-semibold text-[#ddd]">My Reservations</h1>
        <StateMessage
          type="empty"
          title="No reservations yet"
          description="Create a reservation from the spaces list."
          actionText="Browse spaces"
          onAction={() => navigate('/')}
        />
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-4xl px-6 py-6">
      <h1 className="text-2xl font-semibold text-[#ddd]">My Reservations</h1>
      <div className="mt-6 overflow-x-auto border border-[#333]">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-[#333] bg-[#222]">
              <th className="px-4 py-3 text-left font-semibold text-[#ddd]">Space</th>
              <th className="px-4 py-3 text-left font-semibold text-[#ddd]">Date</th>
              <th className="px-4 py-3 text-left font-semibold text-[#ddd]">Time</th>
              <th className="px-4 py-3 text-left font-semibold text-[#ddd]">Purpose</th>
              <th className="px-4 py-3 text-left font-semibold text-[#ddd]">Status</th>
            </tr>
          </thead>
          <tbody>
            {reservations.map((r) => (
              <tr key={r.id} className="border-b border-[#333]">
                <td className="px-4 py-3 text-[#bbb]">{r.space}</td>
                <td className="px-4 py-3 text-[#bbb]">{r.date}</td>
                <td className="px-4 py-3 text-[#bbb]">{r.startTime} - {r.endTime}</td>
                <td className="px-4 py-3 text-[#bbb]">{r.purpose ?? '—'}</td>
                <td className={`px-4 py-3 font-medium ${getStatusColor(r.status)}`}>{r.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  )
}
