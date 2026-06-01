import { API_CONFIG } from '@/config/api'
import { authHeaders } from './authHeaders'

export type ReportPeriod = 'week' | 'month' | 'quarter' | 'year' | 'custom'

export interface OverviewFilters {
  period?: ReportPeriod
  from?: string
  to?: string
  department?: string
  ownerId?: string
  clientId?: string
}

export interface OverviewData {
  meta: { period: string; from: string; to: string; prevFrom: string; prevTo: string; generatedAt: string }
  executive: {
    activitiesCompleted: number;  activitiesDelta: number
    activitiesTotal: number
    completionRate: number
    ticketsResolved: number;      ticketsDelta: number
    avgTicketHrs: number
    casesClosed: number;          casesDelta: number
    newClients: number;           clientsDelta: number
    totalClients: number
    teamSize: number
    atRiskClientCount: number
    overdueActivityCount: number
    slaBreachCount: number
  }
  operations: {
    activitiesByStatus: Record<string, number>
    activitiesOverdue: any[]
    ticketsByStatus: Record<string, number>
    ticketsOpen: any[]
    casesByStatus: Record<string, number>
    casesOpen: any[]
    slaBreach: { total: number; overdue: number }
    avgTicketResolutionHrs: number
  }
  team: {
    byOwner: { _id: string; name?: string; email?: string; total: number; completed: number; overdue: number }[]
    totalMembers: number
  }
  timeseries: { weeklyActivity: { week: string; created: number; completed: number }[] }
  atRiskClients: { _id: string; name?: string; email?: string; company?: string }[]
}

export const reportsOverviewService = {
  async fetch(filters: OverviewFilters = {}): Promise<OverviewData> {
    const params = new URLSearchParams()
    Object.entries(filters).forEach(([k, v]) => { if (v) params.append(k, String(v)) })
    const res = await fetch(`${API_CONFIG.BASE_URL}/reports/overview?${params}`, { headers: authHeaders() })
    if (!res.ok) throw new Error(`Error ${res.status} cargando reportes`)
    const json = await res.json()
    return json.data as OverviewData
  }
}
