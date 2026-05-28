/**
 * Utilidades para el manejo de rutas y navegación
 * Maneja automáticamente la base URL según el ambiente
 */

// Obtener la base URL correcta según el ambiente
export const getBaseUrl = (): string => {
  return import.meta.env.BASE_URL || '/'
}

// Construir URL absoluta considerando la base URL
export const buildUrl = (path: string): string => {
  const baseUrl = getBaseUrl()
  const cleanPath = path.startsWith('/') ? path : `/${path}`
  
  if (baseUrl === '/') {
    return cleanPath
  }
  
  return `${baseUrl.replace(/\/$/, '')}${cleanPath}`
}

// Navegar a una ruta específica
export const navigateTo = (path: string): void => {
  const url = buildUrl(path)
  window.location.href = url
}

// Verificar si estamos en producción (GitHub Pages)
export const isProduction = (): boolean => {
  return import.meta.env.PROD
}

// Verificar si estamos en desarrollo
export const isDevelopment = (): boolean => {
  return import.meta.env.DEV
}

// Log de configuración de rutas
export const logRouteConfig = (): void => {
    baseUrl: getBaseUrl(),
    environment: isProduction() ? 'production' : 'development',
    hostname: window.location.hostname,
    currentPath: window.location.pathname
  })
}

// Inicializar configuración de rutas
if (isDevelopment()) {
  logRouteConfig()
}
