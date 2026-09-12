<template>
  <div class="space-y-4">
    <!-- Header -->
    <div class="bg-white dark:bg-[#1e293b] rounded-xl shadow-sm px-5 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
      <div class="min-w-0">
        <router-link v-if="project?.clientId" :to="`/clients/${clientIdOf(project)}`" class="text-[12px] font-bold text-primary-500 hover:text-primary-600 flex items-center gap-1 mb-1">
          <i class="fas fa-arrow-left text-[10px]"></i> {{ clientNameOf(project) }}
        </router-link>
        <div class="flex items-center gap-2 flex-wrap">
          <h1 class="text-[18px] font-black text-slate-800 dark:text-slate-100 leading-tight">{{ project?.name || '...' }}</h1>
          <span v-if="project" :class="statusChip(project.status)" class="text-[11px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full">
            {{ statusLabel(project.status) }}
          </span>
        </div>
        <p v-if="project?.description" class="text-[13px] text-slate-400 font-medium mt-1">{{ project.description }}</p>
      </div>
      <div v-if="project" class="flex items-center gap-2 shrink-0">
        <router-link
          :to="`/activities?clientId=${clientIdOf(project)}&projectId=${projectId}`"
          class="h-[34px] px-3 text-[12px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-[#334155] rounded-lg hover:bg-slate-100 dark:hover:bg-[#1e293b] hover:text-primary-600 transition-colors flex items-center gap-1.5"
          title="Ver estas tareas en Actividades (mismos datos, otra vista)"
        >
          <i class="fas fa-list-check text-[11px]"></i> Ver en Actividades
        </router-link>
        <div class="w-40">
          <CustomSelect v-model="project.status" size="sm" :options="statusOptions" @update:modelValue="handleStatusChange" />
        </div>
      </div>
    </div>

    <!-- Spinner -->
    <div v-if="loading" class="flex justify-center items-center py-20">
      <i class="fas fa-spinner fa-spin text-3xl text-primary-400"></i>
    </div>

    <div v-else class="bg-white dark:bg-[#1e293b] rounded-xl shadow-sm p-5 space-y-4">
      <!-- Crear tarea dentro del proyecto -->
      <div class="bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-[#334155] rounded-xl p-3 flex gap-2">
        <input v-model="newTaskTitle" @keyup.enter="handleCreateTask" placeholder="¿Qué necesitas hacer en este proyecto? Enter para crear..."
          class="flex-1 h-9 bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-[#334155] rounded-lg px-3 text-[14px] text-slate-700 dark:text-slate-200 font-medium focus:outline-none focus:ring-2 focus:ring-primary-400 transition-all" />
        <button @click="handleCreateTask" :disabled="!newTaskTitle.trim() || creating"
          class="h-9 px-4 rounded-lg bg-primary-600 text-white text-[14px] font-black hover:bg-primary-700 transition-colors shadow-sm flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed shrink-0">
          <i class="fas fa-bolt text-[11px]"></i> Crear
        </button>
      </div>

      <div class="flex items-center gap-2 border-b border-slate-100 dark:border-[#334155] pb-3">
        <i class="fas fa-list-check text-[12px] text-primary-400"></i>
        <span class="text-[13px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Tareas del proyecto</span>
        <span v-if="tasks.length" class="px-1.5 py-0.5 rounded-md bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-300 text-[11px] font-black">{{ tasks.length }}</span>
      </div>

      <!-- Lista de tareas -->
      <div v-if="loadingTasks" class="flex justify-center py-8">
        <i class="fas fa-spinner fa-spin text-xl text-primary-400"></i>
      </div>
      <div v-else-if="tasks.length" class="space-y-2">
        <div v-for="t in tasks" :key="t._id"
          class="flex items-start gap-3 bg-slate-50 dark:bg-[#0f172a] rounded-xl px-4 py-3 border border-slate-100 dark:border-[#334155] hover:border-primary-200 dark:hover:border-primary-500/30 transition-colors cursor-pointer"
          @click="openTaskDetail(t)">
          <button @click.stop="toggleComplete(t)"
            class="w-5 h-5 mt-0.5 rounded-md border-2 flex items-center justify-center shrink-0 transition-colors"
            :class="t.status === 'completed' ? 'bg-emerald-500 border-emerald-500' : 'border-slate-300 dark:border-slate-600 hover:border-primary-400'">
            <i v-if="t.status === 'completed'" class="fas fa-check text-white text-[10px]"></i>
          </button>
          <div class="flex-1 min-w-0">
            <p class="text-[14px] font-bold text-slate-700 dark:text-slate-200" :class="{ 'line-through text-slate-400 dark:text-slate-500': t.status === 'completed' }">
              {{ t.title }}
            </p>
            <p v-if="t.description" class="text-[12px] text-slate-400 mt-0.5">{{ t.description }}</p>
          </div>
          <i class="fas fa-chevron-right text-[11px] text-slate-300 dark:text-slate-600 mt-1.5"></i>
        </div>
      </div>
      <div v-else class="text-center py-10 border border-dashed border-slate-200 dark:border-[#334155] rounded-xl">
        <i class="fas fa-list-check text-2xl text-slate-200 dark:text-slate-700 mb-2"></i>
        <p class="text-slate-400 text-[13px]">Sin tareas todavía — crea la primera arriba.</p>
      </div>
    </div>

    <!-- Detalle completo de tarea: mismo modal que usa Actividades — mismos datos, otra vista -->
    <ActivityFormModal
      v-if="showTaskModal"
      :activity="editingTask"
      :clients="clients"
      :team-members="teamMembers"
      @close="showTaskModal = false"
      @saved="handleTaskSaved"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import CustomSelect from '@/components/ui/CustomSelect.vue'
