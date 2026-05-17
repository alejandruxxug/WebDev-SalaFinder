import { useState, useMemo, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import SpaceList from '../components/spaces/SpaceList'
import FilterBar from '../components/spaces/FilterBar'
import StateMessage from '../components/ui/StateMessage'
import { fetchSpaces } from '../api/spaces'
import type { Space } from '../types'

export default function HomePage() {
  const [spaces, setSpaces] = useState<Space[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [searchTerm, setSearchTerm] = useState('')
  const [selectedType, setSelectedType] = useState('ALL')
  const [selectedBuilding, setSelectedBuilding] = useState('ALL')
  const [selectedResource, setSelectedResource] = useState('ALL')
  const [minCapacity, setMinCapacity] = useState('')
  const [onlyAvailable, setOnlyAvailable] = useState(false)

  const navigate = useNavigate()

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      setError(null)
      const res = await fetchSpaces()
      if (cancelled) return
      if (!res.ok) setError(res.error)
      else setSpaces(res.data)
      setLoading(false)
    }
    void load()
    return () => {
      cancelled = true
    }
  }, [])

  const types = useMemo(
    () => Array.from(new Set(spaces.map((s) => s.type))).sort(),
    [spaces],
  )
  const buildings = useMemo(
    () => Array.from(new Set(spaces.map((s) => s.building))).sort(),
    [spaces],
  )
  const resources = useMemo(
    () => Array.from(new Set(spaces.flatMap((s) => s.resources))).sort(),
    [spaces],
  )

  const filteredSpaces = useMemo(() => {
    const term = searchTerm.trim().toLowerCase()
    const min = parseInt(minCapacity, 10)
    return spaces.filter((s) => {
      if (term && !s.name.toLowerCase().includes(term)) return false
      if (selectedType !== 'ALL' && s.type !== selectedType) return false
      if (selectedBuilding !== 'ALL' && s.building !== selectedBuilding) return false
      if (selectedResource !== 'ALL' && !s.resources.includes(selectedResource)) return false
      if (!Number.isNaN(min) && min > 0 && s.capacity < min) return false
      if (onlyAvailable && s.status !== 'AVAILABLE') return false
      return true
    })
  }, [spaces, searchTerm, selectedType, selectedBuilding, selectedResource, minCapacity, onlyAvailable])

  function handleReset() {
    setSearchTerm('')
    setSelectedType('ALL')
    setSelectedBuilding('ALL')
    setSelectedResource('ALL')
    setMinCapacity('')
    setOnlyAvailable(false)
  }

  function handleReserve(space: Space) {
    navigate(`/reservations/new?spaceId=${space.id}`)
  }

  const showEmpty = !loading && !error && filteredSpaces.length === 0

  return (
    <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
      <h1 className="m-0 text-2xl font-semibold text-slate-800">Espacios disponibles</h1>
      <p className="mt-2 text-sm text-slate-500">
        Explora y reserva salas, laboratorios y canchas.
      </p>

      <FilterBar
        searchTerm={searchTerm}
        onSearchTerm={setSearchTerm}
        types={types}
        selectedType={selectedType}
        onSelectedType={setSelectedType}
        buildings={buildings}
        selectedBuilding={selectedBuilding}
        onSelectedBuilding={setSelectedBuilding}
        resources={resources}
        selectedResource={selectedResource}
        onSelectedResource={setSelectedResource}
        minCapacity={minCapacity}
        onMinCapacity={setMinCapacity}
        onlyAvailable={onlyAvailable}
        onSetOnlyAvailable={setOnlyAvailable}
        onReset={handleReset}
      />

      <div className="mt-3 flex justify-end">
        <span className="border border-slate-200 bg-white px-3 py-1 text-xs text-slate-500 rounded">
          Resultados: {filteredSpaces.length}
        </span>
      </div>

      <section className="mt-4">
        {loading ? (
          <StateMessage
            type="loading"
            title="Cargando espacios..."
            description="Un momento por favor."
          />
        ) : error ? (
          <StateMessage
            type="error"
            title="No se pudieron cargar los espacios"
            description={error}
            actionText="Reintentar"
            onAction={() => window.location.reload()}
          />
        ) : showEmpty ? (
          <StateMessage
            type="empty"
            title="Sin resultados"
            description="Cambia los filtros o restablécelos."
            actionText="Restablecer filtros"
            onAction={handleReset}
          />
        ) : (
          <SpaceList spaces={filteredSpaces} onReserve={handleReserve} />
        )}
      </section>
    </main>
  )
}
