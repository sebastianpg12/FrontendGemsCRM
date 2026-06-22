<template>
  <div class="flex flex-col gap-3 relative pt-3">
    <!-- Glow de fondo GEMS -->
    <div class="pointer-events-none fixed top-0 right-0 w-[500px] h-[400px] opacity-[0.035] -z-0"
      style="background: radial-gradient(ellipse at top right, var(--brand-accent) 0%, transparent 70%)"></div>

    <!-- ══ Header ══════════════════════════════════════════════════════ -->
    <div class="flex items-center justify-between gap-3 flex-wrap relative z-[50]">
      <div>
        <div class="flex items-center gap-2 mb-0.5">
          <i class="fas fa-gem text-primary-400 text-[11px] animate-pulse-slow"></i>
          <span class="text-[11px] font-black uppercase tracking-[0.22em] text-primary-400">GEMS Hub</span>
          <span class="w-1 h-1 rounded-full bg-primary-200 inline-block"></span>
          <span class="px-2 py-0.5 bg-primary-50 dark:bg-primary-500/20 text-primary-600 dark:text-primary-400 text-[11px] font-black rounded-full uppercase tracking-widest">{{ userRoleLabel }}</span>
        </div>
        <h1 class="text-[26px] sm:text-[30px] font-black tracking-tight leading-tight gems-title">
          Hola, {{ firstName }}<span class="text-primary-500">.</span>
        </h1>
        <p class="text-[13px] text-slate-400 mt-0.5 font-medium">
          {{ todayLabel }} ·
          <span v-if="criticalCount > 0" class="text-amber-500 font-black">{{ criticalCount }} {{ criticalCount === 1 ? 'actividad requiere' : 'actividades requieren' }} atención</span>
          <span v-else class="text-emerald-500 font-black">Todo bajo control</span>
        </p>
      </div>

      <!-- Controles -->
      <div class="flex items-center gap-2 relative z-[50]">
        <!-- Toggle acciones rápidas -->
        <button
          @click="showActions = !showActions"
          class="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[13px] font-black border transition-all duration-200 active:scale-95"
          :class="showActions
            ? 'bg-primary-600 text-white border-primary-600 shadow-lg shadow-primary-500/25'
            : 'bg-white dark:bg-[#1e293b] text-slate-600 dark:text-slate-300 border-slate-200 dark:border-[#334155] hover:text-primary-600 hover:bg-primary-50'"
        >
          <i class="fas fa-bolt text-[12px]"></i>
          <span class="hidden sm:inline">Acciones</span>
          <i class="fas fa-chevron-down text-[11px] transition-transform duration-200" :class="{ 'rotate-180': showActions }"></i>
        </button>

