// signup form, adds new user to storage with role Student (prototype)
import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FiUserPlus } from 'react-icons/fi'
import Button from '../components/ui/Button'
import { SESSION_KEY } from '../utils/auth'
import { getUsers, saveUsers } from '../services/storage'
import type { User } from '../types'

export default function SignUpPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [major, setMajor] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const navigate = useNavigate()

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim() || !email.trim() || !major.trim() || !password.trim() || !confirmPassword.trim()) {
      setError('All fields are required')
      return
    }
    if (!email.trim().toLowerCase().endsWith('@eia.edu.co')) {
      setError('Only @eia.edu.co email addresses are allowed')
      return
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }
    if (password.length < 4) {
      setError('Password must be at least 4 characters')
      return
    }
    const users = getUsers()
    if (users.some((u) => u.email.toLowerCase() === email.trim().toLowerCase())) {
      setError('Email already registered')
      return
    }
    setError(null)
    setSubmitted(true)
  }

  useEffect(() => {
    if (!submitted) return
    const users = getUsers()
    const nextId = users.length ? Math.max(...users.map((u) => u.id)) + 1 : 1
    const newUser: User = {
      id: nextId,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password,
      role: 'Student',
      noShowCount: 0,
      major: major.trim() || undefined,
    }
    users.push(newUser)
    saveUsers(users)
    const session = {
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        noShowCount: newUser.noShowCount,
        blockedUntil: newUser.blockedUntil,
        major: newUser.major,
      },
    }
    localStorage.setItem(SESSION_KEY, JSON.stringify(session))
    navigate('/')
  }, [submitted, name, email, major, password, navigate])

  return (
    <main className="mx-auto max-w-md px-6 py-10">
      <section className="border border-[#333] bg-[#222] p-6">
        <div className="flex items-center gap-2 text-[#ddd]">
          <FiUserPlus className="text-[#888]" />
          <h1 className="text-xl font-semibold">Sign Up</h1>
        </div>
        <p className="mt-2 text-sm text-[#888]">Create an account with your @eia.edu.co email</p>
        {!submitted && (
          <form className="mt-4 flex flex-col gap-3" onSubmit={onSubmit}>
            <label className="flex flex-col gap-2">
              <span className="text-xs text-[#888]">Name</span>
              <input
                className="border border-[#444] bg-[#111] px-3 py-2 text-sm text-[#ddd]"
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </label>
            <label className="flex flex-col gap-2">
              <span className="text-xs text-[#888]">Email</span>
              <input
                className="border border-[#444] bg-[#111] px-3 py-2 text-sm text-[#ddd]"
                type="email"
                placeholder="you@eia.edu.co"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </label>
            <label className="flex flex-col gap-2">
              <span className="text-xs text-[#888]">Major</span>
              <input
                className="border border-[#444] bg-[#111] px-3 py-2 text-sm text-[#ddd]"
                type="text"
                placeholder="e.g. Computer Science, Electrical Engineering"
                value={major}
                onChange={(e) => setMajor(e.target.value)}
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
                minLength={4}
              />
            </label>
            <label className="flex flex-col gap-2">
              <span className="text-xs text-[#888]">Confirm password</span>
              <input
                className="border border-[#444] bg-[#111] px-3 py-2 text-sm text-[#ddd]"
                type="password"
                placeholder="••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </label>
            {error && <p className="text-sm text-red-400" role="alert">{error}</p>}
            <Button type="submit" variant="primary">
              Create account
            </Button>
            <p className="m-0 text-sm text-[#888]">
              Already have an account? <Link className="text-[#aaa] hover:underline" to="/login">Log in</Link>
            </p>
          </form>
        )}
      </section>
    </main>
  )
}
