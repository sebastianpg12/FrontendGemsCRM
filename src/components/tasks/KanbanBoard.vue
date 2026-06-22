<template>
  <div class="kanban-board h-full flex flex-col">
    <!-- Board Header -->
    <div class="board-header bg-white border-b border-gray-200 p-4">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <h1 class="text-2xl font-bold text-gray-900">{{ board?.name }}</h1>
          <span 
            class="px-3 py-1 text-sm font-medium rounded-full"
            :class="boardTypeClass"
          >
            {{ boardTypeLabel }}
          </span>
        </div>
        
        <div class="flex items-center space-x-3">
          <!-- Filters -->
          <button
            @click="showFilters = !showFilters"
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <svg class="w-5 h-5 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            Filtros
          </button>

          <!-- Sprint selector (only for Scrum) -->
          <select
            v-if="board?.type === 'scrum' && sprints.length > 0"
            v-model="selectedSprintId"
            @change="loadTasks"
            class="px-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
          >
            <option :value="null">Backlog</option>
            <option 
              v-for="sprint in sprints" 
              :key="sprint._id"
              :value="sprint._id"
            >
              {{ sprint.name }} ({{ sprintStatus(sprint) }})
            </option>
          </select>

          <!-- Add Task -->
          <button
            @click="openTaskModal()"
            class="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700"
          >
            <svg class="w-5 h-5 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Nueva Tarea
          </button>
        </div>
      </div>

      <!-- Filters Panel -->
      <div v-if="showFilters" class="mt-4 p-4 bg-slate-50 dark:bg-[#1e293b] rounded-xl flex flex-wrap gap-3">
        <div class="kb-chip" :class="{ 'kb-chip--on': filters.type }" @click.stop="openKBChip = openKBChip === 'type' ? null : 'type'">
          <i class="fas fa-tag"></i>
          <span class="kb-label">{{ filters.type ? filters.type.charAt(0).toUpperCase() + filters.type.slice(1).replace('-', ' ') : 'Tipo' }}</span>
          <i class="fas fa-chevron-down kb-caret" :class="{ 'rotate-180': openKBChip === 'type' }"></i>
          <div v-if="openKBChip === 'type'" class="kb-dropdown" @click.stop>
            <div class="kb-dropdown-item" :class="{ 'kb-dropdown-item--active': filters.type === '' }" @click="filters.type = ''; openKBChip = null"><span>Todos</span><i v-if="filters.type === ''" class="fas fa-check text-[12px] text-primary-500"></i></div>
            <div class="kb-dropdown-item" :class="{ 'kb-dropdown-item--active': filters.type === 'task' }" @click="filters.type = 'task'; openKBChip = null"><span>Task</span><i v-if="filters.type === 'task'" class="fas fa-check text-[12px] text-primary-500"></i></div>
            <div class="kb-dropdown-item" :class="{ 'kb-dropdown-item--active': filters.type === 'bug' }" @click="filters.type = 'bug'; openKBChip = null"><span>Bug</span><i v-if="filters.type === 'bug'" class="fas fa-check text-[12px] text-primary-500"></i></div>
            <div class="kb-dropdown-item" :class="{ 'kb-dropdown-item--active': filters.type === 'feature' }" @click="filters.type = 'feature'; openKBChip = null"><span>Feature</span><i v-if="filters.type === 'feature'" class="fas fa-check text-[12px] text-primary-500"></i></div>
            <div class="kb-dropdown-item" :class="{ 'kb-dropdown-item--active': filters.type === 'user-story' }" @click="filters.type = 'user-story'; openKBChip = null"><span>User Story</span><i v-if="filters.type === 'user-story'" class="fas fa-check text-[12px] text-primary-500"></i></div>
            <div class="kb-dropdown-item" :class="{ 'kb-dropdown-item--active': filters.type === 'epic' }" @click="filters.type = 'epic'; openKBChip = null"><span>Epic</span><i v-if="filters.type === 'epic'" class="fas fa-check text-[12px] text-primary-500"></i></div>
          </div>
        </div>
        <div class="kb-chip" :class="{ 'kb-chip--on': filters.priority }" @click.stop="openKBChip = openKBChip === 'priority' ? null : 'priority'">
          <i class="fas fa-exclamation-circle"></i>
          <span class="kb-label">{{ filters.priority === 'low' ? 'Baja' : filters.priority === 'medium' ? 'Media' : filters.priority === 'high' ? 'Alta' : filters.priority === 'critical' ? 'Crítica' : 'Prioridad' }}</span>
          <i class="fas fa-chevron-down kb-caret" :class="{ 'rotate-180': openKBChip === 'priority' }"></i>
          <div v-if="openKBChip === 'priority'" class="kb-dropdown" @click.stop>
            <div class="kb-dropdown-item" :class="{ 'kb-dropdown-item--active': filters.priority === '' }" @click="filters.priority = ''; openKBChip = null"><span>Todas</span><i v-if="filters.priority === ''" class="fas fa-check text-[12px] text-primary-500"></i></div>
            <div class="kb-dropdown-item" :class="{ 'kb-dropdown-item--active': filters.priority === 'low' }" @click="filters.priority = 'low'; openKBChip = null"><span>Baja</span><i v-if="filters.priority === 'low'" class="fas fa-check text-[12px] text-primary-500"></i></div>
            <div class="kb-dropdown-item" :class="{ 'kb-dropdown-item--active': filters.priority === 'medium' }" @click="filters.priority = 'medium'; openKBChip = null"><span>Media</span><i v-if="filters.priority === 'medium'" class="fas fa-check text-[12px] text-primary-500"></i></div>
            <div class="kb-dropdown-item" :class="{ 'kb-dropdown-item--active': filters.priority === 'high' }" @click="filters.priority = 'high'; openKBChip = null"><span>Alta</span><i v-if="filters.priority === 'high'" class="fas fa-check text-[12px] text-primary-500"></i></div>
            <div class="kb-dropdown-item" :class="{ 'kb-dropdown-item--active': filters.priority === 'critical' }" @click="filters.priority = 'critical'; openKBChip = null"><span>Crítica</span><i v-if="filters.priority === 'critical'" class="fas fa-check text-[12px] text-primary-500"></i></div>
          </div>
        </div>
        <div class="kb-chip" :class="{ 'kb-chip--on': filters.status }" @click.stop="openKBChip = openKBChip === 'status' ? null : 'status'">
          <i class="fas fa-circle-half-stroke"></i>
          <span class="kb-label">{{ filters.status === 'active' ? 'Activo' : filters.status === 'blocked' ? 'Bloqueado' : filters.status === 'completed' ? 'Completado' : 'Estado' }}</span>
          <i class="fas fa-chevron-down kb-caret" :class="{ 'rotate-180': openKBChip === 'status' }"></i>
          <div v-if="openKBChip === 'status'" class="kb-dropdown" @click.stop>
            <div class="kb-dropdown-item" :class="{ 'kb-dropdown-item--active': filters.status === '' }" @click="filters.status = ''; openKBChip = null"><span>Todos</span><i v-if="filters.status === ''" class="fas fa-check text-[12px] text-primary-500"></i></div>
            <div class="kb-dropdown-item" :class="{ 'kb-dropdown-item--active': filters.status === 'active' }" @click="filters.status = 'active'; openKBChip = null"><span>Activo</span><i v-if="filters.status === 'active'" class="fas fa-check text-[12px] text-primary-500"></i></div>
            <div class="kb-dropdown-item" :class="{ 'kb-dropdown-item--active': filters.status === 'blocked' }" @click="filters.status = 'blocked'; openKBChip = null"><span>Bloqueado</span><i v-if="filters.status === 'blocked'" class="fas fa-check text-[12px] text-primary-500"></i></div>
            <div class="kb-dropdown-item" :class="{ 'kb-dropdown-item--active': filters.status === 'completed' }" @click="filters.status = 'completed'; openKBChip = null"><span>Completado</span><i v-if="filters.status === 'completed'" class="fas fa-check text-[12px] text-primary-500"></i></div>
          </div>
        </div>
        <div class="flex items-center">
          <button @click="clearFilters" class="kb-chip">
            <i class="fas fa-times"></i>
            <span class="kb-label">Limpiar</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex-1 flex items-center justify-center">
      <div class="text-center">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        <p class="mt-4 text-gray-600">Cargando tablero...</p>
      </div>
    </div>

    <!-- Board Columns -->
    <div v-else class="flex-1 overflow-x-auto">
      <div class="flex space-x-4 p-6 h-full">
        <BoardColumn
          v-for="column in columns"
          :key="column.id"
          :column="column"
          :tasks="getTasksForColumn(column.id)"
          :can-add-task="true"
          @add-task="openTaskModal(column.id)"
          @task-click="openTaskDetail"
          @task-moved="handleTaskMoved"
        />
      </div>
    </div>
  </div>

  <!-- Task Detail Modal -->
  <TaskDetailModal
    :is-open="isTaskDetailOpen"
    :task="selectedTask"
    @close="closeTaskDetail"
  />
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useBoardsStore } from '@/stores/boards'
import { useTasksStore } from '@/stores/tasks'
import BoardColumn from './BoardColumn.vue'
import TaskDetailModal from './TaskDetailModal.vue'
import type { Task } from '@/stores/tasks'

