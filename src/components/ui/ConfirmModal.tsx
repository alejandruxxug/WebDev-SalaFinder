import { useEffect, useRef } from 'react'
import Button from './Button'

type Variant = 'primary' | 'danger'

type Props = {
  open: boolean
  title: string
  description?: string
  children?: React.ReactNode
  confirmText?: string
  cancelText?: string
  variant?: Variant
  onConfirm: () => void
  onClose: () => void
}

export default function ConfirmModal({
  open,
  title,
  description,
  children,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  variant = 'primary',
  onConfirm,
  onClose,
}: Props) {
  const confirmRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    confirmRef.current?.focus()
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-lg bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-5">
          <h2 id="confirm-modal-title" className="text-lg font-semibold text-slate-800">
            {title}
          </h2>
          {description && (
            <p className="mt-2 text-sm text-slate-600 whitespace-pre-line">{description}</p>
          )}
          {children && <div className="mt-4">{children}</div>}
        </div>
        <div className="flex justify-end gap-2 border-t border-slate-200 px-6 py-3 bg-slate-50 rounded-b-lg">
          {cancelText && (
            <Button variant="secondary" onClick={onClose}>
              {cancelText}
            </Button>
          )}
          <button
            ref={confirmRef}
            type="button"
            onClick={() => {
              onConfirm()
            }}
            className={`inline-flex items-center justify-center gap-2 px-3 py-2 text-sm border rounded cursor-pointer transition-colors ${
              variant === 'danger'
                ? 'bg-red-600 text-white border-red-600 hover:bg-red-700'
                : 'bg-[#003087] text-white border-[#003087] hover:bg-[#002470]'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}
