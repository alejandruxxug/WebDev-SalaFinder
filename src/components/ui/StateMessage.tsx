/**
 * StateMessage.tsx - Loading, error, and empty states
 *
 * Shows an icon and message based on type. Optional action button (e.g. "Try again").
 * Used when data is loading, when an error occurs, or when a list is empty.
 */
import { FiLoader, FiAlertTriangle, FiInbox } from 'react-icons/fi'
import Button from './Button'

type Props = {
  title: string
  type: 'empty' | 'loading' | 'error'
  description?: string
  actionText?: string
  onAction?: () => void
}

export default function StateMessage({ title, type, description, actionText, onAction }: Props) {
  const Icon = type === 'loading' ? FiLoader : type === 'error' ? FiAlertTriangle : FiInbox
  const ring =
    type === 'error'
      ? 'border-red-800 text-red-400'
      : type === 'loading'
        ? 'border-[#444] text-[#888]'
        : 'border-[#444] text-[#666]'

  return (
    <div className="border border-[#333] bg-[#222] p-6 text-center">
      <div className={`mx-auto mb-3 flex h-10 w-10 items-center justify-center border ${ring}`}>
        <Icon className={type === 'loading' ? 'animate-spin' : ''} />
      </div>
      <h2 className="m-0 text-base font-semibold text-[#ddd]">{title}</h2>
      {description && <p className="mt-2 text-sm text-[#888]">{description}</p>}
      {actionText && onAction && (
        <div className="mt-4 flex justify-center">
          <Button variant="secondary" onClick={onAction}>
            {actionText}
          </Button>
        </div>
      )}
    </div>
  )
}
