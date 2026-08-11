import apiClient from './authService'

export type EnabledModules = Record<string, boolean>

export const moduleService = {
  // Módulos habilitados para la organización activa (global + override aplicados
  // server-side). Falla "abierto" — si la llamada falla, el store asume todo
  // habilitado para no ocultar secciones por un error de red transitorio.
  async getEnabledModules(): Promise<EnabledModules> {
    const { data } = await apiClient.get('/modules')
    return data.data || {}
  }
}
