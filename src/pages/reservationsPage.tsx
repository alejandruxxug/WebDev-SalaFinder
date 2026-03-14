/**
 * ReservationsPage.tsx - List of current user's reservations
 *
 * Uses Fake API (fetchReservations, updateReservationStatus): loading → success/error.
 * Cancel flow: Modal confirmation → API call → toast.
 */
import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import StateMessage from '../components/ui/StateMessage'
import Button from '../components/ui/Button'
import Modal from '../components/ui/Modal'
import { fetchReservations, updateReservationStatus } from '../api/fakeApi'
import { getSessionUser } from '../utils/auth'
import { useToast } from '../contexts/ToastContext'
import type { Reservation } from '../types'

function getStatusColor(status: string) {
  if (status === 'Pending') return 'text-amber-400'
  if (status === 'Approved') return 'text-green-400'
  if (status === 'Rejected' || status === 'Cancelled') return 'text-red-400'
  return 'text-[#888]'
}

export default function ReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [cancelTarget, setCancelTarget] = useState<Reservation | null>(null)
  const [cancelling, setCancelling] = useState(false)
  const navigate = useNavigate()
  const user = getSessionUser()
  const toast = useToast()

  const loadReservations = useCallback(async () => {
    const uid = user?.id
    if (!uid) return
    setLoading(true)
    setError(null)
    const result = await fetchReservations()
    if (result.error) {
      setError(result.error)
      setReservations([])
    } else {
      const mine = (result.data ?? []).filter((r) => r.userId === uid)
      setReservations(mine)
    }
    setLoading(false)
  }, [user?.id])

  useEffect(() => {
    void loadReservations()
  }, [loadReservations])

  async function handleConfirmCancel() {
    if (!cancelTarget) return
    setCancelling(true)
    const result = await updateReservationStatus(cancelTarget.id, 'Cancelled')
    setCancelling(false)
    setCancelTarget(null)
    if (result.error) {
      toast.showToast(result.error, 'error')
    } else {
      toast.showToast('Reservation cancelled.', 'info')
      void loadReservations()
    }
  }

  const canCancel = (r: Reservation) => r.status === 'Pending' || r.status === 'Approved'

  if (!user) {
    return (
      <main className="mx-auto max-w-4xl px-6 py-6">
        <StateMessage
          type="error"
          title="Not logged in"
          description="Log in to see your reservations."
          actionText="Log in"
          onAction={() => navigate('/login')}
        />
      </main>
    )
  }

  if (loading) {
    return (
      <main className="mx-auto max-w-4xl px-6 py-6">
        <StateMessage type="loading" title="Loading..." description="Fetching your reservations." />
      </main>
    )
  }

  if (error) {
    return (
      <main className="mx-auto max-w-4xl px-6 py-6">
        <StateMessage
          type="error"
          title="Failed to load"
          description={error}
          actionText="Try again"
          onAction={() => loadReservations()}
        />
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
              <th className="px-4 py-3 text-left font-semibold text-[#ddd]">Actions</th>
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
                <td className="px-4 py-3">
                  {canCancel(r) && (
                    <Button
                      variant="danger"
                      onClick={() => setCancelTarget(r)}
                      aria-label={`Cancel reservation for ${r.space}`}
                    >
                      Cancel
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={!!cancelTarget}
        onClose={() => !cancelling && setCancelTarget(null)}
        title="Cancel reservation?"
      >
        {cancelTarget && (
          <>
            <p className="text-sm text-[#bbb]">
              {cancelTarget.space} — {cancelTarget.date} {cancelTarget.startTime}–{cancelTarget.endTime}
            </p>
            <div className="mt-4 flex gap-2">
              <Button variant="danger" onClick={handleConfirmCancel} disabled={cancelling}>
                {cancelling ? 'Cancelling...' : 'Yes, cancel'}
              </Button>
              <Button variant="secondary" onClick={() => setCancelTarget(null)} disabled={cancelling}>
                Keep reservation
              </Button>
            </div>
          </>
        )}
      </Modal>
    </main>
  )
}
