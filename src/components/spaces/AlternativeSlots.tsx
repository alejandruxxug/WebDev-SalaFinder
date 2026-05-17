import Button from '../ui/Button'
import type { AlternativeSlot } from '../../types'

type Props = {
  slots: AlternativeSlot[]
  onPick: (slot: AlternativeSlot) => void
}

export default function AlternativeSlots({ slots, onPick }: Props) {
  if (slots.length === 0) return null

  return (
    <div className="mt-3 border border-amber-200 bg-amber-50 p-3 rounded">
      <p className="text-xs font-semibold uppercase tracking-wide text-amber-700">
        Horarios alternativos sugeridos
      </p>
      <ul className="mt-2 flex flex-col gap-2">
        {slots.map((s, i) => (
          <li key={`${s.date}-${s.startTime}-${i}`} className="flex items-center justify-between gap-3 rounded bg-white px-3 py-2 text-sm text-slate-700">
            <span>
              <strong>{s.date}</strong> · {s.startTime} – {s.endTime}
            </span>
            <Button variant="secondary" onClick={() => onPick(s)}>
              Usar este horario
            </Button>
          </li>
        ))}
      </ul>
    </div>
  )
}
