<template>
  <div class="flex flex-col gap-4 pt-3">

    <!-- ══ Header ══════════════════════════════════════════════════════ -->
    <div class="flex items-center justify-between gap-3 flex-wrap relative z-[50]">
      <div>
        <div class="flex items-center gap-2 mb-1">
          <h1 class="text-[22px] font-black tracking-tight text-slate-900 dark:text-white">
            Hola, {{ firstName }}
          </h1>
          <span class="px-2 py-0.5 bg-slate-100 dark:bg-[#334155] text-slate-500 dark:text-slate-300 text-[11px] font-bold rounded-full">{{ userRoleLabel }}</span>
        </div>
        <p class="text-[13px] text-slate-400 font-medium">
          {{ todayLabel }} ·
          <span v-if="criticalCount > 0" class="text-amber-500 font-bold">{{ criticalCount }} {{ criticalCount === 1 ? 'actividad requiere' : 'actividades requieren' }} atención</span>
          <span v-else class="text-emerald-500 font-bold">Todo bajo control</span>
        </p>
      </div>

      <!-- Controles -->
      <div class="flex items-center gap-2 relative z-[50]">
        <!-- Toggle acciones rápidas -->
        <button
          @click="showActions = !showActions"
          class="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[13px] font-bold border transition-colors"
          :class="showActions
            ? 'bg-slate-800 dark:bg-slate-700 text-white border-slate-800 dark:border-slate-700'
            : 'bg-white dark:bg-[#1e293b] text-slate-600 dark:text-slate-300 border-slate-200 dark:border-[#334155] hover:text-primary-600'"
        >
          <i class="fas fa-bolt text-[12px]"></i>
          <span class="hidden sm:inline">Acciones</span>
          <i class="fas fa-chevron-down text-[11px] transition-transform duration-200" :class="{ 'rotate-180': showActions }"></i>
        </button>

        <router-link v-if="authStore.canCreateActivities" to="/activities"
          class="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-[13px] font-bold transition-colors shrink-0">
          <i class="fas fa-plus text-[12px]"></i>
          <span class="hidden sm:inline">Nueva actividad</span>
        </router-link>

        <!-- Acciones rápidas — dropdown flotante -->
        <Transition
          enter-active-class="transition ease-out duration-150"
          enter-from-class="opacity-0 translate-y-1"
          enter-to-class="opacity-100 translate-y-0"
          leave-active-class="transition ease-in duration-100"
          leave-from-class="opacity-100 translate-y-0"
          leave-to-class="opacity-0 translate-y-1"
        >
          <div v-if="showActions"
            class="absolute top-full right-0 mt-1.5 bg-white dark:bg-[#1e293b] rounded-xl shadow-lg p-2.5 w-[280px] sm:w-[340px] origin-top-right">
            <p class="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-1 mb-2">Acciones rápidas</p>
            <div class="grid grid-cols-3 sm:grid-cols-4 gap-1.5">
              <router-link
                v-for="qa in quickActions"
                :key="qa.label"
                :to="qa.to"
                @click="showActions = false"
                class="group flex flex-col items-center gap-1.5 rounded-xl px-1.5 py-2.5 transition-colors hover:bg-slate-50 dark:hover:bg-[#0f172a]"
              >
                <div class="w-9 h-9 rounded-xl flex items-center justify-center" :class="qa.iconBg">
                  <i :class="['fas', qa.icon, qa.iconColor, 'text-[14px]']"></i>
                </div>
                <span class="text-[11px] font-bold text-slate-600 dark:text-slate-300 group-hover:text-primary-600 text-center leading-tight">{{ qa.label }}</span>
              </router-link>
            </div>
          </div>
        </Transition>
      </div>
    </div>

    <!-- Backdrop para cerrar dropdown -->
    <div v-if="showActions" class="fixed inset-0 z-[49]" @click="showActions = false"></div>

    <!-- ══ Vista COLABORADOR ═══════════════════════════════════════════ -->
    <template v-if="isCollaborator">

      <!-- Stat chips rápidos -->
      <div class="grid grid-cols-3 gap-3">
        <div class="bg-white dark:bg-[#1e293b] shadow-sm rounded-xl py-3.5 px-4 flex items-center gap-3">
          <div class="w-8 h-8 rounded-lg bg-red-50 dark:bg-red-500/10 flex items-center justify-center shrink-0">
            <i class="fas fa-exclamation text-red-500 text-[13px]"></i>
          </div>
          <div>
            <span class="block text-[20px] font-black leading-none text-slate-800 dark:text-white">{{ overdueCount }}</span>
            <span class="block text-[11px] font-bold text-slate-400 mt-1">Vencidas</span>
          </div>
        </div>
        <div class="bg-white dark:bg-[#1e293b] shadow-sm rounded-xl py-3.5 px-4 flex items-center gap-3">
          <div class="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center shrink-0">
            <i class="fas fa-calendar-day text-amber-500 text-[13px]"></i>
          </div>
          <div>
            <span class="block text-[20px] font-black leading-none text-slate-800 dark:text-white">{{ todayCount }}</span>
            <span class="block text-[11px] font-bold text-slate-400 mt-1">Para hoy</span>
          </div>
        </div>
        <div class="bg-white dark:bg-[#1e293b] shadow-sm rounded-xl py-3.5 px-4 flex items-center gap-3">
          <div class="w-8 h-8 rounded-lg bg-primary-50 dark:bg-primary-500/10 flex items-center justify-center shrink-0">
            <i class="fas fa-flag text-primary-500 text-[13px]"></i>
          </div>
          <div>
            <span class="block text-[20px] font-black leading-none text-slate-800 dark:text-white">{{ highPriorityCount }}</span>
            <span class="block text-[11px] font-bold text-slate-400 mt-1">Alta prioridad</span>
          </div>
        </div>
      </div>

      <!-- Lista de actividades -->
      <div class="bg-white dark:bg-[#1e293b] shadow-sm rounded-xl overflow-hidden">
        <div class="flex items-center justify-between px-4 py-3">
          <span class="text-[14px] font-bold text-slate-800 dark:text-slate-100">Actividades pendientes</span>
          <router-link to="/activities"
            class="text-[12px] font-bold text-primary-600 hover:text-primary-700 transition-colors">
            Ver todas
          </router-link>
        </div>

        <div v-if="agendaActivities.length === 0" class="flex flex-col items-center justify-center gap-2 py-12">
          <i class="fas fa-check-circle text-slate-300 dark:text-slate-500 text-2xl"></i>
          <p class="text-[13px] text-slate-400 font-medium">Sin actividades pendientes</p>
          <router-link v-if="authStore.canCreateActivities" to="/activities"
            class="mt-1 px-3 py-1.5 bg-primary-600 text-white rounded-lg text-[13px] font-bold hover:bg-primary-700 transition-colors">
            Crear actividad
          </router-link>
        </div>

        <div v-else class="divide-y divide-slate-100 dark:divide-[#334155]">
          <div v-for="act in agendaActivities" :key="act._id"
            class="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-[#0f172a] transition-colors border-l-[3px]"
            :class="act.priority === 'urgent' ? 'border-l-red-400' : act.priority === 'high' ? 'border-l-amber-400' : 'border-l-slate-100 dark:border-l-slate-700'">
            <div class="flex-1 min-w-0">
              <p class="text-[13.5px] font-semibold text-slate-800 dark:text-slate-200 truncate">{{ act.title }}</p>
              <p class="text-[12px] text-slate-400 mt-0.5 truncate">{{ formatDateShort(act.dueDate || act.date) }}</p>
            </div>
            <span :class="['shrink-0 px-2 py-1 rounded-lg text-[11px] font-bold', agendaStatusClass(act)]">
              {{ agendaStatusLabel(act) }}
            </span>
          </div>
        </div>
      </div>

    </template>

    <!-- ══ Vista ADMIN / resto de roles ════════════════════════════════ -->
    <template v-else>

    <!-- Stat cards -->
    <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
      <div v-for="card in statCards" :key="card.label"
        class="bg-white dark:bg-[#1e293b] shadow-sm rounded-xl p-4 flex items-center gap-3 min-w-0">
        <div class="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" :class="card.iconBg">
          <i :class="['fas', card.icon, card.iconColor, 'text-[15px]']"></i>
        </div>
        <div class="min-w-0">
          <span class="block text-[20px] font-black leading-none text-slate-800 dark:text-white">{{ card.value }}</span>
          <span class="block text-[11px] font-bold text-slate-400 truncate mt-1">{{ card.label }}</span>
        </div>
      </div>
    </div>

    <!-- Main grid -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-3">

      <!-- Agenda operativa -->
      <div class="lg:col-span-2 bg-white dark:bg-[#1e293b] shadow-sm rounded-xl overflow-hidden flex flex-col">
        <div class="flex items-center justify-between px-4 py-3 shrink-0">
          <span class="text-[14px] font-bold text-slate-800 dark:text-slate-100">Actividades próximas</span>
          <router-link to="/activities"
            class="text-[12px] font-bold text-primary-600 hover:text-primary-700 transition-colors shrink-0">
            Ver todas
          </router-link>
        </div>
        <div v-if="agendaActivities.length === 0" class="flex-1 flex flex-col items-center justify-center gap-2 py-10">
          <i class="fas fa-calendar-check text-slate-300 dark:text-slate-500 text-2xl"></i>
          <p class="text-[13px] text-slate-400 font-medium">Sin actividades próximas</p>
        </div>
        <div v-else class="max-h-[380px] overflow-y-auto custom-scrollbar divide-y divide-slate-100 dark:divide-[#334155]">
          <div v-for="act in agendaActivities" :key="act._id"
            class="flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 dark:hover:bg-[#0f172a] transition-colors border-l-[3px]"
            :class="act.priority === 'urgent' ? 'border-l-red-400' : act.priority === 'high' ? 'border-l-amber-400' : 'border-l-slate-100 dark:border-l-slate-700'">
            <div class="flex-1 min-w-0">
              <p class="text-[13.5px] font-semibold text-slate-800 dark:text-slate-200 truncate">{{ act.title }}</p>
              <p class="text-[12px] text-slate-400 truncate">{{ clientsStore.clients.find(c => c._id === act.clientId)?.name || '—' }}</p>
            </div>
            <span :class="['shrink-0 px-2 py-1 rounded-lg text-[11px] font-bold', agendaStatusClass(act)]">
              {{ agendaStatusLabel(act) }}
            </span>
            <span class="shrink-0 hidden lg:block text-[11px] text-slate-400">
              {{ formatDateShort(act.dueDate || act.date) }}
            </span>
          </div>
        </div>
      </div>

      <!-- IA -->
      <AIInsightsWidget />
    </div>

    <!-- Tendencia semanal -->
    <WeeklyTrendCard v-if="authStore.canViewActivities" />

    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useClientsStore, useActivitiesStore, useIssuesStore, useTeamStore } from '../stores'
