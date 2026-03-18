// admin approvals: approve/reject pending reservations
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../components/ui/Button'
import StateMessage from '../components/ui/StateMessage'
import { getReservations, saveReservations } from '../services/storage'
import { getUsers } from '../services/storage'
import { logAudit } from '../services/auditService'
import { hasConflict } from '../services/conflictService'
import { getSessionUser, isAdmin } from '../utils/auth'
import type { Reservation } from '../types'

export default function ApprovalsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([])
  const navigate = useNavigate()

  function load() {
    setReservations(getReservations().filter((r) => r.status === 'Pending'))
  }

  useEffect(() => {
    if (!isAdmin()) {
      navigate('/')
      return
    }
    load()
  }, [navigate])

  function handleApprove(r: Reservation) {
    if (hasConflict(r.spaceId, r.date, r.startTime, r.endTime, r.id)) {
      alert('Cannot approve: this time slot is already reserved by another reservation')
      return
    }
    const all = getReservations()
    const idx = all.findIndex((x) => x.id === r.id)
    if (idx === -1) return
    all[idx].status = 'Approved'
    saveReservations(all)
    const user = getSessionUser()
    if (user) logAudit(user.id, 'APPROVE', 'reservation', r.id, 'Approved')
    load()
  }

  function handleReject(r: Reservation) {
    const all = getReservations()
    const idx = all.findIndex((x) => x.id === r.id)
    if (idx === -1) return
    all[idx].status = 'Rejected'
    saveReservations(all)
    const user = getSessionUser()
    if (user) logAudit(user.id, 'REJECT', 'reservation', r.id, 'Rejected')
    load()
  }

  const users = getUsers()
  const userName = (id: number) => users.find((u) => u.id === id)?.name ?? 'Unknown'

  if (!isAdmin()) return null

  if (reservations.length === 0) {
    return (
      <main className="mx-auto max-w-4xl px-6 py-6">
        <h1 className="text-2xl font-semibold text-[#ddd]">Pending Approvals</h1>
        <StateMessage type="empty" title="No pending approvals" description="All reservations are processed." />
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-4xl px-6 py-6">
      <h1 className="text-2xl font-semibold text-[#ddd]">Pending Approvals</h1>
      <div className="mt-6 overflow-x-auto border border-[#333]">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-[#333] bg-[#222]">
              <th className="px-4 py-3 text-left font-semibold text-[#ddd]">Space</th>
              <th className="px-4 py-3 text-left font-semibold text-[#ddd]">User</th>
              <th className="px-4 py-3 text-left font-semibold text-[#ddd]">Date</th>
              <th className="px-4 py-3 text-left font-semibold text-[#ddd]">Time</th>
              <th className="px-4 py-3 text-left font-semibold text-[#ddd]">Purpose</th>
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
                <td className="px-4 py-3 text-[#bbb]">{r.purpose ?? '—'}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <Button variant="primary" onClick={() => handleApprove(r)}>Approve</Button>
                    <Button variant="secondary" onClick={() => handleReject(r)}>Reject</Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  )
}
