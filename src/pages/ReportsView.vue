<template>
  <div class="p-4 lg:p-8 min-h-screen bg-slate-50 dark:bg-slate-950">
    <div class="max-w-7xl mx-auto">

      <!-- ══ Header ══ -->
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <div class="flex items-center gap-2 mb-1">
            <i class="fas fa-gem text-primary-500 text-xs"></i>
            <h1 class="text-[10px] font-black uppercase tracking-[0.25em] text-primary-600">Reportes &amp; KPIs — Centro de Análisis</h1>
          </div>
          <p class="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">
            <span v-if="data?.meta">Datos del {{ fmtDate(data.meta.from) }} al {{ fmtDate(data.meta.to) }}</span>
            <span v-else>Cargando…</span>
            <span v-if="data?.meta" class="mx-2 text-slate-300">·</span>
            <span v-if="data?.meta" class="text-slate-400">Comparado vs {{ fmtDate(data.meta.prevFrom) }} – {{ fmtDate(data.meta.prevTo) }}</span>
          </p>
        </div>
        <button
          @click="load"
          :disabled="loading"
          class="self-start md:self-auto flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-900 transition-colors disabled:opacity-50"
        >
          <i :class="['fas fa-arrows-rotate text-[11px]', loading && 'fa-spin']"></i>
          Actualizar
        </button>
      </div>

      <!-- ══ Filtros globales ══ -->
      <div class="bg-white dark:bg-[#1e293b] shadow-sm rounded-xl px-4 py-3 mb-5 flex flex-wrap items-center gap-2">
        <span class="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 shrink-0 hidden sm:inline">Filtros</span>
        <div class="h-4 w-px bg-slate-200 dark:bg-slate-700 hidden sm:block"></div>

        <div class="filter-chip" :class="{ 'filter-chip--active': filters.period !== 'month' }">
          <i class="fas fa-calendar-alt"></i>
          <select v-model="filters.period" @change="load">
            <option value="week">Última semana</option>
            <option value="month">Último mes</option>
            <option value="quarter">Último trimestre</option>
            <option value="year">Último año</option>
          </select>
          <i class="fas fa-chevron-down chip-chevron"></i>
        </div>

        <div class="filter-chip" :class="{ 'filter-chip--active': filters.department }">
          <i class="fas fa-building"></i>
          <select v-model="filters.department" @change="load">
            <option value="">Todos los depts.</option>
            <option v-for="d in departments" :key="d" :value="d">{{ d }}</option>
          </select>
          <i class="fas fa-chevron-down chip-chevron"></i>
        </div>

        <div class="filter-chip" :class="{ 'filter-chip--active': filters.ownerId }">
          <i class="fas fa-user"></i>
          <select v-model="filters.ownerId" @change="load">
            <option value="">Todos los responsables</option>
            <option v-for="m in teamMembers" :key="m._id" :value="m._id">{{ m.name }}</option>
          </select>
          <i class="fas fa-chevron-down chip-chevron"></i>
        </div>

        <div class="filter-chip" :class="{ 'filter-chip--active': filters.clientId }">
          <i class="fas fa-briefcase"></i>
          <select v-model="filters.clientId" @change="load">
            <option value="">Todos los clientes</option>
            <option v-for="c in clients" :key="c._id" :value="c._id">{{ c.name }}</option>
          </select>
          <i class="fas fa-chevron-down chip-chevron"></i>
        </div>

        <button
          v-if="hasActiveFilters"
          @click="resetFilters"
          class="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-black text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors uppercase tracking-widest"
        >
          <i class="fas fa-times text-[9px]"></i> Limpiar
        </button>
      </div>

      <!-- ══ Tabs ══ -->
      <div class="flex gap-1 bg-white dark:bg-[#1e293b] shadow-sm rounded-xl p-1 mb-5 w-fit overflow-x-auto max-w-full">
        <button
          v-for="t in tabs"
          :key="t.id"
          @click="activeTab = t.id"
          class="px-4 py-2 rounded-lg text-xs font-bold transition-colors flex items-center gap-2 whitespace-nowrap"
          :class="activeTab === t.id
            ? 'bg-primary-600 text-white'
            : 'text-slate-500 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'"
        >
          <i :class="['fas', t.icon, 'text-[11px]']"></i>
          {{ t.label }}
        </button>
      </div>

      <!-- ══ Loading ══ -->
      <div v-if="loading && !data" class="bg-white dark:bg-slate-900 rounded-xl p-16 text-center text-slate-400">
        <i class="fas fa-circle-notch fa-spin text-3xl mb-3"></i>
        <p class="text-xs font-bold">Generando reporte…</p>
      </div>

      <!-- ══ Error ══ -->
      <div v-else-if="error" class="bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 rounded-xl p-6 text-rose-700 dark:text-rose-300">
        <p class="font-bold text-sm mb-1"><i class="fas fa-triangle-exclamation mr-2"></i>Error al cargar</p>
        <p class="text-xs">{{ error }}</p>
      </div>

      <!-- ══ TAB: RESUMEN EJECUTIVO (operativo) ══ -->
      <div v-else-if="activeTab === 'executive' && data" class="space-y-5">
        <!-- KPIs de rendimiento operativo del período -->
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <KpiCard label="Actividades completadas" icon="fa-circle-check" :value="data.executive.activitiesCompleted" :delta="data.executive.activitiesDelta" :sublabel="`${data.executive.completionRate}% de ${data.executive.activitiesTotal} totales`" />
          <KpiCard label="Tickets resueltos" icon="fa-headset" :value="data.executive.ticketsResolved" :delta="data.executive.ticketsDelta" sublabel="En el período seleccionado" />
          <KpiCard label="Casos cerrados" icon="fa-folder-tree" :value="data.executive.casesClosed" :delta="data.executive.casesDelta" sublabel="Resueltos + cerrados" />
          <KpiCard label="Tiempo prom. resolución" icon="fa-stopwatch" :value="data.executive.avgTicketHrs" unit="hrs" sublabel="De tickets resueltos" />
        </div>

        <!-- Salud de la operación: lo que requiere acción -->
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <KpiCard label="Actividades vencidas" icon="fa-clock-rotate-left" :value="data.executive.overdueActivityCount" :invertDelta="true" sublabel="Requieren atención" />
          <KpiCard label="Tickets fuera de SLA" icon="fa-triangle-exclamation" :value="data.executive.slaBreachCount" :invertDelta="true" sublabel="Más de 2h sin respuesta" />
          <KpiCard label="Clientes en riesgo" icon="fa-circle-exclamation" :value="data.executive.atRiskClientCount" :invertDelta="true" sublabel="Sin actividad 30 días" />
          <KpiCard label="Equipo activo" icon="fa-users" :value="data.executive.teamSize" :sublabel="`${data.executive.totalClients} clientes en cartera`" />
        </div>

        <!-- Cards de adquisición y tendencia -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div class="bg-white dark:bg-slate-900 rounded-xl p-5 lg:col-span-2">
            <div class="flex items-center justify-between mb-3">
              <h3 class="text-sm font-black text-slate-900 dark:text-white">Actividad por semana</h3>
              <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Tendencia del período</span>
            </div>
            <div class="h-40">
              <MiniBarChart :points="weeklyPoints" />
            </div>
          </div>
          <div class="bg-white dark:bg-slate-900 rounded-xl p-5">
            <div class="flex items-center justify-between mb-3">
              <h3 class="text-sm font-black text-slate-900 dark:text-white">Adquisición</h3>
              <TrendBadge v-if="data.executive.clientsDelta !== null" :value="data.executive.clientsDelta" />
            </div>
            <p class="text-4xl font-black text-slate-900 dark:text-white tabular-nums mb-1">{{ data.executive.newClients }}</p>
            <p class="text-[11px] font-bold uppercase tracking-widest text-slate-400">Clientes nuevos</p>
            <div class="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span class="text-[11px] text-slate-500">Cartera total</span>
              <span class="text-sm font-black tabular-nums text-slate-800 dark:text-white">{{ data.executive.totalClients }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- ══ TAB: OPERACIONES ══ -->
      <div v-else-if="activeTab === 'operations' && data" class="space-y-5">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="bg-white dark:bg-slate-900 rounded-xl p-5">
            <h3 class="text-sm font-black text-slate-900 dark:text-white mb-3">Actividades por estado</h3>
            <StatusBars :items="actStatusBars" />
          </div>
          <div class="bg-white dark:bg-slate-900 rounded-xl p-5">
            <h3 class="text-sm font-black text-slate-900 dark:text-white mb-3">Tickets por estado</h3>
            <StatusBars :items="ticketStatusBars" />
          </div>
          <div class="bg-white dark:bg-slate-900 rounded-xl p-5">
            <h3 class="text-sm font-black text-slate-900 dark:text-white mb-3">Casos por estado</h3>
            <StatusBars :items="caseStatusBars" />
          </div>
        </div>

        <DataTable
          title="Actividades vencidas"
          :subtitle="`${data.operations.activitiesOverdue.length} requieren acción`"
          :columns="[
            { key: 'title', label: 'Actividad' },
            { key: 'assignedTo', label: 'Responsable' },
            { key: 'clientId', label: 'Cliente' },
            { key: 'dueDate', label: 'Vencía', align: 'right' },
            { key: 'priority', label: 'Prioridad', align: 'right' }
          ]"
          :rows="data.operations.activitiesOverdue"
        >
          <template #assignedTo="{ value }">
            <span>{{ Array.isArray(value) ? (value as any[]).map(u => u.name).join(', ') : ((value as any)?.name || '—') }}</span>
          </template>
          <template #clientId="{ value }">{{ (value as any)?.name || '—' }}</template>
          <template #dueDate="{ value }">{{ fmtDate(value as string) }}</template>
          <template #priority="{ value }">
            <span class="px-2 py-0.5 rounded text-[10px] font-bold uppercase" :class="priorityClass(value as string)">
              {{ value }}
            </span>
          </template>
        </DataTable>

        <DataTable
          title="Tickets abiertos"
          :columns="[
            { key: 'ticketNumber', label: '#' },
            { key: 'subject', label: 'Asunto' },
            { key: 'submittedBy', label: 'Cliente' },
            { key: 'assignedTo', label: 'Asignado' },
            { key: 'status', label: 'Estado', align: 'right' },
            { key: 'priority', label: 'Prioridad', align: 'right' }
          ]"
          :rows="data.operations.ticketsOpen"
        >
          <template #submittedBy="{ value }">{{ (value as any)?.name || '—' }}</template>
          <template #assignedTo="{ value }">{{ (value as any)?.name || 'Sin asignar' }}</template>
          <template #status="{ value }">
            <span class="px-2 py-0.5 rounded text-[10px] font-bold uppercase" :class="ticketStatusClass(value as string)">{{ value }}</span>
          </template>
          <template #priority="{ value }">
            <span class="px-2 py-0.5 rounded text-[10px] font-bold uppercase" :class="priorityClass(value as string)">{{ value }}</span>
          </template>
        </DataTable>

        <DataTable
          title="Casos abiertos"
          :columns="[
            { key: 'titulo', label: 'Título' },
            { key: 'tipo', label: 'Tipo' },
            { key: 'cliente_id', label: 'Cliente' },
            { key: 'progreso', label: 'Progreso', align: 'right' },
            { key: 'prioridad', label: 'Prioridad', align: 'right' }
          ]"
          :rows="data.operations.casesOpen"
        >
          <template #cliente_id="{ value }">{{ (value as any)?.name || '—' }}</template>
          <template #progreso="{ value }">{{ value ?? 0 }}%</template>
        </DataTable>

        <DataTable
          title="Clientes en riesgo"
          subtitle="Sin actividad registrada en los últimos 30 días"
          :columns="[
            { key: 'name', label: 'Cliente' },
            { key: 'company', label: 'Empresa' },
            { key: 'email', label: 'Email' }
          ]"
          :rows="data.atRiskClients"
        />
      </div>

      <!-- ══ TAB: EQUIPO ══ -->
      <div v-else-if="activeTab === 'team' && data" class="space-y-5">
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <KpiCard label="Miembros" icon="fa-users" :value="data.team.totalMembers" />
          <KpiCard label="Productividad promedio" icon="fa-gauge-high" :value="avgPerMember" sublabel="Actividades por persona" />
          <KpiCard label="Top performer" icon="fa-trophy" :value="topPerformer?.completed || 0" :sublabel="topPerformer?.name || '—'" />
          <KpiCard label="Total vencidas" icon="fa-triangle-exclamation" :value="totalOverdueTeam" :invertDelta="true" sublabel="Acumulado por equipo" />
        </div>

        <DataTable
          title="Productividad por miembro"
          subtitle="Actividades del período, ordenado por volumen"
          :columns="[
            { key: 'name', label: 'Miembro' },
            { key: 'total', label: 'Total', align: 'right' },
            { key: 'completed', label: 'Completadas', align: 'right' },
            { key: 'overdue', label: 'Vencidas', align: 'right' },
            { key: 'rate', label: 'Tasa completado', align: 'right' }
          ]"
          :rows="teamRows"
        >
          <template #name="{ row }">
            <div>
              <p class="font-bold text-slate-800 dark:text-white">{{ row.name || 'Sin asignar' }}</p>
              <p class="text-[10px] text-slate-400">{{ row.email || '—' }}</p>
            </div>
          </template>
          <template #overdue="{ value }">
            <span :class="(value as number) > 0 ? 'text-rose-600 font-bold' : 'text-slate-400'">{{ value }}</span>
          </template>
          <template #rate="{ row }">
            <span class="font-bold" :class="(row.rate as number) >= 70 ? 'text-emerald-600' : (row.rate as number) >= 40 ? 'text-amber-600' : 'text-rose-600'">
              {{ row.rate }}%
            </span>
          </template>
        </DataTable>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import KpiCard from '@/components/reports/KpiCard.vue'
