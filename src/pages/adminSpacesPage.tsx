import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../components/ui/Button'
import StateMessage from '../components/ui/StateMessage'
import Badge from '../components/ui/Badge'
import ConfirmModal from '../components/ui/ConfirmModal'
import { createSpace, deleteSpace, fetchSpaces, updateSpace } from '../api/spaces'
import { isAdmin } from '../utils/auth'
import type { Space } from '../types'

type ModalState =
  | { kind: 'delete'; space: Space }
  | { kind: 'error'; message: string }
  | null

interface SpaceFormState {
  name: string
  type: string
  capacity: number
  building: string
  resources: string
  allowedPrograms: string
  requiresApproval: boolean
  isActive: boolean
}

function emptyForm(): SpaceFormState {
  return {
    name: '',
    type: 'Classroom',
    capacity: 10,
    building: '',
    resources: '',
    allowedPrograms: '',
    requiresApproval: false,
    isActive: true,
  }
}

function spaceToForm(s: Space): SpaceFormState {
  return {
    name: s.name,
    type: s.type,
    capacity: s.capacity,
    building: s.building,
    resources: s.resources.join(','),
    allowedPrograms: s.allowedPrograms.join(','),
    requiresApproval: s.requiresApproval,
    isActive: s.isActive ?? s.status === 'AVAILABLE',
  }
}

