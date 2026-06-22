<template>
  <div class="space-y-4">
    <!-- Header -->
    <div class="bg-white dark:bg-[#1e293b] rounded-xl shadow-sm px-5 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
      <div class="flex items-center gap-3.5">
        <div class="w-12 h-12 rounded-xl flex items-center justify-center text-white text-lg font-black shrink-0"
          style="background: linear-gradient(135deg, var(--brand-accent) 0%, color-mix(in srgb, var(--brand-accent) 70%, #6366f1) 100%);">
          {{ (client?.name || 'C').charAt(0).toUpperCase() }}
        </div>
        <div>
          <h1 class="text-[18px] font-black text-slate-800 dark:text-slate-100 leading-tight">{{ client?.name || '...' }}</h1>
          <p class="text-[13px] text-slate-400 font-medium mt-0.5">{{ client?.company || 'Sin empresa' }}<span v-if="client?.email"> · {{ client.email }}</span></p>
        </div>
      </div>
      <div class="flex items-center gap-2 shrink-0">
        <router-link to="/clients" class="h-8 px-3 text-[13px] font-bold text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-[#334155] rounded-lg hover:bg-slate-100 transition-colors flex items-center gap-1.5">
          <i class="fas fa-arrow-left text-[11px]"></i> Volver
        </router-link>
        <button @click="editOverview = !editOverview"
          class="h-8 px-3 text-[13px] font-bold rounded-lg transition-colors flex items-center gap-1.5"
          :class="editOverview
            ? 'bg-rose-50 dark:bg-rose-500/10 text-rose-500 border border-rose-200 dark:border-rose-500/30'
            : 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-500/30 hover:bg-amber-100'">
          <i :class="editOverview ? 'fas fa-times' : 'fas fa-edit'" class="text-[11px]"></i>
          {{ editOverview ? 'Cancelar' : 'Editar' }}
        </button>
        <button v-if="editOverview" @click="handleSave"
          class="h-8 px-3 text-[13px] font-bold text-white bg-emerald-500 hover:bg-emerald-600 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm">
          <i class="fas fa-save text-[11px]"></i> Guardar
        </button>
      </div>
    </div>

    <!-- Spinner -->
    <div v-if="isLoading" class="flex justify-center items-center py-20">
      <i class="fas fa-spinner fa-spin text-3xl text-primary-400"></i>
    </div>

    <!-- Contenedor principal -->
    <div v-else class="bg-white dark:bg-[#1e293b] rounded-xl shadow-sm">
      <!-- Tabs -->
      <div class="flex gap-1 px-3 pt-3 border-b border-slate-100 dark:border-[#334155] overflow-x-auto">
        <button v-for="t in tabs" :key="t.key" @click="activeTab = t.key"
          class="px-4 py-2 rounded-t-lg whitespace-nowrap text-[13px] font-bold transition-all flex items-center gap-1.5 min-w-max border-b-2 -mb-px"
          :class="activeTab === t.key
            ? 'text-primary-600 dark:text-primary-400 border-primary-500 bg-primary-50/50 dark:bg-primary-500/10'
            : 'text-slate-500 dark:text-slate-400 border-transparent hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/20'">
          <i :class="[t.icon, 'text-[11px]']"></i>{{ t.label }}
        </button>
      </div>

      <!-- Contenido -->
      <div class="p-5">
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
