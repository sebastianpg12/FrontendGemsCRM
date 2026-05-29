import axios from 'axios'
import type { LoginCredentials, User } from '../stores/auth'
import { API_CONFIG } from '@/config/api'

// Configuration
const API_BASE_URL = API_CONFIG.BASE_URL

// Create axios instance with interceptors
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Request interceptor to add auth token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

let isRefreshing = false
let failedQueue: any[] = []

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token)
    }
  })
  failedQueue = []
}

// Response interceptor to handle auth errors
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    // Si da 401 y no es el endpoint de refresh o login
    if (error.response?.status === 401 && !originalRequest._retry && !originalRequest.url.includes('/auth/')) {
      if (isRefreshing) {
        return new Promise(function(resolve, reject) {
          failedQueue.push({ resolve, reject })
        }).then(token => {
          originalRequest.headers['Authorization'] = 'Bearer ' + token
          return apiClient(originalRequest)
        }).catch(err => {
          return Promise.reject(err)
        })
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        const refreshToken = localStorage.getItem('refreshToken')
        if (!refreshToken) throw new Error('No refresh token available')

        // Pedir un nuevo access token usando el refresh token
        const response = await axios.post(`${API_BASE_URL}/auth/refresh`, { refreshToken })
        const newToken = response.data.data.token
        const newRefreshToken = response.data.data.refreshToken

        // Guardar nuevos tokens
        localStorage.setItem('token', newToken)
        if (newRefreshToken) localStorage.setItem('refreshToken', newRefreshToken)

        apiClient.defaults.headers.common['Authorization'] = `Bearer ${newToken}`
        originalRequest.headers['Authorization'] = `Bearer ${newToken}`

        processQueue(null, newToken)
        return apiClient(originalRequest)
      } catch (err) {
        processQueue(err, null)
        // Token expired or invalid
        localStorage.removeItem('token')
        localStorage.removeItem('refreshToken')
        localStorage.removeItem('user')
        window.location.href = '/login'
        return Promise.reject(err)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  }
)

export interface OrganizationSummary {
  _id: string
  name: string
  slug: string
  branding?: {
    displayName?: string | null
    logo?: string | null
    primaryColor?: string
    accentColor?: string
    darkMode?: boolean
  }
}

export interface MembershipSummary {
  organizationId: string
  organizationName: string
  organizationSlug: string
  branding?: OrganizationSummary['branding']
  role: string
  isOwner: boolean
  status: string
}

export interface AuthResponse {
  success: boolean
  message?: string
  user?: User
  token?: string
  refreshToken?: string
  organization?: OrganizationSummary | null
  memberships?: MembershipSummary[]
  requiresOrgSelection?: boolean
  membership?: { role: string; isOwner: boolean; permissions: any } | null
  require2FA?: boolean
  tempToken?: string
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await apiClient.post('/auth/login', credentials)
      if (response.data.success) {
        const d = response.data.data
        if (d.require2FA) {
          return {
            success: true,
            require2FA: true,
            tempToken: d.tempToken,
            message: response.data.message
          }
        }
        return {
          success: true,
          user: d.user,
          token: d.token,
          refreshToken: d.refreshToken,
          organization: d.organization || null,
          memberships: d.memberships || [],
          membership: d.membership || null,
          requiresOrgSelection: !!d.requiresOrgSelection
        }
      } else {
        return {
          success: false,
          message: response.data.message || 'Credenciales inválidas'
        }
      }
    } catch (error: any) {
      console.error('❌ Login error details:', error)
      console.error('❌ Error response:', error.response)
      console.error('❌ Error data:', error.response?.data)
      console.error('❌ Error status:', error.response?.status)
      
      if (error.response?.data?.message) {
        return {
          success: false,
          message: error.response.data.message
        }
      }
      
      return {
        success: false,
        message: 'Error de conexión. Verifique que el servidor esté funcionando.'
      }
    }
  },

  async registerOrg(data: { orgName: string; userName: string; email: string; password: string }): Promise<AuthResponse> {
    try {
      const response = await apiClient.post('/auth/register-org', data)
      return {
        success: response.data.success,
        message: response.data.message
      }
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Error al registrar organización'
      }
    }
  },

  async verifyEmail(token: string): Promise<AuthResponse> {
    try {
      const response = await apiClient.get(`/auth/verify-email/${token}`)
      return {
        success: response.data.success,
        message: response.data.message
      }
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Error al verificar correo'
      }
    }
  },

  async verify2FA(tempToken: string, code: string): Promise<AuthResponse> {
    try {
      const response = await apiClient.post('/auth/verify-2fa', { tempToken, code })
      if (response.data.success) {
        const d = response.data.data
        return {
          success: true,
          user: d.user,
          token: d.token,
          refreshToken: d.refreshToken,
          organization: d.organization || null,
          memberships: d.memberships || [],
          membership: d.membership || null,
          requiresOrgSelection: !!d.requiresOrgSelection
        }
      }
      return { success: false, message: response.data.message }
    } catch (error: any) {
      return { success: false, message: error.response?.data?.message || 'Error verificando 2FA' }
    }
  },

  async logout(): Promise<void> {
    try {
      const refreshToken = localStorage.getItem('refreshToken')
      await apiClient.post('/auth/logout', { refreshToken })
    } catch (error) {
      console.error('Logout error:', error)
    }
  },

  async verifyToken(): Promise<AuthResponse> {
    try {
      const response = await apiClient.post('/auth/verify-token')
      const d = response.data.data || {}
      return {
        success: response.data.success,
        user: d.user,
        organization: d.organization || null,
        requiresOrgSelection: !!d.requiresOrgSelection
      }
    } catch (error) {
      return { success: false }
    }
  },

  async selectOrganization(organizationId: string): Promise<AuthResponse> {
    try {
      const response = await apiClient.post('/auth/select-org', { organizationId })
      if (response.data.success) {
        const d = response.data.data
        return {
          success: true,
          user: d.user,
          token: d.token,
          refreshToken: d.refreshToken,
          organization: d.organization,
          membership: d.membership
        }
      }
      return { success: false, message: response.data.message }
    } catch (error: any) {
      return { success: false, message: error.response?.data?.message || 'Error al seleccionar organización' }
    }
  },

  async getMemberships(): Promise<MembershipSummary[]> {
    try {
      const response = await apiClient.get('/auth/memberships')
      return response.data.data || []
    } catch {
      return []
    }
  },

  async updateProfile(profileData: Partial<User>): Promise<AuthResponse> {
    try {
      const response = await apiClient.put('/auth/profile', profileData)
      
      return {
        success: response.data.success,
        user: response.data.user,
        message: response.data.message
      }
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Error al actualizar perfil'
      }
    }
  },

  async changePassword(oldPassword: string, newPassword: string): Promise<AuthResponse> {
    try {
      const response = await apiClient.put('/auth/change-password', {
        oldPassword,
        newPassword
      })
      
      return {
        success: response.data.success,
        message: response.data.message
      }
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Error al cambiar contraseña'
      }
    }
  },

  async requestPasswordReset(email: string): Promise<AuthResponse> {
    try {
      const response = await apiClient.post('/auth/forgot-password', { email })
      
      return {
        success: response.data.success,
        message: response.data.message
      }
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Error al solicitar restablecimiento'
      }
    }
  },

  async resetPassword(token: string, newPassword: string): Promise<AuthResponse> {
    try {
      const response = await apiClient.post('/auth/reset-password', {
        token,
        newPassword
      })
      
      return {
        success: response.data.success,
        message: response.data.message
      }
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Error al restablecer contraseña'
      }
    }
  }
}

export default apiClient
