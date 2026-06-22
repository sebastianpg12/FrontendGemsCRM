<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="bg-white/70 backdrop-blur-md rounded-3xl shadow-sm p-6">
      <div class="flex flex-col lg:flex-row gap-6 lg:items-center lg:justify-between">
        <!-- Selector de Board -->
        <div class="flex items-center gap-4">
          <div class="relative group">
            <select
              v-model="selectedBoardId"
              @change="onBoardChange"
              class="pl-10 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 font-black text-xs uppercase tracking-widest focus:ring-4 focus:ring-primary-500/10 focus:border-primary-400 transition-all appearance-none cursor-pointer min-w-[220px]"
            >
              <option value="">Seleccionar Tablero</option>
              <option 
                v-for="board in boards" 
                :key="board._id"
                :value="board._id"
              >
                {{ board.name }}
              </option>
            </select>
            <div class="absolute left-4 top-1/2 -translate-y-1/2 text-primary-500">
              <i class="fas fa-th-large"></i>
            </div>
            <div class="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none">
              <i class="fas fa-chevron-down text-[12px]"></i>
            </div>
          </div>

          <!-- Toggle Vista -->
          <div class="flex bg-slate-100 rounded-2xl p-1.5 border border-slate-200">
            <button
              @click="currentView = 'kanban'"
              :class="currentView === 'kanban' 
                ? 'bg-white text-primary-600 shadow-sm' 
                : 'text-slate-400 hover:text-slate-600'"
              class="px-4 py-2 rounded-xl text-[12px] font-black uppercase tracking-widest transition-all flex items-center gap-2"
            >
              <i class="fas fa-columns"></i>
              Kanban
            </button>
            <button
              @click="currentView = 'list'"
              :class="currentView === 'list' 
                ? 'bg-white text-primary-600 shadow-sm' 
                : 'text-slate-400 hover:text-slate-600'"
              class="px-4 py-2 rounded-xl text-[12px] font-black uppercase tracking-widest transition-all flex items-center gap-2"
            >
              <i class="fas fa-list"></i>
              Lista
            </button>
          </div>
        </div>

        <div class="flex items-center gap-4">
          <!-- Filtros -->
          <button
            @click="showFilters = !showFilters"
            class="px-5 py-3 bg-white border border-slate-200 rounded-2xl text-slate-600 hover:bg-slate-50 transition-all font-black text-[12px] uppercase tracking-widest flex items-center gap-3 shadow-sm"
            :class="{'border-primary-400 ring-4 ring-primary-500/10': showFilters}"
          >
            <i class="fas fa-filter text-primary-500"></i>
            Filtros
            <span v-if="activeFiltersCount > 0" class="w-5 h-5 bg-primary-500 text-white rounded-full flex items-center justify-center text-[10px]">{{ activeFiltersCount }}</span>
          </button>

          <!-- Sprint Selector (only Scrum) -->
          <div v-if="currentBoard?.type === 'scrum'" class="relative">
            <select
              v-model="selectedSprintId"
              @change="loadTasks"
              class="pl-10 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 font-black text-xs uppercase tracking-widest focus:ring-4 focus:ring-primary-500/10 focus:border-primary-400 transition-all appearance-none cursor-pointer"
            >
              <option :value="null">Backlog Activo</option>
              <option 
                v-for="sprint in sprints" 
                :key="sprint._id"
                :value="sprint._id"
              >
                {{ sprint.name }}
              </option>
            </select>
            <div class="absolute left-4 top-1/2 -translate-y-1/2 text-primary-500">
              <i class="fas fa-running"></i>
            </div>
          </div>

          <!-- Nueva Tarea -->
          <button
            @click="openTaskModal()"
            class="px-6 py-3.5 bg-primary-500 text-white rounded-[1.25rem] hover:bg-primary-600 transition-all shadow-xl shadow-primary-100 font-black text-[12px] uppercase tracking-widest flex items-center gap-3 active:scale-95"
          >
            <i class="fas fa-plus"></i>
            Nueva Tarea
          </button>

          <!-- GitHub -->
          <button
            v-if="currentBoard?.github"
            @click="showGitHubPanel = !showGitHubPanel"
            class="w-12 h-12 flex items-center justify-center bg-slate-800 text-white rounded-2xl hover:bg-black transition-all shadow-lg"
            title="Integración GitHub"
          >
            <i class="fab fa-github text-lg"></i>
          </button>
        </div>
      </div>

      <!-- Filtros Panel -->
      <div v-if="showFilters" class="mt-8 pt-8 border-t border-slate-100 flex flex-wrap gap-3 animate-in slide-in-from-top-4 duration-300">
        <div class="tb-chip" :class="{ 'tb-chip--on': filters.type }" @click.stop="openTBChip = openTBChip === 'type' ? null : 'type'">
          <i class="fas fa-tag"></i>
          <span class="tb-label">{{ filters.type ? filters.type.charAt(0).toUpperCase() + filters.type.slice(1).replace('-', ' ') : 'Tipo de Tarea' }}</span>
          <i class="fas fa-chevron-down tb-caret" :class="{ 'rotate-180': openTBChip === 'type' }"></i>
          <div v-if="openTBChip === 'type'" class="tb-dropdown" @click.stop>
            <div class="tb-dropdown-item" :class="{ 'tb-dropdown-item--active': filters.type === '' }" @click="filters.type = ''; loadTasks(); openTBChip = null"><span>Todos los tipos</span><i v-if="filters.type === ''" class="fas fa-check text-[12px] text-primary-500"></i></div>
            <div class="tb-dropdown-item" :class="{ 'tb-dropdown-item--active': filters.type === 'task' }" @click="filters.type = 'task'; loadTasks(); openTBChip = null"><span>Task</span><i v-if="filters.type === 'task'" class="fas fa-check text-[12px] text-primary-500"></i></div>
            <div class="tb-dropdown-item" :class="{ 'tb-dropdown-item--active': filters.type === 'bug' }" @click="filters.type = 'bug'; loadTasks(); openTBChip = null"><span>Bug</span><i v-if="filters.type === 'bug'" class="fas fa-check text-[12px] text-primary-500"></i></div>
            <div class="tb-dropdown-item" :class="{ 'tb-dropdown-item--active': filters.type === 'feature' }" @click="filters.type = 'feature'; loadTasks(); openTBChip = null"><span>Feature</span><i v-if="filters.type === 'feature'" class="fas fa-check text-[12px] text-primary-500"></i></div>
            <div class="tb-dropdown-item" :class="{ 'tb-dropdown-item--active': filters.type === 'user-story' }" @click="filters.type = 'user-story'; loadTasks(); openTBChip = null"><span>User Story</span><i v-if="filters.type === 'user-story'" class="fas fa-check text-[12px] text-primary-500"></i></div>
            <div class="tb-dropdown-item" :class="{ 'tb-dropdown-item--active': filters.type === 'epic' }" @click="filters.type = 'epic'; loadTasks(); openTBChip = null"><span>Epic</span><i v-if="filters.type === 'epic'" class="fas fa-check text-[12px] text-primary-500"></i></div>
          </div>
        </div>
        <div class="tb-chip" :class="{ 'tb-chip--on': filters.priority }" @click.stop="openTBChip = openTBChip === 'priority' ? null : 'priority'">
          <i class="fas fa-exclamation-circle"></i>
          <span class="tb-label">{{ filters.priority === 'low' ? 'Baja' : filters.priority === 'medium' ? 'Media' : filters.priority === 'high' ? 'Alta' : filters.priority === 'critical' ? 'Crítica' : 'Prioridad' }}</span>
          <i class="fas fa-chevron-down tb-caret" :class="{ 'rotate-180': openTBChip === 'priority' }"></i>
          <div v-if="openTBChip === 'priority'" class="tb-dropdown" @click.stop>
            <div class="tb-dropdown-item" :class="{ 'tb-dropdown-item--active': filters.priority === '' }" @click="filters.priority = ''; loadTasks(); openTBChip = null"><span>Cualquier prioridad</span><i v-if="filters.priority === ''" class="fas fa-check text-[12px] text-primary-500"></i></div>
            <div class="tb-dropdown-item" :class="{ 'tb-dropdown-item--active': filters.priority === 'low' }" @click="filters.priority = 'low'; loadTasks(); openTBChip = null"><span>Baja</span><i v-if="filters.priority === 'low'" class="fas fa-check text-[12px] text-primary-500"></i></div>
            <div class="tb-dropdown-item" :class="{ 'tb-dropdown-item--active': filters.priority === 'medium' }" @click="filters.priority = 'medium'; loadTasks(); openTBChip = null"><span>Media</span><i v-if="filters.priority === 'medium'" class="fas fa-check text-[12px] text-primary-500"></i></div>
            <div class="tb-dropdown-item" :class="{ 'tb-dropdown-item--active': filters.priority === 'high' }" @click="filters.priority = 'high'; loadTasks(); openTBChip = null"><span>Alta</span><i v-if="filters.priority === 'high'" class="fas fa-check text-[12px] text-primary-500"></i></div>
            <div class="tb-dropdown-item" :class="{ 'tb-dropdown-item--active': filters.priority === 'critical' }" @click="filters.priority = 'critical'; loadTasks(); openTBChip = null"><span>Crítica</span><i v-if="filters.priority === 'critical'" class="fas fa-check text-[12px] text-primary-500"></i></div>
          </div>
        </div>
        <div class="tb-chip" :class="{ 'tb-chip--on': filters.department }" @click.stop="openTBChip = openTBChip === 'dept' ? null : 'dept'">
          <i class="fas fa-users"></i>
          <span class="tb-label">{{ filters.department || 'Equipo / Depto' }}</span>
          <i class="fas fa-chevron-down tb-caret" :class="{ 'rotate-180': openTBChip === 'dept' }"></i>
          <div v-if="openTBChip === 'dept'" class="tb-dropdown" @click.stop>
            <div class="tb-dropdown-item" :class="{ 'tb-dropdown-item--active': filters.department === '' }" @click="filters.department = ''; loadTasks(); openTBChip = null"><span>Todos los equipos</span><i v-if="filters.department === ''" class="fas fa-check text-[12px] text-primary-500"></i></div>
            <div v-for="dept in departments" :key="dept" class="tb-dropdown-item" :class="{ 'tb-dropdown-item--active': filters.department === dept }" @click="filters.department = dept; loadTasks(); openTBChip = null"><span>{{ dept }}</span><i v-if="filters.department === dept" class="fas fa-check text-[12px] text-primary-500"></i></div>
          </div>
        </div>
        <div class="tb-chip" :class="{ 'tb-chip--on': filters.assignedTo }" @click.stop="openTBChip = openTBChip === 'assignee' ? null : 'assignee'">
          <i class="fas fa-user"></i>
          <span class="tb-label">{{ filters.assignedTo === authStore.user?._id ? 'Mis Tareas (Yo)' : filters.assignedTo ? (teamMembers.find(m => m._id === filters.assignedTo)?.name ?? 'Responsable') : 'Responsable' }}</span>
          <i class="fas fa-chevron-down tb-caret" :class="{ 'rotate-180': openTBChip === 'assignee' }"></i>
          <div v-if="openTBChip === 'assignee'" class="tb-dropdown" @click.stop>
            <div class="tb-dropdown-item" :class="{ 'tb-dropdown-item--active': filters.assignedTo === '' }" @click="filters.assignedTo = ''; loadTasks(); openTBChip = null"><span>Cualquier persona</span><i v-if="filters.assignedTo === ''" class="fas fa-check text-[12px] text-primary-500"></i></div>
            <div class="tb-dropdown-item" :class="{ 'tb-dropdown-item--active': filters.assignedTo === authStore.user?._id }" @click="filters.assignedTo = authStore.user?._id ?? ''; loadTasks(); openTBChip = null"><span>Mis Tareas (Yo)</span><i v-if="filters.assignedTo === authStore.user?._id" class="fas fa-check text-[12px] text-primary-500"></i></div>
            <div v-for="member in teamMembers" :key="member._id" class="tb-dropdown-item" :class="{ 'tb-dropdown-item--active': filters.assignedTo === member._id }" @click="filters.assignedTo = member._id; loadTasks(); openTBChip = null"><span>{{ member.name }}</span><i v-if="filters.assignedTo === member._id" class="fas fa-check text-[12px] text-primary-500"></i></div>
          </div>
        </div>
        <div class="flex items-end gap-2">
          <button
            @click="clearFilters"
            class="flex-1 px-4 py-3 bg-slate-100 text-slate-500 rounded-xl text-[12px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all"
          >
            Reset
          </button>
          <button
            @click="saveCurrentFilters"
            class="px-4 py-3 bg-primary-50 text-primary-600 rounded-xl text-[12px] font-black uppercase tracking-widest hover:bg-primary-100 transition-all"
            title="Guardar filtros por defecto"
          >
            <i class="fas fa-save"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex flex-col items-center justify-center py-24 gap-4">
      <div class="w-16 h-16 border-4 border-primary-100 border-t-primary-500 rounded-full animate-spin"></div>
      <p class="text-[12px] font-black text-primary-500 uppercase tracking-[0.2em]">Sincronizando GEMS Hub...</p>
    </div>

    <!-- Kanban View -->
    <div v-else-if="currentView === 'kanban' && selectedBoardId" class="overflow-x-auto custom-scrollbar pb-6">
      <div class="flex space-x-6 min-w-max px-1">
        <div
          v-for="column in columns"
          :key="column.id"
          class="bg-slate-50/50 backdrop-blur-sm rounded-[2rem] p-1.5 w-[420px] flex-shrink-0 flex flex-col max-h-[calc(100vh-280px)]"
        >
          <!-- Column Header -->
          <div class="flex items-center justify-between mb-6 px-1">
            <div class="flex items-center gap-3">
              <div class="w-2.5 h-2.5 rounded-full" :class="getColumnColor(column.id)"></div>
              <h3 class="text-slate-800 font-black text-xs uppercase tracking-widest">{{ column.name }}</h3>
              <span class="bg-white border border-slate-200 text-slate-500 px-2.5 py-1 rounded-lg text-[12px] font-black">
                {{ getColumnTasks(column.id).length }}
              </span>
            </div>
            <button
              @click="openTaskModal(column.id)"
              class="w-7 h-7 flex items-center justify-center text-slate-400 hover:text-primary-500 hover:bg-white rounded-lg transition-all border border-transparent hover:border-slate-100"
            >
              <i class="fas fa-plus text-xs"></i>
            </button>
          </div>

          <!-- Tasks List -->
          <div 
            class="space-y-3 flex-1 overflow-y-auto custom-scrollbar px-2 pb-6 min-h-[150px]"
            @drop="onDrop($event, column.id)"
            @dragover.prevent
            @dragenter.prevent
          >
            <div
              v-for="task in getColumnTasks(column.id)"
              :key="task._id"
              draggable="true"
              @dragstart="onDragStart($event, task)"
              @dragend="onDragEnd"
              class="bg-white rounded-[1.5rem] p-3 hover:shadow-xl hover:shadow-primary-500/5 transition-all cursor-move group relative animate-in fade-in duration-500"
            >
              <!-- Clickable Content Wrapper -->
              <div @click.stop="openTaskDetail(task)" class="cursor-pointer">
                <!-- Task Header -->
                <div class="flex items-start justify-between gap-3 mb-3">
                  <div class="flex items-start gap-2 flex-1">
                    <div class="mt-1 w-2 h-2 rounded-full flex-shrink-0" :style="{ backgroundColor: getTaskTypeColor(task.type) }"></div>
                    <h4 class="text-slate-700 text-sm font-bold flex-1 leading-snug group-hover:text-primary-600 transition-colors">{{ task.title }}</h4>
                  </div>
                  <span 
                    class="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider flex-shrink-0 border"
                    :class="getPriorityClass(task.priority)"
                  >
                    {{ getPriorityLabel(task.priority) }}
                  </span>
                </div>

                <!-- Metadata & Assignee -->
                <div class="flex items-center justify-between mt-4 pt-4 border-t border-slate-50">
                  <div class="flex -space-x-2">
                    <div v-if="task.assignedTo" class="group/avatar relative">
                      <div class="w-8 h-8 rounded-full border-2 border-white bg-primary-100 text-primary-700 flex items-center justify-center text-[12px] font-black shadow-sm overflow-hidden">
                        <img v-if="task.assignedTo.photo" :src="task.assignedTo.photo" class="w-full h-full object-cover" />
                        <span v-else>{{ getInitials(task.assignedTo.name) }}</span>
                      </div>
                    </div>
                    <div v-else class="w-8 h-8 rounded-full border-2 border-white bg-slate-100 text-slate-400 flex items-center justify-center text-[12px] shadow-sm">
                      <i class="fas fa-user-plus text-[10px]"></i>
                    </div>
                  </div>

                  <div class="flex items-center gap-3 text-slate-400">
                    <div v-if="task.comments?.length" class="flex items-center gap-1.5">
                      <i class="far fa-comment text-[12px]"></i>
                      <span class="text-[12px] font-bold">{{ task.comments.length }}</span>
                    </div>
                    <div class="flex items-center gap-1.5" :class="{'text-emerald-500 font-bold': task.activeSessions?.length}">
                      <i class="far fa-clock text-[12px]"></i>
                      <span class="text-[12px] font-black tracking-tighter">{{ Number(task.actualHours || 0).toFixed(1) }}h</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Timer Mini-Indicator -->
              <div v-if="task.activeSessions?.length" class="absolute -top-1 -right-1 flex gap-1">
                <span class="w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white animate-pulse"></span>
              </div>

              <!-- Quick Edit Overlay Icon -->
              <div class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <div class="w-6 h-6 bg-primary-50 text-primary-600 rounded-lg flex items-center justify-center text-[10px] shadow-sm">
                  <i class="fas fa-pen"></i>
                </div>
              </div>
            </div>

            <!-- Empty Column State (Soft) -->
            <div v-if="getColumnTasks(column.id).length === 0" class="flex flex-col items-center justify-center py-10 opacity-20 group-hover:opacity-40 transition-opacity">
              <i class="fas fa-layer-group text-3xl mb-2 text-slate-300"></i>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- List View -->
    <div v-else-if="currentView === 'list' && selectedBoardId" class="bg-white rounded-3xl shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-slate-50">
            <tr>
              <th class="px-6 py-4 text-left text-[12px] font-black text-slate-400 uppercase tracking-[0.2em]">Tarea</th>
              <th class="px-6 py-4 text-left text-[12px] font-black text-slate-400 uppercase tracking-[0.2em]">Tipo</th>
              <th class="px-6 py-4 text-left text-[12px] font-black text-slate-400 uppercase tracking-[0.2em]">Estado</th>
              <th class="px-6 py-4 text-left text-[12px] font-black text-slate-400 uppercase tracking-[0.2em]">Prioridad</th>
              <th class="px-6 py-4 text-left text-[12px] font-black text-slate-400 uppercase tracking-[0.2em]">Responsable</th>
              <th class="px-6 py-4 text-right text-[12px] font-black text-slate-400 uppercase tracking-[0.2em]">Tiempo</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr 
              v-for="task in tasks" 
              :key="task._id"
              @click="openTaskDetail(task)"
              class="hover:bg-slate-50/80 cursor-pointer transition-colors group"
            >
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <div class="w-2 h-2 rounded-full flex-shrink-0" :style="{ backgroundColor: getTaskTypeColor(task.type) }"></div>
                  <div class="text-slate-700 font-bold text-sm group-hover:text-primary-600 transition-colors">{{ task.title }}</div>
                </div>
              </td>
              <td class="px-6 py-4">
                <span class="text-[12px] font-black uppercase text-slate-400">{{ getTaskTypeLabel(task.type) }}</span>
              </td>
              <td class="px-6 py-4">
                <span class="px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider" :class="getBoardStatusClass(task.boardStatus)">
                  {{ getBoardStatusLabel(task.boardStatus) }}
                </span>
              </td>
              <td class="px-6 py-4">
                <span class="px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider border" :class="getPriorityClass(task.priority)">
                  {{ getPriorityLabel(task.priority) }}
                </span>
              </td>
              <td class="px-6 py-4">
                <div v-if="task.assignedTo" class="flex items-center gap-2">
                  <div class="w-7 h-7 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-[12px] font-black border border-white shadow-sm">
                    {{ getInitials(task.assignedTo.name) }}
                  </div>
                  <span class="text-slate-600 text-xs font-bold">{{ task.assignedTo.name }}</span>
                </div>
                <span v-else class="text-slate-300 text-xs italic">Sin asignar</span>
              </td>
              <td class="px-6 py-4 text-right">
                <div class="text-slate-700 font-black text-xs">{{ Number(task.actualHours || 0).toFixed(1) }}<span class="text-[12px] text-slate-400 ml-0.5">h</span></div>
                <div class="text-[11px] text-slate-400 uppercase tracking-tighter">Est: {{ task.estimatedHours || 0 }}h</div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Global Empty State -->
    <div v-else class="flex flex-col items-center justify-center py-32 text-center">
      <div class="w-24 h-24 bg-slate-50 rounded-[2.5rem] flex items-center justify-center mb-8 animate-bounce duration-[3s]">
        <i class="fas fa-rocket text-4xl text-primary-200"></i>
      </div>
      <h3 class="text-2xl font-black text-slate-800 tracking-tight mb-2">Comienza tu viaje en GEMS Hub</h3>
      <p class="text-slate-400 font-medium text-sm max-w-md">
        Selecciona un tablero para visualizar el flujo de trabajo y comenzar a gestionar la productividad de tu equipo.
      </p>
    </div>

    <!-- Task Modal -->
    <ActivityFormModal
      v-if="showTaskModal"
      :activity="selectedTask"
      :clients="clients"
      :teamMembers="teamMembers"
      :sprints="currentBoard?.sprints"
      :initialBoardStatus="initialColumnId"
      :boardId="selectedBoardId"
      @close="closeTaskModal"
      @saved="onTaskSaved"
    />

    <!-- Debug Overlay -->
    <div v-if="showTaskModal" class="fixed bottom-4 right-4 bg-slate-900/90 backdrop-blur-md text-white p-4 rounded-2xl z-[9999] text-[12px] font-black border border-white/20 shadow-2xl">
      <div class="flex items-center gap-2">
        <span class="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
        ESTADO: MODAL ABIERTO
      </div>
      <div class="mt-1 text-slate-400">Tarea: {{ selectedTask?._id || 'NUEVA' }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useBoardsStore } from '@/stores/boards'
