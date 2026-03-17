// admin: view all reservations, mark no-show on approved ones
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../components/ui/Button'
import StateMessage from '../components/ui/StateMessage'
import { getReservations } from '../services/storage'
import { getUsers } from '../services/storage'
import { markNoShow } from '../services/noShowService'
import { getSessionUser, isAdmin } from '../utils/auth'
import type { Reservation } from '../types'

function getStatusColor(status: string) {
  if (status === 'Pending') return 'text-amber-400'
  if (status === 'Approved') return 'text-green-400'
  if (status === 'Rejected' || status === 'Cancelled') return 'text-red-400'
  return 'text-[#888]'
}

export default function AdminReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([])
  const navigate = useNavigate()

  useEffect(() => {
    if (!isAdmin()) {
      navigate('/')
      return
    }
    setReservations(getReservations())
  }, [navigate])

  function handleNoShow(r: Reservation) {
    if (r.status !== 'Approved') return
    const user = getSessionUser()
    if (!user) return
    if (!confirm(`Mark no-show for this reservation? User will be blocked if this is their 2nd no-show.`)) return
    markNoShow(r.userId, r.id, user.id)
    setReservations(getReservations())
  }

  const users = getUsers()
  const userName = (id: number) => users.find((u) => u.id === id)?.name ?? 'Unknown'

  if (!isAdmin()) return null

  return (
    <main className="mx-auto max-w-4xl px-6 py-6">
      <h1 className="text-2xl font-semibold text-[#ddd]">All Reservations (Admin)</h1>
      <p className="mt-2 text-sm text-[#888]">Mark no-show on approved reservations. 2 no-shows = 7-day block.</p>

      {reservations.length === 0 ? (
        <StateMessage type="empty" title="No reservations" description="No reservations in the system." />
      ) : (
        <div className="mt-6 overflow-x-auto border border-[#333]">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-[#333] bg-[#222]">
                <th className="px-4 py-3 text-left font-semibold text-[#ddd]">Space</th>
                <th className="px-4 py-3 text-left font-semibold text-[#ddd]">User</th>
                <th className="px-4 py-3 text-left font-semibold text-[#ddd]">Date</th>
                <th className="px-4 py-3 text-left font-semibold text-[#ddd]">Time</th>
                <th className="px-4 py-3 text-left font-semibold text-[#ddd]">Status</th>
                <th className="px-4 py-3 text-left font-semibold text-[#ddd]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {reservations.map((r) => (
                <tr key={r.id} className="border-b border-[#333]">
                  <td className="px-4 py-3 text-[#bbb]">{r.space}</td>
                  <td className="px-4 py-3 text-[#bbb]">{userName(r.userId)}</td>
                  <td className="px-4 py-3 text-[#bbb]">{r.date}</td>
                  <td className="px-4 py-3 text-[#bbb]">{r.startTime} - {r.endTime}</td>
                  <td className={`px-4 py-3 font-medium ${getStatusColor(r.status)}`}>{r.status}</td>
                  <td className="px-4 py-3">
                    {r.status === 'Approved' && (
                      <Button variant="secondary" onClick={() => handleNoShow(r)}>
                        Mark no-show
                      </Button>
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
