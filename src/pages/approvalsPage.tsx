import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../components/ui/Button'
import StateMessage from '../components/ui/StateMessage'
import ConfirmModal from '../components/ui/ConfirmModal'
import { fetchAllReservations, updateReservationStatus } from '../api/reservations'
import { isAdminOrStaff } from '../utils/auth'
import type { Reservation } from '../types'

type ModalState =
  | { kind: 'approve'; reservation: Reservation }
  | { kind: 'reject'; reservation: Reservation }
  | { kind: 'error'; message: string }
  | null

function summarize(r: Reservation): string {
  const who = r.userFullName ?? 'usuario desconocido'
  return `${who}\n${r.space}\n${r.date} · ${r.startTime} - ${r.endTime}`
}

export default function ApprovalsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [modal, setModal] = useState<ModalState>(null)
  const [rejectReason, setRejectReason] = useState('')
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

  function openApprove(r: Reservation) {
    setModal({ kind: 'approve', reservation: r })
  }

  function openReject(r: Reservation) {
    setRejectReason('')
    setModal({ kind: 'reject', reservation: r })
  }

  function closeModal() {
    setModal(null)
  }

  async function confirmApprove() {
    if (modal?.kind !== 'approve') return
    const r = modal.reservation
    setModal(null)
    const res = await updateReservationStatus(r.id, { newStatus: 'Approved' })
    if (!res.ok) {
      setModal({ kind: 'error', message: res.error })
      return
    }
    void load()
  }

  async function confirmReject() {
    if (modal?.kind !== 'reject') return
    const r = modal.reservation
    const reason = rejectReason.trim() || undefined
    setModal(null)
    const res = await updateReservationStatus(r.id, { newStatus: 'Rejected', reason })
    if (!res.ok) {
      setModal({ kind: 'error', message: res.error })
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
                      <Button variant="primary" onClick={() => openApprove(r)}>Aprobar</Button>
                      <Button variant="secondary" onClick={() => openReject(r)}>Rechazar</Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmModal
        open={modal?.kind === 'approve'}
        title="Aprobar reserva"
        description={
          modal?.kind === 'approve'
            ? `¿Confirmas la aprobación de esta reserva?\n\n${summarize(modal.reservation)}`
            : undefined
        }
        confirmText="Aprobar"
        cancelText="Cancelar"
        variant="primary"
        onConfirm={confirmApprove}
        onClose={closeModal}
      />

      <ConfirmModal
        open={modal?.kind === 'reject'}
        title="Rechazar reserva"
        description={
          modal?.kind === 'reject'
            ? `¿Confirmas el rechazo de esta reserva?\n\n${summarize(modal.reservation)}`
            : undefined
        }
        confirmText="Rechazar"
        cancelText="Cancelar"
        variant="danger"
        onConfirm={confirmReject}
        onClose={closeModal}
      >
        <label className="block text-sm font-medium text-slate-700">
          Motivo del rechazo (opcional)
          <textarea
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            rows={3}
            className="mt-1 w-full rounded border border-slate-300 px-3 py-2 text-sm text-slate-800 focus:border-[#003087] focus:outline-none"
            placeholder="Explica brevemente por qué se rechaza..."
          />
        </label>
      </ConfirmModal>

      <ConfirmModal
        open={modal?.kind === 'error'}
        title="Error"
        description={modal?.kind === 'error' ? modal.message : undefined}
        confirmText="Entendido"
        cancelText=""
        variant="primary"
        onConfirm={closeModal}
        onClose={closeModal}
      />
    </main>
  )
}
