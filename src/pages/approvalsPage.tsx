/**
 * ApprovalsPage.tsx - Admin: approve/reject pending reservations
 *
 * Role-based: only Admin sees this. Lists pending reservations.
 * Approve/Reject buttons with conflict check before approving.
 * Uses Fake API for updateReservationStatus.
 */
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import StateMessage from '../components/ui/StateMessage'
import Button from '../components/ui/Button'
import { updateReservationStatus } from '../api/fakeApi'
import { getReservations } from '../services/storage'
import { hasConflict } from '../services/conflictService'
import { isAdmin, getSessionUser } from '../utils/auth'
import { useToast } from '../contexts/ToastContext'
import type { Reservation } from '../types'

export default function ApprovalsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [updatingId, setUpdatingId] = useState<number | null>(null)
  const navigate = useNavigate()
  const toast = useToast()

  useEffect(() => {
    if (!isAdmin()) {
      navigate('/', { replace: true })
      return
    }
    const all = getReservations()
    setReservations(all.filter((r) => r.status === 'Pending'))
    setLoading(false)
  }, [navigate])

  async function handleApprove(r: Reservation) {
    if (hasConflict(r.spaceId, r.date, r.startTime, r.endTime)) {
      toast.showToast('Cannot approve: time slot conflicts with an approved reservation.', 'error')
      return
    }
    setUpdatingId(r.id)
    const result = await updateReservationStatus(r.id, 'Approved')
    setUpdatingId(null)
    if (result.error) {
      toast.showToast(result.error, 'error')
      setError(result.error)
    } else {
      toast.showToast('Reservation approved.', 'success')
      setReservations((prev) => prev.filter((x) => x.id !== r.id))
    }
  }

  async function handleReject(r: Reservation) {
    setUpdatingId(r.id)
    const result = await updateReservationStatus(r.id, 'Rejected')
    setUpdatingId(null)
    if (result.error) {
      toast.showToast(result.error, 'error')
    } else {
      toast.showToast('Reservation rejected.', 'info')
      setReservations((prev) => prev.filter((x) => x.id !== r.id))
    }
  }

  if (!getSessionUser()) return null
  if (!isAdmin()) return null

  if (loading) {
    return (
      <main className="mx-auto max-w-4xl px-6 py-6">
        <StateMessage type="loading" title="Loading..." description="Fetching pending reservations." />
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-4xl px-6 py-6">
      <h1 className="text-2xl font-semibold text-[#ddd]">Pending Approvals</h1>
      <p className="mt-2 text-sm text-[#888]">Approve or reject reservation requests.</p>

      {error && (
        <div className="mt-4 rounded border border-red-800 bg-red-900/30 px-4 py-2 text-sm text-red-300" role="alert">
          {error}
        </div>
      )}

      {reservations.length === 0 ? (
        <StateMessage
          type="empty"
          title="No pending approvals"
          description="All reservations have been processed."
          actionText="Go home"
          onAction={() => navigate('/')}
        />
      ) : (
        <div className="mt-6 space-y-4">
          {reservations.map((r) => (
            <article
              key={r.id}
              className="flex flex-wrap items-center justify-between gap-4 border border-[#333] bg-[#222] p-4"
            >
              <div>
                <p className="m-0 font-medium text-[#ddd]">{r.space}</p>
                <p className="mt-1 text-sm text-[#888]">
                  {r.date} • {r.startTime}–{r.endTime} • {r.purpose ?? '—'}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="primary"
                  onClick={() => handleApprove(r)}
                  disabled={updatingId === r.id}
                  aria-label={`Approve reservation for ${r.space}`}
                >
                  {updatingId === r.id ? '...' : 'Approve'}
                </Button>
                <Button
                  variant="danger"
                  onClick={() => handleReject(r)}
                  disabled={updatingId === r.id}
                  aria-label={`Reject reservation for ${r.space}`}
                >
                  Reject
                </Button>
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  )
}
