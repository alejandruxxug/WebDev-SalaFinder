// seed users - admin only (@eia.edu.co)
import type { User } from '../types'

export const users: User[] = [
  { id: 1, name: 'Admin User', email: 'admin@eia.edu.co', password: '1234', role: 'Admin', noShowCount: 0 },
  { id: 2, name: 'Admin Two', email: 'admin2@eia.edu.co', password: '1234', role: 'Admin', noShowCount: 0 },
]
