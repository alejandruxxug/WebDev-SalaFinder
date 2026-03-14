/**
 * Navbar.tsx - Top navigation bar
 *
 * Role-based UI: Admin sees Approvals link.
 * Blocked users: New Reservation hidden (cannot reserve).
 */
import { NavLink, useNavigate } from 'react-router-dom'
import { FiCalendar, FiLogIn, FiUserPlus, FiList, FiLogOut, FiCheckCircle } from 'react-icons/fi'
import { isLoggedIn, logout, isAdmin, isBlocked } from '../../utils/auth'

const linkBase = 'text-sm text-[#999] hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#555] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1a1a1a] rounded'
const active = 'text-white font-semibold'

export default function Navbar() {
  const navigate = useNavigate()
  const loggedIn = isLoggedIn()
  const showAdmin = loggedIn && isAdmin()
  const blocked = isBlocked()

  function handleLogout() {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <header className="border-b border-[#333] bg-[#1a1a1a]">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <NavLink to="/" className="flex items-center gap-2 text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#555] rounded">
          <FiCalendar className="text-[#888]" aria-hidden />
          <h2 className="text-lg font-semibold">SalaFinder</h2>
        </NavLink>

        <nav className="flex items-center gap-4" aria-label="Primary navigation">
          <NavLink to="/" className={({ isActive }) => (isActive ? `${linkBase} ${active}` : linkBase)}>
            Spaces
          </NavLink>
          <NavLink to="/reservations" className={({ isActive }) => (isActive ? `${linkBase} ${active}` : linkBase)}>
            <span className="inline-flex items-center gap-2">
              <FiList aria-hidden />
              My Reservations
            </span>
          </NavLink>
          {!blocked && (
            <NavLink to="/reservations/new" className={({ isActive }) => (isActive ? `${linkBase} ${active}` : linkBase)}>
              New Reservation
            </NavLink>
          )}
          {showAdmin && (
            <NavLink to="/approvals" className={({ isActive }) => (isActive ? `${linkBase} ${active}` : linkBase)}>
              <span className="inline-flex items-center gap-2">
                <FiCheckCircle aria-hidden />
                Approvals
              </span>
            </NavLink>
          )}
          {loggedIn ? (
            <button
              onClick={handleLogout}
              className={`${linkBase} inline-flex items-center gap-2 border-none bg-transparent`}
              aria-label="Log out"
            >
              <FiLogOut aria-hidden />
              Log out
            </button>
          ) : (
            <>
              <NavLink to="/login" className={({ isActive }) => (isActive ? `${linkBase} ${active}` : linkBase)}>
                <span className="inline-flex items-center gap-2">
                  <FiLogIn aria-hidden />
                  Log In
                </span>
              </NavLink>
              <NavLink to="/signup" className={({ isActive }) => (isActive ? `${linkBase} ${active}` : linkBase)}>
                <span className="inline-flex items-center gap-2">
                  <FiUserPlus aria-hidden />
                  Sign Up
                </span>
              </NavLink>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
