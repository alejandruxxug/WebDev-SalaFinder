/**
 * HomePage.tsx - Space listing with search
 *
 * Demonstrates:
 * - useState: holds spaces, loading, error, and search term
 * - useEffect: fetches spaces when the component mounts (runs once on load)
 * - useMemo: filters spaces only when spaces or searchTerm changes (avoids recalculating every render)
 * - Controlled input: searchTerm is React state; input value and onChange update it
 */
import { useState, useMemo, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import SpaceList from '../components/spaces/SpaceList'
import StateMessage from '../components/ui/StateMessage'
import { getSpaces } from '../services/spaceService'
import type { Space } from '../types'

export default function HomePage() {
  const [spaces, setSpaces] = useState<Space[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  const navigate = useNavigate()

  // Load spaces when component mounts. useEffect with [] runs once after first render.
  useEffect(() => {
    async function loadSpaces() {
      try {
        setLoading(true)
        setError(null)
        const data = await getSpaces()
        setSpaces(data)
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }
    void loadSpaces()
  }, [])

  // Filter spaces by search term. useMemo caches result until spaces or searchTerm changes.
  const filteredSpaces = useMemo(() => {
    const term = searchTerm.trim().toLowerCase()
    if (!term) return spaces
    return spaces.filter((s) => s.name.toLowerCase().includes(term))
  }, [spaces, searchTerm])

  function handleReserve(space: Space) {
    navigate(`/reservations/new?spaceId=${space.id}`)
  }

  const showEmpty = !loading && !error && filteredSpaces.length === 0

  return (
    <main className="mx-auto max-w-6xl px-6 py-6">
      <h1 className="m-0 text-2xl font-semibold">Available Spaces</h1>
      <p className="mt-2 text-sm text-[#888]">Browse and reserve rooms, labs, and courts.</p>

      {/* Simple search: controlled input bound to searchTerm state */}
      <div className="mt-4 border border-[#333] bg-[#222] p-4">
        <label className="flex flex-col gap-2">
          <span className="text-xs text-[#888]">Search by name</span>
          <input
            className="border border-[#444] bg-[#111] px-3 py-2 text-sm text-[#ddd]"
            type="text"
            placeholder="Type to filter..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </label>
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
            description="Try a different search term."
            actionText="Clear search"
            onAction={() => setSearchTerm('')}
          />
        ) : (
          <SpaceList spaces={filteredSpaces} onReserve={handleReserve} />
        )}
      </section>
    </main>
  )
}