const route = useRoute()
const boardsStore = useBoardsStore()
const tasksStore = useTasksStore()

const showFilters = ref(false)
const openKBChip = ref<string | null>(null)
const closeKBChip = () => { openKBChip.value = null }
const selectedSprintId = ref<string | null>(null)
const filters = ref({
  type: '',
  priority: '',
  status: ''
})

const board = computed(() => boardsStore.currentBoard)
const sprints = computed(() => boardsStore.currentBoardSprints)
const loading = computed(() => boardsStore.loading || (tasksStore.loading && !isTaskDetailOpen.value))

const columns = computed(() => {
  if (!board.value) return []
  return board.value.columns.sort((a, b) => a.order - b.order)
})

const boardTypeClass = computed(() => {
  const classes: Record<string, string> = {
    'kanban': 'bg-primary-100 text-primary-800',
    'scrum': 'bg-purple-100 text-purple-800',
    'custom': 'bg-gray-100 text-gray-800'
  }
  return classes[board.value?.type || 'kanban']
})

const boardTypeLabel = computed(() => {
  const labels: Record<string, string> = {
    'kanban': 'Kanban',
    'scrum': 'Scrum',
    'custom': 'Personalizado'
  }
  return labels[board.value?.type || 'kanban']
})

function sprintStatus(sprint: any): string {
  const statuses: Record<string, string> = {
    'planned': 'Planeado',
    'active': 'Activo',
    'completed': 'Completado'
  }
  return statuses[sprint.status] || sprint.status
}

