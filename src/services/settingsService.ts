import { API_CONFIG } from '@/config/api'

const BASE = API_CONFIG.BASE_URL

function authHeaders(): Record<string, string> {
  const token = localStorage.getItem('token') || sessionStorage.getItem('token') || ''
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export interface BrandConfig {
  logo: string | null
  brandName: string
  accentColor: string
  darkMode: boolean
}

export const settingsService = {
  /** Carga la config de marca desde la BD */
  async getBrand(): Promise<BrandConfig | null> {
    try {
      const res = await fetch(`${BASE}/settings/brand`, {
        headers: { ...authHeaders() },
      })
      if (!res.ok) return null
      return await res.json()
    } catch {
      return null
    }
  },

  /** Guarda la config de marca en la BD */
  async saveBrand(config: BrandConfig): Promise<BrandConfig> {
    const res = await fetch(`${BASE}/settings/brand`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...authHeaders() },
      body: JSON.stringify(config),
    })
    if (!res.ok) throw new Error('No se pudo guardar la configuración')
    return await res.json()
  },

  /** Sube un logo (File) y retorna la URL pública */
  async uploadLogo(file: File): Promise<string> {
    const fd = new FormData()
    fd.append('logo', file)
    const res = await fetch(`${BASE}/settings/logo`, {
      method: 'POST',
      headers: { ...authHeaders() },
      body: fd,
    })
    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error(err.error || 'Error al subir el logo')
    }
    const data = await res.json()
    // Convert relative path to absolute URL + cache-bust timestamp
    const origin = BASE.replace(/\/api\/?$/, '')
    const absolute = data.url.startsWith('http') ? data.url : `${origin}${data.url}`
    return `${absolute}?t=${Date.now()}`
  },

  /** Elimina el logo del servidor */
  async deleteLogo(): Promise<void> {
    await fetch(`${BASE}/settings/logo`, {
      method: 'DELETE',
      headers: { ...authHeaders() },
    })
  },
}
