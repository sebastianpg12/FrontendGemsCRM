<template>
  <div class="flex flex-col gap-3">

    <!-- ══ Header ══════════════════════════════════════════════════════ -->
    <div class="flex items-center justify-between gap-3 flex-wrap pr-12 sm:pr-14">
      <div>
        <div class="flex items-center gap-2 mb-0.5">
          <i class="fas fa-gem text-primary-400 text-[9px]"></i>
          <span class="text-[9px] font-black uppercase tracking-[0.22em] text-primary-400">GEMS CRM</span>
          <span class="w-1 h-1 rounded-full bg-primary-200 inline-block"></span>
          <span class="px-2 py-0.5 bg-primary-50 text-primary-600 text-[9px] font-black rounded-full uppercase tracking-widest">{{ userRoleLabel }}</span>
        </div>
        <h1 class="text-[26px] sm:text-[30px] font-black text-slate-900 tracking-tight leading-tight">
          Hola, {{ firstName }}<span class="text-primary-500">.</span>
        </h1>
        <p class="text-[11px] text-slate-400 mt-0.5 font-medium">
          {{ todayLabel }} ·
          <span v-if="criticalCount > 0" class="text-amber-500 font-black">{{ criticalCount }} {{ criticalCount === 1 ? 'actividad requiere' : 'actividades requieren' }} atención</span>
          <span v-else class="text-emerald-500 font-black">Todo bajo control</span>
        </p>
      </div>

      <!-- Controles -->
      <div class="flex items-center gap-2">
        <!-- Toggle acciones rápidas -->
        <button
          @click="showActions = !showActions"
          class="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[11px] font-black border transition-all duration-200 active:scale-95"
          :class="showActions
            ? 'bg-primary-600 text-white border-primary-600 shadow-lg shadow-primary-500/25'
            : 'bg-white text-slate-600 border-slate-200 hover:border-primary-200 hover:text-primary-600 hover:bg-primary-50'"
        >
          <i class="fas fa-bolt text-[10px]"></i>
          <span class="hidden sm:inline">Acciones</span>
          <i class="fas fa-chevron-down text-[9px] transition-transform duration-200" :class="{ 'rotate-180': showActions }"></i>
        </button>

        <button @click="refreshData" :disabled="isRefreshing"
          class="w-9 h-9 flex items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-400 hover:text-primary-500 hover:border-primary-200 transition-all disabled:opacity-50 shadow-sm shrink-0">
          <i class="fas fa-sync-alt text-[11px]" :class="{ 'animate-spin': isRefreshing }"></i>
        </button>

        <router-link v-if="authStore.canCreateActivities" to="/activities"
          class="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 active:scale-95 text-white rounded-xl text-[12px] font-black shadow-lg shadow-primary-500/20 transition-all shrink-0">
          <i class="fas fa-plus text-[10px]"></i>
          <span class="hidden sm:inline">Nueva actividad</span>
        </router-link>
      </div>
    </div>

    <!-- ══ Acciones rápidas (colapsables, animadas) ══════════════════════ -->
    <Transition name="actions-panel">
      <div v-if="showActions" class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
        <router-link
          v-for="(qa, i) in quickActions"
          :key="qa.label"
          :to="qa.to"
          @click="showActions = false"
          class="group flex flex-col items-center gap-2.5 bg-white border border-slate-100 hover:border-primary-100 hover:shadow-xl hover:shadow-primary-500/8 rounded-2xl px-3 py-4 transition-all duration-200 action-item"
          :style="{ '--delay': `${i * 55}ms` }"
        >
          <div class="w-11 h-11 rounded-2xl flex items-center justify-center transition-all duration-200 group-hover:scale-110 group-hover:-rotate-3" :class="qa.iconBg">
            <i :class="['fas', qa.icon, qa.iconColor, 'text-[15px]']"></i>
          </div>
          <span class="text-[11px] font-black text-slate-700 group-hover:text-primary-600 text-center leading-tight">{{ qa.label }}</span>
        </router-link>
      </div>
    </Transition>

    <!-- ══ Stat cards ════════════════════════════════════════════════════ -->
    <div class="flex gap-2 overflow-x-auto pb-0.5 custom-scrollbar">
      <div v-for="card in statCards" :key="card.label"
        class="bg-white border border-slate-100 rounded-xl px-3 py-2 relative overflow-hidden hover:shadow-md transition-all group cursor-default flex items-center gap-2.5 shrink-0 min-w-[130px]">
        <div class="absolute top-0 left-0 right-0 h-[2px] rounded-t-xl" :class="card.accentBar"></div>
        <div class="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-110" :class="card.iconBg">
          <i :class="['fas', card.icon, card.iconColor, 'text-[11px]']"></i>
        </div>
        <div class="min-w-0">
          <div class="text-[8px] font-black uppercase tracking-[0.15em] text-slate-400 truncate leading-none mb-0.5">{{ card.label }}</div>
          <div class="flex items-baseline gap-1 min-w-0">
            <span class="text-[18px] font-black text-slate-900 leading-none">{{ card.value }}</span>
            <span class="text-[9px] font-black truncate" :class="card.tagColor">{{ card.tag }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- ══ Main grid ═════════════════════════════════════════════════════ -->
    <div class="grid grid-cols-1 xl:grid-cols-3 gap-3">

      <!-- ── Left: AI Insights + Agenda ──────────────────────────────── -->
      <div class="xl:col-span-2 flex flex-col gap-3">

        <AIInsightsWidget />

        <!-- Agenda -->
        <div class="bg-white border border-slate-100 rounded-2xl overflow-hidden">
          <div class="flex items-center justify-between px-5 py-3.5 border-b border-slate-50">
            <div class="flex items-center gap-2.5">
              <div class="w-7 h-7 rounded-xl bg-primary-50 flex items-center justify-center shrink-0">
                <i class="fas fa-calendar-alt text-primary-500 text-[10px]"></i>
              </div>
              <div>
                <div class="text-[9px] font-black uppercase tracking-[0.18em] text-primary-400 leading-none mb-0.5">Agenda operativa</div>
                <div class="text-[13px] font-black text-slate-900 leading-tight">Actividades próximas</div>
              </div>
            </div>
            <router-link to="/activities"
              class="flex items-center gap-1 text-[10px] font-black text-primary-500 hover:text-primary-700 uppercase tracking-widest transition-colors">
              Ver todas <i class="fas fa-arrow-right text-[9px]"></i>
            </router-link>
          </div>

          <div v-if="agendaActivities.length === 0" class="py-8 flex flex-col items-center gap-2">
            <div class="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center">
              <i class="fas fa-calendar-check text-slate-300 text-[13px]"></i>
            </div>
            <p class="text-[11px] text-slate-400 font-black uppercase tracking-wide">Sin actividades próximas</p>
          </div>

          <div v-else class="max-h-[360px] overflow-y-auto custom-scrollbar">
            <div v-for="(act, idx) in agendaActivities" :key="act._id"
              class="flex items-center gap-3 px-5 py-2.5 hover:bg-slate-50/60 transition-colors"
              :class="{ 'border-t border-slate-50/80': idx > 0 }">
              <!-- Priority dot -->
              <div class="w-1.5 h-1.5 rounded-full shrink-0"
                :class="act.priority === 'urgent' ? 'bg-red-500' : act.priority === 'high' ? 'bg-amber-500' : 'bg-primary-400'">
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-[12px] font-black text-slate-800 truncate">{{ act.title }}</p>
                <p class="text-[10px] text-slate-400 font-medium truncate">{{ clientsStore.clients.find(c => c._id === act.clientId)?.name || '—' }}</p>
              </div>
              <span :class="['shrink-0 px-2 py-0.5 rounded-full text-[10px] font-black', agendaStatusClass(act)]">
                {{ agendaStatusLabel(act) }}
              </span>
              <span class="shrink-0 hidden md:flex items-center gap-1 text-[10px] text-slate-400">
                <i class="fas fa-clock text-[8px]"></i>
                {{ formatDateShort(act.dueDate || act.date) }}
              </span>
            </div>
          </div>
        </div>

      </div>

      <!-- ── Right column ─────────────────────────────────────────────── -->
      <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 gap-3">

        <!-- Ritmo del día -->
        <div class="bg-white border border-slate-100 rounded-2xl px-4 py-3.5">
          <div class="flex items-center justify-between mb-2.5 gap-2">
            <div class="min-w-0">
              <div class="text-[9px] font-black uppercase tracking-[0.18em] text-slate-400 mb-0.5">Ritmo del día</div>
              <div class="text-[13px] font-black text-slate-900">Foco operativo</div>
            </div>
            <div class="w-11 h-11 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shrink-0 shadow-md shadow-primary-500/20">
              <span class="text-[13px] font-black text-white leading-none">{{ focusProgress }}%</span>
            </div>
          </div>
          <div class="h-1.5 bg-slate-100 rounded-full overflow-hidden mb-3">
            <div class="h-full bg-gradient-to-r from-primary-400 to-primary-600 rounded-full transition-all duration-700"
              :style="{ width: focusProgress + '%' }"></div>
          </div>
          <div class="grid grid-cols-3 gap-1.5">
            <div class="bg-red-50 rounded-xl px-2 py-2.5 text-center">
              <div class="text-[22px] font-black text-red-500 leading-none">{{ overdueCount }}</div>
              <div class="text-[9px] text-red-400 font-black uppercase tracking-wide mt-0.5">Vencidas</div>
            </div>
            <div class="bg-amber-50 rounded-xl px-2 py-2.5 text-center">
              <div class="text-[22px] font-black text-amber-500 leading-none">{{ todayCount }}</div>
              <div class="text-[9px] text-amber-400 font-black uppercase tracking-wide mt-0.5">Hoy</div>
            </div>
            <div class="bg-primary-50 rounded-xl px-2 py-2.5 text-center">
              <div class="text-[22px] font-black text-primary-500 leading-none">{{ highPriorityCount }}</div>
              <div class="text-[9px] text-primary-400 font-black uppercase tracking-wide mt-0.5">Alta Prio.</div>
            </div>
          </div>
        </div>

        <!-- Pulso comercial -->
        <div class="bg-white border border-slate-100 rounded-2xl px-4 py-3.5">
          <div class="flex items-center gap-2 mb-3">
            <div class="w-6 h-6 rounded-lg bg-amber-50 flex items-center justify-center shrink-0">
              <i class="fas fa-chart-line text-amber-500 text-[10px]"></i>
            </div>
            <div>
              <div class="text-[9px] font-black uppercase tracking-[0.18em] text-slate-400 leading-none mb-0.5">Pulso comercial</div>
              <div class="text-[13px] font-black text-slate-900 leading-tight">Dónde atacar</div>
            </div>
          </div>
          <div class="flex flex-col gap-2.5">
            <div v-for="(item, i) in pulsoItems" :key="i" class="flex items-start gap-2.5">
              <div class="w-6 h-6 rounded-lg bg-slate-50 flex items-center justify-center shrink-0 mt-0.5">
                <i :class="['fas', item.icon, item.color, 'text-[10px]']"></i>
              </div>
              <span class="text-[11px] text-slate-600 leading-snug font-medium">{{ item.text }}</span>
            </div>
          </div>
        </div>

        <!-- Nota de foco GEMS -->
        <div class="sm:col-span-2 xl:col-span-1 rounded-2xl px-4 py-4 text-white relative overflow-hidden"
          style="background: linear-gradient(135deg, #1e1b4b 0%, #3b0764 60%, #1e1b4b 100%);">
          <div class="absolute inset-0 pointer-events-none">
            <div class="absolute top-0 right-0 w-32 h-32 opacity-25" style="background: radial-gradient(circle, #8b5cf6 0%, transparent 70%); transform: translate(20%,-20%)"></div>
            <div class="absolute bottom-0 left-0 w-20 h-20 opacity-15" style="background: radial-gradient(circle, #6366f1 0%, transparent 70%); transform: translate(-25%,25%)"></div>
          </div>
          <div class="relative">
            <div class="flex items-center gap-2 mb-2">
              <div class="w-6 h-6 rounded-lg bg-white/10 flex items-center justify-center">
                <i class="fas fa-gem text-primary-300 text-[9px]"></i>
              </div>
              <span class="text-[9px] font-black uppercase tracking-[0.22em] text-primary-300">GEMS · Nota de foco</span>
            </div>
            <p class="text-[12px] font-medium leading-relaxed text-white/80">{{ focusNote }}</p>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useClientsStore, useActivitiesStore, useIssuesStore, useTeamStore } from '../stores'
