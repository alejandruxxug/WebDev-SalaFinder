/**
 * SpaceList.tsx - Grid of space cards
 *
 * Receives spaces array and onReserve callback as props.
 * Maps over spaces and renders a SpaceCard for each.
 * key={s.id} helps React efficiently update the list when data changes.
 */
import type { Space } from '../../types'
import SpaceCard from './SpaceCard'

type Props = {
  spaces: Space[]
  onReserve?: (space: Space) => void
}

export default function SpaceList({ spaces, onReserve }: Props) {
  return (
    <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-3" aria-label="Spaces list">
      {spaces.map((s) => (
        <SpaceCard key={s.id} space={s} onReserve={onReserve} />
      ))}
    </section>
  )
}
