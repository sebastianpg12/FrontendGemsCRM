import { API_CONFIG } from '../config/api'
import { authHeaders, apiFetch } from './authHeaders'

class TaskReportService {
  private baseUrl = API_CONFIG.BASE_URL
  private endpoint = '/task-reports'

  async getSettings(): Promise<any> {
    try {
      const response = await apiFetch(`${this.baseUrl}${this.endpoint}/settings`, {
        method: 'GET',
        headers: authHeaders(),
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      return await response.json()
    } catch (error) {
      console.error('Error fetching task report settings:', error)
      throw new Error('No se pudieron cargar las configuraciones de reportes')
    }
  }

  async updateSettings(settings: {
    dailySummaryEnabled?: boolean,
    dailySummaryTime?: string,
    dailySummaryDays?: number[],
    dueTomorrowEnabled?: boolean,
    dueTomorrowTime?: string,
    dueTomorrowDays?: number[],
    dueTomorrowAdvanceDays?: number | string
  }): Promise<any> {
    try {
      const response = await apiFetch(`${this.baseUrl}${this.endpoint}/settings`, {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify(settings),
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      return await response.json()
    } catch (error) {
      console.error('Error updating task report settings:', error)
      throw new Error('No se pudieron actualizar las configuraciones de reportes')
    }
  }

  async sendDailySummary(): Promise<any> {
    try {
      const response = await apiFetch(`${this.baseUrl}${this.endpoint}/send-daily-summary`, {
        method: 'POST',
        headers: authHeaders()
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      return await response.json()
    } catch (error) {
      console.error('Error sending daily summary:', error)
      throw new Error('No se pudo enviar el resumen diario')
    }
  }

  async sendDueTomorrowReminder(): Promise<any> {
    try {
      const response = await apiFetch(`${this.baseUrl}${this.endpoint}/send-due-tomorrow`, {
        method: 'POST',
        headers: authHeaders()
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      return await response.json()
    } catch (error) {
      console.error('Error sending due tomorrow reminder:', error)
      throw new Error('No se pudo enviar el recordatorio de vencimiento')
    }
  }

  async sendCustomReport(taskIds: string[]): Promise<any> {
    try {
      const response = await apiFetch(`${this.baseUrl}${this.endpoint}/send-custom-report`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ taskIds }),
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      return await response.json()
    } catch (error) {
      console.error('Error sending custom report:', error)
      throw new Error('No se pudo enviar el reporte personalizado')
    }
  }
}

export const taskReportService = new TaskReportService()