<router-link v-if="authStore.canCreateActivities" to="/activities"
          class="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 active:scale-95 text-white rounded-xl text-[14px] font-black shadow-lg shadow-primary-500/20 transition-all shrink-0">
          <i class="fas fa-plus text-[12px]"></i>
          <span class="hidden sm:inline">Nueva actividad</span>
        </router-link>

        <!-- Acciones rápidas — dropdown flotante -->
        <Transition
          enter-active-class="transition ease-out duration-150"
          enter-from-class="opacity-0 translate-y-1 scale-95"
          enter-to-class="opacity-100 translate-y-0 scale-100"
          leave-active-class="transition ease-in duration-100"
          leave-from-class="opacity-100 translate-y-0 scale-100"
          leave-to-class="opacity-0 translate-y-1 scale-95"
        >
          <div v-if="showActions"
            class="absolute top-full right-0 mt-1.5 bg-white dark:bg-[#1e293b] rounded-xl shadow-xl border border-slate-100 dark:border-[#334155] p-2.5 w-[280px] sm:w-[340px] origin-top-right">
            <p class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 px-1 mb-2">Acciones rápidas</p>
            <div class="grid grid-cols-3 sm:grid-cols-4 gap-1.5">
              <router-link
                v-for="qa in quickActions"
                :key="qa.label"
                :to="qa.to"
                @click="showActions = false"
                class="group flex flex-col items-center gap-1.5 rounded-xl px-1.5 py-2.5 transition-all duration-150 hover:bg-slate-50 dark:hover:bg-[#0f172a]"
              >
                <div class="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-150 group-hover:scale-110" :class="qa.iconBg">
                  <i :class="['fas', qa.icon, qa.iconColor, 'text-[14px]']"></i>
                </div>
                <span class="text-[11px] font-black text-slate-600 dark:text-slate-300 group-hover:text-primary-600 text-center leading-tight">{{ qa.label }}</span>
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
      <div class="grid grid-cols-3 gap-2">
        <div class="bg-white dark:bg-[#1e293b] shadow-sm rounded-xl py-3 px-3 flex items-center gap-2.5">
          <div class="w-7 h-7 rounded-lg bg-red-50 dark:bg-red-500/10 flex items-center justify-center shrink-0">
            <i class="fas fa-exclamation text-red-500 text-[12px]"></i>
          </div>
          <div>
            <span class="block text-[18px] font-black leading-none text-red-500">{{ overdueCount }}</span>
            <span class="block text-[11px] font-black uppercase tracking-wide text-slate-400 mt-0.5">Vencidas</span>
          </div>
        </div>
        <div class="bg-white dark:bg-[#1e293b] shadow-sm rounded-xl py-3 px-3 flex items-center gap-2.5">
          <div class="w-7 h-7 rounded-lg bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center shrink-0">
            <i class="fas fa-calendar-day text-amber-500 text-[12px]"></i>
          </div>
          <div>
            <span class="block text-[18px] font-black leading-none text-amber-500">{{ todayCount }}</span>
            <span class="block text-[11px] font-black uppercase tracking-wide text-slate-400 mt-0.5">Para hoy</span>
          </div>
        </div>
        <div class="bg-white dark:bg-[#1e293b] shadow-sm rounded-xl py-3 px-3 flex items-center gap-2.5">
          <div class="w-7 h-7 rounded-lg bg-primary-50 dark:bg-primary-500/10 flex items-center justify-center shrink-0">
            <i class="fas fa-flag text-primary-500 text-[12px]"></i>
          </div>
          <div>
            <span class="block text-[18px] font-black leading-none text-primary-500">{{ highPriorityCount }}</span>
            <span class="block text-[11px] font-black uppercase tracking-wide text-slate-400 mt-0.5">Alta prioridad</span>
          </div>
        </div>
      </div>

      <!-- Lista de actividades -->
      <div class="bg-white dark:bg-[#1e293b] shadow-sm rounded-xl overflow-hidden">
        <div class="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-[#334155]">
          <div class="flex items-center gap-2">
            <div class="w-6 h-6 rounded-lg bg-primary-50 dark:bg-primary-500/20 flex items-center justify-center">
              <i class="fas fa-tasks text-primary-500 text-[11px]"></i>
            </div>
            <div>
              <div class="text-[10px] font-black uppercase tracking-[0.18em] text-primary-400 leading-none">Mi trabajo</div>
              <div class="text-[14px] font-black text-slate-900 dark:text-slate-100 leading-tight">Actividades pendientes</div>
            </div>
          </div>
          <router-link to="/activities"
            class="flex items-center gap-1 text-[11px] font-black text-primary-500 hover:text-primary-700 uppercase tracking-widest transition-colors">
            Ver todas <i class="fas fa-arrow-right text-[10px]"></i>
          </router-link>
        </div>

        <div v-if="agendaActivities.length === 0" class="flex flex-col items-center justify-center gap-2 py-12">
          <div class="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-[#334155] flex items-center justify-center">
            <i class="fas fa-check-circle text-slate-300 dark:text-slate-500 text-[15px]"></i>
          </div>
          <p class="text-[13px] text-slate-400 font-black uppercase tracking-wide">Sin actividades pendientes</p>
          <router-link v-if="authStore.canCreateActivities" to="/activities"
            class="mt-1 px-3 py-1.5 bg-primary-600 text-white rounded-lg text-[13px] font-black hover:bg-primary-700 transition-colors">
            Crear actividad
          </router-link>
        </div>

        <div v-else>
          <div v-for="(act, idx) in agendaActivities" :key="act._id"
            class="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-[#0f172a] transition-colors border-l-[3px]"
            :class="[
              idx > 0 ? 'border-t border-slate-50 dark:border-[#334155]' : '',
              act.priority === 'urgent' ? 'border-l-red-400' : act.priority === 'high' ? 'border-l-amber-400' : 'border-l-slate-200'
            ]">
            <div class="flex-1 min-w-0">
              <p class="text-[14px] font-black text-slate-800 dark:text-slate-200 truncate">{{ act.title }}</p>
              <p class="text-[12px] text-slate-400 mt-0.5 truncate">
                <i class="fas fa-clock text-[10px] mr-1"></i>{{ formatDateShort(act.dueDate || act.date) }}
              </p>
            </div>
            <span :class="['shrink-0 px-2 py-1 rounded-lg text-[11px] font-black', agendaStatusClass(act)]">
              {{ agendaStatusLabel(act) }}
            </span>
          </div>
        </div>
      </div>

    </template>

    <!-- ══ Vista ADMIN / resto de roles ════════════════════════════════ -->
    <template v-else>

    <!-- Stat cards -->
    <div class="overflow-x-auto pb-0.5">
    <div class="grid gap-1 min-w-0" :style="`grid-template-columns: repeat(${statCards.length}, minmax(60px, 1fr))`">
      <div v-for="card in statCards" :key="card.label"
        class="bg-white dark:bg-[#1e293b] shadow-sm rounded-xl py-2 px-2 flex items-center gap-2 min-w-0 cursor-default transition-all duration-150">
        <div class="w-6 h-6 rounded-lg flex items-center justify-center shrink-0" :class="card.iconBg">
          <i :class="['fas', card.icon, card.iconColor, 'text-[12px]']"></i>
        </div>
        <div class="min-w-0">
          <span class="block text-[17px] font-black leading-none" :class="card.iconColor">{{ card.value }}</span>
          <span class="block text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 truncate leading-tight mt-0.5">{{ card.label }}</span>
        </div>
      </div>
    </div>
    </div>

    <!-- Main grid -->
    <div class="grid grid-cols-1 xl:grid-cols-3 gap-2 xl:h-[300px]">

      <!-- Left: AI Insights + Agenda -->
      <div class="xl:col-span-2 h-full min-h-0">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-2 h-full">
          <div class="h-full min-h-0 overflow-hidden">
            <AIInsightsWidget class="h-full" />
          </div>

          <div class="bg-white dark:bg-[#1e293b] shadow-sm rounded-xl overflow-hidden flex flex-col h-full min-h-0">
            <div class="flex items-center justify-between px-3 py-2 shrink-0">
              <div class="flex items-center gap-2">
                <div class="w-6 h-6 rounded-lg bg-primary-50 dark:bg-primary-500/20 flex items-center justify-center shrink-0">
                  <i class="fas fa-calendar-alt text-primary-500 text-[11px]"></i>
                </div>
                <div>
                  <div class="text-[10px] font-black uppercase tracking-[0.18em] text-primary-400 leading-none">Agenda operativa</div>
                  <div class="text-[14px] font-black text-slate-900 dark:text-slate-100 leading-tight">Actividades próximas</div>
                </div>
              </div>
              <router-link to="/activities"
                class="flex items-center gap-1 text-[11px] font-black text-primary-500 hover:text-primary-700 uppercase tracking-widest transition-colors shrink-0">
                Ver todas <i class="fas fa-arrow-right text-[10px]"></i>
              </router-link>
            </div>
            <div v-if="agendaActivities.length === 0" class="flex-1 flex flex-col items-center justify-center gap-2 py-8">
              <div class="w-9 h-9 rounded-2xl bg-slate-100 dark:bg-[#334155] flex items-center justify-center">
                <i class="fas fa-calendar-check text-slate-300 dark:text-slate-500 text-[14px]"></i>
              </div>
              <p class="text-[12px] text-slate-400 font-black uppercase tracking-wide">Sin actividades</p>
            </div>
            <div v-else class="flex-1 overflow-y-auto custom-scrollbar">
              <div v-for="(act, idx) in agendaActivities" :key="act._id"
                class="flex items-center gap-2.5 px-4 py-2 hover:bg-primary-50/30 dark:hover:bg-primary-500/10 transition-colors border-l-[3px]"
                :class="[
                  { 'border-t border-slate-50': idx > 0 },
                  act.priority === 'urgent' ? 'border-l-red-400' : act.priority === 'high' ? 'border-l-amber-400' : 'border-l-slate-100'
                ]">
                <div class="flex-1 min-w-0">
                  <p class="text-[13px] font-black text-slate-800 dark:text-slate-200 truncate">{{ act.title }}</p>
                  <p class="text-[12px] text-slate-400 truncate">{{ clientsStore.clients.find(c => c._id === act.clientId)?.name || '—' }}</p>
                </div>
                <span :class="['shrink-0 px-2 py-0.5 rounded-full text-[11px] font-black', agendaStatusClass(act)]">
                  {{ agendaStatusLabel(act) }}
                </span>
                <span class="shrink-0 hidden lg:flex items-center gap-1 text-[11px] text-slate-400">
                  <i class="fas fa-clock text-[10px]"></i>
                  {{ formatDateShort(act.dueDate || act.date) }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Right column -->
      <div class="flex flex-col gap-2 h-full min-h-0">
        <div class="bg-white dark:bg-[#1e293b] shadow-sm rounded-xl px-3 py-2 shrink-0 flex items-center gap-3">
          <div class="w-6 h-6 rounded-lg bg-primary-50 dark:bg-primary-500/20 flex items-center justify-center shrink-0">
            <i class="fas fa-fire text-primary-500 text-[11px]"></i>
          </div>
          <div class="hidden sm:block shrink-0">
            <div class="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 leading-none">Ritmo</div>
            <div class="text-[13px] font-black text-slate-800 dark:text-slate-100 leading-tight">Foco operativo</div>
          </div>
          <div class="flex-1 flex items-center gap-1.5 min-w-0">
            <div class="flex-1 h-1 bg-slate-200 dark:bg-slate-600 rounded-full overflow-hidden">
              <div class="h-full bg-primary-500 rounded-full transition-all duration-700" :style="{ width: focusProgress + '%' }"></div>
            </div>
            <span class="text-[11px] font-black text-primary-500 shrink-0">{{ focusProgress }}%</span>
          </div>
          <div class="flex items-center gap-1.5 shrink-0">
            <div class="flex flex-col items-center px-2 py-1 bg-red-50 dark:bg-red-500/10 rounded-lg">
              <span class="text-[14px] font-black text-red-500 leading-none">{{ overdueCount }}</span>
              <span class="text-[9px] font-black uppercase text-red-400 tracking-wide leading-none mt-0.5">Venc.</span>
            </div>
            <div class="flex flex-col items-center px-2 py-1 bg-amber-50 dark:bg-amber-500/10 rounded-lg">
              <span class="text-[14px] font-black text-amber-500 leading-none">{{ todayCount }}</span>
              <span class="text-[9px] font-black uppercase text-amber-400 tracking-wide leading-none mt-0.5">Hoy</span>
            </div>
            <div class="flex flex-col items-center px-2 py-1 bg-primary-50 dark:bg-primary-500/10 rounded-lg">
              <span class="text-[14px] font-black text-primary-500 leading-none">{{ highPriorityCount }}</span>
              <span class="text-[9px] font-black uppercase text-primary-400 tracking-wide leading-none mt-0.5">Alta</span>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-[#1e293b] shadow-sm rounded-xl px-3 py-2.5 flex-1 min-h-0 overflow-y-auto custom-scrollbar">
          <div class="flex items-center gap-1.5 mb-2">
            <i class="fas fa-chart-line text-amber-500 text-[11px]"></i>
            <span class="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">Pulso comercial</span>
          </div>
          <div class="flex flex-col gap-1.5">
            <div v-for="(item, i) in pulsoItems" :key="i" class="flex items-start gap-2">
              <i :class="['fas', item.icon, item.color, 'text-[11px] mt-0.5 shrink-0']"></i>
              <span class="text-[12px] text-slate-500 dark:text-slate-400 leading-snug">{{ item.text }}</span>
            </div>
          </div>
        </div>

        <div class="flex items-start gap-2 px-3 py-1.5 bg-primary-50 dark:bg-primary-500/10 rounded-xl shrink-0">
          <i class="fas fa-gem text-primary-400 text-[11px] mt-0.5 shrink-0"></i>
          <p class="text-[12px] font-medium leading-relaxed text-slate-500 dark:text-slate-400">{{ focusNote }}</p>
        </div>
      </div>
    </div>

    <!-- Tendencia semanal -->
    <WeeklyTrendCard v-if="authStore.canViewActivities" class="relative z-10" />

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
const focusProgress = computed(() => {
  const total = activitiesStore.activities.length
  if (!total) return 0
  return Math.round(activitiesStore.activities.filter((a: any) => a.status === 'completed').length / total * 100)
})

const quickActions = computed(() => {
  const all = [
    { label: 'Nuevo cliente', to: '/clients', icon: 'fa-user-plus', iconBg: 'bg-primary-50 group-hover:bg-primary-100', iconColor: 'text-primary-500', hover: 'hover:border-primary-200', can: authStore.canCreateClients },
    { label: 'Nueva actividad', to: '/activities', icon: 'fa-plus-circle', iconBg: 'bg-green-50 group-hover:bg-green-100', iconColor: 'text-green-500', hover: 'hover:border-green-200', can: authStore.canCreateActivities },
    { label: 'Revisar tickets', to: '/tickets', icon: 'fa-ticket-alt', iconBg: 'bg-blue-50 group-hover:bg-blue-100', iconColor: 'text-blue-500', hover: 'hover:border-blue-200', can: authStore.canViewCases },
    { label: 'Nuevo caso', to: '/cases', icon: 'fa-exclamation-circle', iconBg: 'bg-orange-50 group-hover:bg-orange-100', iconColor: 'text-orange-500', hover: 'hover:border-orange-200', can: authStore.canCreateCases },
    { label: 'Gestionar equipo', to: '/team', icon: 'fa-users-cog', iconBg: 'bg-purple-50 group-hover:bg-purple-100', iconColor: 'text-purple-500', hover: 'hover:border-primary-200', can: authStore.canCreateTeam },
  ]
  return all.filter(a => a.can)
})

const statCards = computed(() => {
  const all = [
    { label: 'Clientes', value: clientsStore.clients.length, tag: 'Base', tagColor: 'text-primary-500', icon: 'fa-users', iconBg: 'bg-primary-50', iconColor: 'text-primary-500', accentBar: 'bg-gradient-to-r from-primary-400 to-primary-300', can: authStore.canViewClients },
    { label: 'Actividades', value: activeActivities.value, tag: 'Activas', tagColor: 'text-emerald-500', icon: 'fa-clipboard-list', iconBg: 'bg-emerald-50', iconColor: 'text-emerald-500', accentBar: 'bg-gradient-to-r from-emerald-400 to-emerald-300', can: authStore.canViewActivities },
    { label: 'Casos', value: openCases.value, tag: 'Abiertos', tagColor: 'text-red-500', icon: 'fa-exclamation-triangle', iconBg: 'bg-red-50', iconColor: 'text-red-500', accentBar: 'bg-gradient-to-r from-red-400 to-red-300', can: authStore.canViewCases },
    { label: 'Tickets', value: pendingTickets.value, tag: 'Pendientes', tagColor: 'text-orange-500', icon: 'fa-ticket-alt', iconBg: 'bg-orange-50', iconColor: 'text-orange-500', accentBar: 'bg-gradient-to-r from-orange-400 to-orange-300', can: authStore.canViewCases },
    { label: 'Equipo', value: teamStore.members.length, tag: 'Activos', tagColor: 'text-primary-500', icon: 'fa-user-friends', iconBg: 'bg-primary-50', iconColor: 'text-primary-500', accentBar: 'bg-gradient-to-r from-primary-400 to-primary-300', can: authStore.canViewTeam },
  ]
  return all.filter(s => s.can)
})

const agendaActivities = computed(() => {
  const list = [...activitiesStore.activities]
    .filter((a: any) => a.status !== 'completed' && a.status !== 'cancelled')
    .sort((a: any, b: any) => new Date(a.dueDate || a.date).getTime() - new Date(b.dueDate || b.date).getTime())
  return list.slice(0, 20)
})

const pulsoItems = computed(() => {
  const items: { icon: string; color: string; text: string }[] = []
  if (overdueCount.value > 0)
    items.push({ icon: 'fa-bolt', color: 'text-amber-500', text: 'Recupera primero las actividades vencidas antes de abrir nuevos frentes.' })
  if (pendingTickets.value > 0 || openCases.value > 0) {
    const n = pendingTickets.value + openCases.value
    items.push({ icon: 'fa-chart-bar', color: 'text-slate-500', text: `${n} ${n === 1 ? 'caso/ticket activo puede afectar' : 'casos/tickets activos pueden afectar'} experiencia de clientes.` })
  }
  if (highPriorityCount.value > 0)
    items.push({ icon: 'fa-check-circle', color: 'text-emerald-500', text: 'Ataca actividades urgentes o de alta prioridad en bloque.' })
  if (items.length === 0)
    items.push({ icon: 'fa-check-circle', color: 'text-emerald-500', text: 'Todo bajo control. Aprovecha para planear la siguiente semana.' })
  return items
})

const focusNote = computed(() => {
  if (criticalCount.value > 0)
    return 'Prioriza seguimientos con fecha, casos abiertos y tickets sin resolver. El dashboard debe servir para decidir, no para decorar.'
  return 'Aprovecha esta calma para revisar pipeline, planear seguimientos y consolidar relaciones con clientes clave.'
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
    if (authStore.canViewActivities) ps.push(activitiesStore.fetchActivities())
    if (authStore.canViewCases) ps.push(issuesStore.fetchIssues())
    if (authStore.canViewTeam) ps.push(teamStore.fetchTeam())
    await Promise.all(ps)
  } finally { isRefreshing.value = false }
}

onMounted(async () => {
  try {
    const ps: Promise<any>[] = []
    if (authStore.canViewClients) ps.push(clientsStore.fetchClients())
    if (authStore.canViewActivities) ps.push(activitiesStore.fetchActivities())
    if (authStore.canViewCases) ps.push(issuesStore.fetchIssues())
    if (authStore.canViewTeam) ps.push(teamStore.fetchTeam())
    await Promise.all(ps)
  } catch (e) { console.error('Error loading dashboard:', e) }
})
</script>

<style scoped>
/* Título con shimmer sutil */
.gems-title {
  background: linear-gradient(90deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.gems-title span {
  -webkit-text-fill-color: var(--brand-accent);
}

/* Panel de acciones: slide-down con fade */
.actions-panel-enter-active {
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}
.actions-panel-leave-active {
  transition: all 0.18s ease-in;
}
.actions-panel-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}
.actions-panel-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

/* Stagger de cada card dentro del panel */
.action-item {
  animation: action-pop 0.3s cubic-bezier(0.16, 1, 0.3, 1) both;
  animation-delay: var(--delay, 0ms);
}

@keyframes action-pop {
  from {
    opacity: 0;
    transform: translateY(-8px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
</style>
