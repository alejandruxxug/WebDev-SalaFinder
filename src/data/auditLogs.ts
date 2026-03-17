// seed audit logs - 20 for prototype
import type { AuditLog } from '../types'

export const auditLogs: AuditLog[] = [
  { id: 1, userId: 1, action: 'CREATE', entityType: 'reservation', entityId: 1, timestamp: '2026-03-10T09:00:00Z', changes: 'Created' },
  { id: 2, userId: 1, action: 'APPROVE', entityType: 'reservation', entityId: 1, timestamp: '2026-03-10T09:05:00Z', changes: 'Approved' },
  { id: 3, userId: 4, action: 'CREATE', entityType: 'reservation', entityId: 2, timestamp: '2026-03-11T10:00:00Z', changes: 'Created' },
  { id: 4, userId: 5, action: 'CREATE', entityType: 'reservation', entityId: 3, timestamp: '2026-03-11T11:00:00Z', changes: 'Created' },
  { id: 5, userId: 1, action: 'REJECT', entityType: 'reservation', entityId: 3, timestamp: '2026-03-11T12:00:00Z', changes: 'Rejected' },
  { id: 6, userId: 4, action: 'CANCEL', entityType: 'reservation', entityId: 4, timestamp: '2026-03-12T09:00:00Z', changes: 'Cancelled' },
  { id: 7, userId: 1, action: 'UPDATE', entityType: 'space', entityId: 1, timestamp: '2026-03-12T10:00:00Z', changes: 'Capacity updated' },
  { id: 8, userId: 2, action: 'CREATE', entityType: 'reservation', entityId: 5, timestamp: '2026-03-12T14:00:00Z', changes: 'Created' },
  { id: 9, userId: 1, action: 'NO_SHOW', entityType: 'user', entityId: 6, timestamp: '2026-03-13T09:00:00Z', changes: 'Marked no-show' },
  { id: 10, userId: 1, action: 'NO_SHOW', entityType: 'user', entityId: 6, timestamp: '2026-03-13T09:01:00Z', changes: 'Blocked 7 days' },
  { id: 11, userId: 7, action: 'CREATE', entityType: 'reservation', entityId: 6, timestamp: '2026-03-13T10:00:00Z', changes: 'Created' },
  { id: 12, userId: 8, action: 'CREATE', entityType: 'reservation', entityId: 7, timestamp: '2026-03-13T11:00:00Z', changes: 'Created' },
  { id: 13, userId: 1, action: 'APPROVE', entityType: 'reservation', entityId: 2, timestamp: '2026-03-13T12:00:00Z', changes: 'Approved' },
  { id: 14, userId: 9, action: 'CREATE', entityType: 'reservation', entityId: 8, timestamp: '2026-03-13T13:00:00Z', changes: 'Created' },
  { id: 15, userId: 10, action: 'CREATE', entityType: 'reservation', entityId: 9, timestamp: '2026-03-13T14:00:00Z', changes: 'Created' },
  { id: 16, userId: 1, action: 'REJECT', entityType: 'reservation', entityId: 10, timestamp: '2026-03-13T15:00:00Z', changes: 'Conflict' },
  { id: 17, userId: 11, action: 'CREATE', entityType: 'reservation', entityId: 11, timestamp: '2026-03-13T16:00:00Z', changes: 'Created' },
  { id: 18, userId: 2, action: 'APPROVE', entityType: 'reservation', entityId: 5, timestamp: '2026-03-13T17:00:00Z', changes: 'Approved' },
  { id: 19, userId: 1, action: 'CREATE', entityType: 'space', entityId: 7, timestamp: '2026-03-13T18:00:00Z', changes: 'New space' },
  { id: 20, userId: 12, action: 'CANCEL', entityType: 'reservation', entityId: 12, timestamp: '2026-03-13T19:00:00Z', changes: 'Cancelled' },
]
