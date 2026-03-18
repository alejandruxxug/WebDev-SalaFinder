// top nav with links, shows Log out when logged in
import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { FiLogIn, FiUserPlus, FiList, FiLogOut, FiCheckCircle, FiMenu, FiX } from 'react-icons/fi'
import { isLoggedIn, logout, isAdmin } from '../../utils/auth'

const linkBase = 'text-sm text-blue-200 hover:text-white hover:bg-[#002470] px-3 py-1.5 rounded transition-colors'
const active = 'text-white bg-[#002470] font-semibold'

export default function Navbar() {
  const navigate = useNavigate()
  const loggedIn = isLoggedIn()
  const [menuOpen, setMenuOpen] = useState(false)

  function handleLogout() {
    logout()
    navigate('/login', { replace: true })
    setMenuOpen(false)
  }

  function closeMenu() {
    setMenuOpen(false)
  }

  const navLinks = (
    <>
      <NavLink to="/" end className={({ isActive }) => (isActive ? `${linkBase} ${active}` : linkBase)} onClick={closeMenu}>
        Spaces
      </NavLink>
      <NavLink to="/calendar" className={({ isActive }) => (isActive ? `${linkBase} ${active}` : linkBase)} onClick={closeMenu}>
        Calendar
      </NavLink>
      <NavLink to="/reservations" className={({ isActive }) => (isActive ? `${linkBase} ${active}` : linkBase)} onClick={closeMenu}>
        <span className="inline-flex items-center gap-1.5">
          <FiList />
          My Reservations
        </span>
      </NavLink>
      <NavLink to="/reservations/new" className={({ isActive }) => (isActive ? `${linkBase} ${active}` : linkBase)} onClick={closeMenu}>
        New Reservation
      </NavLink>
      {loggedIn && isAdmin() && (
        <>
          <NavLink to="/approvals" className={({ isActive }) => (isActive ? `${linkBase} ${active}` : linkBase)} onClick={closeMenu}>
            <span className="inline-flex items-center gap-1.5">
              <FiCheckCircle />
              Approvals
            </span>
          </NavLink>
          <NavLink to="/admin/reservations" className={({ isActive }) => (isActive ? `${linkBase} ${active}` : linkBase)} onClick={closeMenu}>
            No-shows
          </NavLink>
          <NavLink to="/admin/spaces" className={({ isActive }) => (isActive ? `${linkBase} ${active}` : linkBase)} onClick={closeMenu}>
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
          <NavLink to="/login" className={({ isActive }) => (isActive ? `${linkBase} ${active}` : linkBase)} onClick={closeMenu}>
            <span className="inline-flex items-center gap-1.5">
              <FiLogIn />
              Log In
            </span>
          </NavLink>
          <NavLink to="/signup" className={({ isActive }) => (isActive ? `${linkBase} ${active}` : linkBase)} onClick={closeMenu}>
            <span className="inline-flex items-center gap-1.5">
              <FiUserPlus />
              Sign Up
            </span>
          </NavLink>
        </>
      )}
    </>
  )

  return (
    <header className="bg-[#003087] shadow-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <NavLink to="/" className="flex items-center gap-2.5 text-white">
          <img src="/salaFinderLogo-200.png" alt="SalaFinder" className="h-9 w-9 rounded object-contain" />
          <div className="leading-tight">
            <p className="m-0 text-[10px] font-medium uppercase tracking-widest text-blue-200">EIA University</p>
            <h2 className="m-0 text-base font-bold text-white">SalaFinder</h2>
          </div>
        </NavLink>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1" aria-label="Primary navigation">
          {navLinks}
        </nav>

        {/* Mobile hamburger button */}
        <button
          className="md:hidden text-blue-200 hover:text-white p-2 rounded transition-colors"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
        >
          {menuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
        </button>
      </div>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-[#002470] bg-[#003087]">
          <nav className="mx-auto max-w-6xl px-4 py-2 flex flex-col gap-1" aria-label="Mobile navigation">
            {navLinks}
          </nav>
        </div>
      )}
    </header>
  )
}
