// space detail view, reserve button
import { Link, useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { SlArrowLeftCircle } from 'react-icons/sl'
import { FiCalendar } from 'react-icons/fi'
import StateMessage from '../components/ui/StateMessage'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import { getSpaceById } from '../services/spaceService'
import type { Space } from '../types'

export default function SpaceDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const spaceId = Number(id)

  const [space, setSpace] = useState<Space | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!Number.isFinite(spaceId)) {
      setError('Invalid space ID')
      setLoading(false)
      return
    }

    async function loadSpace() {
      try {
        setLoading(true)
        setError(null)
        const data = await getSpaceById(spaceId)
        setSpace(data)
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }
    void loadSpace()
  }, [spaceId])

  if (loading) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-6 sm:px-6">
        <StateMessage type="loading" title="Loading space..." description="Fetching details..." />
      </main>
    )
  }

  if (error || !space) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-6 sm:px-6">
        <StateMessage
          type="error"
          title="Space not found"
          description={error ?? 'The space could not be loaded.'}
          actionText="Go home"
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
        Back to spaces
      </Link>

      <section className="mt-4 border border-slate-200 bg-white p-6 rounded-md shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="m-0 text-2xl font-semibold text-slate-800">{space.name}</h1>
            <p className="mt-2 text-sm text-slate-500">{space.type}</p>
          </div>
          <Badge variant={isUnavailable ? 'danger' : 'success'}>
            {isUnavailable ? 'UNAVAILABLE' : 'AVAILABLE'}
          </Badge>
        </div>

        <div className="mt-5 space-y-1.5 text-sm text-slate-600">
          <p><span className="font-semibold text-slate-700">Capacity:</span> {space.capacity} people</p>
          <p><span className="font-semibold text-slate-700">Building:</span> {space.building}</p>
          {space.resources.length > 0 && (
            <p><span className="font-semibold text-slate-700">Resources:</span> {space.resources.join(', ')}</p>
          )}
          {space.requiresApproval && (
            <p className="text-amber-600 font-medium">Requires admin approval</p>
          )}
        </div>

        <div className="mt-6">
          <Button
            variant="primary"
            disabled={isUnavailable}
            onClick={() => navigate(`/reservations/new?spaceId=${space.id}`)}
          >
            <FiCalendar />
            {isUnavailable ? 'Unavailable' : 'Reserve this space'}
          </Button>
        </div>
      </section>
    </main>
  )
}
