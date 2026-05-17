import { useEffect } from 'react'
import { Route, Routes, Navigate, useLocation } from 'react-router-dom'
import Navbar from './components/layout/Navbar'
import BlockedBanner from './components/admin/BlockedBanner'
import HomePage from './pages/homePage'
import SpaceDetails from './pages/spaceDetails'
import CreateReservationPage from './pages/createReservationPage'
import ReservationsPage from './pages/reservationsPage'
import ApprovalsPage from './pages/approvalsPage'
import AdminReservationsPage from './pages/adminReservationsPage'
import AdminSpacesPage from './pages/adminSpacesPage'
import AuditLogPage from './pages/auditLogPage'
import CalendarPage from './pages/calendarPage'
import LoginPage from './pages/loginPage'
import SignUpPage from './pages/signUpPage'
import NotFoundPage from './pages/notFoundPage'
import { isLoggedIn } from './utils/auth'
import { fetchMe } from './api/auth'

function AuthGuard({ children }: { children: React.ReactNode }) {
  const location = useLocation()
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup'

  if (isAuthPage) return <>{children}</>
  if (!isLoggedIn()) return <Navigate to="/login" replace state={{ from: location.pathname }} />
  return <>{children}</>
}

function App() {
  useEffect(() => {
    if (isLoggedIn()) {
      void fetchMe()
    }
  }, [])

  return (
    <div className="min-h-screen bg-[#f4f6f9] text-[#0f1923]">
      <AuthGuard>
        <Navbar />
        <BlockedBanner />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/spaces/:id" element={<SpaceDetails />} />
          <Route path="/reservations" element={<ReservationsPage />} />
          <Route path="/reservations/new" element={<CreateReservationPage />} />
          <Route path="/approvals" element={<ApprovalsPage />} />
          <Route path="/admin/reservations" element={<AdminReservationsPage />} />
          <Route path="/admin/spaces" element={<AdminSpacesPage />} />
          <Route path="/admin/audit" element={<AuditLogPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AuthGuard>
    </div>
  )
}

export default App