import AIInsightsWidget from '../components/AIInsightsWidget.vue'

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

const userRoleLabel = computed(() => ({
  admin: 'Administrador', manager: 'Manager', employee: 'Empleado',
  support: 'Soporte', development: 'Desarrollador', fullstack: 'Fullstack',
  viewer: 'Viewer', client: 'Cliente',
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
    { label: 'Revisar tickets', to: '/tickets', icon: 'fa-ticket-alt', iconBg: 'bg-slate-100 group-hover:bg-slate-200', iconColor: 'text-slate-600', hover: 'hover:border-slate-300', can: authStore.canViewCases },
    { label: 'Nuevo caso', to: '/cases', icon: 'fa-exclamation-circle', iconBg: 'bg-orange-50 group-hover:bg-orange-100', iconColor: 'text-orange-500', hover: 'hover:border-orange-200', can: authStore.canCreateCases },
    { label: 'Gestionar equipo', to: '/team', icon: 'fa-users-cog', iconBg: 'bg-purple-50 group-hover:bg-purple-100', iconColor: 'text-purple-500', hover: 'hover:border-purple-200', can: authStore.canCreateTeam },
  ]
  return all.filter(a => a.can)
})

const statCards = computed(() => {
  const all = [
    { label: 'Clientes', value: clientsStore.clients.length, tag: 'Base', tagColor: 'text-primary-500', icon: 'fa-users', iconBg: 'bg-primary-50', iconColor: 'text-primary-500', accentBar: 'bg-gradient-to-r from-primary-400 to-primary-300', can: authStore.canViewClients },
    { label: 'Actividades', value: activeActivities.value, tag: 'Activas', tagColor: 'text-emerald-500', icon: 'fa-clipboard-list', iconBg: 'bg-emerald-50', iconColor: 'text-emerald-500', accentBar: 'bg-gradient-to-r from-emerald-400 to-emerald-300', can: authStore.canViewActivities },
    { label: 'Casos', value: openCases.value, tag: 'Abiertos', tagColor: 'text-red-500', icon: 'fa-exclamation-triangle', iconBg: 'bg-red-50', iconColor: 'text-red-500', accentBar: 'bg-gradient-to-r from-red-400 to-red-300', can: authStore.canViewCases },
    { label: 'Tickets', value: pendingTickets.value, tag: 'Pendientes', tagColor: 'text-orange-500', icon: 'fa-ticket-alt', iconBg: 'bg-orange-50', iconColor: 'text-orange-500', accentBar: 'bg-gradient-to-r from-orange-400 to-orange-300', can: authStore.canViewCases },
    { label: 'Equipo', value: teamStore.members.length, tag: 'Activos', tagColor: 'text-violet-500', icon: 'fa-user-friends', iconBg: 'bg-violet-50', iconColor: 'text-violet-500', accentBar: 'bg-gradient-to-r from-violet-400 to-violet-300', can: authStore.canViewTeam },
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
  if (d < todayMidnight) return 'bg-red-50 text-red-600'
  if (a.status === 'in-progress') return 'bg-primary-50 text-primary-600'
  return 'bg-amber-50 text-amber-600'
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
