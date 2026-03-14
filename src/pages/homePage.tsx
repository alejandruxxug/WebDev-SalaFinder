/**
 * HomePage.tsx - Space listing with filters
 *
 * Uses Fake API (fetchSpaces): loading → success/error.
 * FilterBar: search, type, only available.
 */
import { useState, useMemo, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import SpaceList from '../components/spaces/SpaceList'
import FilterBar from '../components/spaces/FilterBar'
import StateMessage from '../components/ui/StateMessage'
import { fetchSpaces } from '../api/fakeApi'
import type { Space } from '../types'

export default function HomePage() {
  const [spaces, setSpaces] = useState<Space[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedType, setSelectedType] = useState<string>('ALL')
  const [onlyAvailable, setOnlyAvailable] = useState(false)

  const navigate = useNavigate()

  useEffect(() => {
    async function loadSpaces() {
      setLoading(true)
      setError(null)
      const result = await fetchSpaces()
      if (result.error) {
        setError(result.error)
        setSpaces([])
      } else {
        setSpaces(result.data ?? [])
      }
      setLoading(false)
    }
    void loadSpaces()
  }, [])

  const types = useMemo(() => Array.from(new Set(spaces.map((s) => s.type))).sort(), [spaces])

  const filteredSpaces = useMemo(() => {
    const term = searchTerm.trim().toLowerCase()
    return spaces.filter((s) => {
      const matchesSearch = !term || s.name.toLowerCase().includes(term)
      const matchesType = selectedType === 'ALL' || s.type === selectedType
      const matchesAvailability = !onlyAvailable || s.status === 'AVAILABLE'
      return matchesSearch && matchesType && matchesAvailability
    })
  }, [spaces, searchTerm, selectedType, onlyAvailable])

  function handleReset() {
    setSearchTerm('')
    setSelectedType('ALL')
    setOnlyAvailable(false)
  }

  function handleReserve(space: Space) {
    navigate(`/reservations/new?spaceId=${space.id}`)
  }

  const showEmpty = !loading && !error && filteredSpaces.length === 0

  return (
    <main className="mx-auto max-w-6xl px-6 py-6">
      <h1 className="m-0 text-2xl font-semibold">Available Spaces</h1>
      <p className="mt-2 text-sm text-[#888]">Browse and reserve rooms, labs, and courts.</p>

      <FilterBar
        searchTerm={searchTerm}
        onSearchTerm={setSearchTerm}
        types={types}
        selectedType={selectedType}
        onSelectedType={setSelectedType}
        onlyAvailable={onlyAvailable}
        onSetOnlyAvailable={setOnlyAvailable}
        onReset={handleReset}
      />

      <div className="mt-3 flex justify-end">
        <span className="border border-[#333] bg-[#222] px-3 py-1 text-xs text-[#888]">
          Results: {filteredSpaces.length}
        </span>
      </div>

      <section className="mt-4">
        {loading ? (
          <StateMessage type="loading" title="Loading spaces..." description="Please wait a moment." />
        ) : error ? (
          <StateMessage
            type="error"
            title="Failed to load spaces"
            description={error}
            actionText="Try again"
            onAction={() => window.location.reload()}
          />
        ) : showEmpty ? (
          <StateMessage
            type="empty"
            title="No results"
            description="Try changing the filters or resetting them."
            actionText="Reset filters"
            onAction={handleReset}
          />
        ) : (
          <SpaceList spaces={filteredSpaces} onReserve={handleReserve} />
        )}
      </section>
    </main>
  )
}
