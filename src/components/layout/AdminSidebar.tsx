import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import {
  FiCalendar,
  FiCheckCircle,
  FiClipboard,
  FiGrid,
  FiHome,
  FiList,
  FiLogOut,
  FiMenu,
  FiPlusCircle,
  FiShield,
  FiUsers,
  FiX,
} from 'react-icons/fi'
import { getSessionUser, isAdmin, logout } from '../../utils/auth'

const linkBase =
  'flex items-center gap-2.5 px-3 py-2 text-sm rounded text-blue-100 hover:text-white hover:bg-[#002470] transition-colors'
const active = 'text-white bg-[#002470] font-semibold'

export default function AdminSidebar() {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const admin = isAdmin()
  const user = getSessionUser()

  function close() {
    setOpen(false)
  }

  function handleLogout() {
    logout()
    navigate('/login', { replace: true })
    close()
  }

  const nav = (
    <>
      <NavLink to="/" end className={({ isActive }) => (isActive ? `${linkBase} ${active}` : linkBase)} onClick={close}>
        <FiHome /> Espacios
      </NavLink>
      <NavLink to="/calendar" className={({ isActive }) => (isActive ? `${linkBase} ${active}` : linkBase)} onClick={close}>
        <FiCalendar /> Calendario
      </NavLink>
      <NavLink to="/reservations" className={({ isActive }) => (isActive ? `${linkBase} ${active}` : linkBase)} onClick={close}>
        <FiList /> Mis reservas
      </NavLink>
      <NavLink to="/reservations/new" className={({ isActive }) => (isActive ? `${linkBase} ${active}` : linkBase)} onClick={close}>
        <FiPlusCircle /> Nueva reserva
      </NavLink>

      <div className="mt-4 mb-1 px-3 text-[10px] font-semibold uppercase tracking-widest text-blue-300">
        Administración
      </div>

      <NavLink to="/approvals" className={({ isActive }) => (isActive ? `${linkBase} ${active}` : linkBase)} onClick={close}>
        <FiCheckCircle /> Aprobaciones
      </NavLink>
      <NavLink to="/admin/reservations" className={({ isActive }) => (isActive ? `${linkBase} ${active}` : linkBase)} onClick={close}>
        <FiClipboard /> Todas las reservas
      </NavLink>

      {admin && (
        <>
          <NavLink to="/admin/spaces" className={({ isActive }) => (isActive ? `${linkBase} ${active}` : linkBase)} onClick={close}>
            <FiGrid /> Gestionar espacios
          </NavLink>
          <NavLink to="/admin/users" className={({ isActive }) => (isActive ? `${linkBase} ${active}` : linkBase)} onClick={close}>
            <FiUsers /> Usuarios
          </NavLink>
          <NavLink to="/admin/audit" className={({ isActive }) => (isActive ? `${linkBase} ${active}` : linkBase)} onClick={close}>
            <FiShield /> Auditoría
          </NavLink>
        </>
      )}
    </>
  )

  return (
    <>
      {/* Mobile top bar */}
      <header className="md:hidden bg-[#003087] text-white flex items-center justify-between px-4 py-3 shadow-md">
        <NavLink to="/" className="flex items-center gap-2.5" onClick={close}>
          <img src="/salaFinderLogo-200.png" alt="SalaFinder" className="h-8 w-8 rounded object-contain" />
          <div className="leading-tight">
            <p className="m-0 text-[10px] font-medium uppercase tracking-widest text-blue-200">EIA University</p>
            <h2 className="m-0 text-base font-bold text-white">SalaFinder</h2>
          </div>
        </NavLink>
        <button
          className="text-blue-200 hover:text-white p-2 rounded transition-colors"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={open}
        >
          {open ? <FiX size={22} /> : <FiMenu size={22} />}
        </button>
      </header>

      {/* Mobile drawer */}
      {open && (
        <div className="md:hidden border-t border-[#002470] bg-[#003087]">
          <nav className="px-4 py-2 flex flex-col gap-1" aria-label="Navegación móvil">
            {nav}
            <button
              onClick={handleLogout}
              className={`${linkBase} text-left border-none bg-transparent cursor-pointer`}
            >
              <FiLogOut /> Cerrar sesión
            </button>
          </nav>
        </div>
      )}

      {/* Desktop fixed sidebar */}
      <aside className="hidden md:flex fixed inset-y-0 left-0 w-60 bg-[#003087] text-white flex-col shadow-lg">
        <div className="px-4 py-4 border-b border-[#002470] flex items-center gap-2.5">
          <img src="/salaFinderLogo-200.png" alt="SalaFinder" className="h-9 w-9 rounded object-contain" />
          <div className="leading-tight">
            <p className="m-0 text-[10px] font-medium uppercase tracking-widest text-blue-200">EIA University</p>
            <h2 className="m-0 text-base font-bold text-white">SalaFinder</h2>
          </div>
        </div>

        <nav className="flex-1 px-3 py-3 flex flex-col gap-1 overflow-y-auto" aria-label="Navegación principal">
          {nav}
        </nav>

        <div className="px-3 py-3 border-t border-[#002470] text-xs text-blue-200">
          <div className="px-3 pb-2 truncate">
            <p className="m-0 font-semibold text-white truncate">{user?.fullName ?? 'Usuario'}</p>
            <p className="m-0 text-blue-300">{user?.role ?? ''}</p>
          </div>
          <button
            onClick={handleLogout}
            className={`${linkBase} w-full text-left border-none bg-transparent cursor-pointer`}
          >
            <FiLogOut /> Cerrar sesión
          </button>
        </div>
      </aside>
    </>
  )
}
