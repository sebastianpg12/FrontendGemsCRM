import { API_CONFIG } from '../config/api'
import { authHeaders, apiFetch } from './authHeaders'

export interface ProjectData {
  _id?: string
  clientId: string
  name: string
  description?: string
  status?: 'active' | 'paused' | 'completed' | 'cancelled'
  startDate?: string
  dueDate?: string
  createdAt?: string
  updatedAt?: string
}

class ProjectService {
  private baseUrl = API_CONFIG.BASE_URL
  private endpoint = '/projects'

  async getAll(clientId?: string): Promise<ProjectData[]> {
    try {
      const query = clientId ? `?clientId=${encodeURIComponent(clientId)}` : ''
      const response = await apiFetch(`${this.baseUrl}${this.endpoint}${query}`, {
        method: 'GET',
        headers: authHeaders(),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return Array.isArray(data) ? data : []
    } catch (error) {
      console.error('Error fetching projects:', error)
      throw new Error('No se pudieron cargar los proyectos')
    }
  }

  async getById(id: string): Promise<ProjectData> {
    try {
      const response = await apiFetch(`${this.baseUrl}${this.endpoint}/${id}`, {
        method: 'GET',
        headers: authHeaders(),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error fetching project:', error)
      throw new Error('No se pudo cargar el proyecto')
    }
  }

  async create(projectData: Omit<ProjectData, '_id' | 'createdAt' | 'updatedAt'>): Promise<ProjectData> {
    try {
      const response = await apiFetch(`${this.baseUrl}${this.endpoint}`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify(projectData),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error creating project:', error)
      throw new Error('No se pudo crear el proyecto')
    }
  }

  async update(id: string, projectData: Partial<ProjectData>): Promise<ProjectData> {
    try {
      const response = await apiFetch(`${this.baseUrl}${this.endpoint}/${id}`, {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify(projectData),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error updating project:', error)
      throw new Error('No se pudo actualizar el proyecto')
    }
  }

  async deleteProject(id: string): Promise<void> {
    try {
      const response = await apiFetch(`${this.baseUrl}${this.endpoint}/${id}`, {
        method: 'DELETE',
        headers: authHeaders(),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
    } catch (error) {
      console.error('Error deleting project:', error)
      throw new Error('No se pudo eliminar el proyecto')
    }
  }

  async getActivities(id: string): Promise<any[]> {
    try {
      const response = await apiFetch(`${this.baseUrl}${this.endpoint}/${id}/activities`, {
        method: 'GET',
        headers: authHeaders(),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return Array.isArray(data) ? data : []
    } catch (error) {
      console.error('Error fetching project activities:', error)
      throw new Error('No se pudieron cargar las tareas del proyecto')
    }
  }
}

export const projectService = new ProjectService()
