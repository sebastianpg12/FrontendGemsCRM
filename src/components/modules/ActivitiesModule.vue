<template>
  <div class="space-y-6">
    <!-- Header with stats -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div class="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-primary-500/20">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-400 text-sm">Total Actividades</p>
            <p class="text-2xl font-bold text-white">{{ activities.length }}</p>
          </div>
          <i class="fas fa-tasks text-primary-400 text-2xl"></i>
        </div>
      </div>
      
      <div class="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-green-500/20">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-400 text-sm">Completadas</p>
            <p class="text-2xl font-bold text-white">{{ completedActivities }}</p>
          </div>
          <i class="fas fa-check-circle text-green-400 text-2xl"></i>
        </div>
      </div>
      
      <div class="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-yellow-500/20">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-400 text-sm">Pendientes</p>
            <p class="text-2xl font-bold text-white">{{ pendingActivities }}</p>
          </div>
          <i class="fas fa-clock text-yellow-400 text-2xl"></i>
        </div>
      </div>
      
      <div class="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-red-500/20">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-400 text-sm">Vencidas</p>
            <p class="text-2xl font-bold text-white">{{ overdueActivities }}</p>
          </div>
          <i class="fas fa-exclamation-triangle text-red-400 text-2xl"></i>
        </div>
      </div>
    </div>

    <!-- Filters and Search -->
    <div class="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
      <div class="flex items-center space-x-3">
        <div class="am-chip" :class="{ 'am-chip--on': statusFilter }" @click.stop="openAMChip = openAMChip === 'status' ? null : 'status'">
          <i class="fas fa-circle-half-stroke"></i>
          <span class="am-label">{{ statusFilter === 'completed' ? 'Completadas' : statusFilter === 'pending' ? 'Pendientes' : statusFilter === 'in-progress' ? 'En Progreso' : 'Todos los estados' }}</span>
          <i class="fas fa-chevron-down am-caret" :class="{ 'rotate-180': openAMChip === 'status' }"></i>
          <div v-if="openAMChip === 'status'" class="am-dropdown" @click.stop>
            <div class="am-dropdown-item" :class="{ 'am-dropdown-item--active': statusFilter === '' }" @click="statusFilter = ''; openAMChip = null"><span>Todos los estados</span><i v-if="statusFilter === ''" class="fas fa-check text-[12px] text-primary-500"></i></div>
            <div class="am-dropdown-item" :class="{ 'am-dropdown-item--active': statusFilter === 'completed' }" @click="statusFilter = 'completed'; openAMChip = null"><span>Completadas</span><i v-if="statusFilter === 'completed'" class="fas fa-check text-[12px] text-primary-500"></i></div>
            <div class="am-dropdown-item" :class="{ 'am-dropdown-item--active': statusFilter === 'pending' }" @click="statusFilter = 'pending'; openAMChip = null"><span>Pendientes</span><i v-if="statusFilter === 'pending'" class="fas fa-check text-[12px] text-primary-500"></i></div>
            <div class="am-dropdown-item" :class="{ 'am-dropdown-item--active': statusFilter === 'in-progress' }" @click="statusFilter = 'in-progress'; openAMChip = null"><span>En Progreso</span><i v-if="statusFilter === 'in-progress'" class="fas fa-check text-[12px] text-primary-500"></i></div>
          </div>
        </div>

        <div class="am-chip" :class="{ 'am-chip--on': typeFilter }" @click.stop="openAMChip = openAMChip === 'type' ? null : 'type'">
          <i class="fas fa-tag"></i>
          <span class="am-label">{{ typeFilter === 'call' ? 'Llamada' : typeFilter === 'meeting' ? 'Reunión' : typeFilter === 'email' ? 'Email' : typeFilter === 'task' ? 'Tarea' : 'Todos los tipos' }}</span>
          <i class="fas fa-chevron-down am-caret" :class="{ 'rotate-180': openAMChip === 'type' }"></i>
          <div v-if="openAMChip === 'type'" class="am-dropdown" @click.stop>
            <div class="am-dropdown-item" :class="{ 'am-dropdown-item--active': typeFilter === '' }" @click="typeFilter = ''; openAMChip = null"><span>Todos los tipos</span><i v-if="typeFilter === ''" class="fas fa-check text-[12px] text-primary-500"></i></div>
            <div class="am-dropdown-item" :class="{ 'am-dropdown-item--active': typeFilter === 'call' }" @click="typeFilter = 'call'; openAMChip = null"><span>Llamada</span><i v-if="typeFilter === 'call'" class="fas fa-check text-[12px] text-primary-500"></i></div>
            <div class="am-dropdown-item" :class="{ 'am-dropdown-item--active': typeFilter === 'meeting' }" @click="typeFilter = 'meeting'; openAMChip = null"><span>Reunión</span><i v-if="typeFilter === 'meeting'" class="fas fa-check text-[12px] text-primary-500"></i></div>
            <div class="am-dropdown-item" :class="{ 'am-dropdown-item--active': typeFilter === 'email' }" @click="typeFilter = 'email'; openAMChip = null"><span>Email</span><i v-if="typeFilter === 'email'" class="fas fa-check text-[12px] text-primary-500"></i></div>
            <div class="am-dropdown-item" :class="{ 'am-dropdown-item--active': typeFilter === 'task' }" @click="typeFilter = 'task'; openAMChip = null"><span>Tarea</span><i v-if="typeFilter === 'task'" class="fas fa-check text-[12px] text-primary-500"></i></div>
          </div>
        </div>
      </div>

      <button
        @click="$emit('create')"
        class="px-4 py-2 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-lg hover:from-primary-700 hover:to-primary-700 transition-all duration-200 transform hover:scale-105 shadow-lg shadow-primary-500/25"
      >
        <i class="fas fa-plus mr-2"></i>
        Nueva Actividad
      </button>
    </div>

    <!-- Activities Timeline -->
    <div class="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-primary-500/20 overflow-hidden">
      <div class="p-6">
        <h3 class="text-xl font-bold text-white mb-6">Línea de Tiempo de Actividades</h3>
        
        <!-- Loading state -->
        <div v-if="loading" class="flex items-center justify-center py-12">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
        </div>

        <!-- Activities list -->
        <div v-else-if="filteredActivities.length > 0" class="space-y-4">
          <div
            v-for="activity in filteredActivities"
            :key="activity.id"
            class="flex items-start space-x-4 p-4 bg-gray-900/30 rounded-lg hover:bg-gray-900/50 transition-colors group"
          >
            <!-- Activity icon -->
            <div class="flex-shrink-0 mt-1">
              <div
                class="w-10 h-10 rounded-full flex items-center justify-center"
                :class="{
                  'bg-green-500/20 text-green-400': activity.status === 'completed',
                  'bg-yellow-500/20 text-yellow-400': activity.status === 'pending',
                  'bg-primary-500/20 text-primary-400': activity.status === 'in-progress',
                  'bg-red-500/20 text-red-400': activity.status === 'overdue'
                }"
              >
                <i :class="getActivityIcon(activity.type)" class="text-sm"></i>
              </div>
            </div>

            <!-- Activity content -->
            <div class="flex-1 min-w-0">
              <div class="flex items-start justify-between">
                <div class="flex-1">
                  <h4 class="text-white font-medium text-lg">{{ activity.title }}</h4>
                  <p class="text-gray-400 text-sm mt-1">{{ activity.description }}</p>
                  
                  <!-- Activity meta -->
                  <div class="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                    <span class="flex items-center">
                      <i class="fas fa-user mr-1"></i>
                      {{ activity.assignedTo || 'Sin asignar' }}
                    </span>
                    <span class="flex items-center">
                      <i class="fas fa-calendar mr-1"></i>
                      {{ formatDate(activity.dueDate) }}
                    </span>
                    <span class="flex items-center">
                      <i class="fas fa-clock mr-1"></i>
                      {{ activity.estimatedTime || 'N/A' }}
                    </span>
                  </div>
                </div>

                <!-- Activity status -->
                <div class="flex items-center space-x-2">
                  <span
                    class="px-2 py-1 rounded-full text-xs font-medium"
                    :class="{
                      'bg-green-100 text-green-800': activity.status === 'completed',
                      'bg-yellow-100 text-yellow-800': activity.status === 'pending',
                      'bg-primary-100 text-primary-800': activity.status === 'in-progress',
                      'bg-red-100 text-red-800': activity.status === 'overdue'
                    }"
                  >
                    {{ getStatusLabel(activity.status) }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Activity actions -->
            <div class="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
              <div class="flex items-center space-x-2">
                <button
                  @click="editActivity(activity)"
                  class="p-2 text-gray-400 hover:text-primary-400 transition-colors"
                  title="Editar"
                >
                  <i class="fas fa-edit"></i>
                </button>
                <button
                  @click="toggleActivityStatus(activity)"
                  class="p-2 text-gray-400 hover:text-green-400 transition-colors"
                  title="Cambiar estado"
                >
                  <i class="fas fa-check"></i>
                </button>
                <button
                  @click="deleteActivity(activity)"
                  class="p-2 text-gray-400 hover:text-red-400 transition-colors"
                  title="Eliminar"
                >
                  <i class="fas fa-trash"></i>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty state -->
        <div v-else class="text-center py-12">
          <i class="fas fa-tasks text-6xl text-gray-600 mb-4"></i>
          <h3 class="text-xl font-bold text-white mb-2">No hay actividades</h3>
          <p class="text-gray-400 mb-6">Comienza creando tu primera actividad</p>
          <button
            @click="$emit('create')"
            class="px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-lg hover:from-primary-700 hover:to-primary-700 transition-all duration-200 transform hover:scale-105"
          >
            <i class="fas fa-plus mr-2"></i>
            Crear Actividad
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useNotifications } from '@/composables/useNotifications'

