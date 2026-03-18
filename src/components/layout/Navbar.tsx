// top nav with links, shows Log out when logged in
import { NavLink, useNavigate } from 'react-router-dom'
import { FiCalendar, FiLogIn, FiUserPlus, FiList, FiLogOut, FiCheckCircle } from 'react-icons/fi'
import { isLoggedIn, logout, isAdmin } from '../../utils/auth'

const linkBase = 'text-sm text-blue-200 hover:text-white hover:bg-[#002470] px-3 py-1.5 rounded transition-colors'
const active = 'text-white bg-[#002470] font-semibold'

export default function Navbar() {
  const navigate = useNavigate()
  const loggedIn = isLoggedIn()

  function handleLogout() {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <header className="bg-[#003087] shadow-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
        <NavLink to="/" className="flex items-center gap-2.5 text-white">
          <div className="flex h-8 w-8 items-center justify-center rounded bg-white/20">
            <FiCalendar className="text-white" size={16} />
          </div>
          <div className="leading-tight">
            <p className="m-0 text-[10px] font-medium uppercase tracking-widest text-blue-200">EIA University</p>
            <h2 className="m-0 text-base font-bold text-white">SalaFinder</h2>
          </div>
        </NavLink>

        <nav className="flex items-center gap-1" aria-label="Primary navigation">
          <NavLink to="/" end className={({ isActive }) => (isActive ? `${linkBase} ${active}` : linkBase)}>
            Spaces
          </NavLink>
          <NavLink to="/calendar" className={({ isActive }) => (isActive ? `${linkBase} ${active}` : linkBase)}>
            Calendar
          </NavLink>
          <NavLink to="/reservations" className={({ isActive }) => (isActive ? `${linkBase} ${active}` : linkBase)}>
            <span className="inline-flex items-center gap-1.5">
              <FiList />
              My Reservations
            </span>
          </NavLink>
          <NavLink to="/reservations/new" className={({ isActive }) => (isActive ? `${linkBase} ${active}` : linkBase)}>
            New Reservation
          </NavLink>
          {loggedIn && isAdmin() && (
            <>
              <NavLink to="/approvals" className={({ isActive }) => (isActive ? `${linkBase} ${active}` : linkBase)}>
                <span className="inline-flex items-center gap-1.5">
                  <FiCheckCircle />
                  Approvals
                </span>
              </NavLink>
              <NavLink to="/admin/reservations" className={({ isActive }) => (isActive ? `${linkBase} ${active}` : linkBase)}>
                No-shows
              </NavLink>
              <NavLink to="/admin/spaces" className={({ isActive }) => (isActive ? `${linkBase} ${active}` : linkBase)}>
                Manage Spaces
              </NavLink>
            </>
          )}
          {loggedIn ? (
            <button
              onClick={handleLogout}
              className={`${linkBase} inline-flex items-center gap-1.5 border-none bg-transparent cursor-pointer`}
            >
              <FiLogOut />
              Log out
            </button>
          ) : (
            <>
              <NavLink to="/login" className={({ isActive }) => (isActive ? `${linkBase} ${active}` : linkBase)}>
                <span className="inline-flex items-center gap-1.5">
                  <FiLogIn />
                  Log In
                </span>
              </NavLink>
              <NavLink to="/signup" className={({ isActive }) => (isActive ? `${linkBase} ${active}` : linkBase)}>
                <span className="inline-flex items-center gap-1.5">
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
