import { Link, useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { SlArrowLeftCircle } from 'react-icons/sl'
import { FiCalendar } from 'react-icons/fi'
import StateMessage from '../components/ui/StateMessage'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import { fetchSpaceById } from '../api/spaces'
import type { Space } from '../types'

export default function SpaceDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const spaceId = id ?? ''

  const [space, setSpace] = useState<Space | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!spaceId) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setError('Identificador de espacio inválido')
      setLoading(false)
      return
    }
    let cancelled = false
    async function load() {
      setLoading(true)
      setError(null)
      const res = await fetchSpaceById(spaceId)
      if (cancelled) return
      if (!res.ok) setError(res.error)
      else setSpace(res.data)
      setLoading(false)
    }
    void load()
    return () => {
      cancelled = true
    }
  }, [spaceId])

  if (loading) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-6 sm:px-6">
        <StateMessage type="loading" title="Cargando espacio..." description="Obteniendo detalles..." />
      </main>
    )
  }

  if (error || !space) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-6 sm:px-6">
        <StateMessage
          type="error"
          title="Espacio no encontrado"
          description={error ?? 'No se pudo cargar el espacio.'}
          actionText="Ir al inicio"
          onAction={() => navigate('/')}
        />
      </main>
    )
  }

  const isUnavailable = space.status === 'UNAVAILABLE'

  return (
    <main className="mx-auto max-w-3xl px-6 py-6">
      <Link to="/" className="inline-flex items-center gap-2 text-sm text-[#003087] hover:underline">
        <SlArrowLeftCircle />
        Volver a espacios
      </Link>

      <section className="mt-4 border border-slate-200 bg-white p-6 rounded-md shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="m-0 text-2xl font-semibold text-slate-800">{space.name}</h1>
            <p className="mt-2 text-sm text-slate-500">{space.type}</p>
          </div>
          <Badge variant={isUnavailable ? 'danger' : 'success'}>
            {isUnavailable ? 'NO DISPONIBLE' : 'DISPONIBLE'}
          </Badge>
        </div>

        <div className="mt-5 space-y-1.5 text-sm text-slate-600">
          <p><span className="font-semibold text-slate-700">Capacidad:</span> {space.capacity} personas</p>
          <p><span className="font-semibold text-slate-700">Edificio:</span> {space.building}</p>
          {space.resources.length > 0 && (
            <p><span className="font-semibold text-slate-700">Recursos:</span> {space.resources.join(', ')}</p>
          )}
          {space.allowedPrograms.length > 0 && (
            <p><span className="font-semibold text-slate-700">Programas:</span> {space.allowedPrograms.join(', ')}</p>
          )}
          {space.requiresApproval && (
            <p className="text-amber-600 font-medium">Requiere aprobación del administrador</p>
          )}
        </div>

        <div className="mt-6">
          <Button
            variant="primary"
            disabled={isUnavailable}
            onClick={() => navigate(`/reservations/new?spaceId=${space.id}`)}
          >
            <FiCalendar />
            {isUnavailable ? 'No disponible' : 'Reservar este espacio'}
          </Button>
        </div>
      </section>
    </main>
  )
}
