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
  const fieldBase = 'border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 rounded'

  return (
    <section className="mt-5 border border-slate-200 bg-white p-4 rounded-md shadow-sm">
      <div className="grid gap-3 lg:grid-cols-3">
        <label className="flex flex-col gap-2">
          <span className="text-xs font-medium text-slate-500">Search</span>
          <div className={`flex items-center gap-2 ${fieldBase}`}>
            <FiSearch className="text-slate-400" />
            <input
              className="w-full bg-transparent outline-none placeholder:text-slate-400 text-slate-700"
              type="text"
              value={searchTerm}
              placeholder="Space name..."
              onChange={(e) => onSearchTerm(e.target.value)}
            />
          </div>
        </label>

        <label className="flex flex-col gap-2">
          <span className="text-xs font-medium text-slate-500">Type</span>
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
        <label className="flex items-center gap-2 text-sm text-slate-600">
          <input
            type="checkbox"
            checked={onlyAvailable}
            onChange={(e) => onSetOnlyAvailable(e.target.checked)}
            className="accent-[#003087]"
          />
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
