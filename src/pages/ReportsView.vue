<template>
  <div class="p-4 lg:p-8 min-h-screen bg-slate-50 dark:bg-slate-950">
    <div class="max-w-7xl mx-auto">

      <!-- ══ Header ══ -->
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <div class="flex items-center gap-2 mb-1">
            <i class="fas fa-gem text-primary-500 text-xs"></i>
            <h1 class="text-[12px] font-black uppercase tracking-[0.25em] text-primary-600">Reportes &amp; KPIs — Centro de Análisis</h1>
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
          <i :class="['fas fa-arrows-rotate text-[13px]', loading && 'fa-spin']"></i>
          Actualizar
        </button>
      </div>

      <!-- ══ Filtros globales ══ -->
      <div class="bg-white dark:bg-[#1e293b] shadow-sm rounded-xl px-4 py-3 mb-5 flex flex-wrap items-center gap-2">
        <span class="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 shrink-0 hidden sm:inline">Filtros</span>
        <div class="h-4 w-px bg-slate-200 dark:bg-slate-700 hidden sm:block"></div>

        <div class="filter-chip" :class="{ 'filter-chip--active': filters.period !== 'month' }" @click.stop="toggleReportChip('period')">
          <i class="fas fa-calendar-alt"></i>
          <span class="chip-label">{{ periodLabel }}</span>
          <i class="fas fa-chevron-down chip-chevron" :class="{ 'rotate-180': openReportChip === 'period' }"></i>
          <div v-if="openReportChip === 'period'" class="chip-dropdown" @click.stop>
            <div v-for="opt in periodOptions" :key="opt.value"
              class="chip-dropdown-item" :class="{ 'chip-dropdown-item--active': filters.period === opt.value }"
              @click="setReportFilter('period', opt.value)">
              <span>{{ opt.label }}</span>
              <i v-if="filters.period === opt.value" class="fas fa-check text-[12px] text-primary-500"></i>
            </div>
          </div>
        </div>

        <div class="filter-chip" :class="{ 'filter-chip--active': filters.department }" @click.stop="toggleReportChip('dept')">
          <i class="fas fa-building"></i>
          <span class="chip-label">{{ deptLabel }}</span>
          <i class="fas fa-chevron-down chip-chevron" :class="{ 'rotate-180': openReportChip === 'dept' }"></i>
          <div v-if="openReportChip === 'dept'" class="chip-dropdown" @click.stop>
            <div class="chip-dropdown-item" :class="{ 'chip-dropdown-item--active': !filters.department }" @click="setReportFilter('dept', '')">
              <span>Todos</span><i v-if="!filters.department" class="fas fa-check text-[12px] text-primary-500"></i>
            </div>
            <div v-for="d in departments" :key="d"
              class="chip-dropdown-item" :class="{ 'chip-dropdown-item--active': filters.department === d }"
              @click="setReportFilter('dept', d)">
              <span>{{ d }}</span><i v-if="filters.department === d" class="fas fa-check text-[12px] text-primary-500"></i>
            </div>
          </div>
        </div>

        <div class="filter-chip" :class="{ 'filter-chip--active': filters.ownerId }" @click.stop="toggleReportChip('owner')">
          <i class="fas fa-user"></i>
          <span class="chip-label">{{ ownerLabel }}</span>
          <i class="fas fa-chevron-down chip-chevron" :class="{ 'rotate-180': openReportChip === 'owner' }"></i>
          <div v-if="openReportChip === 'owner'" class="chip-dropdown" @click.stop>
            <div class="chip-dropdown-item" :class="{ 'chip-dropdown-item--active': !filters.ownerId }" @click="setReportFilter('owner', '')">
              <span>Todos</span><i v-if="!filters.ownerId" class="fas fa-check text-[12px] text-primary-500"></i>
            </div>
            <div v-for="m in teamMembers" :key="m._id"
              class="chip-dropdown-item" :class="{ 'chip-dropdown-item--active': filters.ownerId === m._id }"
              @click="setReportFilter('owner', m._id)">
              <span>{{ m.name }}</span><i v-if="filters.ownerId === m._id" class="fas fa-check text-[12px] text-primary-500"></i>
            </div>
          </div>
        </div>

        <div class="filter-chip" :class="{ 'filter-chip--active': filters.clientId }" @click.stop="toggleReportChip('client')">
          <i class="fas fa-briefcase"></i>
          <span class="chip-label">{{ clientLabel }}</span>
          <i class="fas fa-chevron-down chip-chevron" :class="{ 'rotate-180': openReportChip === 'client' }"></i>
          <div v-if="openReportChip === 'client'" class="chip-dropdown chip-dropdown--end" @click.stop>
            <div class="chip-dropdown-item" :class="{ 'chip-dropdown-item--active': !filters.clientId }" @click="setReportFilter('client', '')">
              <span>Todos</span><i v-if="!filters.clientId" class="fas fa-check text-[12px] text-primary-500"></i>
            </div>
            <div v-for="c in clients" :key="c._id"
              class="chip-dropdown-item" :class="{ 'chip-dropdown-item--active': filters.clientId === c._id }"
              @click="setReportFilter('client', c._id)">
              <span>{{ c.name }}</span><i v-if="filters.clientId === c._id" class="fas fa-check text-[12px] text-primary-500"></i>
            </div>
          </div>
        </div>

        <button
          v-if="hasActiveFilters"
          @click="resetFilters"
          class="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-black text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors uppercase tracking-widest"
        >
          <i class="fas fa-times text-[11px]"></i> Limpiar
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
          <i :class="['fas', t.icon, 'text-[13px]']"></i>
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
              <span class="text-[12px] font-bold text-slate-400 uppercase tracking-widest">Tendencia del período</span>
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
            <p class="text-[13px] font-bold uppercase tracking-widest text-slate-400">Clientes nuevos</p>
            <div class="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span class="text-[13px] text-slate-500">Cartera total</span>
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
            <span class="px-2 py-0.5 rounded text-[12px] font-bold uppercase" :class="priorityClass(value as string)">
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
            <span class="px-2 py-0.5 rounded text-[12px] font-bold uppercase" :class="ticketStatusClass(value as string)">{{ value }}</span>
          </template>
          <template #priority="{ value }">
            <span class="px-2 py-0.5 rounded text-[12px] font-bold uppercase" :class="priorityClass(value as string)">{{ value }}</span>
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
              <p class="text-[12px] text-slate-400">{{ row.email || '—' }}</p>
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
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'
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