import TrendBadge from '@/components/reports/TrendBadge.vue'
import MiniBarChart from '@/components/reports/MiniBarChart.vue'
import StatusBars from '@/components/reports/StatusBars.vue'
import DataTable from '@/components/reports/DataTable.vue'
import { reportsOverviewService, type OverviewData, type OverviewFilters } from '@/services/reportsOverviewService'
import { clientService } from '@/services/clientService'
import { teamService } from '@/services/teamService'

const data = ref<OverviewData | null>(null)
const loading = ref(false)
const error = ref<string | null>(null)
const activeTab = ref<'executive' | 'operations' | 'team'>('executive')

const filters = reactive<OverviewFilters>({
  period: 'month',
  department: '',
  ownerId: '',
  clientId: ''
})

const tabs = [
  { id: 'executive',   label: 'Resumen ejecutivo', icon: 'fa-chart-pie' },
  { id: 'operations',  label: 'Operaciones',       icon: 'fa-list-check' },
  { id: 'team',        label: 'Equipo',            icon: 'fa-users-gear' }
] as const

const clients = ref<any[]>([])
const teamMembers = ref<any[]>([])
const departments = ref<string[]>([])

async function load() {
  loading.value = true
  error.value = null
  try {
    data.value = await reportsOverviewService.fetch(filters)
  } catch (err: any) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}