import AIInsightsWidget from '../components/AIInsightsWidget.vue'
import WeeklyTrendCard from '../components/dashboard/WeeklyTrendCard.vue'

const authStore = useAuthStore()
const clientsStore = useClientsStore()
const activitiesStore = useActivitiesStore()
const issuesStore = useIssuesStore()
const teamStore = useTeamStore()

const isRefreshing = ref(false)
const showActions = ref(false)

const firstName = computed(() => authStore.user?.name?.split(' ')[0] || 'Usuario')

const todayLabel = computed(() => {
  return new Date().toLocaleDateString('es', { weekday: 'long', day: 'numeric', month: 'long' })
    .replace(/^\w/, c => c.toUpperCase())
})

const isCollaborator = computed(() => authStore.user?.role === 'collaborator')

const userRoleLabel = computed(() => ({
  admin: 'Administrador', manager: 'Manager', employee: 'Empleado',
  support: 'Soporte', development: 'Desarrollador', fullstack: 'Fullstack',
  viewer: 'Viewer', client: 'Cliente', collaborator: 'Colaborador',
  supervisor: 'Supervisor',
}[authStore.user?.role || ''] || authStore.user?.role || 'Usuario'))

const todayMidnight = new Date()
todayMidnight.setHours(0, 0, 0, 0)

