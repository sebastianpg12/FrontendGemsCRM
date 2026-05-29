import axios from 'axios'
import { API_CONFIG } from '@/config/api'

const client = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' }
})
client.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export interface OrganizationAdmin {
  _id: string
  name: string
  slug: string
  status: 'active' | 'suspended' | 'pending' | 'archived'
  plan: 'free' | 'starter' | 'pro' | 'enterprise'
  branding?: {
    displayName?: string | null
    logo?: string | null
    primaryColor?: string
    accentColor?: string
    darkMode?: boolean
  }
  contact?: { email?: string | null; phone?: string | null; country?: string | null }
  limits?: { maxUsers?: number; maxStorageMb?: number }
  dbConnection?: { uri?: string | null; dbName?: string | null; migratedAt?: string | null }
  memberCount?: number
  createdAt?: string
  updatedAt?: string
}

export interface CreateOrgPayload {
  name: string
  slug: string
  plan?: OrganizationAdmin['plan']
  contact?: OrganizationAdmin['contact']
  branding?: OrganizationAdmin['branding']
  ownerEmail?: string
  ownerName?: string
  ownerPassword?: string
}

export const adminService = {
  async listOrganizations(params?: { status?: string; q?: string }): Promise<OrganizationAdmin[]> {
    const { data } = await client.get('/admin/organizations', { params })
    return data.data || []
  },

  async getOrganization(id: string): Promise<OrganizationAdmin | null> {
    const { data } = await client.get(`/admin/organizations/${id}`)
    return data.data || null
  },

  async createOrganization(payload: CreateOrgPayload): Promise<OrganizationAdmin> {
    const { data } = await client.post('/admin/organizations', payload)
    return data.data
  },

  async updateOrganization(id: string, patch: Partial<OrganizationAdmin>): Promise<OrganizationAdmin> {
    const { data } = await client.patch(`/admin/organizations/${id}`, patch)
    return data.data
  },

  async archiveOrganization(id: string): Promise<OrganizationAdmin> {
    const { data } = await client.delete(`/admin/organizations/${id}`)
    return data.data
  },

  async getStats(id: string): Promise<Record<string, number>> {
    const { data } = await client.get(`/admin/organizations/${id}/stats`)
    return data.data || {}
  },

  async listSuperAdmins() {
    const { data } = await client.get('/admin/super-admins')
    return data.data || []
  },

  async grantSuperAdmin(userId: string) {
    const { data } = await client.post(`/admin/super-admins/${userId}/grant`)
    return data.data
  },

  async revokeSuperAdmin(userId: string) {
    const { data } = await client.post(`/admin/super-admins/${userId}/revoke`)
    return data.data
  },

  async getAuditLogs(page = 1, limit = 50) {
    const { data } = await client.get('/admin/audit-logs', { params: { page, limit } })
    return data
  }
}