async function loadDimensions() {
  try {
    const [cl, team] = await Promise.all([
      clientService.getAll().catch(() => []),
      teamService.getAll().catch(() => [])
    ])
    clients.value = cl || []
    teamMembers.value = team || []
    const set = new Set<string>()
    teamMembers.value.forEach((m: any) => { if (m.department) set.add(m.department) })
    departments.value = Array.from(set).sort()
  } catch {}
}

function resetFilters() {
  filters.period = 'month'
  filters.department = ''
  filters.ownerId = ''
  filters.clientId = ''
  load()
}

const hasActiveFilters = computed(() =>
  filters.period !== 'month' || !!filters.department || !!filters.ownerId || !!filters.clientId
)

// ── Derivados para charts ──
const statusPalette: Record<string, { bar: string; dot: string }> = {
  pending:     { bar: 'bg-slate-400',   dot: 'bg-slate-400' },
  'in-progress':{ bar: 'bg-amber-500',  dot: 'bg-amber-500' },
  completed:   { bar: 'bg-emerald-500', dot: 'bg-emerald-500' },
  cancelled:   { bar: 'bg-slate-300',   dot: 'bg-slate-300' },
  overdue:     { bar: 'bg-rose-500',    dot: 'bg-rose-500' },
  new:         { bar: 'bg-sky-500',     dot: 'bg-sky-500' },
  open:        { bar: 'bg-amber-500',   dot: 'bg-amber-500' },
  waiting:     { bar: 'bg-violet-500',  dot: 'bg-violet-500' },
  resolved:    { bar: 'bg-emerald-500', dot: 'bg-emerald-500' },
  closed:      { bar: 'bg-slate-400',   dot: 'bg-slate-400' },
  abierto:     { bar: 'bg-sky-500',     dot: 'bg-sky-500' },
  en_progreso: { bar: 'bg-amber-500',   dot: 'bg-amber-500' },
  resuelto:    { bar: 'bg-emerald-500', dot: 'bg-emerald-500' },
  cerrado:     { bar: 'bg-slate-400',   dot: 'bg-slate-400' },
  nuevo:       { bar: 'bg-sky-500',     dot: 'bg-sky-500' },
  calificado:  { bar: 'bg-amber-500',   dot: 'bg-amber-500' },
  propuesta:   { bar: 'bg-violet-500',  dot: 'bg-violet-500' },
  seguimiento: { bar: 'bg-cyan-500',    dot: 'bg-cyan-500' },
  ganado:      { bar: 'bg-emerald-500', dot: 'bg-emerald-500' },
  perdido:     { bar: 'bg-rose-500',    dot: 'bg-rose-500' }
}

