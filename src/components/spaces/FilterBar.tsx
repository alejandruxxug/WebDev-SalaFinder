// search and filter by type, only available checkbox, reset
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
  const fieldBase = 'border border-[#444] bg-[#222] px-3 py-2 text-sm text-[#ddd]'

  return (
    <section className="mt-5 border border-[#333] bg-[#222] p-4">
      <div className="grid gap-3 lg:grid-cols-3">
        <label className="flex flex-col gap-2">
          <span className="text-xs text-[#888]">Search</span>
          <div className={`flex items-center gap-2 ${fieldBase}`}>
            <FiSearch className="text-[#666]" />
            <input
              className="w-full bg-transparent outline-none placeholder:text-[#666]"
              type="text"
              value={searchTerm}
              placeholder="Space name..."
              onChange={(e) => onSearchTerm(e.target.value)}
            />
          </div>
        </label>

        <label className="flex flex-col gap-2">
          <span className="text-xs text-[#888]">Type</span>
          <select
            className={`cursor-pointer ${fieldBase}`}
            value={selectedType}
            onChange={(e) => onSelectedType(e.target.value)}
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
        <label className="flex items-center gap-2 text-sm text-[#bbb]">
          <input type="checkbox" checked={onlyAvailable} onChange={(e) => onSetOnlyAvailable(e.target.checked)} />
          Only available
        </label>
        <Button variant="secondary" onClick={onReset}>
          <FiRefreshCcw />
          Reset
        </Button>
      </div>
    </section>
  )
}