import { useTasksStore, type Task } from '@/stores/tasks'
import { useAuthStore } from '@/stores/auth'
import { teamService } from '@/services/teamService'
import { clientService } from '@/services/clientService'
import ActivityFormModal from '../components/forms/ActivityFormModal.vue'
import { useNotifications } from '@/composables/useNotifications'


const authStore = useAuthStore()
const boardsStore = useBoardsStore()
const tasksStore = useTasksStore()
const { showSuccess, showError } = useNotifications()

const currentView = ref<'kanban' | 'list'>('kanban')
const selectedBoardId = ref<string>('')
const selectedSprintId = ref<string | null>(null)
const showFilters = ref(false)
const openTBChip = ref<string | null>(null)
const closeTBChip = () => { openTBChip.value = null }
const showGitHubPanel = ref(false)
const showTaskModal = ref(false)
const selectedTask = ref<Task | null>(null)
const initialColumnId = ref('backlog')
const teamMembers = ref<any[]>([])
const clients = ref([])
const departments = ref<string[]>(['TI', 'Comercial', 'Marketing'])

watch(showTaskModal, (val) => {
})

watch(selectedTask, (val) => {
})

const filters = ref({
  type: '',
  priority: '',
  status: '',
  department: '',
  assignedTo: authStore.user?._id || '' // Por defecto el usuario actual
})