const { confirmDelete } = useNotifications()

// Props
defineProps<{
  searchTerm: string
}>()

// Emits
defineEmits(['create', 'edit'])

// Reactive data
const loading = ref(false)
const statusFilter = ref('')
const typeFilter = ref('')
const openAMChip = ref<string | null>(null)

const closeAMChip = () => { openAMChip.value = null }
onUnmounted(() => document.removeEventListener('click', closeAMChip))

// Mock data - En producción esto vendría de un store/API
const activities = ref([
  {
    id: 1,
    title: 'Llamar a cliente ABC Corp',
    description: 'Seguimiento de propuesta enviada la semana pasada',
    type: 'call',
    status: 'pending',
    assignedTo: 'Juan Pérez',
    dueDate: '2025-09-05T14:30:00',
    estimatedTime: '30 min',
    clientId: 1
  },
  {
    id: 2,
    title: 'Reunión con equipo de desarrollo',
    description: 'Revisión del progreso del proyecto XYZ',
    type: 'meeting',
    status: 'completed',
    assignedTo: 'María García',
    dueDate: '2025-09-04T10:00:00',
    estimatedTime: '1 hora',
    clientId: 2
  },
  {
    id: 3,
    title: 'Enviar propuesta técnica',
    description: 'Preparar y enviar documentación técnica para nuevo proyecto',
    type: 'task',
    status: 'in-progress',
    assignedTo: 'Carlos López',
    dueDate: '2025-09-06T16:00:00',
    estimatedTime: '2 horas',
    clientId: 3
  }
])

