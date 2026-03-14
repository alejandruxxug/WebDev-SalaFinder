/**
 * ToastContext.tsx - Global toast notifications
 *
 * Provides showToast() to display success/error/info messages.
 * Toasts auto-dismiss after a few seconds. Accessible via role="status".
 */
import { createContext, useContext, useState, useCallback } from 'react'
import type { ReactNode } from 'react'

export type ToastType = 'success' | 'error' | 'info'

export interface Toast {
  id: number
  message: string
  type: ToastType
}

interface ToastContextValue {
  toasts: Toast[]
  showToast: (message: string, type?: ToastType) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = Date.now()
    setToasts((prev) => [...prev, { id, message, type }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 4000)
  }, [])

  return (
    <ToastContext.Provider value={{ toasts, showToast }}>
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  )
}

function ToastContainer() {
  const ctx = useContext(ToastContext)
  if (!ctx) return null
  const { toasts } = ctx
  if (toasts.length === 0) return null

  return (
    <div
      className="fixed bottom-4 right-4 z-50 flex flex-col gap-2"
      aria-live="polite"
      aria-atomic="true"
      role="status"
    >
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`min-w-[280px] rounded border px-4 py-3 text-sm shadow-lg ${
            t.type === 'success'
              ? 'border-green-700 bg-green-900/90 text-green-100'
              : t.type === 'error'
                ? 'border-red-700 bg-red-900/90 text-red-100'
                : 'border-[#444] bg-[#222] text-[#ddd]'
          }`}
          role="alert"
        >
          {t.message}
        </div>
      ))}
    </div>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}
