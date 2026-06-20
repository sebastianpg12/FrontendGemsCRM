import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authService, type MembershipSummary, type OrganizationSummary } from '../services/authService'

export interface User {
  _id: string
  name: string
  email: string
  role: 'admin' | 'supervisor' | 'collaborator' | 'support' | 'viewer' | 'client'
  department: string
  position: string
  avatar?: string
  isSuperAdmin?: boolean
  permissions?: {
    dashboard: boolean
    clients: {
      view: boolean
      create: boolean
      edit: boolean
      delete: boolean
    }
    activities: {
      view: boolean
      create: boolean
      edit: boolean
      delete: boolean
    }
    reports: {
      view: boolean
      export: boolean
    }
    accounting: {
      view: boolean
      create: boolean
      edit: boolean
      delete: boolean
    }
    cases: {
      view: boolean
      create: boolean
      edit: boolean
      delete: boolean
    }
    team: {
      view: boolean
      create: boolean
      edit: boolean
      delete: boolean
    }
  }
}

export interface LoginCredentials {
  email: string
  password: string
}

const ROLE_NORMALIZE: Record<string, User['role']> = {
  'administrador': 'admin',   'admin': 'admin',
  'supervisor': 'supervisor',
  'colaborador': 'collaborator', 'collaborator': 'collaborator',
  'soporte': 'support',       'support': 'support',
  'consultor': 'viewer',      'viewer': 'viewer',
  'cliente': 'client',        'client': 'client',
}
const normalizeRole = (role: string): User['role'] =>
  ROLE_NORMALIZE[role.toLowerCase()] ?? (role as User['role'])

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref<User | null>(null)
  const token = ref<string | null>(localStorage.getItem('token'))
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  // Multi-tenant
  const organization = ref<OrganizationSummary | null>(
    (() => { try { return JSON.parse(localStorage.getItem('organization') || 'null') } catch { return null } })()
  )
  const memberships = ref<MembershipSummary[]>([])
  const requiresOrgSelection = ref<boolean>(false)
  // Cuántas orgs tiene el usuario — persiste en localStorage para sobrevivir reloads
  const membershipsCount = ref<number>(Number(localStorage.getItem('memberships_count') || 0))

  // Getters
  const isAuthenticated = computed(() => !!user.value && !!token.value)
  const userRole = computed(() => user.value?.role || null)
  const isAdmin = computed(() => user.value?.role === 'admin')
  const isSuperAdmin = computed(() => !!user.value?.isSuperAdmin)
  // Visible para cualquier usuario (incluyendo no-superadmin) con 2+ orgs
  const hasMultipleOrgs = computed(() =>
    isSuperAdmin.value ||
    memberships.value.length > 1 ||
    membershipsCount.value > 1
  )
  const isManager = computed(() => ['admin', 'supervisor'].includes(user.value?.role || ''))
  const isSupport = computed(() => ['admin', 'supervisor', 'support'].includes(user.value?.role || ''))
  const isClient = computed(() => user.value?.role === 'client')
  
  // Helper function to safely access permissions
  const getUserPermission = (module: keyof NonNullable<User['permissions']>, action: string) => {
    if (user.value?.role === 'admin') return true
    
    const permissions = user.value?.permissions
    if (!permissions) return false
    
    const modulePerms = permissions[module]
    if (!modulePerms || typeof modulePerms === 'boolean') return false
    
    return (modulePerms as any)[action] || false
  }
  
  const getUserModulePermission = (module: keyof NonNullable<User['permissions']>) => {
    if (user.value?.role === 'admin') return true
    return user.value?.permissions?.[module] || false
  }

  const INTERNAL_ROLES = ['admin', 'supervisor', 'collaborator', 'support', 'viewer']
  const MANAGE_ROLES = ['admin', 'supervisor']

  // Dashboard: todos los roles internos
  const canViewDashboard = computed(() => {
    if (!user.value) return false
    return INTERNAL_ROLES.includes(user.value.role)
  })

  // Clientes: admin y supervisor ven+crean+editan; collaborator solo ve
  const canViewClients = computed(() => {
    if (!user.value) return false
    return getUserPermission('clients', 'view') || ['admin', 'supervisor', 'collaborator'].includes(user.value.role)
  })
  const canCreateClients = computed(() => getUserPermission('clients', 'create') || MANAGE_ROLES.includes(user.value?.role || ''))
  const canEditClients = computed(() => getUserPermission('clients', 'edit') || MANAGE_ROLES.includes(user.value?.role || ''))
  const canDeleteClients = computed(() => getUserPermission('clients', 'delete') || user.value?.role === 'admin')

  // Actividades: todos los roles internos excepto viewer solo ve
  const canViewActivities = computed(() => {
    if (!user.value) return false
    return getUserPermission('activities', 'view') || INTERNAL_ROLES.includes(user.value.role)
  })
  const canCreateActivities = computed(() => {
    if (!user.value) return false
    return getUserPermission('activities', 'create') || ['admin', 'supervisor', 'collaborator', 'support'].includes(user.value.role)
  })
  const canEditActivities = computed(() => {
    if (!user.value) return false
    return getUserPermission('activities', 'edit') || ['admin', 'supervisor', 'collaborator', 'support'].includes(user.value.role)
  })
  const canDeleteActivities = computed(() => {
    if (!user.value) return false
    return getUserPermission('activities', 'delete') || MANAGE_ROLES.includes(user.value.role)
  })

  // Reportes y contabilidad: admin y supervisor
  const canViewReports = computed(() => getUserPermission('reports', 'view') || MANAGE_ROLES.includes(user.value?.role || ''))
  const canViewAccounting = computed(() => getUserPermission('accounting', 'view') || MANAGE_ROLES.includes(user.value?.role || ''))
  const canManageAccounting = computed(() => getUserPermission('accounting', 'create') || getUserPermission('accounting', 'edit') || MANAGE_ROLES.includes(user.value?.role || ''))

  // Tickets: admin, supervisor y support
  const canViewTickets = computed(() => {
    if (!user.value) return false
    return ['admin', 'supervisor', 'support'].includes(user.value.role)
  })

  // Casos: admin, supervisor, collaborator y support
  const canViewCases = computed(() => {
    if (!user.value) return false
    return getUserPermission('cases', 'view') || ['admin', 'supervisor', 'collaborator', 'support'].includes(user.value.role)
  })
  const canCreateCases = computed(() => getUserPermission('cases', 'create') || MANAGE_ROLES.includes(user.value?.role || ''))
  const canEditCases = computed(() => getUserPermission('cases', 'edit') || MANAGE_ROLES.includes(user.value?.role || ''))
  const canDeleteCases = computed(() => getUserPermission('cases', 'delete') || user.value?.role === 'admin')

  // Equipo: todos los roles internos pueden ver; solo admin y supervisor crean/editan
  const canViewTeam = computed(() => {
    if (!user.value) return false
    return getUserPermission('team', 'view') || INTERNAL_ROLES.includes(user.value.role)
  })
  const canCreateTeam = computed(() => getUserPermission('team', 'create') || MANAGE_ROLES.includes(user.value?.role || ''))
  const canEditTeam = computed(() => getUserPermission('team', 'edit') || MANAGE_ROLES.includes(user.value?.role || ''))
  const canDeleteTeam = computed(() => getUserPermission('team', 'delete') || user.value?.role === 'admin')
  const canManageTeam = computed(() => canCreateTeam.value || canEditTeam.value || canDeleteTeam.value)

  const canViewTeamActivities = computed(() => {
    if (!user.value) return false
    return INTERNAL_ROLES.includes(user.value.role)
  })

  const isLeader = computed(() => {
    if (!user.value) return false
    return INTERNAL_ROLES.includes(user.value.role)
  })

  // Department-based access
  const canViewMarketingSection = computed(() => {
    if (!user.value) return false
    return user.value.role === 'admin' ||
           (user.value.role === 'supervisor' && user.value.department === 'Marketing') ||
           user.value.department === 'Marketing'
  })

  const canViewSalesSection = computed(() => {
    if (!user.value) return false
    return user.value.role === 'admin' ||
           (user.value.role === 'supervisor' && user.value.department === 'Ventas') ||
           user.value.department === 'Ventas'
  })

  // Actions
  const login = async (credentials: LoginCredentials) => {
    try {
      isLoading.value = true
      error.value = null
      
      
      const response = await authService.login(credentials)

      if (response.success) {
        if (response.require2FA) {
          return { success: true, require2FA: true, tempToken: response.tempToken }
        }

        user.value = response.user || null
        if (user.value) {
          const effectiveRole = response.membership?.role || user.value.role
          user.value = { ...user.value, role: normalizeRole(effectiveRole) }
        }
        token.value = response.token || null
        if (response.token) localStorage.setItem('token', response.token)
        if (response.refreshToken) localStorage.setItem('refreshToken', response.refreshToken)
        if (user.value) localStorage.setItem('user', JSON.stringify(user.value))
        memberships.value = response.memberships || []
        persistMembershipsCount(memberships.value.length)
        requiresOrgSelection.value = !!response.requiresOrgSelection
        if (response.organization) {
          organization.value = response.organization
          localStorage.setItem('organization', JSON.stringify(response.organization))
        } else {
          organization.value = null
          localStorage.removeItem('organization')
        }
        return { success: true, requiresOrgSelection: requiresOrgSelection.value }
      } else {
        error.value = response.message || 'Error al iniciar sesión'
        return { success: false, message: error.value }
      }
    } catch (err: any) {
      error.value = err.message || 'Error de conexión'
      return { success: false, message: error.value }
    } finally {
      isLoading.value = false
    }
  }

  const verify2FA = async (tempToken: string, code: string) => {
    try {
      isLoading.value = true
      error.value = null
      
      const response = await authService.verify2FA(tempToken, code)

      if (response.success) {
        user.value = response.user || null
        if (user.value) {
          const effectiveRole = response.membership?.role || user.value.role
          user.value = { ...user.value, role: normalizeRole(effectiveRole) }
        }
        token.value = response.token || null
        if (response.token) localStorage.setItem('token', response.token)
        if (response.refreshToken) localStorage.setItem('refreshToken', response.refreshToken)
        if (user.value) localStorage.setItem('user', JSON.stringify(user.value))
        memberships.value = response.memberships || []
        persistMembershipsCount(memberships.value.length)
        requiresOrgSelection.value = !!response.requiresOrgSelection
        if (response.organization) {
          organization.value = response.organization
          localStorage.setItem('organization', JSON.stringify(response.organization))
        } else {
          organization.value = null
          localStorage.removeItem('organization')
        }
        return { success: true, requiresOrgSelection: requiresOrgSelection.value }
      } else {
        error.value = response.message || 'Código incorrecto'
        return { success: false, message: error.value }
      }
    } catch (err: any) {
      error.value = err.message || 'Error de conexión'
      return { success: false, message: error.value }
    } finally {
      isLoading.value = false
    }
  }

  const logout = async () => {
    try {
      if (token.value) {
        await authService.logout()
      }
    } catch (err) {
      console.error('Error during logout:', err)
    } finally {
      user.value = null
      token.value = null
      organization.value = null
      memberships.value = []
      membershipsCount.value = 0
      requiresOrgSelection.value = false
      localStorage.removeItem('token')
      localStorage.removeItem('refreshToken')
      localStorage.removeItem('user')
      localStorage.removeItem('organization')
      localStorage.removeItem('memberships_count')
      window.location.href = '/login'
    }
  }

  const resetPassword = async (token: string, newPassword: string) => {
    isLoading.value = true
    error.value = null
    try {
      return await authService.resetPassword(token, newPassword)
    } finally {
      isLoading.value = false
    }
  }

  const registerOrg = async (data: { orgName: string; userName: string; email: string; password: string }) => {
    isLoading.value = true
    error.value = null
    try {
      return await authService.registerOrg(data)
    } finally {
      isLoading.value = false
    }
  }

  const verifyEmail = async (token: string) => {
    isLoading.value = true
    error.value = null
    try {
      return await authService.verifyEmail(token)
    } finally {
      isLoading.value = false
    }
  }

  const selectOrganization = async (organizationId: string) => {
    isLoading.value = true
    error.value = null
    try {
      const response = await authService.selectOrganization(organizationId)
      if (response.success && response.token && response.organization) {
        // Merge user + membership role from org selection
        if (response.user) {
          user.value = response.user
          const effectiveRole = response.membership?.role || user.value.role
          user.value = { ...user.value, role: normalizeRole(effectiveRole) }
          localStorage.setItem('user', JSON.stringify(user.value))
        }
        token.value = response.token || null
        organization.value = response.organization || null
        requiresOrgSelection.value = false
        if (response.token) localStorage.setItem('token', response.token)
        if (response.refreshToken) localStorage.setItem('refreshToken', response.refreshToken)
        if (response.organization) localStorage.setItem('organization', JSON.stringify(response.organization))
        return { success: true }
      }
      error.value = response.message || 'No se pudo seleccionar la organización'
      return { success: false, message: error.value }
    } finally {
      isLoading.value = false
    }
  }

  // Persiste el conteo de orgs para sobrevivir reloads
  const persistMembershipsCount = (count: number) => {
    membershipsCount.value = count
    if (count > 1) localStorage.setItem('memberships_count', String(count))
    else localStorage.removeItem('memberships_count')
  }

  // Limpia el estado local sin hacer redirect (para uso en guards de ruta)
  const clearSession = () => {
    user.value = null
    token.value = null
    organization.value = null
    memberships.value = []
    membershipsCount.value = 0
    requiresOrgSelection.value = false
    localStorage.removeItem('token')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('user')
    localStorage.removeItem('organization')
    localStorage.removeItem('memberships_count')
  }

  const checkAuth = async () => {
    const storedToken = localStorage.getItem('token')
    const storedUser = localStorage.getItem('user')

    if (!storedToken || !storedUser) {
      return false
    }

    try {
      token.value = storedToken
      const parsedUser = JSON.parse(storedUser)
      user.value = parsedUser ? { ...parsedUser, role: normalizeRole(parsedUser.role || '') } : null

      // Verify token is still valid
      const response = await authService.verifyToken()
      if (!response.success) {
        // Limpiar silenciosamente — el router guard hará next('/login') sin reload
        clearSession()
        return false
      }
      requiresOrgSelection.value = !!response.requiresOrgSelection
      if (response.organization) {
        organization.value = response.organization
        localStorage.setItem('organization', JSON.stringify(response.organization))
      }
      return true
    } catch (err) {
      clearSession()
      return false
    }
  }

  const updateProfile = async (profileData: Partial<User>) => {
    try {
      isLoading.value = true
      error.value = null
      
      const response = await authService.updateProfile(profileData)
      
      if (response.success && user.value) {
        user.value = { ...user.value, ...response.user }
        localStorage.setItem('user', JSON.stringify(user.value))
        return { success: true }
      } else {
        error.value = response.message || 'Error al actualizar perfil'
        return { success: false, message: error.value }
      }
    } catch (err: any) {
      error.value = err.message || 'Error de conexión'
      return { success: false, message: error.value }
    } finally {
      isLoading.value = false
    }
  }

  
  const getAvailableModules = computed(() => {
    if (!user.value) return []
    // Si es CLIENTE, solo ve "Soporte" (levantar tickets)
    if (user.value.role === 'client') {
      return [
        { id: 'tickets-public', name: 'Soporte', icon: 'fas fa-headset', path: '/support', canAccess: true }
      ]
    }

    const modules = [
      { id: 'dashboard', name: 'Dashboard', icon: 'fas fa-house', path: '/', canAccess: canViewDashboard.value }
    ]

    if (canViewClients.value) {
      modules.push({ id: 'clients', name: 'Clientes', icon: 'fas fa-address-book', path: '/clients', canAccess: true })
      modules.push({ id: 'prospects', name: 'Prospectos IA', icon: 'fas fa-wand-magic-sparkles', path: '/prospectos', canAccess: true })
    }

    if (canViewActivities.value) {
      modules.push({ id: 'activities', name: 'Actividades', icon: 'fas fa-list-check', path: '/activities', canAccess: true })
    }

    if (canViewReports.value) {
      modules.push({ id: 'reports', name: 'Reportes', icon: 'fas fa-chart-line', path: '/reports', canAccess: true })
    }

    if (canViewTickets.value) {
      modules.push({ id: 'tickets', name: 'Tickets', icon: 'fas fa-headset', path: '/tickets', canAccess: true })
    }

    if (canViewCases.value) {
      modules.push({ id: 'cases', name: 'Casos', icon: 'fas fa-folder-tree', path: '/cases', canAccess: true })
    }

    // Base de conocimiento: visible para todo el equipo interno
    modules.push({ id: 'wiki', name: 'Wiki', icon: 'fas fa-book-open', path: '/wiki', canAccess: true })

    if (canViewTeam.value) {
      modules.push({ id: 'team', name: 'Equipo', icon: 'fas fa-user-group', path: '/team', canAccess: true })
    }

    if (['admin', 'supervisor'].includes(user.value.role)) {
      modules.push({ id: 'theme-settings', name: 'Personalización', icon: 'fas fa-sliders', path: '/settings/theme', canAccess: true })
    }

    if (user.value.isSuperAdmin) {
      modules.push({ id: 'admin-orgs', name: 'Organizaciones', icon: 'fas fa-building', path: '/admin/organizations', canAccess: true })
      modules.push({ id: 'pricing-calculator', name: 'Calculadora', icon: 'fas fa-calculator', path: '/pricing-calculator', canAccess: true })
    }

    return modules.filter(m => m.canAccess)
  })

  // Helper functions for updating user data
  const updateUserAvatar = (avatar: string) => {
    if (user.value) {
      user.value.avatar = avatar
      localStorage.setItem('user', JSON.stringify(user.value))
    }
  }

  const updateUserProfile = (profileData: Partial<User>) => {
    if (user.value) {
      user.value = { ...user.value, ...profileData }
      localStorage.setItem('user', JSON.stringify(user.value))
    }
  }

  return {
    // State
    user,
    token,
    isLoading,
    error,
    
    // Getters
    isAuthenticated,
    userRole,
    isAdmin,
    isSuperAdmin,
    isManager,
    
    // Permission computed properties
    canViewDashboard,
    canViewClients,
    canViewActivities,
    canViewReports,
    canViewAccounting,
    canViewCases,
    canViewTeam,
    canCreateClients,
    canEditClients,
    canDeleteClients,
    canCreateActivities,
    canEditActivities,
    canDeleteActivities,
    canCreateCases,
    canEditCases,
    canDeleteCases,
    canCreateTeam,
    canEditTeam,
    canDeleteTeam,
    canManageTeam,
    canManageAccounting,
    
    // Department access
    canViewMarketingSection,
    canViewSalesSection,
    
    // Multi-tenant state
    organization,
    memberships,
    membershipsCount,
    hasMultipleOrgs,
    requiresOrgSelection,

    // Actions
    login,
    verify2FA,
    logout,
    checkAuth,
    clearSession,
    selectOrganization,
    persistMembershipsCount,
    updateProfile,
    updateUserAvatar,
    updateUserProfile,
    getAvailableModules,
    registerOrg,
    verifyEmail,
    checkPermission: getUserPermission
  }
})