const boards = computed(() => boardsStore.myBoards)
const currentBoard = computed(() => boardsStore.currentBoard)
const sprints = computed(() => boardsStore.currentBoardSprints)
const tasks = computed(() => tasksStore.tasks)
const loading = computed(() => boardsStore.loading || tasksStore.loading)

const activeFiltersCount = computed(() => {
  return Object.values(filters.value).filter(v => v !== '').length
})

const columns = computed(() => {
  if (!currentBoard.value) return []
  return currentBoard.value.columns.sort((a, b) => a.order - b.order)
})

function getColumnTasks(columnId: string): Task[] {
  return tasks.value.filter(task => task.boardStatus === columnId)
}

function getColumnColor(columnId: string): string {
  const colors: Record<string, string> = {
    'backlog': 'bg-slate-300',
    'todo': 'bg-primary-400',
    'in-progress': 'bg-amber-400',
    'review': 'bg-indigo-400',
    'testing': 'bg-rose-400',
    'done': 'bg-emerald-400'
  }
  return colors[columnId] || 'bg-slate-300'
}

function getTaskTypeColor(type: string): string {
  const colors: Record<string, string> = {
    'task': '#8b5cf6',
    'bug': '#F43F5E',
    'feature': '#8B5CF6',
    'user-story': '#10B981',
    'epic': '#F59E0B'
  }
  return colors[type] || '#94A3B8'
}

function getTaskTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    'task': 'Tarea',
    'bug': 'Error',
    'feature': 'Feature',
    'user-story': 'Story',
    'epic': 'Epic'
  }
  return labels[type] || type
}

function getPriorityClass(priority: string): string {
  const classes: Record<string, string> = {
    'low': 'bg-slate-50 text-slate-500 border-slate-100',
    'medium': 'bg-primary-50 text-primary-600 border-primary-100',
    'high': 'bg-amber-50 text-amber-600 border-amber-100',
    'critical': 'bg-rose-50 text-rose-600 border-rose-100',
    'urgent': 'bg-rose-50 text-rose-600 border-rose-100'
  }
  return classes[priority] || 'bg-slate-50 text-slate-500 border-slate-100'
}

function getPriorityLabel(priority: string): string {
  const labels: Record<string, string> = {
    'low': 'Baja',
    'medium': 'Media',
    'high': 'Alta',
    'critical': 'Crítica',
    'urgent': 'Crítica'
  }
  return labels[priority] || priority
}

function getBoardStatusClass(status: string): string {
  const classes: Record<string, string> = {
    'backlog': 'bg-slate-100 text-slate-500',
    'todo': 'bg-primary-50 text-primary-600',
    'in-progress': 'bg-amber-50 text-amber-600',
    'review': 'bg-indigo-50 text-indigo-600',
    'testing': 'bg-rose-50 text-rose-600',
    'done': 'bg-emerald-50 text-emerald-600'
  }
  return classes[status] || 'bg-slate-100 text-slate-500'
}

function getBoardStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    'backlog': 'Backlog',
    'todo': 'Pendiente',
    'in-progress': 'Ejecución',
    'review': 'Revisión',
    'testing': 'QA',
    'done': 'Finalizado'
  }
  return labels[status] || status
}

function getInitials(name: string): string {
  if (!name) return '??'
  return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)
}

let draggedTask: Task | null = null

function onDragStart(event: DragEvent, task: Task) {
  draggedTask = task
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = 'move'
  }
}

function onDragEnd() {
  draggedTask = null
}

async function onDrop(event: DragEvent, targetColumnId: string) {
  event.preventDefault()
  if (draggedTask && draggedTask.boardStatus !== targetColumnId) {
    try {
      await tasksStore.moveTask(draggedTask._id, targetColumnId)
      showSuccess('Movimiento sincronizado')
    } catch (error) {
      showError('Error al mover la tarea')
    }
  }
}

async function onBoardChange() {
  if (selectedBoardId.value) {
    await boardsStore.fetchBoardById(selectedBoardId.value)
    await loadTasks()
  }
}

async function loadTasks() {
  if (!selectedBoardId.value) return
  
  const filterParams: any = {
    ...filters.value,
    sprint: selectedSprintId.value || undefined
  }
  
  Object.keys(filterParams).forEach(key => {
    if (!filterParams[key]) {
      delete filterParams[key]
    }
  })
  
  await tasksStore.fetchTasks(selectedBoardId.value, filterParams)
}

