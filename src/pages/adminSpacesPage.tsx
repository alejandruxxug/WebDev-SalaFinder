// admin: list and edit spaces (prototype)
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../components/ui/Button'
import StateMessage from '../components/ui/StateMessage'
import Badge from '../components/ui/Badge'
import { getSpaces, saveSpaces } from '../services/storage'
import { logAudit } from '../services/auditService'
import { getSessionUser, isAdmin } from '../utils/auth'
import type { Space } from '../types'

export default function AdminSpacesPage() {
  const [spaces, setSpaces] = useState<Space[]>([])
  const [editing, setEditing] = useState<number | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (!isAdmin()) {
      navigate('/')
      return
    }
    setSpaces(getSpaces())
  }, [navigate])

  function handleSave(space: Space) {
    const all = getSpaces()
    const idx = all.findIndex((s) => s.id === space.id)
    if (idx === -1) return
    all[idx] = space
    saveSpaces(all)
    const user = getSessionUser()
    if (user) logAudit(user.id, 'UPDATE', 'space', space.id, 'Updated')
    setSpaces(getSpaces())
    setEditing(null)
  }

  if (!isAdmin()) return null

  return (
    <main className="mx-auto max-w-4xl px-4 py-6 sm:px-6">
      <h1 className="text-2xl font-semibold text-slate-800">Manage Spaces</h1>
      <p className="mt-2 text-sm text-slate-500">Edit space details (prototype)</p>

      {spaces.length === 0 ? (
        <div className="mt-6">
          <StateMessage type="empty" title="No spaces" description="No spaces in the system." />
        </div>
      ) : (
        <div className="mt-6 space-y-3">
          {spaces.map((s) => (
            <div key={s.id} className="border border-slate-200 bg-white p-4 rounded-md shadow-sm">
              {editing === s.id ? (
                <SpaceEditForm
                  space={s}
                  onSave={handleSave}
                  onCancel={() => setEditing(null)}
                />
              ) : (
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h2 className="font-semibold text-slate-800">{s.name}</h2>
                    <p className="text-sm text-slate-500 mt-0.5">
                      {s.type} | Building: {s.building} | Capacity: {s.capacity}
                      {s.requiresApproval && ' | Requires approval'}
                    </p>
                    {s.resources.length > 0 && (
                      <p className="text-xs text-slate-400 mt-0.5">Resources: {s.resources.join(', ')}</p>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant={s.status === 'AVAILABLE' ? 'success' : 'danger'}>{s.status}</Badge>
                    <Button variant="secondary" onClick={() => setEditing(s.id)}>Edit</Button>
                    <Button variant="primary" onClick={() => navigate(`/spaces/${s.id}`)}>View</Button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </main>
  )
}

function SpaceEditForm({
  space,
  onSave,
  onCancel,
}: {
  space: Space
  onSave: (s: Space) => void
  onCancel: () => void
}) {
  const [name, setName] = useState(space.name)
  const [capacity, setCapacity] = useState(space.capacity)
  const [status, setStatus] = useState<Space['status']>(space.status)
  const [requiresApproval, setRequiresApproval] = useState(space.requiresApproval)

  const inputClass = 'border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 rounded focus:outline-none focus:ring-2 focus:ring-[#003087]/30 focus:border-[#003087]'

  return (
    <form
      className="flex flex-col gap-3"
      onSubmit={(e) => {
        e.preventDefault()
        onSave({ ...space, name, capacity, status, requiresApproval })
      }}
    >
      <label className="flex flex-col gap-1">
        <span className="text-xs font-medium text-slate-500">Name</span>
        <input
          className={inputClass}
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </label>
      <label className="flex flex-col gap-1">
        <span className="text-xs font-medium text-slate-500">Capacity</span>
        <input
          type="number"
          min={1}
          className={inputClass}
          value={capacity}
          onChange={(e) => setCapacity(parseInt(e.target.value, 10) || 1)}
        />
      </label>
      <label className="flex flex-col gap-1">
        <span className="text-xs font-medium text-slate-500">Status</span>
        <select
          className={inputClass}
          value={status}
          onChange={(e) => setStatus(e.target.value as Space['status'])}
        >
          <option value="AVAILABLE">AVAILABLE</option>
          <option value="UNAVAILABLE">UNAVAILABLE</option>
        </select>
      </label>
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          className="accent-[#003087]"
          checked={requiresApproval}
          onChange={(e) => setRequiresApproval(e.target.checked)}
        />
        <span className="text-sm text-slate-600">Requires approval</span>
      </label>
      <div className="flex gap-2">
        <Button type="submit" variant="primary">Save</Button>
        <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
      </div>
    </form>
  )
}