const overdueCount = computed(() =>
  activitiesStore.activities.filter((a: any) => {
    if (a.status === 'completed' || a.status === 'cancelled') return false
    const d = new Date(a.dueDate || a.date); d.setHours(0, 0, 0, 0)
    return d < todayMidnight
  }).length
)
const todayCount = computed(() =>
  activitiesStore.activities.filter((a: any) => {
    if (a.status === 'completed' || a.status === 'cancelled') return false
    const d = new Date(a.dueDate || a.date); d.setHours(0, 0, 0, 0)
    return d.getTime() === todayMidnight.getTime()
  }).length
)
const highPriorityCount = computed(() =>
  activitiesStore.activities.filter((a: any) =>
    (a.priority === 'high' || a.priority === 'urgent') &&
    a.status !== 'completed' && a.status !== 'cancelled'
  ).length
)
const criticalCount = computed(() => overdueCount.value + todayCount.value)

const activeActivities = computed(() =>
  activitiesStore.activities.filter((a: any) => a.status !== 'completed' && a.status !== 'cancelled').length
)
const openCases = computed(() =>
  issuesStore.issues.filter((i: any) => i.status === 'open').length
)
const pendingTickets = computed(() =>
  issuesStore.issues.filter((i: any) => i.status === 'pending' || i.status === 'in-progress').length
)
const quickActions = computed(() => {
  const all = [
    { label: 'Nuevo cliente', to: '/clients', icon: 'fa-user-plus', iconBg: 'bg-primary-50 group-hover:bg-primary-100', iconColor: 'text-primary-500', hover: 'hover:border-primary-200', can: authStore.canCreateClients },
    { label: 'Nueva actividad', to: '/activities', icon: 'fa-plus-circle', iconBg: 'bg-green-50 group-hover:bg-green-100', iconColor: 'text-green-500', hover: 'hover:border-green-200', can: authStore.canCreateActivities && authStore.isModuleEnabled('activities') },
    { label: 'Revisar tickets', to: '/tickets', icon: 'fa-ticket-alt', iconBg: 'bg-blue-50 group-hover:bg-blue-100', iconColor: 'text-blue-500', hover: 'hover:border-blue-200', can: authStore.canViewTickets && authStore.isModuleEnabled('tickets') },
    { label: 'Nuevo caso', to: '/cases', icon: 'fa-exclamation-circle', iconBg: 'bg-orange-50 group-hover:bg-orange-100', iconColor: 'text-orange-500', hover: 'hover:border-orange-200', can: authStore.canCreateCases && authStore.isModuleEnabled('cases') },
    { label: 'Gestionar equipo', to: '/team', icon: 'fa-users-cog', iconBg: 'bg-purple-50 group-hover:bg-purple-100', iconColor: 'text-purple-500', hover: 'hover:border-primary-200', can: authStore.canCreateTeam && authStore.isModuleEnabled('team') },
  ]
  return all.filter(a => a.can)
})