function clearFilters() {
  filters.value = { type: '', priority: '', status: '', department: '', assignedTo: '' }
  loadTasks()
}

function saveCurrentFilters() {
  localStorage.setItem('gems_crm_filters', JSON.stringify(filters.value))
  showSuccess('Filtros guardados como predeterminados')
}

function openTaskModal(columnId?: string) {
  selectedTask.value = null
  initialColumnId.value = columnId || 'backlog'
  showTaskModal.value = true
}

function openTaskDetail(task: Task) {
  selectedTask.value = task
  showTaskModal.value = true
}

function closeTaskModal() {
  showTaskModal.value = false
  selectedTask.value = null
}

async function onTaskSaved() {
  await loadTasks()
}

onUnmounted(() => document.removeEventListener('click', closeTBChip))

onMounted(async () => {
  document.addEventListener('click', closeTBChip)
  try {
    // Cargar filtros guardados
    const saved = localStorage.getItem('gems_crm_filters')
    if (saved) {
      try {
        filters.value = JSON.parse(saved)
      } catch (e) {}
    }

    await boardsStore.fetchBoards()
    if (boards.value.length > 0) {
      selectedBoardId.value = boards.value[0]._id
      await boardsStore.fetchBoardById(selectedBoardId.value)
      await loadTasks()
    }

    const [team, cls] = await Promise.all([
      teamService.getActiveMembers(),
      clientService.getAll()
    ])
    teamMembers.value = team
    clients.value = cls
  } catch (error) {
    console.error('Error in TasksBoard onMounted:', error)
  }
})
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #f1f5f9;
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #e2e8f0;
}

