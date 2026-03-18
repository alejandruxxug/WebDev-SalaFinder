// 404, link to home
import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <main className="mx-auto max-w-md px-6 py-16 text-center">
      <h1 className="text-3xl font-bold text-slate-300">404</h1>
      <p className="mt-2 text-slate-500">Page not found.</p>
      <Link to="/" className="mt-4 inline-block text-[#003087] hover:underline font-medium">
        Go home
      </Link>
    </main>
  )
}
