/**
 * Navbar.tsx - Top navigation bar
 *
 * Uses NavLink from React Router for client-side navigation (no full page reload).
 * - NavLink gets an "active" class when the current URL matches its path
 * - Shows Login/Sign Up when logged out; Log out when logged in
 * - Basic links: Spaces (home), My Reservations, New Reservation
 */
import { NavLink, useNavigate } from 'react-router-dom'
import { FiCalendar, FiLogIn, FiUserPlus, FiList, FiLogOut } from 'react-icons/fi'
import { isLoggedIn, logout } from '../../utils/auth'

const linkBase = 'text-sm text-[#999] hover:text-white'
const active = 'text-white font-semibold'

export default function Navbar() {
  const navigate = useNavigate()
  const loggedIn = isLoggedIn()

  function handleLogout() {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <header className="border-b border-[#333] bg-[#1a1a1a]">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <NavLink to="/" className="flex items-center gap-2 text-white">
          <FiCalendar className="text-[#888]" />
          <h2 className="text-lg font-semibold">SalaFinder</h2>
        </NavLink>

        <nav className="flex items-center gap-4" aria-label="Primary navigation">
          <NavLink to="/" className={({ isActive }) => (isActive ? `${linkBase} ${active}` : linkBase)}>
            Spaces
          </NavLink>
          <NavLink to="/reservations" className={({ isActive }) => (isActive ? `${linkBase} ${active}` : linkBase)}>
            <span className="inline-flex items-center gap-2">
              <FiList />
              My Reservations
            </span>
          </NavLink>
          <NavLink to="/reservations/new" className={({ isActive }) => (isActive ? `${linkBase} ${active}` : linkBase)}>
            New Reservation
          </NavLink>
          {loggedIn ? (
            <button onClick={handleLogout} className={`${linkBase} inline-flex items-center gap-2 border-none bg-transparent`}>
              <FiLogOut />
              Log out
            </button>
          ) : (
            <>
              <NavLink to="/login" className={({ isActive }) => (isActive ? `${linkBase} ${active}` : linkBase)}>
                <span className="inline-flex items-center gap-2">
                  <FiLogIn />
                  Log In
                </span>
              </NavLink>
              <NavLink to="/signup" className={({ isActive }) => (isActive ? `${linkBase} ${active}` : linkBase)}>
                <span className="inline-flex items-center gap-2">
                  <FiUserPlus />
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
