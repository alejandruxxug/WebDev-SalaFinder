/**
 * SpaceCard.tsx - Single space card
 *
 * Displays name, type, capacity, status badge. Links to space details.
 * Reserve button calls onReserve(space) - disabled when space is unavailable.
 */
import { Link } from 'react-router-dom'
import type { Space } from '../../types'
import Badge from '../ui/Badge'
import Button from '../ui/Button'
import { FiCalendar } from 'react-icons/fi'

type Props = {
  space: Space
  onReserve?: (space: Space) => void
}

export default function SpaceCard({ space, onReserve }: Props) {
  const isUnavailable = space.status === 'UNAVAILABLE'

  return (
    <article className="border border-[#333] bg-[#222] p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="m-0 text-base font-semibold text-[#ddd]">{space.name}</h3>
          <span className="mt-1 text-xs text-[#888]">{space.type}</span>
        </div>
        <Badge variant={isUnavailable ? 'danger' : 'success'}>
          {isUnavailable ? 'UNAVAILABLE' : 'AVAILABLE'}
        </Badge>
      </div>

      <div className="mt-3 text-sm text-[#bbb]">
        <span className="font-semibold">Capacity:</span> {space.capacity} people
      </div>

      <div className="mt-4 flex items-center justify-between gap-2">
        <Link to={`/spaces/${space.id}`} className="text-sm text-[#aaa] hover:underline">
          View details
        </Link>
        <Button variant="primary" disabled={isUnavailable} onClick={() => onReserve?.(space)}>
          <FiCalendar />
          {isUnavailable ? 'Unavailable' : 'Reserve'}
        </Button>
      </div>
    </article>
  )
}