const toStatusBars = (obj: Record<string, number>) => Object.entries(obj).map(([k, v]) => ({
  label: k,
  value: v,
  dotClass: statusPalette[k]?.dot || 'bg-slate-400',
  barClass: statusPalette[k]?.bar || 'bg-slate-400'
}))

const actStatusBars    = computed(() => data.value ? toStatusBars(data.value.operations.activitiesByStatus) : [])
const ticketStatusBars = computed(() => data.value ? toStatusBars(data.value.operations.ticketsByStatus) : [])
const caseStatusBars   = computed(() => data.value ? toStatusBars(data.value.operations.casesByStatus) : [])

const weeklyPoints = computed(() => {
  if (!data.value) return []
  return data.value.timeseries.weeklyActivity.map(w => ({
    label: fmtDate(w.week, { day: '2-digit', month: 'short' }),
    value: w.created
  }))
})

const teamRows = computed(() => {
  if (!data.value) return []
  return data.value.team.byOwner.map(o => ({
    ...o,
    rate: o.total > 0 ? Math.round((o.completed / o.total) * 1000) / 10 : 0
  }))
})

const avgPerMember = computed(() => {
  if (!data.value || !data.value.team.totalMembers) return 0
  const total = data.value.team.byOwner.reduce((s, o) => s + o.total, 0)
  return Math.round(total / data.value.team.totalMembers)
})

