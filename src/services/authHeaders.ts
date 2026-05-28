/**
 * Header factory para servicios que usan `fetch` directamente.
 * Inyecta Authorization Bearer desde localStorage si existe.
 *
 * Uso:
 *   headers: authHeaders()
 *   // o
 *   headers: authHeaders({ 'X-Custom': 'value' })
 *
 * Para FormData (sin Content-Type para que el browser ponga boundary):
 *   headers: authHeaders({}, { json: false })
 */
export function authHeaders(extra: Record<string, string> = {}, opts: { json?: boolean } = {}): HeadersInit {
  const token = localStorage.getItem('token')
  const headers: Record<string, string> = { ...extra }
  if (opts.json !== false) headers['Content-Type'] = 'application/json'
  if (token) headers['Authorization'] = `Bearer ${token}`
  return headers
}
