import { API_CONFIG } from '@/config/api'

const API_BASE_URL = API_CONFIG.BASE_URL

/**
 * Header factory para servicios que usan fetch directamente.
 */
export function authHeaders(extra: Record<string, string> = {}, opts: { json?: boolean } = {}): HeadersInit {
  const token = localStorage.getItem('token')
  const headers: Record<string, string> = { ...extra }
  if (opts.json !== false) headers['Content-Type'] = 'application/json'
  if (token) headers['Authorization'] = `Bearer ${token}`
  return headers
}

// ─── Refresh token queue (evita llamadas simultáneas al /refresh) ─────────────
let isRefreshing = false
let refreshQueue: Array<{ resolve: (token: string) => void; reject: (err: unknown) => void }> = []

function flushQueue(err: unknown, token: string | null) {
  refreshQueue.forEach(p => (err ? p.reject(err) : p.resolve(token!)))
  refreshQueue = []
}

async function attemptRefresh(): Promise<string> {
  const refreshToken = localStorage.getItem('refreshToken')
  if (!refreshToken) throw new Error('No refresh token')

  const res = await fetch(`${API_BASE_URL}/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken }),
  })

  if (!res.ok) throw new Error('Refresh failed')

  const data = await res.json()
  const newToken: string = data.data.token
  const newRefresh: string | undefined = data.data.refreshToken

  localStorage.setItem('token', newToken)
  if (newRefresh) localStorage.setItem('refreshToken', newRefresh)

  return newToken
}

function forceLogout() {
  localStorage.removeItem('token')
  localStorage.removeItem('refreshToken')
  localStorage.removeItem('user')
  // No redirigir si ya estamos en una página de autenticación
  const p = window.location.pathname
  if (!p.startsWith('/login') && !p.startsWith('/register') && !p.startsWith('/verify-email') && !p.startsWith('/forgot-password') && !p.startsWith('/reset-password')) {
    window.location.href = '/login'
  }
}

/**
 * `fetch` con refresh automático de token.
 * Úsalo en lugar de `fetch` en todos los servicios que pasan authHeaders.
 *
 * Maneja:
 * - Inyección automática de Authorization header
 * - Intento de refresh en 401
 * - Cola de peticiones en vuelo durante el refresh
 * - Redirect a /login si el refresh también falla
 */
export async function apiFetch(url: string, options: RequestInit = {}): Promise<Response> {
  const buildHeaders = (token: string | null): Record<string, string> => {
    const base = (options.headers as Record<string, string>) || {}
    const h: Record<string, string> = { ...base }
    // Solo Content-Type si no es FormData
    if (!(options.body instanceof FormData) && !h['Content-Type']) {
      h['Content-Type'] = 'application/json'
    }
    if (token) h['Authorization'] = `Bearer ${token}`
    return h
  }

  // Primera llamada
  let token = localStorage.getItem('token')
  let response = await fetch(url, { ...options, headers: buildHeaders(token) })

  if (response.status !== 401) return response

  // ── 401: intentar refresh ─────────────────────────────────────────────────
  if (isRefreshing) {
    // Otro request ya está refrescando — encolar y esperar
    const newToken = await new Promise<string>((resolve, reject) => {
      refreshQueue.push({ resolve, reject })
    })
    return fetch(url, { ...options, headers: buildHeaders(newToken) })
  }

  isRefreshing = true
  try {
    const newToken = await attemptRefresh()
    flushQueue(null, newToken)
    return fetch(url, { ...options, headers: buildHeaders(newToken) })
  } catch (err) {
    flushQueue(err, null)
    forceLogout()
    return response // devolvemos el 401 original (la página ya redirige)
  } finally {
    isRefreshing = false
  }
}
