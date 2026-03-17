// seed spaces - 6 for prototype
import type { Space } from '../types'

export const spaces: Space[] = [
  { id: 1, name: 'Class 1.1A', type: 'Class', capacity: 20, status: 'AVAILABLE', building: 'A', resources: ['Projector'], allowedPrograms: ['CS', 'EE'], requiresApproval: false },
  { id: 2, name: 'Lab 2.2B', type: 'Lab', capacity: 15, status: 'AVAILABLE', building: 'B', resources: ['Computers'], allowedPrograms: ['CS'], requiresApproval: true },
  { id: 3, name: 'Tennis Court', type: 'Court', capacity: 30, status: 'AVAILABLE', building: 'Sports', resources: [], allowedPrograms: ['All'], requiresApproval: false },
  { id: 4, name: 'Class 1.7A', type: 'Class', capacity: 10, status: 'UNAVAILABLE', building: 'A', resources: [], allowedPrograms: ['CS', 'EE'], requiresApproval: true },
  { id: 5, name: 'Lab 2.4B', type: 'Lab', capacity: 25, status: 'AVAILABLE', building: 'B', resources: ['Computers', 'Projector'], allowedPrograms: ['CS', 'EE'], requiresApproval: true },
  { id: 6, name: 'Soccer Field', type: 'Court', capacity: 40, status: 'AVAILABLE', building: 'Sports', resources: [], allowedPrograms: ['All'], requiresApproval: false },
]
