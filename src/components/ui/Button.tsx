// button with primary, secondary, danger variants
type Props = {
  children: React.ReactNode
  onClick?: () => void
  disabled?: boolean
  variant?: 'primary' | 'secondary' | 'danger'
  type?: 'button' | 'submit'
}

export default function Button({
  children,
  onClick,
  disabled = false,
  variant = 'primary',
  type = 'button',
}: Props) {
  const base = 'inline-flex items-center justify-center gap-2 px-3 py-2 text-sm border rounded cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-colors'

  const variants = {
    primary: 'bg-[#003087] text-white border-[#003087] hover:bg-[#002470]',
    secondary: 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50',
    danger: 'bg-white text-red-600 border-red-300 hover:bg-red-50',
  }

  return (
    <button type={type} className={`${base} ${variants[variant]}`} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  )
}
