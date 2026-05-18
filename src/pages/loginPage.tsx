import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { FiLogIn, FiEye, FiEyeOff } from 'react-icons/fi'
import Button from '../components/ui/Button'
import { login } from '../api/auth'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: string })?.from ?? '/home'

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim() || !password.trim()) {
      setError('El correo y la contraseña son obligatorios')
      return
    }
    if (!email.trim().toLowerCase().endsWith('@eia.edu.co')) {
      setError('Solo se permiten correos @eia.edu.co')
      return
    }
    setError(null)
    setSubmitting(true)
    const result = await login(email.trim().toLowerCase(), password)
    setSubmitting(false)
    if (result.error) {
      setError(result.error)
      return
    }
    navigate(from, { replace: true })
  }

  return (
    <main className="mx-auto max-w-md px-4 py-10 sm:px-6">
      <div className="mb-6 text-center">
        <p className="text-xs font-medium uppercase tracking-widest text-[#003087]">EIA University</p>
        <h1 className="mt-1 text-2xl font-bold text-slate-800">SalaFinder</h1>
      </div>
      <section className="border border-slate-200 bg-white p-6 rounded-md shadow-sm">
        <div className="flex items-center gap-2 text-slate-700">
          <FiLogIn className="text-[#003087]" />
          <h2 className="text-xl font-semibold">Iniciar sesión</h2>
        </div>
        <p className="mt-2 text-sm text-slate-500">Ingresa con tu correo @eia.edu.co</p>

        <form className="mt-4 flex flex-col gap-3" onSubmit={onSubmit}>
          <label className="flex flex-col gap-2">
            <span className="text-xs font-medium text-slate-500">Correo</span>
            <input
              className="border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 rounded focus:outline-none focus:ring-2 focus:ring-[#003087]/30 focus:border-[#003087]"
              type="email"
              placeholder="you@eia.edu.co"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
          <label className="flex flex-col gap-2">
            <span className="text-xs font-medium text-slate-500">Contraseña</span>
            <div className="relative">
              <input
                className="w-full border border-slate-300 bg-white px-3 py-2 pr-10 text-sm text-slate-800 rounded focus:outline-none focus:ring-2 focus:ring-[#003087]/30 focus:border-[#003087]"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                className="absolute inset-y-0 right-2 flex items-center text-slate-500 hover:text-slate-700"
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </label>
          {error && <p className="text-sm text-red-600" role="alert">{error}</p>}
          <Button type="submit" variant="primary" disabled={submitting}>
            <FiLogIn />
            {submitting ? 'Ingresando...' : 'Ingresar'}
          </Button>
          <p className="m-0 text-sm text-slate-500">
            ¿No tienes cuenta? <Link className="text-[#003087] hover:underline font-medium" to="/signup">Regístrate</Link>
          </p>
        </form>
      </section>
    </main>
  )
}
