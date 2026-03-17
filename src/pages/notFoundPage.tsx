// 404, link to home
import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <main className="mx-auto max-w-md px-6 py-16 text-center">
      <h1 className="text-3xl font-bold text-[#888]">404</h1>
      <p className="mt-2 text-[#888]">Page not found.</p>
      <Link to="/" className="mt-4 inline-block text-[#aaa] hover:underline">
        Go home
      </Link>
    </main>
  )
}
