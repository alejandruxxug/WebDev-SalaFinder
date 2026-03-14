/**
 * FilterBar.tsx - Search and filter controls
 *
 * Search by name, filter by type, toggle "only available".
 * Accessible: labels, focus-visible styles.
 */
import { FiRefreshCcw, FiSearch } from 'react-icons/fi'
import Button from '../ui/Button'
import type { SpaceType } from '../../types'

type Props = {
  searchTerm: string
  onSearchTerm: (value: string) => void
  types: SpaceType[]
  selectedType: string
  onSelectedType: (value: string) => void
  onlyAvailable: boolean
  onSetOnlyAvailable: (value: boolean) => void
  onReset: () => void
}

export default function FilterBar({
  searchTerm,
  onSearchTerm,
  types,
  selectedType,
  onSelectedType,
  onlyAvailable,
  onSetOnlyAvailable,
  onReset,
}: Props) {
  const fieldBase = 'border border-[#444] bg-[#222] px-3 py-2 text-sm text-[#ddd] rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-[#555]'

  return (
    <section className="mt-5 border border-[#333] bg-[#222] p-4" aria-label="Filter spaces">
      <div className="grid gap-3 lg:grid-cols-3">
        <label htmlFor="filter-search" className="flex flex-col gap-2">
          <span className="text-xs text-[#888]">Search</span>
          <div className={`flex items-center gap-2 ${fieldBase}`}>
            <FiSearch className="text-[#666]" aria-hidden />
            <input
              id="filter-search"
              className="w-full bg-transparent outline-none placeholder:text-[#666] focus:outline-none"
              type="text"
              value={searchTerm}
              placeholder="Space name..."
              onChange={(e) => onSearchTerm(e.target.value)}
              aria-label="Search by space name"
            />
          </div>
        </label>

        <label htmlFor="filter-type" className="flex flex-col gap-2">
          <span className="text-xs text-[#888]">Type</span>
          <select
            id="filter-type"
            className={`cursor-pointer ${fieldBase}`}
            value={selectedType}
            onChange={(e) => onSelectedType(e.target.value)}
            aria-label="Filter by space type"
          >
            <option value="ALL">All</option>
            {types.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <label className="flex cursor-pointer items-center gap-2 text-sm text-[#bbb]">
          <input
            type="checkbox"
            checked={onlyAvailable}
            onChange={(e) => onSetOnlyAvailable(e.target.checked)}
            aria-label="Show only available spaces"
            className="rounded focus:ring-2 focus:ring-[#555] focus:ring-offset-0 focus:ring-offset-[#111]"
          />
          Only available
        </label>
        <Button variant="secondary" onClick={onReset} aria-label="Reset filters">
          <FiRefreshCcw aria-hidden />
          Reset
        </Button>
      </div>
    </section>
  )
}
