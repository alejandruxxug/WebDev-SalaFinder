# SalaFinder

A space reservation system for educational institutions. SalaFinder lets students browse, reserve, and manage rooms, labs, and courts—with role-based access, approval workflows, and no-show policies.

## Focus

SalaFinder is **exclusive to EIA University**. Only users with `@eia.edu.co` email addresses can access the app—no external or non-EIA users. Both sign up and login require an @eia.edu.co domain.

It provides:

- **Space discovery** — Browse available rooms, labs, and courts with filters
- **Reservations** — Book spaces by date and time slot, with conflict detection
- **Approval workflow** — All reservations require admin approval before they are confirmed
- **No-show policy** — 2 no-shows = 7-day block (admins cannot be blocked)
- **Role-based access** — Students and Admins with different permissions

## Tech Stack

- **React 19** + **TypeScript**
- **Vite** — Build tool
- **React Router** — Client-side routing
- **Tailwind CSS** — Styling
- **localStorage** — Data persistence (prototype; replace with API for production)

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Install & Run

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

### Build for Production

```bash
npm run build
npm run preview
```

## Project Structure

```
src/
├── components/       # Reusable UI
│   ├── admin/       # BlockedBanner
│   ├── layout/      # Navbar
│   ├── spaces/      # SpaceCard, SpaceList, FilterBar
│   └── ui/          # Button, Badge, StateMessage
├── pages/           # Route-level views
├── services/        # Business logic (storage, conflict, no-show, audit)
├── data/            # Seed data (spaces, users, reservations)
├── utils/           # Auth helpers
└── types.ts         # TypeScript definitions
```

## Features

### For All Users

- **Browse spaces** — Filter by name, type (Class/Lab/Court), and availability
- **View space details** — Capacity, resources, approval requirements
- **Create reservations** — Choose date, time slot, purpose, attendee count
- **My reservations** — List of your bookings with status (Pending/Approved/Rejected/Cancelled)
- **Calendar view** — See reservations across spaces

### For Students

- Sign up and login restricted to `@eia.edu.co` email only—no other domains allowed
- Profile includes name, email, major
- Blocked users cannot create new reservations (banner shown when blocked)

### For Admins

- **Approvals** — Approve or reject pending reservations (with conflict check)
- **No-shows** — Mark no-show on approved reservations; 2nd no-show triggers 7-day block
- **Manage spaces** — View and manage space inventory
- Admins are never blocked, even if marked as no-show

### Business Rules

| Rule | Description |
|------|-------------|
| **Conflict detection** | No overlapping reservations (Pending or Approved) for the same space—if someone has reserved it, no one else can |
| **No-show policy** | 2 no-shows → 7-day block (Students only) |
| **Admin protection** | Admins cannot be blocked |
| **Email domain** | Sign-up and login restricted to `@eia.edu.co` only—no external users |
| **Approval** | All reservations require admin approval |

## Seed Accounts

For development, only admin seed users exist in `src/data/users.ts`. All use password `1234` and `@eia.edu.co` emails:

- `admin@eia.edu.co` — Admin
- `admin2@eia.edu.co` — Admin

No seed reservations—users sign up and create their own.

## Resetting Data

To reset localStorage and re-seed from default data:

1. Open DevTools (F12) → **Console**
2. Run: `localStorage.clear()`
3. Reload the page

Or clear only SalaFinder keys:

```javascript
localStorage.removeItem('salafinder_session')
localStorage.removeItem('salafinder_spaces')
localStorage.removeItem('salafinder_users')
localStorage.removeItem('salafinder_reservations')
localStorage.removeItem('salafinder_auditLogs')
```

## Routes

| Path | Description | Access |
|------|-------------|--------|
| `/` | Space listing | All |
| `/calendar` | Calendar view | All |
| `/spaces/:id` | Space details | All |
| `/reservations` | My reservations | Logged in |
| `/reservations/new` | Create reservation | Logged in |
| `/approvals` | Approve/reject pending | Admin |
| `/admin/reservations` | All reservations, mark no-show | Admin |
| `/admin/spaces` | Manage spaces | Admin |
| `/login` | Log in | Public |
| `/signup` | Register (@eia.edu.co) | Public |

## License

Sebastían Higuita Usme
Alejandro Urrego Giraldo

Web Enginnering FrontEnd Class
Private project.
