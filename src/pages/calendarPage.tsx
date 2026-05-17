import { useState, useMemo, useEffect, useCallback } from 'react'
import StateMessage from '../components/ui/StateMessage'
import { fetchSpaces } from '../api/spaces'
import { fetchAllReservations, fetchMyReservations } from '../api/reservations'
import { isAdminOrStaff } from '../utils/auth'
import type { Space, Reservation } from '../types'

const DAYS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']
const SLOTS = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00']

function getWeekDates(base: Date): Date[] {
  const d = new Date(base)
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? -6 : 1)
  d.setDate(diff)
  return Array.from({ length: 7 }, (_, i) => {
    const x = new Date(d)
    x.setDate(d.getDate() + i)
    return x
  })
}

function formatDate(d: Date) {
  return d.toISOString().slice(0, 10)
}

export default function CalendarPage() {
  const [baseDate, setBaseDate] = useState(new Date())
  const [filterType, setFilterType] = useState('ALL')
  const [filterBuilding, setFilterBuilding] = useState('ALL')
  const [filterResource, setFilterResource] = useState('ALL')
  const [minCapacity, setMinCapacity] = useState<number>(0)

  const [spaces, setSpaces] = useState<Space[]>([])
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    const [spacesRes, reservationsRes] = await Promise.all([
      fetchSpaces(),
      isAdminOrStaff() ? fetchAllReservations() : fetchMyReservations(),
    ])
    if (!spacesRes.ok) {
      setError(spacesRes.error)
      setLoading(false)
      return
    }
    if (!reservationsRes.ok) {
      setError(reservationsRes.error)
      setLoading(false)
      return
    }
    setSpaces(spacesRes.data)
    setReservations(reservationsRes.data)
    setLoading(false)
  }, [])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load()
  }, [load])

  const weekDates = useMemo(() => getWeekDates(baseDate), [baseDate])

  const filteredSpaces = useMemo(() => {
    return spaces.filter((s) => {
      if (filterType !== 'ALL' && s.type !== filterType) return false
      if (filterBuilding !== 'ALL' && s.building !== filterBuilding) return false
      if (filterResource !== 'ALL' && !s.resources.includes(filterResource)) return false
      if (minCapacity > 0 && s.capacity < minCapacity) return false
      return true
    })
  }, [spaces, filterType, filterBuilding, filterResource, minCapacity])

  const displayReservations = reservations.filter(
    (r) => r.status === 'Approved' || r.status === 'Pending',
  )

  const spaceIds = new Set(filteredSpaces.map((s) => s.id))
  const filteredReservations = displayReservations.filter((r) => spaceIds.has(r.spaceId))

  const types = useMemo(() => Array.from(new Set(spaces.map((s) => s.type))).sort(), [spaces])
  const buildings = useMemo(() => Array.from(new Set(spaces.map((s) => s.building))).sort(), [spaces])
  const resources = useMemo(() => Array.from(new Set(spaces.flatMap((s) => s.resources))).sort(), [spaces])

  function prevWeek() {
    const d = new Date(baseDate)
    d.setDate(d.getDate() - 7)
    setBaseDate(d)
  }

  function nextWeek() {
    const d = new Date(baseDate)
    d.setDate(d.getDate() + 7)
    setBaseDate(d)
  }

  const selectClass = 'border border-slate-300 bg-white px-2 py-1.5 text-sm text-slate-700 rounded focus:outline-none focus:ring-2 focus:ring-[#003087]/30 focus:border-[#003087]'

  return (
    <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
      <h1 className="text-2xl font-semibold text-slate-800">Calendario semanal</h1>

      <div className="mt-4 flex flex-wrap gap-4 border border-slate-200 bg-white p-4 rounded-md shadow-sm">
        <label className="flex flex-col gap-1">
          <span className="text-xs font-medium text-slate-500">Tipo</span>
          <select className={selectClass} value={filterType} onChange={(e) => setFilterType(e.target.value)}>
            <option value="ALL">Todos</option>
            {types.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-xs font-medium text-slate-500">Edificio</span>
          <select className={selectClass} value={filterBuilding} onChange={(e) => setFilterBuilding(e.target.value)}>
            <option value="ALL">Todos</option>
            {buildings.map((b) => <option key={b} value={b}>{b}</option>)}
          </select>
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-xs font-medium text-slate-500">Recurso</span>
          <select className={selectClass} value={filterResource} onChange={(e) => setFilterResource(e.target.value)}>
            <option value="ALL">Todos</option>
            {resources.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-xs font-medium text-slate-500">Capacidad mín.</span>
          <input
            type="number"
            min={0}
            className={`w-20 ${selectClass}`}
            value={minCapacity || ''}
            onChange={(e) => setMinCapacity(parseInt(e.target.value, 10) || 0)}
          />
        </label>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <button
          className="border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50 rounded transition-colors"
          onClick={prevWeek}
        >
          Semana anterior
        </button>
        <span className="text-sm font-medium text-slate-600">
          {weekDates[0].toLocaleDateString()} – {weekDates[6].toLocaleDateString()}
        </span>
        <button
          className="border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50 rounded transition-colors"
          onClick={nextWeek}
        >
          Semana siguiente
        </button>
      </div>

      <div className="mt-2 flex gap-4 text-xs text-slate-500">
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-3 w-3 rounded bg-green-200 border border-green-400" /> Aprobada
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-3 w-3 rounded bg-amber-200 border border-amber-400" /> Pendiente
        </span>
      </div>

      {loading ? (
        <div className="mt-4">
          <StateMessage type="loading" title="Cargando..." description="Obteniendo calendario." />
        </div>
      ) : error ? (
        <div className="mt-4">
          <StateMessage type="error" title="Error" description={error} actionText="Reintentar" onAction={load} />
        </div>
      ) : (
        <div className="mt-4 overflow-x-auto border border-slate-200 rounded-md shadow-sm">
          <table className="w-full border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="w-16 border-r border-slate-200 px-2 py-2 text-left font-semibold text-slate-600">Hora</th>
                {weekDates.map((d) => (
                  <th key={d.getTime()} className="border-r border-slate-200 px-2 py-2 text-left font-semibold text-slate-600 last:border-r-0">
                    {DAYS[d.getDay() === 0 ? 6 : d.getDay() - 1]} {d.getDate()}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {SLOTS.map((slot) => (
                <tr key={slot} className="border-b border-slate-100">
                  <td className="border-r border-slate-200 px-2 py-2 text-slate-500 bg-slate-50 font-medium">{slot}</td>
                  {weekDates.map((d) => {
                    const dateStr = formatDate(d)
                    const cells: { space: string; purpose?: string; status: string }[] = []
                    for (const r of filteredReservations) {
                      if (r.date !== dateStr) continue
                      if (r.startTime <= slot && r.endTime > slot) {
                        cells.push({ space: r.space, purpose: r.purpose, status: r.status })
                      }
                    }
                    return (
                      <td key={d.getTime()} className="border-r border-slate-100 px-2 py-2 align-top last:border-r-0 bg-white">
                        {cells.map((c, i) => (
                          <div
                            key={i}
                            className={`mb-1 rounded px-1.5 py-0.5 text-xs font-medium ${
                              c.status === 'Pending'
                                ? 'bg-amber-100 text-amber-700 border border-amber-300'
                                : 'bg-green-100 text-green-700 border border-green-300'
                            }`}
                          >
                            {c.space} {c.purpose ? `(${c.purpose})` : ''}
                          </div>
                        ))}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  )
}