// ── Chip dropdowns ────────────────────────────────────────────────────
const openReportChip = ref<string | null>(null)
const toggleReportChip = (name: string) => { openReportChip.value = openReportChip.value === name ? null : name }
const closeReportChips = () => { openReportChip.value = null }
const setReportFilter = (chip: string, value: string) => {
  if (chip === 'period')  filters.period     = value as any
  if (chip === 'dept')    filters.department = value
  if (chip === 'owner')   filters.ownerId    = value
  if (chip === 'client')  filters.clientId   = value
  openReportChip.value = null
  load()
}
const periodOptions = [
  { value: 'week', label: 'Última semana' }, { value: 'month', label: 'Último mes' },
  { value: 'quarter', label: 'Último trimestre' }, { value: 'year', label: 'Último año' }
]
const periodLabel  = computed(() => periodOptions.find(o => o.value === filters.period)?.label || 'Último mes')
const deptLabel    = computed(() => filters.department || 'Todos los depts.')
const ownerLabel   = computed(() => teamMembers.value.find((m: any) => m._id === filters.ownerId)?.name || 'Todos los responsables')
const clientLabel  = computed(() => clients.value.find((c: any) => c._id === filters.clientId)?.name || 'Todos los clientes')

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
  document.addEventListener('click', closeReportChips)
  await loadDimensions()
  await load()
})
onUnmounted(() => { document.removeEventListener('click', closeReportChips) })
</script>

<style scoped>
/* ── Filter chips ── */
.filter-chip {
  position: relative; display: inline-flex; align-items: center; gap: 6px;
  background: rgb(248 250 252); border: 1px solid rgb(226 232 240);
  border-radius: 999px; padding: 0 12px 0 10px; height: 32px;
  transition: all 0.15s; cursor: pointer;
  font-size: 0.7rem; color: rgb(100 116 139);
}
.filter-chip i:first-child { font-size: 0.6rem; }
.filter-chip:hover { border-color: rgb(148 163 184); background: rgb(241 245 249); }
.filter-chip--active { border-color: rgb(139 92 246); background: rgb(245 243 255); color: rgb(109 40 217); }
.chip-label { font-size: 0.72rem; font-weight: 700; color: inherit; white-space: nowrap; max-width: 150px; overflow: hidden; text-overflow: ellipsis; }
.chip-chevron { font-size: 0.5rem; opacity: 0.5; transition: transform 0.2s; }
.chip-dropdown {
  position: absolute; top: calc(100% + 6px); left: 0;
  min-width: 180px; z-index: 100;
  background: #fff; border: 1px solid rgb(226 232 240);
  border-radius: 0.75rem; box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  padding: 4px; overflow: hidden; max-height: 240px; overflow-y: auto;
}
.chip-dropdown--end { left: auto; right: 0; }
.chip-dropdown-item {
  display: flex; align-items: center; justify-content: space-between;
  padding: 6px 10px; border-radius: 0.5rem;
  font-size: 0.72rem; font-weight: 600; color: rgb(51 65 85);
  cursor: pointer; transition: background 0.12s; user-select: none;
}
.chip-dropdown-item:hover { background: rgb(248 250 252); }
.chip-dropdown-item--active { background: rgb(238 242 255); color: rgb(79 70 229); }
</style>

<style>
.dark .filter-chip { background: rgb(30 41 59); border-color: rgb(51 65 85); color: rgb(148 163 184); }
.dark .filter-chip:hover { background: rgb(37 50 71); }
.dark .filter-chip--active { background: rgb(76 29 149 / 0.2); border-color: rgb(139 92 246); color: rgb(167 139 250); }
.dark .chip-dropdown { background: rgb(22 34 52); border-color: rgb(51 65 85); box-shadow: 0 2px 12px rgba(0,0,0,0.35); }
.dark .chip-dropdown-item { color: rgb(148 163 184); }
.dark .chip-dropdown-item:hover { background: rgb(37 50 71); color: rgb(203 213 225); }
.dark .chip-dropdown-item--active { background: rgb(49 46 129 / 0.3); color: rgb(167 139 250); }
</style>
