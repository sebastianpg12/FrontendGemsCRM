// Configuración automática de API según el ambiente
const getBaseURL = (): string => {
  return import.meta.env.VITE_API_URL || 'https://gems-crm-backend.onrender.com/api'
}

// Función para obtener timeout personalizado
const getTimeout = (): number => {
  return Number(import.meta.env.VITE_API_TIMEOUT) || 10000
}

export const API_CONFIG = {
  BASE_URL: getBaseURL(),
  TIMEOUT: getTimeout(),
  HEADERS: {
    'Content-Type': 'application/json',
  }
}

// Función para verificar si estamos en modo debug
export const isDebugMode = (): boolean => {
  return import.meta.env.VITE_DEBUG_MODE === 'true' || import.meta.env.DEV
}



export const ENDPOINTS = {
  CLIENTS: '/clients',
  ACTIVITIES: '/activities',
  PAYMENTS: '/payments',
  CASES: '/cases',
  FOLLOWUPS: '/followups',
  ISSUES: '/issues',
  NOTIFICATIONS: '/notifications',
  DOCS: '/docs',
  MINUTES: '/minutes',
  SETTINGS: '/settings',
  TEAM: '/team',
  REPORTS: '/reports',
  TICKETS: '/tickets'
}
