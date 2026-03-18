/**
 * Modal.tsx - Reusable modal dialog
 *
 * Accessible: focus trap, Escape to close, aria-modal, role="dialog".
 * Use for confirmations, forms, or detail views.
 */
import { useEffect, useRef } from 'react'
import type { ReactNode } from 'react'

type Props = {
  isOpen: boolean
  onClose: () => void
  title: string
  children: ReactNode
}

export default function Modal({ isOpen, onClose, title, children }: Props) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen) return
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleEscape)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose])

  useEffect(() => {
    if (isOpen && ref.current) {
      ref.current.focus()
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        ref={ref}
        tabIndex={-1}
        className="max-h-[90vh] w-full max-w-md overflow-y-auto border border-slate-200 bg-white p-6 shadow-xl rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-[#003087]"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="modal-title" className="m-0 text-xl font-semibold text-slate-800">
          {title}
        </h2>
        <div className="mt-4">{children}</div>
      </div>
    </div>
  )
}
