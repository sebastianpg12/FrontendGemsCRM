<template>
  <div class="flex flex-col h-full min-h-0 relative">
    <div class="flex-1 min-h-0 overflow-y-auto space-y-6 sm:space-y-12 p-1 custom-scrollbar">

      <!-- Main Content Container -->
      <div class="space-y-8 sm:space-y-16 mt-3 sm:mt-6">
        
        <!-- Barra de sesiones activas ahora mismo -->
        <div v-if="activeSessions.length > 0" class="bg-white dark:bg-[#1e293b] shadow-sm rounded-xl p-4 flex items-center gap-4 flex-wrap animate-in slide-in-from-top-4 duration-700">
          <div class="flex items-center gap-2 px-3 py-1.5 bg-primary-600 rounded-lg shrink-0">
            <span class="relative flex h-2 w-2">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span class="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
            </span>
            <span class="text-[12px] font-black text-white uppercase tracking-widest">En vivo</span>
          </div>

          <div class="flex -space-x-2.5">
            <div
              v-for="(session, idx) in activeSessions"
              :key="session.userId + idx"
              class="relative group/avatar"
            >
              <div class="w-9 h-9 rounded-xl bg-slate-800 border-2 border-white dark:border-[#1e293b] shadow flex items-center justify-center text-xs font-black text-white overflow-hidden">
                <img v-if="session.userPhoto || session.userAvatar" :src="session.userPhoto || session.userAvatar" class="w-full h-full object-cover" />
                <span v-else>{{ session.userName?.charAt(0) || '?' }}</span>
              </div>
              <div class="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white dark:border-[#1e293b]"></div>

              <!-- Tooltip -->
              <div class="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 px-3 py-1.5 bg-slate-900 text-white text-[12px] font-bold rounded-lg opacity-0 invisible group-hover/avatar:opacity-100 group-hover/avatar:visible transition-all whitespace-nowrap z-10 shadow-xl">
                {{ session.userName }} — {{ session.taskTitle }}
                <div class="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-slate-900"></div>
              </div>
            </div>
          </div>

          <span class="text-slate-500 dark:text-slate-400 text-[13px] font-bold">{{ activeSessions.length }} {{ activeSessions.length === 1 ? 'persona trabajando ahora' : 'personas trabajando ahora' }}</span>
        </div>

        <!-- Team Resumen Grid -->
        <section class="space-y-4 sm:space-y-6 pb-6 sm:pb-12">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between bg-white dark:bg-[#1e293b] p-4 sm:p-5 rounded-xl shadow-sm gap-3">
            <div class="flex items-center gap-3">
              <div class="w-9 h-9 bg-primary-50 dark:bg-primary-500/10 rounded-xl flex items-center justify-center text-primary-500 shrink-0">
                <i class="fas fa-users text-base sm:text-lg"></i>
              </div>
              <h2 class="text-base sm:text-xl font-black text-slate-800 dark:text-white tracking-tight">Equipo hoy</h2>
            </div>

            <button @click="openEmailModal" class="flex items-center gap-2 h-9 px-4 bg-primary-600 hover:bg-primary-700 text-white rounded-xl transition-all shadow-sm font-black text-[12px] uppercase tracking-widest shrink-0 self-start sm:self-auto">
              <i class="fas fa-paper-plane"></i>
              <span class="hidden sm:inline">Enviar Reporte</span>
            </button>
          </div>

          <div class="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-5">
            <div
              v-for="item in usersWithTasks"
              :key="item.user._id"
              class="bg-white dark:bg-[#1e293b] rounded-xl shadow-sm flex flex-col"
            >
              <div class="flex flex-col lg:flex-row gap-4 p-4">
                <!-- User Profile Section -->
                <div class="lg:w-[220px] flex lg:flex-col justify-between lg:justify-start gap-4 shrink-0">
                  <div class="flex items-center lg:items-start gap-3">
                    <div class="relative shrink-0">
                      <div class="w-11 h-11 rounded-xl bg-slate-800 border-2 border-white dark:border-[#1e293b] shadow flex items-center justify-center text-white font-black text-base overflow-hidden">
                        <img v-if="item.user.photo || item.user.avatar" :src="item.user.photo || item.user.avatar" class="w-full h-full object-cover" />
                        <span v-else>{{ item.user.name.charAt(0) }}</span>
                      </div>
                      <div v-if="isUserActive(item.user._id)" class="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white dark:border-[#1e293b] animate-pulse"></div>
                    </div>
                    <div class="space-y-0.5 min-w-0">
                      <h3 class="text-slate-800 dark:text-white font-black text-sm tracking-tight truncate">{{ item.user.name }}</h3>
                      <span class="px-2 py-0.5 bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400 rounded-md text-[10px] font-black uppercase tracking-widest block w-fit">
                        {{ item.user.role || 'Consultor' }}
                      </span>
                    </div>
                  </div>

                  <div class="flex flex-col gap-2 mt-auto">
                    <div class="flex justify-between items-end">
                      <span class="text-[11px] font-black text-slate-400 uppercase tracking-widest">Rendimiento</span>
                      <span class="text-xs font-black text-primary-600 dark:text-primary-400">{{ calculateUserPerformance(item.tasks) }}%</span>
                    </div>
                    <div class="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-1.5 overflow-hidden">
                      <div
                        class="bg-primary-500 h-full rounded-full transition-all duration-700"
                        :style="{ width: `${calculateUserPerformance(item.tasks)}%` }"
                      ></div>
                    </div>
                    <span class="text-[11px] font-bold" :class="isUserActive(item.user._id) ? 'text-emerald-500' : 'text-slate-400 dark:text-slate-500'">
                      {{ isUserActive(item.user._id) ? '● Trabajando ahora' : 'En pausa' }}
                    </span>
                  </div>
                </div>

                <!-- Vertical Divider -->
                <div class="hidden lg:block w-px bg-slate-100 dark:bg-[#334155] self-stretch"></div>

                <!-- Activities Timeline Section -->
                <div class="flex-1 min-w-0">
                  <div class="flex items-center justify-between mb-2 px-1">
                    <span class="text-[11px] font-black text-slate-400 uppercase tracking-widest">Hoy ({{ item.tasks.length }})</span>
                    <span class="text-[11px] font-black text-slate-400 uppercase tracking-widest">{{ formatSecondsToTime(calculateTotalTime(item.tasks)) }}</span>
                  </div>

                  <div class="space-y-1.5 h-[130px] overflow-y-auto pr-1 custom-scrollbar-mini">
                    <div v-if="item.tasks.length === 0" class="flex items-center justify-center h-full text-slate-300 dark:text-slate-600">
                      <p class="text-[12px] font-bold">Sin actividad registrada</p>
                    </div>

                    <div
                      v-for="task in item.tasks"
                      :key="task._id"
                      class="flex items-center gap-3 bg-slate-50 dark:bg-[#0f172a] hover:bg-slate-100 dark:hover:bg-[#273449] p-2.5 rounded-lg transition-colors"
                    >
                      <div class="w-1.5 h-1.5 rounded-full shrink-0" :class="task.activeSessions?.some((s: any) => (s.userId?._id || s.userId) === item.user._id) ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300 dark:bg-slate-600'"></div>
                      <div class="flex-1 min-w-0">
                        <h5 class="text-slate-700 dark:text-slate-200 text-[13px] font-bold truncate tracking-tight">{{ task.title }}</h5>
                        <div class="flex items-center gap-3 text-[11px] font-bold text-slate-400">
                           <span class="flex items-center gap-1"><i class="fas fa-clock text-[10px]"></i> {{ formatSecondsToTime(task.timeSpent || 0) }}</span>
                           <span v-if="task.completionPercentage">{{ task.completionPercentage }}% completo</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>

    <!-- Modal de Envío de Reporte (Premium Redesign) -->
    <Teleport to="body">
      <div v-if="showEmailModal" class="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/50 p-4 animate-in fade-in duration-500">
        <div class="bg-white dark:bg-[#1e293b] rounded-xl p-6 sm:p-8 w-full max-w-md shadow-xl animate-in zoom-in-95 duration-500">
          <div class="text-center space-y-3 mb-6">
            <div class="w-14 h-14 bg-primary-50 dark:bg-primary-500/10 rounded-xl flex items-center justify-center mx-auto">
              <i class="fas fa-paper-plane text-primary-600 dark:text-primary-400 text-xl"></i>
            </div>
            <div class="space-y-1.5">
              <h3 class="text-lg font-black text-slate-800 dark:text-white tracking-tight">Enviar reporte diario</h3>
              <p class="text-xs font-medium text-slate-500 dark:text-slate-400 leading-relaxed max-w-[280px] mx-auto">
                Resumen del progreso y actividad de todo el equipo hoy.
              </p>
            </div>
          </div>

          <div class="space-y-5">
            <div class="group">
              <label class="block text-[12px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Destinatario</label>
              <div class="relative">
                <i class="fas fa-envelope absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 dark:text-slate-500"></i>
                <input
                  v-model="reportEmail"
                  type="email"
                  placeholder="admin@gemsinnovations.com"
                  class="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-[#334155] rounded-xl text-slate-800 dark:text-white text-sm font-bold focus:bg-white dark:focus:bg-[#0f172a] focus:ring-4 focus:ring-primary-500/10 focus:border-primary-400 outline-none transition-all placeholder:text-slate-300 dark:placeholder:text-slate-600"
                />
              </div>
            </div>

            <div class="flex gap-3">
              <button @click="showEmailModal = false" class="flex-1 h-9 px-4 bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-xl text-[13px] font-black uppercase tracking-widest transition-all">
                Cancelar
              </button>
              <button
                @click="confirmSendReport"
                :disabled="sendingEmail || !reportEmail"
                class="flex-[1.5] h-9 px-4 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-[13px] font-black uppercase tracking-widest transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 active:scale-95"
              >
                <div v-if="sendingEmail" class="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                <i v-else class="fas fa-paper-plane text-xs"></i>
                {{ sendingEmail ? 'Procesando...' : 'Confirmar' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import axios from 'axios'
import { API_CONFIG } from '@/config/api'
import { useAuthStore } from '@/stores/auth'
import { useNotifications } from '@/composables/useNotifications'

const props = defineProps<{
  activities: any[]
}>()

const authStore = useAuthStore()
const { showSuccess, showError } = useNotifications()
const API_URL = API_CONFIG.BASE_URL.replace('/api', '')

const dailyTasks = computed(() => {
  return props.activities.filter((t: any) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    const updated = new Date(t.updatedAt)
    const hasActive = t.activeSessions && t.activeSessions.length > 0
    const isInProgress = t.status === 'in-progress'
    const isTodayOrActive = updated >= today || hasActive || isInProgress
    
    // Filtrar si el asignado es un cliente
    const isAssignedToClient = Array.isArray(t.assignedTo) && t.assignedTo.some((u: any) => {
      const role = u.role?.toLowerCase() || ''
      return role.includes('client') || role.includes('cliente')
    })

    return isTodayOrActive && !isAssignedToClient
  })
})

const usersWithTasks = computed(() => {
  const grouped = new Map<string, { user: any, tasks: any[] }>()
  
  dailyTasks.value.forEach(task => {
    if (Array.isArray(task.assignedTo) && task.assignedTo.length > 0) {
      task.assignedTo.forEach(user => {
        const userId = typeof user === 'object' ? user._id : user
        if (!userId) return

        if (!grouped.has(userId)) {
          grouped.set(userId, { 
            user: typeof user === 'object' ? user : { _id: userId, name: 'Usuario' }, 
            tasks: [] 
          })
        }
        grouped.get(userId)!.tasks.push(task)
      })
    }
  })
  
  // Convert map to sorted array (by name)
  return Array.from(grouped.values()).sort((a, b) => a.user.name.localeCompare(b.user.name))
})

const activeSessions = computed(() => {
  const sessions: any[] = []
  dailyTasks.value.forEach(task => {
    if (task.activeSessions) {
      task.activeSessions.forEach((session: any) => {
        // Encontrar el usuario en la lista de asignados para obtener nombre/foto
        const userId = typeof session.userId === 'object' ? session.userId._id : session.userId
        const user = task.assignedTo?.find((u: any) => (u._id || u) === userId)
        
        sessions.push({
          ...session,
          userName: user?.name || 'Usuario',
          userPhoto: user?.photo || user?.avatar,
          taskTitle: task.title,
          taskId: task._id
        })
      })
    }
  })
  return sessions
})

const isUserActive = (userId: string) => {
  return activeSessions.value.some(s => (s.userId?._id || s.userId) === userId)
}

const sendingEmail = ref(false)
const showEmailModal = ref(false)
const reportEmail = ref('')

function openEmailModal() {
  reportEmail.value = authStore.user?.email || ''
  showEmailModal.value = true
}

async function confirmSendReport() {
  if (!reportEmail.value) return
  
  sendingEmail.value = true
  try {
    await axios.post(`${API_URL}/api/task-reports/send-daily-email`, {
      toEmail: reportEmail.value
    }, {
      headers: {
        Authorization: `Bearer ${authStore.token}`
      }
    })
    showEmailModal.value = false
    showSuccess(`Reporte enviado exitosamente a ${reportEmail.value}`)
  } catch (error: any) {
    showError(error.response?.data?.error || 'Error al enviar el reporte.')
  } finally {
    sendingEmail.value = false
  }
}

const calculateUserPerformance = (tasks: any[]) => {
  if (tasks.length === 0) return 0
  const total = tasks.length
  const completedWeight = tasks.reduce((acc, t) => acc + (t.completionPercentage || 0), 0)
  return Math.round(completedWeight / total)
}

const formatSecondsToTime = (seconds: number) => {
  if (!seconds || isNaN(seconds)) return '0m'
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  
  if (h > 0) return `${h}h ${m}m`
  return `${m}m`
}

const calculateTotalTime = (tasks: any[]) => {
  return tasks.reduce((acc, t) => acc + (t.timeSpent || 0), 0)
}

</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #e2e8f0;
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #cbd5e1;
}

.custom-scrollbar-mini::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar-mini::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar-mini::-webkit-scrollbar-thumb {
  background: #f1f5f9;
  border-radius: 10px;
}
.custom-scrollbar-mini::-webkit-scrollbar-thumb:hover {
  background: #e2e8f0;
}

@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes zoom-in-95 {
  from { transform: scale(0.95); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
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
.zoom-in-95 {
  animation-name: zoom-in-95;
}
.slide-in-from-top-4 {
  animation-name: slide-in-from-top-4;
}

.animate-fade-in {
  animation: fade-in 0.8s ease-out forwards;
}

/* Glassmorphism utility */
.backdrop-blur-xl {
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
}
</style>
