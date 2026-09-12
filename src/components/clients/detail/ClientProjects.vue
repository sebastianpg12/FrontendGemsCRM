<template>
  <div class="space-y-4">
    <!-- Header -->
    <div class="flex items-center justify-between border-b border-slate-100 dark:border-[#334155] pb-3">
      <div class="flex items-center gap-2">
        <i class="fas fa-diagram-project text-[12px] text-primary-400"></i>
        <span class="text-[13px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Proyectos</span>
        <span v-if="projects.length" class="px-1.5 py-0.5 rounded-md bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-300 text-[11px] font-black">{{ projects.length }}</span>
      </div>
    </div>

    <!-- Form -->
    <div class="bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-[#334155] rounded-xl p-3 space-y-2.5">
      <input v-model="newName" placeholder="Nombre del proyecto..."
        class="w-full h-8 bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-[#334155] rounded-lg px-3 text-[14px] text-slate-700 dark:text-slate-200 font-medium focus:outline-none focus:ring-2 focus:ring-primary-400 transition-all" />
      <div class="flex flex-wrap gap-2">
        <div class="flex-1 min-w-[140px]">
          <CustomSelect v-model="newStatus" :options="statusOptions" size="sm" />
        </div>
        <button @click="handleCreate" :disabled="!newName.trim() || creating"
          class="h-8 px-4 rounded-lg bg-primary-600 text-white text-[14px] font-black hover:bg-primary-700 transition-colors shadow-sm flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed shrink-0">
          <i class="fas fa-plus text-[11px]"></i> Agregar
        </button>
      </div>
    </div>

    <!-- Spinner -->
    <div v-if="loading" class="flex justify-center py-10">
      <i class="fas fa-spinner fa-spin text-2xl text-primary-400"></i>
    </div>

    <!-- Lista -->
    <div v-else-if="projects.length" class="space-y-2">
      <router-link v-for="p in projects" :key="p._id" :to="`/projects/${p._id}`"
        class="block bg-white dark:bg-[#1e293b] rounded-xl border-l-4 pl-4 pr-3.5 py-3 shadow-sm hover:shadow-md transition-all"
        :class="statusBorder(p.status)">
        <div class="flex items-start justify-between gap-3">
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 flex-wrap">
              <h4 class="text-[14px] font-black text-slate-800 dark:text-slate-100 leading-tight">{{ p.name }}</h4>
              <span :class="statusChip(p.status)" class="text-[11px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full">
                {{ statusLabel(p.status) }}
              </span>
            </div>
            <p v-if="p.description" class="text-[13px] text-slate-500 dark:text-slate-400 mt-1.5 line-clamp-2">{{ p.description }}</p>
          </div>
          <i class="fas fa-chevron-right text-[12px] text-slate-300 dark:text-slate-600 mt-1"></i>
        </div>
      </router-link>
    </div>

    <div v-else class="text-center py-10 border border-dashed border-slate-200 dark:border-[#334155] rounded-xl">
      <i class="fas fa-diagram-project text-2xl text-slate-200 dark:text-slate-700 mb-2"></i>
      <p class="text-slate-400 text-[13px]">Sin proyectos registrados.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import CustomSelect from '@/components/ui/CustomSelect.vue'
import { projectService, type ProjectData } from '@/services/projectService'

const route = useRoute()
const clientId = route.params.id as string

const projects = ref<ProjectData[]>([])
const loading = ref(false)
const creating = ref(false)
const newName = ref('')
const newStatus = ref<string>('active')

const statusOptions = [
  { value: 'active', label: 'Activo' },
  { value: 'paused', label: 'Pausado' },
  { value: 'completed', label: 'Completado' },
  { value: 'cancelled', label: 'Cancelado' },
]

const statusLabel = (s?: string) => ({ active: 'Activo', paused: 'Pausado', completed: 'Completado', cancelled: 'Cancelado' }[s || 'active'] || s)

const statusChip = (s?: string) => ({
  active:    'bg-primary-100 dark:bg-primary-500/20 text-primary-600 dark:text-primary-300',
  paused:    'bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-300',
  completed: 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-300',
  cancelled: 'bg-red-100 dark:bg-red-500/20 text-red-500 dark:text-red-300',
}[s || 'active'] || '')

const statusBorder = (s?: string) => ({
  active:    'border-l-primary-400 dark:border-l-primary-500',
  paused:    'border-l-amber-400 dark:border-l-amber-500',
  completed: 'border-l-emerald-400 dark:border-l-emerald-500',
  cancelled: 'border-l-red-300 dark:border-l-red-500/60',
}[s || 'active'] || 'border-l-slate-200')

const loadProjects = async () => {
  if (!clientId) return
  loading.value = true
  try {
    projects.value = await projectService.getAll(clientId)
  } catch (err) {
    console.error('Error loading projects:', err)
  } finally {
    loading.value = false
  }
}

const handleCreate = async () => {
  const name = newName.value.trim()
  if (!name || !clientId) return
  creating.value = true
  try {
    const project = await projectService.create({ clientId, name, status: newStatus.value as ProjectData['status'] })
    projects.value.unshift(project)
    newName.value = ''
    newStatus.value = 'active'
  } catch (err) {
    console.error('Error creating project:', err)
  } finally {
    creating.value = false
  }
}

onMounted(loadProjects)
</script>
