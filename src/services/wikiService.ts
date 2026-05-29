import apiClient from './authService'

export interface WikiArticle {
  _id?: string
  titulo: string
  categoria: 'proceso' | 'codigo' | 'manual' | 'otros'
  contenido: string
  descripcion: string
  tags: string[]
  autor?: {
    _id: string
    name: string
    email: string
  }
  archivos?: Array<{
    nombre: string
    url: string
    tipo: string
  }>
  vistas?: number
  linkedTickets?: any[]
  createdAt?: Date
  updatedAt?: Date
}

class WikiService {
  private apiUrl = '/wiki'

  async getAll(filters: { categoria?: string, search?: string } = {}): Promise<WikiArticle[]> {
    const queryParams = new URLSearchParams()
    if (filters.categoria) queryParams.append('categoria', filters.categoria)
    if (filters.search) queryParams.append('search', filters.search)
    
    const response = await apiClient.get(`${this.apiUrl}?${queryParams}`)
    return response.data
  }

  async getById(id: string): Promise<WikiArticle> {
    const response = await apiClient.get(`${this.apiUrl}/${id}`)
    return response.data
  }

  async create(data: Partial<WikiArticle>): Promise<WikiArticle> {
    const formData = new FormData()
    Object.entries(data).forEach(([key, value]) => {
      if (value === undefined || value === null) return
      
      if (key === 'archivos' && Array.isArray(value)) {
        value.forEach(v => {
          if (v instanceof File || v instanceof Blob) formData.append('archivos', v)
        })
      } else if (key === 'autor' && typeof value === 'object') {
        if ((value as any)._id) formData.append('autor', (value as any)._id)
      } else if (Array.isArray(value)) {
        value.forEach(v => formData.append(key, v))
      } else if (typeof value !== 'object' || value instanceof File || value instanceof Blob) {
        formData.append(key, value as any)
      }
    })

    const response = await apiClient.post(this.apiUrl, formData)
    return response.data
  }

  async update(id: string, data: Partial<WikiArticle>): Promise<WikiArticle> {
    // Campos gestionados por el servidor o por endpoints dedicados — no se envían al actualizar
    const SKIP_FIELDS = new Set(['_id', 'autor', 'linkedTickets', 'vistas', 'createdAt', 'updatedAt'])

    const formData = new FormData()
    Object.entries(data).forEach(([key, value]) => {
      if (value === undefined || value === null) return
      if (SKIP_FIELDS.has(key)) return

      if (key === 'archivos' && Array.isArray(value)) {
        value.forEach(v => {
          if (v instanceof File || v instanceof Blob) formData.append('archivos', v)
        })
      } else if (Array.isArray(value)) {
        value.forEach(v => {
          if (v instanceof File || v instanceof Blob) {
            formData.append(key, v)
          } else if (typeof v === 'object' && v !== null) {
            formData.append(key, (v as any)._id ?? '')
          } else {
            formData.append(key, String(v))
          }
        })
      } else if (typeof value !== 'object' || value instanceof File || value instanceof Blob) {
        formData.append(key, value as any)
      }
    })

    const response = await apiClient.put(`${this.apiUrl}/${id}`, formData)
    return response.data
  }

  async delete(id: string): Promise<void> {
    await apiClient.delete(`${this.apiUrl}/${id}`)
  }

  // Vincular ticket
  async linkTicket(wikiId: string, ticketId: string): Promise<WikiArticle> {
    const response = await apiClient.post(`${this.apiUrl}/${wikiId}/tickets`, { ticketId })
    return response.data
  }

  // Desvincular ticket
  async unlinkTicket(wikiId: string, ticketId: string): Promise<WikiArticle> {
    const response = await apiClient.delete(`${this.apiUrl}/${wikiId}/tickets/${ticketId}`)
    return response.data
  }
}

export const wikiService = new WikiService()