const statCards = computed(() => {
  const all = [
    { label: 'Clientes', value: clientsStore.clients.length, tag: 'Base', tagColor: 'text-primary-500', icon: 'fa-users', iconBg: 'bg-primary-50', iconColor: 'text-primary-500', accentBar: 'bg-gradient-to-r from-primary-400 to-primary-300', can: authStore.canViewClients },
    { label: 'Actividades', value: activeActivities.value, tag: 'Activas', tagColor: 'text-emerald-500', icon: 'fa-clipboard-list', iconBg: 'bg-emerald-50', iconColor: 'text-emerald-500', accentBar: 'bg-gradient-to-r from-emerald-400 to-emerald-300', can: authStore.canViewActivities && authStore.isModuleEnabled('activities') },
    { label: 'Casos', value: openCases.value, tag: 'Abiertos', tagColor: 'text-red-500', icon: 'fa-exclamation-triangle', iconBg: 'bg-red-50', iconColor: 'text-red-500', accentBar: 'bg-gradient-to-r from-red-400 to-red-300', can: authStore.canViewCases && authStore.isModuleEnabled('cases') },
    { label: 'Tickets', value: pendingTickets.value, tag: 'Pendientes', tagColor: 'text-orange-500', icon: 'fa-ticket-alt', iconBg: 'bg-orange-50', iconColor: 'text-orange-500', accentBar: 'bg-gradient-to-r from-orange-400 to-orange-300', can: authStore.canViewTickets && authStore.isModuleEnabled('tickets') },
    { label: 'Equipo', value: teamStore.members.length, tag: 'Activos', tagColor: 'text-primary-500', icon: 'fa-user-friends', iconBg: 'bg-primary-50', iconColor: 'text-primary-500', accentBar: 'bg-gradient-to-r from-primary-400 to-primary-300', can: authStore.canViewTeam && authStore.isModuleEnabled('team') },
  ]
  return all.filter(s => s.can)
})

