# SalaFinder — Frontend

SPA en **React 19 + Vite + TypeScript** para la reserva de espacios universitarios (salones, laboratorios, canchas) de la **Universidad EIA**. Consume la API REST de SalaFinder (ver `WebDev-Backend`).

> Para una guía detallada del comportamiento y reglas de negocio orientada a sustentación oral, ver [`presentation.md`](./presentation.md).

## Demo en producción

- Frontend: **https://web-dev-sala-finder.vercel.app**
- API: **https://salafindereia.azurewebsites.net**

> La API corre en Azure SQL serverless con auto-pause. El primer request tras inactividad puede tardar 30–60s mientras la BD se "despierta"; los siguientes son inmediatos.

## Stack

- React 19 (con **React Compiler** habilitado vía `babel-plugin-react-compiler`)
- Vite 7
- TypeScript estricto
- Tailwind CSS 4
- React Router 7
- `fetch` nativo envuelto en `apiClient.ts` (sin Axios)

## Acceso restringido

Solo correos `@eia.edu.co` pueden registrarse o iniciar sesión. La validación corre en frontend (UX) y en backend (autoridad).

## Roles

| Rol | Permisos |
|---|---|
| **Student** | Ver espacios, crear y cancelar sus propias reservas. Usa el **top navbar**. |
| **Staff** | Aprobar/rechazar reservas y ver todas las reservas (gestión de reservas). Usa el **sidebar lateral** (sin módulos admin-propietarios). |
| **Admin** | Todo lo de Staff + CRUD de espacios, gestión de usuarios (cambiar rol, bloquear/desbloquear manualmente con motivo), marcar no-show, auditoría. Usa el **sidebar lateral** con todos los módulos. |

### Chrome de navegación

- **Student:** top navbar tradicional.
- **Staff / Admin:** sidebar lateral fijo (`AdminSidebar`) en **todas** las rutas del sitio. Los módulos admin-propietarios (Gestionar espacios, Usuarios, Auditoría) solo aparecen para Admin.

## Empezar

### Requisitos

- Node.js 18+
- npm
- Backend corriendo en local o accesible por URL (ver `WebDev-Backend/README.md`)

### Instalación

```bash
npm install
```

### Variables de entorno

El proyecto usa Vite envs (`import.meta.env.VITE_*`). Los archivos `.env.development` y `.env.production` están **gitignored** — solo `.env.example` está versionado.

Crea tu `.env.development` apuntando al backend local:

```bash
# .env.development
VITE_API_BASE_URL=http://localhost:5001
```

Para producción (Vercel), la URL se configura en **Project Settings → Environment Variables** o vía el archivo `.env.production` local (no se sube a git pero se sube a Vercel en build):


### Comandos

```bash
npm run dev      # vite dev server en http://localhost:5173
npm run build    # tsc -b && vite build
npm run preview  # servir el build de producción
npm run lint     # eslint .
```

### Test de errores

Agrega `?simulateError=1` a cualquier URL para que el modo de simulación (donde aplique) devuelva error y poder probar estados de fallo.

## Estructura

```
src/
├── api/                     ← cliente HTTP por recurso
│   ├── apiClient.ts         ← wrapper de fetch (Bearer auth, ApiResult<T>, helpers de fecha/hora)
│   ├── auth.ts              ← /api/auth/* (login, register, me, listUsers, changeUserRole, lockUser, unlockUser)
│   ├── spaces.ts            ← /api/spaces/* (CRUD + availability + filters)
│   └── reservations.ts      ← /api/reservations/* (mías, todas, conflict-check, status, no-show, audit)
├── components/
│   ├── admin/               ← BlockedBanner (banner si el usuario está bloqueado)
│   ├── layout/              ← Navbar (students) + AdminSidebar (staff/admin)
│   ├── spaces/              ← SpaceCard, SpaceList, FilterBar, AlternativeSlots
│   └── ui/                  ← Button, Badge, StateMessage
├── contexts/                ← ToastContext (proveedor global de toasts)
├── pages/                   ← una por ruta
├── utils/auth.ts            ← sesión: token, getSessionUser, isLoggedIn, isAdmin, isBlocked
└── types.ts                 ← Space, Reservation, User, AuditLog, ConflictInfo, etc.
```

## Cómo se conecta al backend

### `apiClient.ts`

Wrapper único sobre `fetch`. Cada función (`apiGet`, `apiPost`, ...) devuelve un **discriminated union**:

```ts
type ApiResult<T> =
  | { ok: true;  data: T;    error: null }
  | { ok: false; data: null; error: string }
```

Pages narrow con `if (!res.ok) ... else ...`. El wrapper:

