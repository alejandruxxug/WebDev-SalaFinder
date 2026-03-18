// loading, error, empty states with optional action button
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
      ? 'border-red-300 text-red-500'
      : type === 'loading'
        ? 'border-slate-300 text-slate-400'
        : 'border-slate-300 text-slate-400'

  return (
    <div className="border border-slate-200 bg-white p-6 text-center rounded-md shadow-sm">
      <div className={`mx-auto mb-3 flex h-10 w-10 items-center justify-center border rounded-full ${ring}`}>
        <Icon className={type === 'loading' ? 'animate-spin' : ''} />
      </div>
      <h2 className="m-0 text-base font-semibold text-slate-700">{title}</h2>
      {description && <p className="mt-2 text-sm text-slate-500">{description}</p>}
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
