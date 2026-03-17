// seed users - 15 for prototype, mix of roles
import type { User } from '../types'

export const users: User[] = [
  { id: 1, name: 'Admin User', email: 'admin@test.com', password: '1234', role: 'Admin', noShowCount: 0 },
  { id: 2, name: 'Staff One', email: 'staff1@test.com', password: '1234', role: 'Staff', noShowCount: 0 },
  { id: 3, name: 'Staff Two', email: 'staff2@test.com', password: '1234', role: 'Staff', noShowCount: 0 },
  { id: 4, name: 'Student A', email: 'student1@test.com', password: '1234', role: 'Student', noShowCount: 0 },
  { id: 5, name: 'Student B', email: 'student2@test.com', password: '1234', role: 'Student', noShowCount: 1 },
  { id: 6, name: 'Student C', email: 'student3@test.com', password: '1234', role: 'Student', noShowCount: 2, blockedUntil: '2026-03-20' },
  { id: 7, name: 'Student D', email: 'student4@test.com', password: '1234', role: 'Student', noShowCount: 0 },
  { id: 8, name: 'Student E', email: 'student5@test.com', password: '1234', role: 'Student', noShowCount: 0 },
  { id: 9, name: 'Student F', email: 'student6@test.com', password: '1234', role: 'Student', noShowCount: 0 },
  { id: 10, name: 'Student G', email: 'student7@test.com', password: '1234', role: 'Student', noShowCount: 0 },
  { id: 11, name: 'Student H', email: 'student8@test.com', password: '1234', role: 'Student', noShowCount: 0 },
  { id: 12, name: 'Student I', email: 'student9@test.com', password: '1234', role: 'Student', noShowCount: 0 },
  { id: 13, name: 'Student J', email: 'student10@test.com', password: '1234', role: 'Student', noShowCount: 0 },
  { id: 14, name: 'Staff Three', email: 'staff3@test.com', password: '1234', role: 'Staff', noShowCount: 0 },
  { id: 15, name: 'Admin Two', email: 'admin2@test.com', password: '1234', role: 'Admin', noShowCount: 0 },
]
