/**
 * LoginPage.tsx - Login form
 *
 * Validates email/password against users in localStorage. On success, saves session
 * to localStorage and redirects to the page the user came from (or home).
 * Uses controlled inputs: value and onChange keep React state in sync with the form.
 */
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
    const users = getUsers()
    const user = users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase())
    if (!user || user.password !== password) {
      setError('Invalid email or password')
      return
    }
    setError(null)
    setSubmitted(true)
  }

  // After successful validation, save session and redirect
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
      },
    }
    localStorage.setItem(SESSION_KEY, JSON.stringify(session))
    navigate(from, { replace: true })
  }, [submitted, email, navigate, from])

  return (
    <main className="mx-auto max-w-md px-6 py-10">
      <section className="border border-[#333] bg-[#222] p-6">
        <div className="flex items-center gap-2 text-[#ddd]">
          <FiLogIn className="text-[#888]" />
          <h1 className="text-xl font-semibold">Log In</h1>
        </div>
        <p className="mt-2 text-sm text-[#888]">Use a seed account (e.g. admin@test.com / 1234)</p>

        {!submitted && (
          <form className="mt-4 flex flex-col gap-3" onSubmit={onSubmit}>
            <label className="flex flex-col gap-2">
              <span className="text-xs text-[#888]">Email</span>
              <input
                className="border border-[#444] bg-[#111] px-3 py-2 text-sm text-[#ddd]"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </label>
            <label className="flex flex-col gap-2">
              <span className="text-xs text-[#888]">Password</span>
              <input
                className="border border-[#444] bg-[#111] px-3 py-2 text-sm text-[#ddd]"
                type="password"
                placeholder="••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </label>
            {error && <p className="text-sm text-red-400" role="alert">{error}</p>}
            <Button type="submit" variant="primary">
              Submit
            </Button>
            <p className="m-0 text-sm text-[#888]">
              Don&apos;t have an account? <Link className="text-[#aaa] hover:underline" to="/signup">Sign up</Link>
            </p>
          </form>
        )}
      </section>
    </main>
  )
}
