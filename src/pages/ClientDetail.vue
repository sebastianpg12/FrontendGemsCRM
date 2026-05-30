<template>
  <div class="space-y-6">
    <!-- Encabezado del Cliente -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
      <div class="flex items-center gap-4">
        <div class="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 text-2xl font-black border border-primary-200">
          {{ (client?.name || 'C').charAt(0).toUpperCase() }}
        </div>
        <div>
          <h1 class="text-2xl font-black text-slate-800">{{ client?.name }}</h1>
          <p class="text-slate-500 font-medium text-sm mt-0.5">{{ client?.company || 'Sin Empresa' }}</p>
        </div>
      </div>
      <div class="flex items-center gap-3">
        <router-link to="/clients" class="px-5 py-2.5 text-sm font-bold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors shadow-sm">
          <i class="fas fa-arrow-left mr-2"></i> Volver
        </router-link>
        <button @click="editOverview = !editOverview" class="px-5 py-2.5 text-sm font-bold text-amber-700 bg-amber-50 border border-amber-200 rounded-lg hover:bg-amber-100 transition-colors shadow-sm">
          <i :class="editOverview ? 'fas fa-times' : 'fas fa-edit'" class="mr-2"></i>
          {{ editOverview ? 'Cancelar Edición' : 'Editar Cliente' }}
        </button>
        <button v-if="editOverview" @click="handleSave" class="px-5 py-2.5 text-sm font-bold text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors shadow-sm">
          <i class="fas fa-save mr-2"></i> Guardar Cambios
        </button>
      </div>
    </div>

    <!-- Spinner de Carga -->
    <div v-if="isLoading" class="flex justify-center items-center py-20">
      <i class="fas fa-spinner fa-spin text-4xl text-primary-500"></i>
    </div>

    <!-- Contenedor Principal (Tabs y Contenido) -->
    <div v-else class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <!-- Tabs -->
      <div class="flex gap-2 p-3 border-b border-slate-100 bg-slate-50 overflow-x-auto scroll-smooth">
        <button v-for="t in tabs" :key="t.key" @click="activeTab = t.key"
          :class="[
            'px-4 py-2.5 rounded-lg whitespace-nowrap text-sm font-bold transition-colors flex items-center min-w-max',
            activeTab === t.key 
              ? 'bg-primary-600 text-white shadow-sm' 
              : 'text-slate-600 hover:bg-white hover:text-slate-900 border border-transparent hover:border-slate-200'
          ]">
          <i :class="[t.icon, 'mr-2', activeTab === t.key ? 'opacity-100' : 'opacity-70']"></i>{{ t.label }}
        </button>
      </div>

      <!-- Contenido de las Tabs -->
      <div class="p-6 md:p-8">
        <ClientOverview v-if="activeTab === 'overview'" :editOverview="editOverview" />
        <ClientServices v-else-if="activeTab === 'services'" />
        <ClientCommitments v-else-if="activeTab === 'commitments'" />
        <ClientPreferences v-else-if="activeTab === 'preferences'" />
        <ClientNotes v-else-if="activeTab === 'notes'" />
        <ClientCustomFields v-else-if="activeTab === 'custom'" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, provide } from 'vue'
import { useRoute } from 'vue-router'
import { useClientDetail } from '@/composables/useClientDetail'

// Sub-componentes fragmentados (Clean Architecture)
import ClientOverview from '@/components/clients/detail/ClientOverview.vue'
import ClientServices from '@/components/clients/detail/ClientServices.vue'
import ClientCommitments from '@/components/clients/detail/ClientCommitments.vue'
import ClientPreferences from '@/components/clients/detail/ClientPreferences.vue'
import ClientNotes from '@/components/clients/detail/ClientNotes.vue'
import ClientCustomFields from '@/components/clients/detail/ClientCustomFields.vue'

const route = useRoute()
const clientId = route.params.id as string

// Inicializar el Composable de estado
const clientDetailState = useClientDetail(clientId)
const { client, isLoading, fetchDetail, saveOverview } = clientDetailState

// Proveer el contexto global a todos los hijos para evitar prop-drilling
provide('clientContext', clientDetailState)

const editOverview = ref(false)
const activeTab = ref('overview')

const tabs = [
  { key: 'overview', label: 'Resumen', icon: 'fas fa-user' },
  { key: 'services', label: 'Servicios', icon: 'fas fa-box' },
  { key: 'commitments', label: 'Compromisos', icon: 'fas fa-handshake' },
  { key: 'preferences', label: 'Preferencias', icon: 'fas fa-heart' },
  { key: 'notes', label: 'Notas', icon: 'fas fa-sticky-note' },
  { key: 'custom', label: 'Campos', icon: 'fas fa-sliders-h' }
]

const handleSave = async () => {
  const success = await saveOverview()
  if (success) {
    editOverview.value = false
  }
}

onMounted(() => {
  fetchDetail()
})
</script>

<style scoped>
</style>
