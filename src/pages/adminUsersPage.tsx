import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../components/ui/Button'
import StateMessage from '../components/ui/StateMessage'
import {
  changeUserRole,
  listUsers,
  lockUser,
  unlockUser,
  type AdminUser,
} from '../api/auth'
import { getSessionUser, isAdmin } from '../utils/auth'
import type { UserRole } from '../types'

const ROLES: UserRole[] = ['Student', 'Staff', 'Admin']

type PanelMode = null | 'role' | 'lock' | 'unlock'

interface PanelState {
  mode: PanelMode
  pendingRole?: UserRole
  blockedUntil?: string
  reason: string
}

const emptyPanel: PanelState = { mode: null, reason: '' }

function formatBlockedUntil(value?: string | null): string {
  if (!value) return ''
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return value
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}

function isCurrentlyLocked(u: AdminUser): boolean {
  if (!u.blockedUntil) return false
  return new Date(u.blockedUntil) > new Date()
}

export default function AdminUsersPage() {
  const navigate = useNavigate()
  const [users, setUsers] = useState<AdminUser[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [panelByUser, setPanelByUser] = useState<Record<string, PanelState>>({})
  const [rowError, setRowError] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState<string | null>(null)

  const me = getSessionUser()
  const myId = me?.id ?? ''

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    const res = await listUsers()
    if (!res.ok) setError(res.error)
    else setUsers(res.data)
    setLoading(false)
  }, [])

  useEffect(() => {
    if (!isAdmin()) {
      navigate('/home')
      return
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load()
  }, [navigate, load])

  function setPanel(userId: string, next: PanelState) {
    setPanelByUser((prev) => ({ ...prev, [userId]: next }))
    setRowError((prev) => {
      if (!(userId in prev)) return prev
      const next = { ...prev }
      delete next[userId]
      return next
    })
  }

  function cancelPanel(userId: string) {
    setPanel(userId, emptyPanel)
  }

  function openRoleChange(u: AdminUser, newRole: UserRole) {
    if (newRole === u.role) {
      cancelPanel(u.id)
      return
    }
    setPanel(u.id, { mode: 'role', pendingRole: newRole, reason: '' })
  }

  function openLock(u: AdminUser) {
    setPanel(u.id, { mode: 'lock', reason: '', blockedUntil: '' })
  }

  function openUnlock(u: AdminUser) {
    setPanel(u.id, { mode: 'unlock', reason: '' })
  }

  async function confirmRole(u: AdminUser) {
    const panel = panelByUser[u.id]
    if (!panel?.pendingRole || !panel.reason.trim()) return
    setSubmitting(u.id)
    const res = await changeUserRole(u.id, { newRole: panel.pendingRole, reason: panel.reason.trim() })
    setSubmitting(null)
    if (!res.ok) {
      setRowError((prev) => ({ ...prev, [u.id]: res.error }))
      return
    }
    cancelPanel(u.id)
    await load()
  }

  async function confirmLock(u: AdminUser) {
    const panel = panelByUser[u.id]
    if (!panel?.blockedUntil || !panel.reason.trim()) return
    const iso = new Date(panel.blockedUntil).toISOString()
    setSubmitting(u.id)
    const res = await lockUser(u.id, { blockedUntil: iso, reason: panel.reason.trim() })
    setSubmitting(null)
    if (!res.ok) {
      setRowError((prev) => ({ ...prev, [u.id]: res.error }))
      return
    }
    cancelPanel(u.id)
    await load()
  }

  async function confirmUnlock(u: AdminUser) {
    const panel = panelByUser[u.id]
    if (!panel?.reason.trim()) return
    setSubmitting(u.id)
    const res = await unlockUser(u.id, { reason: panel.reason.trim() })
    setSubmitting(null)
    if (!res.ok) {
      setRowError((prev) => ({ ...prev, [u.id]: res.error }))
      return
    }
    cancelPanel(u.id)
    await load()
  }

  if (!isAdmin()) return null

  return (
    <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
      <h1 className="text-2xl font-semibold text-slate-800">Gestión de usuarios</h1>
      <p className="mt-2 text-sm text-slate-500">
        Cambia roles o bloquea/desbloquea usuarios manualmente. Toda acción queda registrada en auditoría con un motivo.
      </p>

      {loading ? (
        <div className="mt-6">
          <StateMessage type="loading" title="Cargando..." description="Obteniendo usuarios." />
        </div>
      ) : error ? (
        <div className="mt-6">
          <StateMessage type="error" title="Error" description={error} actionText="Reintentar" onAction={load} />
        </div>
      ) : users.length === 0 ? (
        <div className="mt-6">
          <StateMessage type="empty" title="Sin usuarios" description="No hay usuarios registrados." />
        </div>
      ) : (
        <div className="mt-6 overflow-x-auto border border-slate-200 rounded-md shadow-sm">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-4 py-3 text-left font-semibold text-slate-600">Nombre</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-600">Email</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-600">Programa</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-600">Rol</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-600">Estado</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-600">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => {
                const isSelf = u.id === myId
                const panel = panelByUser[u.id] ?? emptyPanel
                const locked = isCurrentlyLocked(u)
                const isAdminRow = u.role === 'Admin'
                const busy = submitting === u.id
                const status = isAdminRow
                  ? 'Admin (exento)'
                  : locked
                    ? `Bloqueado hasta ${formatBlockedUntil(u.blockedUntil)}`
                    : 'Activo'
                const statusClass = isAdminRow
                  ? 'text-slate-500'
                  : locked
                    ? 'text-red-600 font-medium'
                    : 'text-green-700'

                return (
                  <tr key={u.id} className="border-b border-slate-100 bg-white hover:bg-slate-50 transition-colors align-top">
                    <td className="px-4 py-3 text-slate-700">
                      {u.fullName}
                      {isSelf && <span className="ml-2 text-xs text-slate-400">(tú)</span>}
                    </td>
                    <td className="px-4 py-3 text-slate-700">{u.email}</td>
                    <td className="px-4 py-3 text-slate-700">{u.program || '—'}</td>
                    <td className="px-4 py-3">
                      <select
                        className="border border-slate-300 px-2 py-1.5 rounded text-sm focus:ring-2 focus:ring-[#003087]/30 disabled:opacity-50"
                        value={panel.mode === 'role' && panel.pendingRole ? panel.pendingRole : u.role}
                        disabled={isSelf || busy}
                        onChange={(e) => openRoleChange(u, e.target.value as UserRole)}
                      >
                        {ROLES.map((r) => (
                          <option key={r} value={r}>{r}</option>
                        ))}
                      </select>
                    </td>
                    <td className={`px-4 py-3 ${statusClass}`}>{status}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-2">
                        <div className="flex gap-2">
                          {!isAdminRow && !locked && (
                            <Button variant="secondary" onClick={() => openLock(u)} disabled={isSelf || busy}>
                              Bloquear
                            </Button>
                          )}
                          {!isAdminRow && locked && (
                            <Button variant="secondary" onClick={() => openUnlock(u)} disabled={busy}>
                              Desbloquear
                            </Button>
                          )}
                        </div>

                        {panel.mode === 'role' && (
                          <div className="border border-slate-200 bg-slate-50 p-3 rounded flex flex-col gap-2">
                            <p className="m-0 text-xs text-slate-600">
                              Cambiar rol a <strong>{panel.pendingRole}</strong>. Indica el motivo:
                            </p>
                            <input
                              type="text"
                              className="border border-slate-300 px-2 py-1.5 rounded text-sm focus:ring-2 focus:ring-[#003087]/30"
                              placeholder="Motivo (requerido)"
                              value={panel.reason}
                              onChange={(e) => setPanel(u.id, { ...panel, reason: e.target.value })}
                            />
                            <div className="flex gap-2">
                              <Button variant="primary" onClick={() => confirmRole(u)} disabled={!panel.reason.trim() || busy}>
                                Confirmar
                              </Button>
                              <Button variant="secondary" onClick={() => cancelPanel(u.id)} disabled={busy}>
                                Cancelar
                              </Button>
                            </div>
                          </div>
                        )}

                        {panel.mode === 'lock' && (
                          <div className="border border-slate-200 bg-slate-50 p-3 rounded flex flex-col gap-2">
                            <p className="m-0 text-xs text-slate-600">Bloquear usuario hasta:</p>
                            <input
                              type="datetime-local"
                              className="border border-slate-300 px-2 py-1.5 rounded text-sm focus:ring-2 focus:ring-[#003087]/30"
                              value={panel.blockedUntil ?? ''}
                              onChange={(e) => setPanel(u.id, { ...panel, blockedUntil: e.target.value })}
                            />
                            <input
                              type="text"
                              className="border border-slate-300 px-2 py-1.5 rounded text-sm focus:ring-2 focus:ring-[#003087]/30"
                              placeholder="Motivo (requerido)"
                              value={panel.reason}
                              onChange={(e) => setPanel(u.id, { ...panel, reason: e.target.value })}
                            />
                            <div className="flex gap-2">
                              <Button
                                variant="primary"
                                onClick={() => confirmLock(u)}
                                disabled={!panel.blockedUntil || !panel.reason.trim() || busy}
                              >
                                Confirmar
                              </Button>
                              <Button variant="secondary" onClick={() => cancelPanel(u.id)} disabled={busy}>
                                Cancelar
                              </Button>
                            </div>
                          </div>
                        )}

                        {panel.mode === 'unlock' && (
                          <div className="border border-slate-200 bg-slate-50 p-3 rounded flex flex-col gap-2">
                            <p className="m-0 text-xs text-slate-600">Desbloquear usuario. Indica el motivo:</p>
                            <input
                              type="text"
                              className="border border-slate-300 px-2 py-1.5 rounded text-sm focus:ring-2 focus:ring-[#003087]/30"
                              placeholder="Motivo (requerido)"
                              value={panel.reason}
                              onChange={(e) => setPanel(u.id, { ...panel, reason: e.target.value })}
                            />
                            <div className="flex gap-2">
                              <Button variant="primary" onClick={() => confirmUnlock(u)} disabled={!panel.reason.trim() || busy}>
                                Confirmar
                              </Button>
                              <Button variant="secondary" onClick={() => cancelPanel(u.id)} disabled={busy}>
                                Cancelar
                              </Button>
                            </div>
                          </div>
                        )}

                        {rowError[u.id] && (
                          <p className="m-0 text-xs text-red-600">{rowError[u.id]}</p>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </main>
  )
}