export default function AdminSpacesPage() {
  const [spaces, setSpaces] = useState<Space[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editing, setEditing] = useState<string | null>(null)
  const [creating, setCreating] = useState(false)
  const [modal, setModal] = useState<ModalState>(null)
  const navigate = useNavigate()

  function closeModal() {
    setModal(null)
  }

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    const res = await fetchSpaces()
    if (!res.ok) setError(res.error)
    else setSpaces(res.data)
    setLoading(false)
  }, [])

  useEffect(() => {
    if (!isAdmin()) {
      navigate('/')
      return
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load()
  }, [navigate, load])

  async function handleSave(id: string, form: SpaceFormState) {
    const res = await updateSpace(id, form)
    if (!res.ok) {
      setModal({ kind: 'error', message: res.error })
      return
    }
    setEditing(null)
    void load()
  }

  async function handleCreate(form: SpaceFormState) {
    const res = await createSpace(form)
    if (!res.ok) {
      setModal({ kind: 'error', message: res.error })
      return
    }
    setCreating(false)
    void load()
  }

  function handleDelete(s: Space) {
    setModal({ kind: 'delete', space: s })
  }

  async function confirmDelete() {
    if (modal?.kind !== 'delete') return
    const id = modal.space.id
    setModal(null)
    const res = await deleteSpace(id)
    if (!res.ok) {
      setModal({ kind: 'error', message: res.error })
      return
    }
    void load()
  }

  if (!isAdmin()) return null

  return (
    <main className="mx-auto max-w-4xl px-4 py-6 sm:px-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-slate-800">Gestión de espacios</h1>
          <p className="mt-2 text-sm text-slate-500">Crea, edita o elimina espacios.</p>
        </div>
        <Button variant="primary" onClick={() => setCreating(true)} disabled={creating}>
          Nuevo espacio
        </Button>
      </div>

      {creating && (
        <div className="mt-4 border border-slate-200 bg-white p-4 rounded-md shadow-sm">
          <h2 className="font-semibold text-slate-800">Nuevo espacio</h2>
          <SpaceForm
            initial={emptyForm()}
            onSubmit={handleCreate}
            onCancel={() => setCreating(false)}
            includeIsActive={false}
          />
        </div>
      )}

      {loading ? (
        <div className="mt-6">
          <StateMessage type="loading" title="Cargando..." description="Obteniendo espacios." />
        </div>
      ) : error ? (
        <div className="mt-6">
          <StateMessage type="error" title="Error" description={error} actionText="Reintentar" onAction={load} />
        </div>
      ) : spaces.length === 0 ? (
        <div className="mt-6">
          <StateMessage type="empty" title="Sin espacios" description="Crea uno para empezar." />
        </div>
      ) : (
        <div className="mt-6 space-y-3">
          {spaces.map((s) => (
            <div key={s.id} className="border border-slate-200 bg-white p-4 rounded-md shadow-sm">
              {editing === s.id ? (
                <SpaceForm
                  initial={spaceToForm(s)}
                  onSubmit={(form) => handleSave(s.id, form)}
                  onCancel={() => setEditing(null)}
                  includeIsActive
                />
              ) : (
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h2 className="font-semibold text-slate-800">{s.name}</h2>
                    <p className="text-sm text-slate-500 mt-0.5">
                      {s.type} · Edificio: {s.building} · Capacidad: {s.capacity}
                      {s.requiresApproval && ' · Requiere aprobación'}
                    </p>
                    {s.resources.length > 0 && (
                      <p className="text-xs text-slate-400 mt-0.5">Recursos: {s.resources.join(', ')}</p>
                    )}
                    {s.allowedPrograms.length > 0 && (
                      <p className="text-xs text-slate-400 mt-0.5">Programas: {s.allowedPrograms.join(', ')}</p>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant={s.status === 'AVAILABLE' ? 'success' : 'danger'}>
                      {s.status === 'AVAILABLE' ? 'DISPONIBLE' : 'NO DISPONIBLE'}
                    </Badge>
                    <Button variant="secondary" onClick={() => setEditing(s.id)}>Editar</Button>
                    <Button variant="secondary" onClick={() => handleDelete(s)}>Eliminar</Button>
                    <Button variant="primary" onClick={() => navigate(`/spaces/${s.id}`)}>Ver</Button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <ConfirmModal
        open={modal?.kind === 'delete'}
        title="Eliminar espacio"
        description={
          modal?.kind === 'delete'
            ? `¿Eliminar el espacio "${modal.space.name}"? Esta acción no se puede deshacer.`
            : undefined
        }
        confirmText="Eliminar"
        cancelText="Cancelar"
        variant="danger"
        onConfirm={confirmDelete}
        onClose={closeModal}
      />

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

function SpaceForm({
  initial,
  onSubmit,
  onCancel,
  includeIsActive,
}: {
  initial: SpaceFormState
  onSubmit: (form: SpaceFormState) => void | Promise<void>
  onCancel: () => void
  includeIsActive: boolean
}) {
  const [form, setForm] = useState<SpaceFormState>(initial)

  function update<K extends keyof SpaceFormState>(key: K, value: SpaceFormState[K]) {
    setForm({ ...form, [key]: value })
  }

  const inputClass = 'border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 rounded focus:outline-none focus:ring-2 focus:ring-[#003087]/30 focus:border-[#003087]'

  return (
    <form
      className="mt-3 flex flex-col gap-3"
      onSubmit={(e) => {
        e.preventDefault()
        void onSubmit(form)
      }}
    >
      <label className="flex flex-col gap-1">
        <span className="text-xs font-medium text-slate-500">Nombre</span>
        <input className={inputClass} value={form.name} onChange={(e) => update('name', e.target.value)} required />
      </label>
      <label className="flex flex-col gap-1">
        <span className="text-xs font-medium text-slate-500">Tipo</span>
        <input className={inputClass} value={form.type} onChange={(e) => update('type', e.target.value)} required />
      </label>
      <label className="flex flex-col gap-1">
        <span className="text-xs font-medium text-slate-500">Edificio</span>
        <input className={inputClass} value={form.building} onChange={(e) => update('building', e.target.value)} required />
      </label>
      <label className="flex flex-col gap-1">
        <span className="text-xs font-medium text-slate-500">Capacidad</span>
        <input
          type="number"
          min={1}
          className={inputClass}
          value={form.capacity}
          onChange={(e) => update('capacity', parseInt(e.target.value, 10) || 1)}
        />
      </label>
      <label className="flex flex-col gap-1">
        <span className="text-xs font-medium text-slate-500">Recursos (separados por coma)</span>
        <input
          className={inputClass}
          placeholder="Proyector,Pizarrón,WiFi"
          value={form.resources}
          onChange={(e) => update('resources', e.target.value)}
        />
      </label>
      <label className="flex flex-col gap-1">
        <span className="text-xs font-medium text-slate-500">Programas permitidos (separados por coma)</span>
        <input
          className={inputClass}
          placeholder="Ingeniería,Sistemas"
          value={form.allowedPrograms}
          onChange={(e) => update('allowedPrograms', e.target.value)}
        />
      </label>
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          className="accent-[#003087]"
          checked={form.requiresApproval}
          onChange={(e) => update('requiresApproval', e.target.checked)}
        />
        <span className="text-sm text-slate-600">Requiere aprobación</span>
      </label>
      {includeIsActive && (
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            className="accent-[#003087]"
            checked={form.isActive}
            onChange={(e) => update('isActive', e.target.checked)}
          />
          <span className="text-sm text-slate-600">Activo</span>
        </label>
      )}
      <div className="flex gap-2">
        <Button type="submit" variant="primary">Guardar</Button>
        <Button type="button" variant="secondary" onClick={onCancel}>Cancelar</Button>
      </div>
    </form>
  )
}
