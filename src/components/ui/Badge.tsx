/**
 * Badge.tsx - Status pill / label
 *
 * Used for AVAILABLE (green), UNAVAILABLE (red), or neutral text.
 */
type Props = {
  children: React.ReactNode
  variant?: 'success' | 'danger' | 'neutral'
}

export default function Badge({ children, variant = 'neutral' }: Props) {
  const base = 'inline-flex items-center px-2 py-0.5 text-xs font-medium'
  const variants = {
    success: 'bg-[#1a3320] text-[#6ee7a0]',
    danger: 'bg-[#331a1a] text-[#f87171]',
    neutral: 'bg-[#333] text-[#888]',
  }

  return <span className={`${base} ${variants[variant]}`}>{children}</span>
}
