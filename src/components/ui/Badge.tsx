// status pill: success, danger, neutral
type Props = {
  children: React.ReactNode
  variant?: 'success' | 'danger' | 'neutral'
}

export default function Badge({ children, variant = 'neutral' }: Props) {
  const base = 'inline-flex items-center px-2 py-0.5 text-xs font-medium rounded'
  const variants = {
    success: 'bg-green-100 text-green-700',
    danger: 'bg-red-100 text-red-600',
    neutral: 'bg-slate-100 text-slate-500',
  }

  return <span className={`${base} ${variants[variant]}`}>{children}</span>
}