const topPerformer = computed(() => {
  if (!data.value) return null
  return [...data.value.team.byOwner].sort((a, b) => b.completed - a.completed)[0] || null
})

const totalOverdueTeam = computed(() => {
  if (!data.value) return 0
  return data.value.team.byOwner.reduce((s, o) => s + (o.overdue || 0), 0)
})

// ── Helpers de formato ──
function fmtDate(d?: string, opts: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'short', year: 'numeric' }) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('es-CR', opts)
}

function priorityClass(p: string) {
  return ({
    urgent:   'bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300',
    critica:  'bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300',
    high:     'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300',
    alta:     'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300',
    medium:   'bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300',
    media:    'bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300',
    low:      'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300',
    baja:     'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
  } as Record<string, string>)[p] || 'bg-slate-100 text-slate-600'
}

function ticketStatusClass(s: string) {
  return ({
    new:      'bg-sky-100 text-sky-700',
    open:     'bg-amber-100 text-amber-700',
    waiting:  'bg-violet-100 text-violet-700',
    resolved: 'bg-emerald-100 text-emerald-700',
    closed:   'bg-slate-100 text-slate-600'
  } as Record<string, string>)[s] || 'bg-slate-100 text-slate-600'
}

onMounted(async () => {
  await loadDimensions()
  await load()
})
</script>

<style scoped>
/* ── Filter chips ── */
.filter-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: rgb(248 250 252);
  border: 1px solid rgb(226 232 240);
  border-radius: 999px;
  padding: 0 12px 0 10px;
  height: 32px;
  transition: all 0.15s;
  cursor: pointer;
  font-size: 0.7rem;
  color: rgb(100 116 139);
  color-scheme: light;
}
.filter-chip i:first-child { font-size: 0.6rem; }
.filter-chip:hover { border-color: rgb(148 163 184); background: rgb(241 245 249); }
.filter-chip:focus-within { border-color: rgb(99 102 241); background: rgb(238 242 255); color: rgb(79 70 229); }
.filter-chip--active { border-color: rgb(139 92 246); background: rgb(245 243 255); color: rgb(109 40 217); }

.filter-chip select {
  background: transparent;
  border: none;
  outline: none;
  cursor: pointer;
  appearance: none;
  -webkit-appearance: none;
  font-size: 0.72rem;
  font-weight: 700;
  color: inherit;
  max-width: 160px;
}
.chip-chevron { font-size: 0.5rem; opacity: 0.5; }

:global(.dark) .filter-chip {
  background: rgb(30 41 59);
  border-color: rgb(51 65 85);
  color: rgb(148 163 184);
  color-scheme: dark;
}
:global(.dark) .filter-chip:hover { background: rgb(37 50 71); }
:global(.dark) .filter-chip:focus-within { background: rgb(49 46 129 / 0.25); border-color: rgb(139 92 246); color: rgb(167 139 250); }
:global(.dark) .filter-chip--active { background: rgb(76 29 149 / 0.2); border-color: rgb(139 92 246); color: rgb(167 139 250); }
:global(.dark) .filter-chip select { color: inherit; background: transparent; }
</style>
