import { reactive, ref, computed } from 'vue'
import { API_CONFIG } from '@/config/api'
import { apiFetch } from '@/services/authHeaders'
import { useNotifications } from '@/composables/useNotifications'

export function useClientDetail(clientId: string) {
  const { showError } = useNotifications()

  const client = reactive<any>({})
  const draft = reactive<any>({ profile: {}, tags: [] })
  const isLoading = ref(false)

  const parseJsonSafe = async (res: Response) => {
    const ct = res.headers.get('content-type') || ''
    if (!ct.includes('application/json')) {
      const text = await res.text()
      throw new Error(`Respuesta no-JSON (${res.status}): ${text.slice(0, 200)}...`)
    }
    return res.json()
  }

  const fetchDetail = async () => {
    isLoading.value = true
    try {
      let res = await apiFetch(`${API_CONFIG.BASE_URL}/clients/${clientId}/detail`)
      if (res.status === 404) {
        res = await apiFetch(`${API_CONFIG.BASE_URL}/clients/${clientId}`)
      }
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await parseJsonSafe(res)
      Object.assign(client, data)
      Object.assign(draft, JSON.parse(JSON.stringify(data)))
    } catch (err) {
      console.error('Error cargando detalle del cliente:', err)
      showError('No se pudo cargar el detalle del cliente.')
    } finally {
      isLoading.value = false
    }
  }

  const saveOverview = async () => {
    try {
      const payload = {
        email: draft.email,
        phone: draft.phone,
        company: draft.company,
        tags: draft.tags,
        profile: draft.profile,
        preferences: draft.preferences,
        customFields: draft.customFields
      }

      let res = await apiFetch(`${API_CONFIG.BASE_URL}/clients/${clientId}/detail`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (res.status === 404) {
        res = await apiFetch(`${API_CONFIG.BASE_URL}/clients/${clientId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        })
      }

      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await parseJsonSafe(res)
      Object.assign(client, data)
      Object.assign(draft, JSON.parse(JSON.stringify(data)))
      return true
    } catch (err) {
      console.error('Error guardando cambios:', err)
      showError('No se pudieron guardar los cambios.')
      return false
    }
  }

  // --- Notes API ---
  const sortedNotes = computed(() => {
    return (client.notes || []).slice().sort((a: any, b: any) => {
      if (a.pinned && !b.pinned) return -1
      if (!a.pinned && b.pinned) return 1
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })
  })

  const addNote = async (content: string) => {
    try {
      const res = await apiFetch(`${API_CONFIG.BASE_URL}/clients/${clientId}/notes`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ content })
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const note = await parseJsonSafe(res)
      client.notes = [note, ...(client.notes || [])]
      return true
    } catch (err) {
      console.error('Error agregando nota:', err)
      showError('No se pudo agregar la nota.')
      return false
    }
  }

  const togglePinNote = async (n: any) => {
    try {
      const res = await apiFetch(`${API_CONFIG.BASE_URL}/clients/${clientId}/notes/${n._id}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ pinned: !n.pinned })
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const upd = await parseJsonSafe(res)
      Object.assign(n, upd)
    } catch (err) {
      console.error('Error actualizando nota:', err)
      showError('No se pudo actualizar la nota.')
    }
  }

  const deleteNote = async (noteId: string) => {
    try {
      const res = await apiFetch(`${API_CONFIG.BASE_URL}/clients/${clientId}/notes/${noteId}`, { method: 'DELETE' })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      client.notes = (client.notes || []).filter((n: any) => n._id !== noteId)
    } catch (err) {
      console.error('Error eliminando nota:', err)
      showError('No se pudo eliminar la nota.')
    }
  }

  // --- Services API ---
  const createService = async (payload: any) => {
    try {
      const res = await apiFetch(`${API_CONFIG.BASE_URL}/clients/${clientId}/services`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const svc = await parseJsonSafe(res)
      client.services = [...(client.services || []), svc]
      return true
    } catch (err) {
      console.error('Error agregando servicio:', err)
      showError('No se pudo agregar el servicio.')
      return false
    }
  }

  const updateService = async (serviceId: string, payload: any) => {
    try {
      const res = await apiFetch(`${API_CONFIG.BASE_URL}/clients/${clientId}/services/${serviceId}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const upd = await parseJsonSafe(res)
      const idx = (client.services || []).findIndex((x: any) => x._id === serviceId)
      if (idx !== -1) client.services[idx] = upd
      return true
    } catch (err) {
      console.error('Error editando servicio:', err)
      showError('No se pudo editar el servicio.')
      return false
    }
  }

  const deleteService = async (serviceId: string) => {
    try {
      const res = await apiFetch(`${API_CONFIG.BASE_URL}/clients/${clientId}/services/${serviceId}`, { method: 'DELETE' })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      client.services = (client.services || []).filter((s: any) => s._id !== serviceId)
    } catch (err) {
      console.error('Error eliminando servicio:', err)
      showError('No se pudo eliminar el servicio.')
    }
  }

  // --- Commitments API ---
  const createCommitment = async (payload: any) => {
    try {
      const res = await apiFetch(`${API_CONFIG.BASE_URL}/clients/${clientId}/commitments`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const item = await parseJsonSafe(res)
      client.commitments = [...(client.commitments || []), item]
      return true
    } catch (err) {
      console.error('Error agregando compromiso:', err)
      showError('No se pudo agregar el compromiso.')
      return false
    }
  }

  const updateCommitment = async (commitmentId: string, payload: any) => {
    try {
      const res = await apiFetch(`${API_CONFIG.BASE_URL}/clients/${clientId}/commitments/${commitmentId}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const upd = await parseJsonSafe(res)
      const idx = (client.commitments || []).findIndex((x: any) => x._id === commitmentId)
      if (idx !== -1) client.commitments[idx] = upd
      return true
    } catch (err) {
      console.error('Error editando compromiso:', err)
      showError('No se pudo editar el compromiso.')
      return false
    }
  }

  const deleteCommitment = async (commitmentId: string) => {
    try {
      const res = await apiFetch(`${API_CONFIG.BASE_URL}/clients/${clientId}/commitments/${commitmentId}`, { method: 'DELETE' })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      client.commitments = (client.commitments || []).filter((c: any) => c._id !== commitmentId)
    } catch (err) {
      console.error('Error eliminando compromiso:', err)
      showError('No se pudo eliminar el compromiso.')
    }
  }

  // --- Preferences & Custom Fields (optimistic UI then save) ---
  const addPreference = async (key: string, value: string) => {
    draft.preferences = [...(draft.preferences || []), { key, value }]
    client.preferences = JSON.parse(JSON.stringify(draft.preferences))
    return await saveOverview()
  }

  const removePreference = async (pref: any) => {
    const next = (draft.preferences || []).filter((p: any) => (p._id && pref._id) ? p._id !== pref._id : p.key !== pref.key)
    draft.preferences = next
    client.preferences = JSON.parse(JSON.stringify(next))
    return await saveOverview()
  }

  const addCustomField = async (key: string, value: string) => {
    draft.customFields = [...(draft.customFields || []), { key, value }]
    client.customFields = JSON.parse(JSON.stringify(draft.customFields))
    return await saveOverview()
  }

  const removeCustomField = async (cf: any) => {
    const next = (draft.customFields || []).filter((f: any) => (f._id && cf._id) ? f._id !== cf._id : f.key !== cf.key)
    draft.customFields = next
    client.customFields = JSON.parse(JSON.stringify(next))
    return await saveOverview()
  }

  return {
    client,
    draft,
    isLoading,
    sortedNotes,
    fetchDetail,
    saveOverview,
    addNote,
    togglePinNote,
    deleteNote,
    createService,
    updateService,
    deleteService,
    createCommitment,
    updateCommitment,
    deleteCommitment,
    addPreference,
    removePreference,
    addCustomField,
    removeCustomField
  }
}