function getTasksForColumn(columnId: string): Task[] {
  return tasksStore.tasks.filter(task => task.boardStatus === columnId)
}

async function loadTasks() {
  const boardId = route.params.id as string
  const filterParams = {
    ...filters.value,
    sprint: selectedSprintId.value || undefined
  }
  
  // Remove empty filters
  Object.keys(filterParams).forEach(key => {
    if (!filterParams[key as keyof typeof filterParams]) {
      delete filterParams[key as keyof typeof filterParams]
    }
  })
  
  await tasksStore.fetchTasks(boardId, filterParams)
}

function clearFilters() {
  filters.value = {
    type: '',
    priority: '',
    status: ''
  }
  loadTasks()
}

async function handleTaskMoved(task: Task, targetColumnId: string, newIndex: number) {
  try {
    await tasksStore.moveTask(task._id, targetColumnId, newIndex)
  } catch (error) {
    console.error('Error moving task:', error)
  }
}

const isTaskDetailOpen = ref(false)
const selectedTask = ref<Task | null>(null)

function openTaskModal(columnId?: string) {
  // TODO: Implementar modal de creación de tarea
}

async function openTaskDetail(task: Task) {
  selectedTask.value = task
  isTaskDetailOpen.value = true
  try {
    const full = await tasksStore.fetchTaskById(task._id)
    selectedTask.value = full
  } catch (e) {
    console.error('Error fetching task detail:', e)
  }
}

function closeTaskDetail() {
  isTaskDetailOpen.value = false
  selectedTask.value = null
}

onMounted(async () => {
  document.addEventListener('click', closeKBChip)
  const boardId = route.params.id as string
  await boardsStore.fetchBoardById(boardId)
  await loadTasks()
})
onUnmounted(() => document.removeEventListener('click', closeKBChip))

// Watch filters
watch(filters, () => {
  loadTasks()
}, { deep: true })
</script>

<style scoped>
.kanban-board {
  max-height: calc(100vh - 64px);
}
</style>

<style>
.kb-chip {
  position: relative; display: inline-flex; align-items: center; gap: 6px;
  height: 36px; padding: 0 10px; border-radius: 8px;
  background: #f8fafc; border: 1px solid #e2e8f0;
  font-size: 11px; font-weight: 700; color: #475569;
  cursor: pointer; user-select: none; white-space: nowrap; transition: all 0.15s;
}
.kb-chip:hover { background: #f1f5f9; }
.kb-chip--on { background: #ede9fe; border-color: #c4b5fd; color: #6d28d9; }
.kb-chip i:first-child { font-size: 9px; }
.kb-caret { font-size: 8px; transition: transform 0.2s; }
.kb-label { font-size: 11px; font-weight: 700; }
.kb-dropdown {
  position: absolute; top: calc(100% + 6px); left: 0; z-index: 50;
  min-width: 160px; background: #fff; border: 1px solid #e2e8f0;
  border-radius: 10px; box-shadow: 0 4px 16px rgba(0,0,0,0.10);
  padding: 4px; max-height: 240px; overflow-y: auto;
}
.kb-dropdown-item {
  display: flex; align-items: center; justify-content: space-between; gap: 8px;
  padding: 7px 10px; border-radius: 7px;
  font-size: 11px; font-weight: 600; color: #475569; cursor: pointer; transition: background 0.12s;
}
.kb-dropdown-item:hover { background: #f1f5f9; }
.kb-dropdown-item--active { color: #4f46e5; font-weight: 700; }
.dark .kb-chip { background: #1e293b; border-color: #334155; color: #94a3b8; }
.dark .kb-chip:hover { background: #273449; }
.dark .kb-chip--on { background: #3b1f6e33; border-color: #7c3aed55; color: #a78bfa; }
.dark .kb-dropdown { background: #1e293b; border-color: #334155; box-shadow: 0 4px 20px rgba(0,0,0,0.4); }
.dark .kb-dropdown-item { color: #94a3b8; }
.dark .kb-dropdown-item:hover { background: #273449; color: #e2e8f0; }
.dark .kb-dropdown-item--active { color: #818cf8; }
</style>