1. Lee la URL base de `import.meta.env.VITE_API_BASE_URL`.
2. Inyecta `Authorization: Bearer <token>` si hay sesión en `localStorage`.
3. Convierte fechas/horas con `toApiDate`, `toApiTime`, `fromApiDate`, `fromApiTime` (ASP.NET espera `YYYY-MM-DDT00:00:00` y `HH:mm:00`).
4. Si recibe **401**, hace `logout()` y devuelve `{ ok: false, error: 'Sesión expirada' }`.
5. Mapea errores 4xx (`{ message }` o `{ errors }`) a strings legibles.

### Sesión

Se guarda en `localStorage["salafinder_session"]`:

```ts
interface SessionUser {
  token: string
  expiresAt: string
  id: string
  email: string
  fullName: string
  role: 'Student' | 'Staff' | 'Admin'
  program?: string
  isBlocked: boolean
  blockedUntil?: string
  noShowCount: number
}
```

Al montar `App.tsx`, si hay sesión, se llama `GET /api/auth/me` para refrescar `isBlocked` / `noShowCount` (por si un admin actuó mientras el usuario tenía la pestaña abierta).

## Rutas

| Path | Descripción | Acceso |
|------|-------------|--------|
| `/` | Lista de espacios + filtros (nombre, tipo, capacidad, edificio, recurso) | Logueado |
| `/calendar` | Vista calendario semanal de reservas | Logueado |
| `/spaces/:id` | Detalle de espacio + disponibilidad | Logueado |
| `/reservations/new` | Crear reserva (incluye conflict-check y horarios alternativos) | Logueado, no bloqueado |
| `/reservations` | Mis reservas + cancelar | Logueado |
| `/approvals` | Cola de pendientes (aprobar/rechazar) | Admin/Staff |
| `/admin/reservations` | Todas las reservas, marcar no-show | Admin/Staff |
| `/admin/spaces` | CRUD de espacios | Admin |
| `/admin/users` | Gestión de usuarios: cambiar rol, bloquear/desbloquear (motivo requerido) | Admin |
| `/admin/audit` | Log de auditoría | Admin |
| `/login` / `/signup` | Auth (`@eia.edu.co` requerido) | Público |

### Guards

`AuthGuard` (en `App.tsx`) redirige a `/login` cualquier ruta que no sea `/login` o `/signup` si `isLoggedIn()` es false. **No hay guard de rol centralizado** — los items se ocultan en la navegación (sidebar/navbar) y cada página admin tiene un guard interno (`if (!isAdmin()) navigate('/')`). El backend valida con `[Authorize(Roles="Admin")]` como autoridad final.

## Reglas de negocio que el frontend refleja

Las reglas autoritativas viven en el backend. El frontend las refleja para UX:

- **Filtros de espacio:** `name`, `type`, `minCapacity`, `building`, `resource` — todos pasan al backend en query string.
- **Conflict-check antes de crear:** `POST /api/reservations/check-conflict` antes del submit; si hay conflicto, renderiza `AlternativeSlots` con hasta 3 horarios sugeridos.
- **Auto-aprobación:** el frontend **no** decide el status final. Toma `res.data.status` que devuelve el servidor (puede ser `Pending` o `Approved` según `Space.RequiresApproval`).
- **No-show / bloqueo:** después de marcar no-show, el frontend re-fetcha las reservas. Si el usuario afectado es el que está logueado, `BlockedBanner` aparece tras el siguiente `fetchMe()`.
- **Gestión de usuarios (admin):** cada cambio de rol o bloqueo/desbloqueo manual requiere un **motivo** que se persiste en `AuditLog.Details`. Guardrails enforced en backend: un admin no puede cambiar su propio rol, no puede degradar al último admin, no puede bloquearse a sí mismo y no puede bloquear a otros admins. El bloqueo manual usa `BlockedUntil` con fecha/hora elegida por el admin; el desbloqueo limpia tanto `BlockedUntil` como `NoShowCount`.

## Despliegue (Vercel)

1. Conectar el repo en Vercel — detecta Vite automáticamente.
2. **Project Settings → Environment Variables** → agregar `VITE_API_BASE_URL` con la URL del backend Azure.
3. **Project Settings → Build & Output Settings** → dejar valores por defecto (Vite).
4. `vercel.json` ya tiene SPA rewrites a `/index.html`.

> ⚠️ Las variables `VITE_*` se "hornean" en el bundle en build time. Si cambias `VITE_API_BASE_URL` hay que **redeployar**, no sirve solo guardar la variable.

## Recursos útiles

- Backend: [`../WebDev-Backend/README.md`](../WebDev-Backend/README.md).

## Autores

- Sebastián Higuita Usme
- Alejandro Urrego Giraldo

Ingeniería Web — EIA University.