@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slide-in-from-top-4 {
  from { transform: translateY(-1rem); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

.animate-in {
  animation-fill-mode: forwards;
}
.fade-in {
  animation-name: fade-in;
}
.slide-in-from-top-4 {
  animation-name: slide-in-from-top-4;
}
</style>

<style>
.tb-chip {
  position: relative; display: inline-flex; align-items: center; gap: 6px;
  height: 36px; padding: 0 10px; border-radius: 8px;
  background: #f8fafc; border: 1px solid #e2e8f0;
  font-size: 11px; font-weight: 700; color: #475569;
  cursor: pointer; user-select: none; white-space: nowrap; transition: all 0.15s;
}
.tb-chip:hover { background: #f1f5f9; }
.tb-chip--on { background: #ede9fe; border-color: #c4b5fd; color: #6d28d9; }
.tb-chip i:first-child { font-size: 9px; }
.tb-caret { font-size: 8px; transition: transform 0.2s; }
.tb-label { font-size: 11px; font-weight: 700; }
.tb-dropdown {
  position: absolute; top: calc(100% + 6px); left: 0; z-index: 50;
  min-width: 160px; background: #fff; border: 1px solid #e2e8f0;
  border-radius: 10px; box-shadow: 0 4px 16px rgba(0,0,0,0.10);
  padding: 4px; max-height: 240px; overflow-y: auto;
}
.tb-dropdown-item {
  display: flex; align-items: center; justify-content: space-between; gap: 8px;
  padding: 7px 10px; border-radius: 7px;
  font-size: 11px; font-weight: 600; color: #475569; cursor: pointer; transition: background 0.12s;
}
.tb-dropdown-item:hover { background: #f1f5f9; }
.tb-dropdown-item--active { color: #4f46e5; font-weight: 700; }
.dark .tb-chip { background: #1e293b; border-color: #334155; color: #94a3b8; }
.dark .tb-chip:hover { background: #273449; }
.dark .tb-chip--on { background: #3b1f6e33; border-color: #7c3aed55; color: #a78bfa; }
.dark .tb-dropdown { background: #1e293b; border-color: #334155; box-shadow: 0 4px 20px rgba(0,0,0,0.4); }
.dark .tb-dropdown-item { color: #94a3b8; }
.dark .tb-dropdown-item:hover { background: #273449; color: #e2e8f0; }
.dark .tb-dropdown-item--active { color: #818cf8; }
</style>
