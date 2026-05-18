import { Link } from 'react-router-dom'
import { FiLogIn, FiUserPlus, FiCalendar, FiMapPin, FiCheckCircle } from 'react-icons/fi'

export default function LandingPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
      <div className="text-center">
        <p className="text-xs font-medium uppercase tracking-widest text-[#003087]">EIA University</p>
        <h1 className="mt-2 text-4xl font-bold text-slate-800 sm:text-5xl">SalaFinder</h1>
        <p className="mt-4 text-base text-slate-600 sm:text-lg">
          Reserva salas de estudio, laboratorios y canchas de la EIA en segundos.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            to="/login"
            className="inline-flex items-center justify-center gap-2 rounded bg-[#003087] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#002470]"
          >
            <FiLogIn />
            Iniciar sesión
          </Link>
          <Link
            to="/signup"
            className="inline-flex items-center justify-center gap-2 rounded border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            <FiUserPlus />
            Crear cuenta
          </Link>
        </div>
      </div>

      <section className="mt-16 grid gap-4 sm:grid-cols-3">
        <div className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
          <FiMapPin className="text-[#003087]" size={20} />
          <h2 className="mt-3 text-sm font-semibold text-slate-800">Encuentra tu espacio</h2>
          <p className="mt-1 text-sm text-slate-500">Filtra por edificio, capacidad o recursos.</p>
        </div>
        <div className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
          <FiCalendar className="text-[#003087]" size={20} />
          <h2 className="mt-3 text-sm font-semibold text-slate-800">Reserva al instante</h2>
          <p className="mt-1 text-sm text-slate-500">Elige día y hora, sin conflictos con otras reservas.</p>
        </div>
        <div className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
          <FiCheckCircle className="text-[#003087]" size={20} />
          <h2 className="mt-3 text-sm font-semibold text-slate-800">Solo para la EIA</h2>
          <p className="mt-1 text-sm text-slate-500">Acceso con tu correo @eia.edu.co.</p>
        </div>
      </section>

      <p className="mt-12 text-center text-xs text-slate-400">
        © {new Date().getFullYear()} EIA University · SalaFinder
      </p>
    </main>
  )
}
