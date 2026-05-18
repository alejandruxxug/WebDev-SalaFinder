import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FiUserPlus, FiEye, FiEyeOff } from 'react-icons/fi'
import Button from '../components/ui/Button'
import { login, register } from '../api/auth'

export default function SignUpPage() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [program, setProgram] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const navigate = useNavigate()

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!fullName.trim() || !email.trim() || !program.trim() || !password.trim() || !confirmPassword.trim()) {
      setError('Todos los campos son obligatorios')
      return
    }
    if (!email.trim().toLowerCase().endsWith('@eia.edu.co')) {
      setError('Solo se permiten correos @eia.edu.co')
      return
    }
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden')
      return
    }
    if (password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres')
      return
    }
    if (!/\d/.test(password)) {
      setError('La contraseña debe incluir al menos un número')
      return
    }
    setError(null)
    setSubmitting(true)
    const reg = await register({
      fullName: fullName.trim(),
      email: email.trim().toLowerCase(),
      password,
      program: program.trim(),
      role: 'Student',
    })
    if (!reg.ok) {
      setSubmitting(false)
      setError(reg.error)
      return
    }
    const session = await login(email.trim().toLowerCase(), password)
    setSubmitting(false)
    if (!session.ok) {
      setError(session.error)
      return
    }
    navigate('/home')
  }

  const inputClass = 'border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 rounded focus:outline-none focus:ring-2 focus:ring-[#003087]/30 focus:border-[#003087]'

  return (
    <main className="mx-auto max-w-md px-4 py-10 sm:px-6">
      <div className="mb-6 text-center">
        <p className="text-xs font-medium uppercase tracking-widest text-[#003087]">EIA University</p>
        <h1 className="mt-1 text-2xl font-bold text-slate-800">SalaFinder</h1>
      </div>
      <section className="border border-slate-200 bg-white p-6 rounded-md shadow-sm">
        <div className="flex items-center gap-2 text-slate-700">
          <FiUserPlus className="text-[#003087]" />
          <h2 className="text-xl font-semibold">Crear cuenta</h2>
        </div>
        <p className="mt-2 text-sm text-slate-500">Regístrate con tu correo @eia.edu.co</p>

        <form className="mt-4 flex flex-col gap-3" onSubmit={onSubmit}>
          <label className="flex flex-col gap-2">
            <span className="text-xs font-medium text-slate-500">Nombre completo</span>
            <input
              className={inputClass}
              type="text"
              placeholder="Tu nombre"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </label>
          <label className="flex flex-col gap-2">
            <span className="text-xs font-medium text-slate-500">Correo</span>
            <input
              className={inputClass}
              type="email"
              placeholder="you@eia.edu.co"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
          <label className="flex flex-col gap-2">
            <span className="text-xs font-medium text-slate-500">Programa</span>
            <input
              className={inputClass}
              type="text"
              placeholder="p. ej. Ingeniería de Sistemas"
              value={program}
              onChange={(e) => setProgram(e.target.value)}
              required
            />
          </label>
          <label className="flex flex-col gap-2">
            <span className="text-xs font-medium text-slate-500">Contraseña</span>
            <div className="relative">
              <input
                className={`${inputClass} w-full pr-10`}
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
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
          <label className="flex flex-col gap-2">
            <span className="text-xs font-medium text-slate-500">Confirmar contraseña</span>
            <div className="relative">
              <input
                className={`${inputClass} w-full pr-10`}
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((v) => !v)}
                aria-label={showConfirmPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                className="absolute inset-y-0 right-2 flex items-center text-slate-500 hover:text-slate-700"
              >
                {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </label>
          {error && <p className="text-sm text-red-600" role="alert">{error}</p>}
          <Button type="submit" variant="primary" disabled={submitting}>
            {submitting ? 'Creando cuenta...' : 'Crear cuenta'}
          </Button>
          <p className="m-0 text-sm text-slate-500">
            ¿Ya tienes cuenta? <Link className="text-[#003087] hover:underline font-medium" to="/login">Inicia sesión</Link>
          </p>
        </form>
      </section>
    </main>
  )
}
