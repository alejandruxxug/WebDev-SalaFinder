/**
 * SpaceDetails.tsx - Single space view
 *
 * Uses Fake API (fetchSpaceById): loading → success/error.
 */
import { Link, useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { SlArrowLeftCircle } from 'react-icons/sl'
import { FiCalendar } from 'react-icons/fi'
import StateMessage from '../components/ui/StateMessage'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import { fetchSpaceById } from '../api/fakeApi'
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
      setLoading(true)
      setError(null)
      const result = await fetchSpaceById(spaceId)
      if (result.error) {
        setError(result.error)
        setSpace(null)
      } else {
        setSpace(result.data ?? null)
      }
      setLoading(false)
    }
    void loadSpace()
  }, [spaceId])

  if (loading) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-6">
        <StateMessage type="loading" title="Loading space..." description="Fetching details..." />
      </main>
    )
  }

  if (error || !space) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-6">
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
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-sm text-[#aaa] hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-[#555] rounded"
      >
        <SlArrowLeftCircle aria-hidden />
        Back to spaces
      </Link>

      <section className="mt-4 border border-[#333] bg-[#222] p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="m-0 text-2xl font-semibold text-[#ddd]">{space.name}</h1>
            <p className="mt-2 text-sm text-[#888]">{space.type}</p>
          </div>
          <Badge variant={isUnavailable ? 'danger' : 'success'}>
            {isUnavailable ? 'UNAVAILABLE' : 'AVAILABLE'}
          </Badge>
        </div>

        <div className="mt-5 space-y-1 text-sm text-[#bbb]">
          <p><span className="font-semibold">Capacity:</span> {space.capacity} people</p>
          <p><span className="font-semibold">Building:</span> {space.building}</p>
          {space.resources.length > 0 && (
            <p><span className="font-semibold">Resources:</span> {space.resources.join(', ')}</p>
          )}
          {space.requiresApproval && (
            <p className="text-amber-400">Requires admin approval</p>
          )}
        </div>

        <div className="mt-6">
          <Button
            variant="primary"
            disabled={isUnavailable}
            onClick={() => navigate(`/reservations/new?spaceId=${space.id}`)}
          >
            <FiCalendar aria-hidden />
            {isUnavailable ? 'Unavailable' : 'Reserve this space'}
          </Button>
        </div>
      </section>
    </main>
  )
}
