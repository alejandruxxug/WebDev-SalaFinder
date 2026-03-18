// login form, validates against users, saves session, checks blocked
import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { FiLogIn } from 'react-icons/fi'
import Button from '../components/ui/Button'
import { SESSION_KEY } from '../utils/auth'
import { getUsers } from '../services/storage'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: string })?.from ?? '/'

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim() || !password.trim()) {
      setError('Email and password are required')
      return
    }
    if (!email.trim().toLowerCase().endsWith('@eia.edu.co')) {
      setError('Only @eia.edu.co email addresses can access this app')
      return
    }
    const users = getUsers()
    const user = users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase())
    if (!user || user.password !== password) {
      setError('Invalid email or password')
      return
    }
    if (user.blockedUntil && new Date(user.blockedUntil) > new Date()) {
      setError(`Account blocked until ${user.blockedUntil}. Contact admin.`)
      return
    }
    setError(null)
    setSubmitted(true)
  }

  useEffect(() => {
    if (!submitted) return
    const users = getUsers()
    const user = users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase())
    if (!user) return
    const session = {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        noShowCount: user.noShowCount,
        blockedUntil: user.blockedUntil,
        major: user.major,
      },
    }
    localStorage.setItem(SESSION_KEY, JSON.stringify(session))
    navigate(from, { replace: true })
  }, [submitted, email, navigate, from])

  return (
    <main className="mx-auto max-w-md px-6 py-10">
      <div className="mb-6 text-center">
        <p className="text-xs font-medium uppercase tracking-widest text-[#003087]">EIA University</p>
        <h1 className="mt-1 text-2xl font-bold text-slate-800">SalaFinder</h1>
      </div>
      <section className="border border-slate-200 bg-white p-6 rounded-md shadow-sm">
        <div className="flex items-center gap-2 text-slate-700">
          <FiLogIn className="text-[#003087]" />
          <h2 className="text-xl font-semibold">Log In</h2>
        </div>
        <p className="mt-2 text-sm text-slate-500">Sign in with your @eia.edu.co email</p>

        {!submitted && (
          <form className="mt-4 flex flex-col gap-3" onSubmit={onSubmit}>
            <label className="flex flex-col gap-2">
              <span className="text-xs font-medium text-slate-500">Email</span>
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
              <span className="text-xs font-medium text-slate-500">Password</span>
              <input
                className="border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 rounded focus:outline-none focus:ring-2 focus:ring-[#003087]/30 focus:border-[#003087]"
                type="password"
                placeholder="••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </label>
            {error && <p className="text-sm text-red-600" role="alert">{error}</p>}
            <Button type="submit" variant="primary">
              <FiLogIn />
              Sign in
            </Button>
            <p className="m-0 text-sm text-slate-500">
              Don&apos;t have an account? <Link className="text-[#003087] hover:underline font-medium" to="/signup">Sign up</Link>
            </p>
          </form>
        )}
      </section>
    </main>
  )
}
