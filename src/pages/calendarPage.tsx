// basic week calendar view with filters (type, capacity, building, resource)
import { useState, useMemo } from 'react'
import { getSpaces } from '../services/storage'
import { getReservations } from '../services/storage'

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
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
  const [filterType, setFilterType] = useState<string>('ALL')
  const [filterBuilding, setFilterBuilding] = useState<string>('ALL')
  const [filterResource, setFilterResource] = useState<string>('ALL')
  const [minCapacity, setMinCapacity] = useState<number>(0)

  const spaces = getSpaces()
  const reservations = getReservations()
  const approved = reservations.filter((r) => r.status === 'Approved')

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

  const spaceIds = new Set(filteredSpaces.map((s) => s.id))
  const filteredReservations = approved.filter((r) => spaceIds.has(r.spaceId))

  const types = Array.from(new Set(spaces.map((s) => s.type))).sort()
  const buildings = Array.from(new Set(spaces.map((s) => s.building))).sort()
  const resources = Array.from(new Set(spaces.flatMap((s) => s.resources))).sort()

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

  return (
    <main className="mx-auto max-w-6xl px-6 py-6">
      <h1 className="text-2xl font-semibold text-[#ddd]">Week Calendar</h1>

      <div className="mt-4 flex flex-wrap gap-4 border border-[#333] bg-[#222] p-4">
        <label className="flex flex-col gap-1">
          <span className="text-xs text-[#888]">Type</span>
          <select
            className="border border-[#444] bg-[#111] px-2 py-1 text-sm text-[#ddd]"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="ALL">All</option>
            {types.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-xs text-[#888]">Building</span>
          <select
            className="border border-[#444] bg-[#111] px-2 py-1 text-sm text-[#ddd]"
            value={filterBuilding}
            onChange={(e) => setFilterBuilding(e.target.value)}
          >
            <option value="ALL">All</option>
            {buildings.map((b) => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-xs text-[#888]">Resource</span>
          <select
            className="border border-[#444] bg-[#111] px-2 py-1 text-sm text-[#ddd]"
            value={filterResource}
            onChange={(e) => setFilterResource(e.target.value)}
          >
            <option value="ALL">All</option>
            {resources.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-xs text-[#888]">Min capacity</span>
          <input
            type="number"
            min={0}
            className="w-20 border border-[#444] bg-[#111] px-2 py-1 text-sm text-[#ddd]"
            value={minCapacity || ''}
            onChange={(e) => setMinCapacity(parseInt(e.target.value, 10) || 0)}
          />
        </label>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <button
          className="border border-[#444] bg-[#222] px-3 py-1 text-sm text-[#ddd] hover:bg-[#333]"
          onClick={prevWeek}
        >
          Prev week
        </button>
        <span className="text-sm text-[#888]">
          {weekDates[0].toLocaleDateString()} – {weekDates[6].toLocaleDateString()}
        </span>
        <button
          className="border border-[#444] bg-[#222] px-3 py-1 text-sm text-[#ddd] hover:bg-[#333]"
          onClick={nextWeek}
        >
          Next week
        </button>
      </div>

      <div className="mt-4 overflow-x-auto border border-[#333]">
        <table className="w-full border-collapse text-xs">
          <thead>
            <tr className="border-b border-[#333] bg-[#222]">
              <th className="w-16 border-r border-[#333] px-2 py-2 text-left font-semibold text-[#ddd]">Time</th>
              {weekDates.map((d) => (
                <th key={d.getTime()} className="border-r border-[#333] px-2 py-2 text-left font-semibold text-[#ddd] last:border-r-0">
                  {DAYS[d.getDay() === 0 ? 6 : d.getDay() - 1]} {d.getDate()}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {SLOTS.map((slot) => (
              <tr key={slot} className="border-b border-[#333]">
                <td className="border-r border-[#333] px-2 py-2 text-[#888]">{slot}</td>
                {weekDates.map((d) => {
                  const dateStr = formatDate(d)
                  const cells: { space: string; purpose?: string }[] = []
                  for (const r of filteredReservations) {
                    if (r.date !== dateStr) continue
                    if (r.startTime <= slot && r.endTime > slot) {
                      cells.push({ space: r.space, purpose: r.purpose })
                    }
                  }
                  return (
                    <td key={d.getTime()} className="border-r border-[#333] px-2 py-2 align-top last:border-r-0">
                      {cells.map((c, i) => (
                        <div key={i} className="mb-1 rounded bg-green-900/40 px-1 py-0.5 text-[#aaa]">
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
    </main>
  )
}
