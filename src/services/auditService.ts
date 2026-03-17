// audit logging - prototype, logs to localStorage
import { getAuditLogs, saveAuditLogs } from './storage'
import type { AuditLog } from '../types'

export function logAudit(
  userId: number,
  action: string,
  entityType: string,
  entityId: number,
  changes?: string
) {
  const logs = getAuditLogs()
  const nextId = logs.length ? Math.max(...logs.map((l) => l.id)) + 1 : 1
  const entry: AuditLog = {
    id: nextId,
    userId,
    action,
    entityType,
    entityId,
    timestamp: new Date().toISOString(),
    changes,
  }
  logs.push(entry)
  saveAuditLogs(logs)
}