const agendaActivities = computed(() => {
  const list = [...activitiesStore.activities]
    .filter((a: any) => a.status !== 'completed' && a.status !== 'cancelled')
    .sort((a: any, b: any) => new Date(a.dueDate || a.date).getTime() - new Date(b.dueDate || b.date).getTime())
  return list.slice(0, 20)
})

const agendaStatusLabel = (a: any) => {
  const d = new Date(a.dueDate || a.date); d.setHours(0, 0, 0, 0)
  if (d < todayMidnight) return 'Atrasada'
  if (a.status === 'in-progress') return 'En curso'
  return 'Pendiente'
}
const agendaStatusClass = (a: any) => {
  const d = new Date(a.dueDate || a.date); d.setHours(0, 0, 0, 0)
  if (d < todayMidnight) return 'bg-red-50 dark:bg-red-500/10 text-red-600'
  if (a.status === 'in-progress') return 'bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400'
  return 'bg-amber-50 dark:bg-amber-500/10 text-amber-600'
}

const formatDateShort = (d?: string) => {
  if (!d) return '—'
  const date = new Date(d)
  const day = date.getDate()
  const month = date.toLocaleString('es', { month: 'short' }).replace('.', '')
  const time = date.toLocaleTimeString('es', { hour: 'numeric', minute: '2-digit', hour12: true }).toLowerCase()
  return `${day} de ${month}, ${time}`
}

const refreshData = async () => {
  if (isRefreshing.value) return
  isRefreshing.value = true
  try {
    const ps: Promise<any>[] = []
    if (authStore.canViewClients) ps.push(clientsStore.fetchClients())
    if (authStore.canViewActivities && authStore.isModuleEnabled('activities')) ps.push(activitiesStore.fetchActivities())
    // El stat "Tickets" también lee de issuesStore (Casos) — se carga si cualquiera
    // de los dos módulos está habilitado, para no dejar el stat de Tickets en 0
    // cuando alguien puede verlo pero no tiene permiso/módulo de Casos.
    if ((authStore.canViewCases && authStore.isModuleEnabled('cases')) || (authStore.canViewTickets && authStore.isModuleEnabled('tickets'))) ps.push(issuesStore.fetchIssues())
    if (authStore.canViewTeam && authStore.isModuleEnabled('team')) ps.push(teamStore.fetchTeam())
    await Promise.all(ps)
  } finally { isRefreshing.value = false }
}

onMounted(async () => {
  try {
    const ps: Promise<any>[] = []
    if (authStore.canViewClients) ps.push(clientsStore.fetchClients())
    if (authStore.canViewActivities && authStore.isModuleEnabled('activities')) ps.push(activitiesStore.fetchActivities())
    // El stat "Tickets" también lee de issuesStore (Casos) — se carga si cualquiera
    // de los dos módulos está habilitado, para no dejar el stat de Tickets en 0
    // cuando alguien puede verlo pero no tiene permiso/módulo de Casos.
    if ((authStore.canViewCases && authStore.isModuleEnabled('cases')) || (authStore.canViewTickets && authStore.isModuleEnabled('tickets'))) ps.push(issuesStore.fetchIssues())
    if (authStore.canViewTeam && authStore.isModuleEnabled('team')) ps.push(teamStore.fetchTeam())
    await Promise.all(ps)
  } catch (e) { console.error('Error loading dashboard:', e) }
})
</script>

