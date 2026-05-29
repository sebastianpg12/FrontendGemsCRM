interface UserProfileData {
  name: string
  email: string
  phone?: string
  department?: string
  avatar?: string
  role?: string
  role?: string
  createdAt?: string
  updatedAt?: string
  isTwoFactorEnabled?: boolean
}

interface UpdateProfileData {
  name: string
  email: string
  phone?: string | null
  department?: string | null
  avatar?: string
}

interface UpdatePasswordData {
  currentPassword: string
  newPassword: string
}

import { API_CONFIG } from '@/config/api'

class UserService {
  private baseUrl = API_CONFIG.BASE_URL
  private endpoint = '/auth'

  // Normaliza URLs de archivos: si viene '/uploads/...', la convierte a absoluta con el origen del backend
  private toAbsoluteUrl = (url?: string) => {
    if (!url) return ''
    if (/^https?:\/\//i.test(url)) return url
    // Obtener origen del backend a partir de baseUrl
    // Soporta valores como 'http://host:4000' o 'http://host:4000/api'
  let origin = this.baseUrl
    // Si incluye '/api' al final, lo removemos para apuntar al origen raíz
    origin = origin.replace(/\/?api\/?$/i, '')
    // Evitar doble slash al concatenar
    return `${origin.replace(/\/$/, '')}/${url.replace(/^\//, '')}`
  }

  async getProfile(): Promise<UserProfileData> {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('No hay token de autenticación')
      }

      const response = await fetch(`${this.baseUrl}${this.endpoint}/profile`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })


      if (!response.ok) {
        const errorText = await response.text()
        console.error('❌ Error en API:', errorText)
        throw new Error(`Error ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()

      // El backend puede devolver data.user o data.data.user
      const user = data.user || data.data?.user
      if (!user) {
        throw new Error('No se recibieron datos de usuario válidos')
      }

      // Normalizar URL de foto si es relativa
      if (user.photo) {
        user.photo = this.toAbsoluteUrl(user.photo)
      }

      return user
    } catch (error) {
      console.error('❌ Error getting profile:', error)
      throw error
    }
  }

  async updateProfile(profileData: UpdateProfileData): Promise<UserProfileData> {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${this.baseUrl}${this.endpoint}/profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
      })

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      return data.user
    } catch (error) {
      console.error('Error updating profile:', error)
      throw error
    }
  }

  async updatePassword(passwordData: UpdatePasswordData): Promise<void> {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${this.baseUrl}${this.endpoint}/change-password`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(passwordData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `Error ${response.status}: ${response.statusText}`)
      }
    } catch (error) {
      console.error('Error updating password:', error)
      throw error
    }
  }

  async uploadPhoto(file: File): Promise<string> {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('No hay token de autenticación')
      }

      
      const formData = new FormData()
      formData.append('photo', file)

      const response = await fetch(`${this.baseUrl}${this.endpoint}/upload-photo`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      })


      if (!response.ok) {
        const errorText = await response.text()
        console.error('❌ Error en subida:', errorText)
        throw new Error(`Error ${response.status}: ${response.statusText}`)
      }

  const data = await response.json()
      
  // Devolver URL absoluta para usarla directamente en <img>
  return this.toAbsoluteUrl(data.photoUrl)
    } catch (error) {
      console.error('❌ Error uploading photo:', error)
      throw error
    }
  }

  async setup2FA(): Promise<{ secret: string; qrCode: string }> {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${this.baseUrl}${this.endpoint}/setup-2fa`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      if (!response.ok) throw new Error('Error configurando 2FA')
      const data = await response.json()
      return data.data
    } catch (error) {
      throw error
    }
  }

  async enable2FA(code: string): Promise<void> {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${this.baseUrl}${this.endpoint}/enable-2fa`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ code })
      })
      if (!response.ok) {
        const err = await response.json()
        throw new Error(err.message || 'Error habilitando 2FA')
      }
    } catch (error) {
      throw error
    }
  }

  async disable2FA(password: string): Promise<void> {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${this.baseUrl}${this.endpoint}/disable-2fa`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ password })
      })
      if (!response.ok) {
        const err = await response.json()
        throw new Error(err.message || 'Error deshabilitando 2FA')
      }
    } catch (error) {
      throw error
    }
  }
}

export const userService = new UserService()
export type { UserProfileData, UpdateProfileData, UpdatePasswordData }
