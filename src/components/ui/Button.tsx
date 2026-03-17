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
  const base = 'inline-flex items-center justify-center gap-2 px-3 py-2 text-sm border cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'

  const variants = {
    primary: 'bg-[#444] text-white border-[#555] hover:bg-[#555]',
    secondary: 'bg-[#222] text-[#ddd] border-[#444] hover:bg-[#333]',
    danger: 'bg-[#222] text-red-400 border-red-800 hover:bg-[#2a2222]',
  }

  return (
    <button type={type} className={`${base} ${variants[variant]}`} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  )
}
