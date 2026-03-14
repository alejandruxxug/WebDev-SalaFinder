/**
 * App.tsx - Main application component
 *
 * This file sets up:
 * 1. React Router - defines all routes (URL paths) for the app
 * 2. AuthGuard - redirects unauthenticated users to login (except for /login and /signup)
 * 3. Layout - Navbar appears on every page; Routes render the page content below it
 *
 * Routing: Each <Route path="..." element={<Component />} /> maps a URL to a React component.
 * The * path catches any unknown URL and shows the 404 page.
 */
import { Route, Routes, Navigate, useLocation } from 'react-router-dom'
import Navbar from './components/layout/Navbar'
import HomePage from './pages/homePage'
import SpaceDetails from './pages/spaceDetails'
import CreateReservationPage from './pages/createReservationPage'
import ReservationsPage from './pages/reservationsPage'
import LoginPage from './pages/loginPage'
import SignUpPage from './pages/signUpPage'
import NotFoundPage from './pages/notFoundPage'
import { isLoggedIn } from './utils/auth'

/**
 * AuthGuard - Protects routes that require login.
 * If user is not logged in and tries to access a protected page, redirect to /login.
 * Login and Signup pages are always accessible (no redirect).
 */
function AuthGuard({ children }: { children: React.ReactNode }) {
  const location = useLocation()
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup'

  if (isAuthPage) return <>{children}</>
  if (!isLoggedIn()) return <Navigate to="/login" replace state={{ from: location.pathname }} />
  return <>{children}</>
}

function App() {
  return (
    <div className="min-h-screen bg-[#111] text-[#ddd]">
      <AuthGuard>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/spaces/:id" element={<SpaceDetails />} />
          <Route path="/reservations" element={<ReservationsPage />} />
          <Route path="/reservations/new" element={<CreateReservationPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AuthGuard>
    </div>
  )
}

export default App