// Computed properties
const filteredActivities = computed(() => {
  let filtered = activities.value

  if (statusFilter.value) {
    filtered = filtered.filter(activity => activity.status === statusFilter.value)
  }

  if (typeFilter.value) {
    filtered = filtered.filter(activity => activity.type === typeFilter.value)
  }

  return filtered
})

const completedActivities = computed(() => {
  return activities.value.filter(a => a.status === 'completed').length
})

const pendingActivities = computed(() => {
  return activities.value.filter(a => a.status === 'pending').length
})

const overdueActivities = computed(() => {
  return activities.value.filter(a => {
    return a.status !== 'completed' && new Date(a.dueDate) < new Date()
  }).length
})

// Methods
const getActivityIcon = (type: string) => {
  const icons = {
    call: 'fas fa-phone',
    meeting: 'fas fa-users',
    email: 'fas fa-envelope',
    task: 'fas fa-tasks'
  }
  return icons[type as keyof typeof icons] || 'fas fa-circle'
}

const getStatusLabel = (status: string) => {
  const labels = {
    completed: 'Completada',
    pending: 'Pendiente',
    'in-progress': 'En Progreso',
    overdue: 'Vencida'
  }
  return labels[status as keyof typeof labels] || status
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const editActivity = (activity: any) => {
  // Emit edit event
}

const toggleActivityStatus = (activity: any) => {
  if (activity.status === 'completed') {
    activity.status = 'pending'
  } else {
    activity.status = 'completed'
  }
}

const deleteActivity = async (activity: any) => {
  const result = await confirmDelete(`¿Eliminar la actividad "${activity.title}"?`)
  if (!result.isConfirmed) return
  const index = activities.value.findIndex(a => a.id === activity.id)
  if (index !== -1) {
    activities.value.splice(index, 1)
  }
}

onMounted(() => {
  document.addEventListener('click', closeAMChip)
})
</script>

<style>
.am-chip {
  position: relative; display: inline-flex; align-items: center; gap: 6px;
  height: 36px; padding: 0 10px; border-radius: 8px;
  background: #1e293b; border: 1px solid #334155;
  font-size: 11px; font-weight: 700; color: #94a3b8;
  cursor: pointer; user-select: none; white-space: nowrap; transition: all 0.15s;
}
.am-chip:hover { background: #273449; }
.am-chip--on { background: #3b1f6e33; border-color: #7c3aed55; color: #a78bfa; }
.am-chip i:first-child { font-size: 9px; }
.am-caret { font-size: 8px; transition: transform 0.2s; }
.am-label { font-size: 11px; font-weight: 700; }
.am-dropdown {
  position: absolute; top: calc(100% + 6px); left: 0; z-index: 50;
  min-width: 160px; background: #1e293b; border: 1px solid #334155;
  border-radius: 10px; box-shadow: 0 4px 20px rgba(0,0,0,0.4);
  padding: 4px; max-height: 240px; overflow-y: auto;
}
.am-dropdown-item {
  display: flex; align-items: center; justify-content: space-between; gap: 8px;
  padding: 7px 10px; border-radius: 7px;
  font-size: 11px; font-weight: 600; color: #94a3b8; cursor: pointer; transition: background 0.12s;
}
.am-dropdown-item:hover { background: #273449; color: #e2e8f0; }
.am-dropdown-item--active { color: #818cf8; font-weight: 700; }
</style>