import ActivityFormModal from '@/components/forms/ActivityFormModal.vue'
import { projectService, type ProjectData } from '@/services/projectService'
import { activityService, type ActivityData } from '@/services/activityService'
import { clientService, type ClientData } from '@/services/clientService'
import { teamService } from '@/services/teamService'
import type { TeamMember } from '@/types'

const route = useRoute()
const projectId = route.params.id as string

const project = ref<ProjectData | null>(null)
const tasks = ref<ActivityData[]>([])
const loading = ref(true)
const loadingTasks = ref(false)
const creating = ref(false)
const newTaskTitle = ref('')

// Datos para el modal de detalle de tarea (mismo modal de Actividades)
const clients = ref<ClientData[]>([])
const teamMembers = ref<TeamMember[]>([])
const showTaskModal = ref(false)
const editingTask = ref<ActivityData | null>(null)

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

const clientIdOf = (p: any) => typeof p?.clientId === 'object' ? p.clientId?._id : p?.clientId
const clientNameOf = (p: any) => typeof p?.clientId === 'object' ? p.clientId?.name : 'Cliente'

const loadProject = async () => {
  loading.value = true
  try {
    project.value = await projectService.getById(projectId)
  } catch (err) {
    console.error('Error loading project:', err)
  } finally {
    loading.value = false
  }
}

const loadTasks = async () => {
  loadingTasks.value = true
  try {
    tasks.value = await projectService.getActivities(projectId)
  } catch (err) {
    console.error('Error loading project tasks:', err)
  } finally {
    loadingTasks.value = false
  }
}

const handleStatusChange = async (newStatus: string) => {
  try {
    await projectService.update(projectId, { status: newStatus as ProjectData['status'] })
  } catch (err) {
    console.error('Error updating project status:', err)
  }
}

const handleCreateTask = async () => {
  const title = newTaskTitle.value.trim()
  if (!title || !project.value) return
  creating.value = true
  try {
    const task = await activityService.create({
      title,
      description: '',
      status: 'pending',
      date: new Date().toISOString(),
      clientId: clientIdOf(project.value),
      projectId: projectId,
      assignedTo: []
    })
    tasks.value.unshift(task)
    newTaskTitle.value = ''
  } catch (err) {
    console.error('Error creating task:', err)
  } finally {
    creating.value = false
  }
}

const toggleComplete = async (t: ActivityData) => {
  const nextStatus = t.status === 'completed' ? 'pending' : 'completed'
  t.status = nextStatus
  try {
    await activityService.updateStatus(t._id!, nextStatus)
  } catch (err) {
    console.error('Error updating task status:', err)
    t.status = t.status === 'completed' ? 'pending' : 'completed' // revertir en error
  }
}

function openTaskDetail(t: ActivityData) {
  editingTask.value = t
  showTaskModal.value = true
}

function handleTaskSaved(saved: ActivityData) {
  const idx = tasks.value.findIndex(t => t._id === saved._id)
  if (idx !== -1) tasks.value[idx] = saved
  showTaskModal.value = false
}

onMounted(async () => {
  await Promise.all([
    loadProject(),
    loadTasks(),
    clientService.getAll().then(c => clients.value = c).catch(() => {}),
    teamService.getAll().then(m => teamMembers.value = m).catch(() => {})
  ])
})
</script>
