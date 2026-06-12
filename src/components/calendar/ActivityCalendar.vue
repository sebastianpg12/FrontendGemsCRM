<template>
  <div class="bg-white dark:bg-[#1e293b] rounded-xl shadow-sm overflow-hidden">
    <!-- Barra superior -->
    <div class="flex flex-wrap items-center justify-between gap-3 px-4 py-3 border-b border-slate-100 dark:border-[#334155]">
      <div class="flex items-center gap-2">
        <button class="nav-btn" title="Anterior" @click="navigate(-1)">
          <i class="fas fa-chevron-left text-[10px]"></i>
        </button>
        <button class="nav-btn" title="Siguiente" @click="navigate(1)">
          <i class="fas fa-chevron-right text-[10px]"></i>
        </button>
        <button class="today-btn" @click="goToday">Hoy</button>
        <h2 class="text-[15px] font-black text-slate-800 dark:text-slate-100 tracking-tight ml-1 capitalize">
          {{ periodLabel }}
        </h2>
      </div>

      <!-- Conmutador de vista -->
      <div class="flex items-center bg-slate-50 dark:bg-[#0f172a] rounded-lg p-0.5">
        <button
          v-for="v in views"
          :key="v.id"
          class="px-3 h-7 rounded-md text-[11px] font-bold transition-all"
          :class="view === v.id
            ? 'bg-white dark:bg-[#1e293b] text-primary-600 dark:text-primary-300 shadow-sm'
            : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'"
          @click="view = v.id"
        >
          {{ v.label }}
        </button>
      </div>
    </div>

    <!-- ═══════════ MES ═══════════ -->
    <div v-if="view === 'month'" class="p-3">
      <div class="grid grid-cols-7 gap-1 mb-1">
        <div v-for="d in weekDays" :key="d" class="py-1.5 text-center text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
          {{ d }}
        </div>
      </div>
      <div class="grid grid-cols-7 gap-1">
        <div
          v-for="(day, i) in monthDays"
          :key="i"
          class="group min-h-[104px] rounded-lg border p-1.5 flex flex-col transition-colors cursor-pointer"
          :class="[
            day.inMonth ? 'bg-white dark:bg-[#1e293b] border-slate-100 dark:border-[#334155] hover:bg-slate-50 dark:hover:bg-[#273449]'
                        : 'bg-slate-50/60 dark:bg-[#0f172a]/40 border-transparent',
            isToday(day.date) ? 'ring-1 ring-primary-400 ring-inset border-primary-200' : ''
          ]"
          @click="emitQuickTask(day.date)"
        >
          <div class="flex items-center justify-between mb-1">
            <span
              class="text-[11px]"
              :class="[
                day.inMonth ? 'text-slate-700 dark:text-slate-200 font-black' : 'text-slate-300 dark:text-slate-600 font-bold',
                isToday(day.date) ? 'w-5 h-5 flex items-center justify-center bg-primary-600 text-white rounded-full' : ''
              ]"
            >{{ day.date.getDate() }}</span>
            <button
              class="w-5 h-5 hidden group-hover:flex items-center justify-center rounded-md text-slate-300 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-500/10 transition-colors"
              title="Nueva actividad"
              @click.stop="emitQuickTask(day.date)"
            >
              <i class="fas fa-plus text-[8px]"></i>
            </button>
          </div>
          <div class="space-y-0.5 flex-1">
            <button
              v-for="a in activitiesForDay(day.date).slice(0, 3)"
              :key="a._id"
              class="w-full text-left px-1.5 py-0.5 rounded text-[9px] font-bold truncate border-l-2 transition-colors"
              :class="chipClass(a)"
              :title="a.title"
              @click.stop="emitView(a)"
            >
              {{ timePrefix(a) }}{{ a.title }}
            </button>
            <button
              v-if="activitiesForDay(day.date).length > 3"
              class="text-[9px] font-black text-primary-600 dark:text-primary-300 pl-1.5 hover:underline"
              @click.stop="openDay(day.date)"
            >
              +{{ activitiesForDay(day.date).length - 3 }} más
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- ═══════════ SEMANA ═══════════ -->
    <div v-else-if="view === 'week'" class="flex flex-col max-h-[640px]">
      <!-- Cabecera de días -->
      <div class="grid border-b border-slate-100 dark:border-[#334155]" :style="gridCols">
        <div class="border-r border-slate-100 dark:border-[#334155]"></div>
        <div
          v-for="day in weekRange"
          :key="day.toISOString()"
          class="py-2 text-center border-r border-slate-100 dark:border-[#334155] last:border-r-0"
          :class="isToday(day) ? 'bg-primary-50/60 dark:bg-primary-500/5' : ''"
        >
          <p class="text-[9px] font-black uppercase tracking-widest" :class="isToday(day) ? 'text-primary-600 dark:text-primary-300' : 'text-slate-400 dark:text-slate-500'">
            {{ weekDays[day.getDay()] }}
          </p>
          <p class="text-[15px] font-black mt-0.5" :class="isToday(day) ? 'text-primary-600 dark:text-primary-300' : 'text-slate-700 dark:text-slate-200'">
            {{ day.getDate() }}
          </p>
        </div>
      </div>

      <!-- Fila todo-el-día -->
      <div v-if="weekHasAllDay" class="grid border-b border-slate-100 dark:border-[#334155]" :style="gridCols">
        <div class="flex items-center justify-end pr-2 py-1.5 border-r border-slate-100 dark:border-[#334155]">
          <span class="text-[8px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-widest">Todo el día</span>
        </div>
        <div
          v-for="day in weekRange"
          :key="'ad-' + day.toISOString()"
          class="p-1 space-y-0.5 border-r border-slate-100 dark:border-[#334155] last:border-r-0 min-h-[28px]"
          :class="isToday(day) ? 'bg-primary-50/30 dark:bg-primary-500/5' : ''"
        >
          <button
            v-for="a in allDayFor(day)"
            :key="a._id"
            class="w-full text-left px-1.5 py-0.5 rounded text-[9px] font-bold truncate border-l-2 transition-colors"
            :class="chipClass(a)"
            :title="a.title"
            @click="emitView(a)"
          >{{ a.title }}</button>
        </div>
      </div>

      <!-- Rejilla horaria -->
      <div class="overflow-y-auto custom-scrollbar">
        <div class="grid" :style="gridCols">
          <!-- Columna de horas -->
          <div class="border-r border-slate-100 dark:border-[#334155]">
            <div v-for="h in hours" :key="h" class="h-12 relative">
              <span class="absolute -top-1.5 right-2 text-[8px] font-black text-slate-300 dark:text-slate-600">{{ hourLabel(h) }}</span>
            </div>
          </div>
          <!-- Columnas de días -->
          <div
            v-for="day in weekRange"
            :key="'col-' + day.toISOString()"
            class="border-r border-slate-100 dark:border-[#334155] last:border-r-0 relative"
            :class="isToday(day) ? 'bg-primary-50/20 dark:bg-primary-500/5' : ''"
          >
            <div
              v-for="h in hours"
              :key="h"
              class="h-12 border-b border-slate-50 dark:border-[#0f172a] hover:bg-slate-50 dark:hover:bg-[#273449] cursor-pointer transition-colors"
              @click="emitQuickTask(atHour(day, h))"
            ></div>
            <!-- Eventos posicionados -->
            <button
              v-for="ev in timedFor(day)"
              :key="ev.a._id"
              class="absolute left-1 right-1 rounded-md px-1.5 py-1 text-[9px] font-bold border-l-2 overflow-hidden text-left shadow-sm transition-transform hover:scale-[1.02] hover:z-10"
              :class="chipClass(ev.a)"
              :style="{ top: ev.top + 'px', height: ev.height + 'px' }"
              :title="ev.a.title"
              @click.stop="emitView(ev.a)"
            >
              <span class="block truncate">{{ ev.a.title }}</span>
              <span class="block text-[8px] opacity-70">{{ hourLabel(eventHour(ev.a)) }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- ═══════════ DÍA ═══════════ -->
    <div v-else class="flex flex-col max-h-[640px]">
      <div v-if="dayAllDay.length" class="px-4 py-2 border-b border-slate-100 dark:border-[#334155] flex flex-wrap gap-1.5 items-center">
        <span class="text-[8px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-widest mr-1">Todo el día</span>
        <button
          v-for="a in dayAllDay"
          :key="a._id"
          class="px-2 py-0.5 rounded-md text-[9px] font-bold border-l-2 transition-colors"
          :class="chipClass(a)"
          @click="emitView(a)"
        >{{ a.title }}</button>
      </div>
      <div class="overflow-y-auto custom-scrollbar">
        <div class="relative">
          <div
            v-for="h in hours"
            :key="h"
            class="flex border-b border-slate-50 dark:border-[#0f172a] hover:bg-slate-50 dark:hover:bg-[#273449] cursor-pointer transition-colors group"
            @click="emitQuickTask(atHour(currentDate, h))"
          >
            <div class="w-16 shrink-0 py-2 pr-3 text-right border-r border-slate-100 dark:border-[#334155]">
              <span class="text-[9px] font-black text-slate-300 dark:text-slate-600">{{ hourLabel(h) }}</span>
            </div>
            <div class="flex-1 min-h-[52px] py-1 px-2 space-y-1">
              <button
                v-for="a in dayTimedForHour(h)"
                :key="a._id"
                class="w-full text-left px-2.5 py-1.5 rounded-lg text-[11px] font-bold border-l-2 transition-colors"
                :class="chipClass(a)"
                @click.stop="emitView(a)"
              >
                <span class="block truncate">{{ a.title }}</span>
                <span class="block text-[9px] font-medium opacity-70">{{ assigneeName(a) }}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Leyenda -->
    <div class="flex flex-wrap gap-x-4 gap-y-1.5 px-4 py-2.5 border-t border-slate-100 dark:border-[#334155]">
      <span v-for="s in legend" :key="s.label" class="flex items-center gap-1.5">
        <span class="w-2.5 h-2.5 rounded" :class="s.dot"></span>
        <span class="text-[9px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">{{ s.label }}</span>
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Activity, TeamMember } from '../../types'

interface Props {
  activities: Activity[]
  clients: any[]
  teamMembers: TeamMember[]
}
const props = defineProps<Props>()

const emit = defineEmits<{
  quickTask: [date: Date]
  viewActivity: [activity: Activity]
}>()

type View = 'month' | 'week' | 'day'
const view = ref<View>('month')
const views: { id: View; label: string }[] = [
  { id: 'month', label: 'Mes' },
  { id: 'week', label: 'Semana' },
  { id: 'day', label: 'Día' },
]

const currentDate = ref(new Date())
const weekDays = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']
const months = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre']

// Rango horario visible (7:00 – 21:00)
const START_HOUR = 7
const END_HOUR = 21
const HOUR_PX = 48
const hours = Array.from({ length: END_HOUR - START_HOUR + 1 }, (_, i) => START_HOUR + i)

const gridCols = { gridTemplateColumns: '52px repeat(7, minmax(0, 1fr))' }

const legend = [
  { label: 'Pendiente', dot: 'bg-amber-500' },
  { label: 'En proceso', dot: 'bg-blue-500' },
  { label: 'Completada', dot: 'bg-emerald-500' },
  { label: 'Vencida', dot: 'bg-rose-500' },
  { label: 'Cancelada', dot: 'bg-slate-400' },
]

// ── Etiqueta del periodo ──
const periodLabel = computed(() => {
  const d = currentDate.value
  if (view.value === 'month') return `${months[d.getMonth()]} ${d.getFullYear()}`
  if (view.value === 'day') return `${d.getDate()} de ${months[d.getMonth()]} ${d.getFullYear()}`
  const range = weekRange.value
  const a = range[0], b = range[6]
  if (a.getMonth() === b.getMonth()) return `${a.getDate()} – ${b.getDate()} ${months[a.getMonth()]}`
  return `${a.getDate()} ${months[a.getMonth()].slice(0, 3)} – ${b.getDate()} ${months[b.getMonth()].slice(0, 3)}`
})

// ── Navegación ──
const navigate = (dir: number) => {
  const d = new Date(currentDate.value)
  if (view.value === 'month') d.setMonth(d.getMonth() + dir)
  else if (view.value === 'week') d.setDate(d.getDate() + dir * 7)
  else d.setDate(d.getDate() + dir)
  currentDate.value = d
}
const goToday = () => { currentDate.value = new Date() }

const openDay = (date: Date) => {
  currentDate.value = new Date(date)
  view.value = 'day'
}

// ── Mes ──
const monthDays = computed(() => {
  const year = currentDate.value.getFullYear()
  const month = currentDate.value.getMonth()
  const first = new Date(year, month, 1)
  const start = new Date(first)
  start.setDate(start.getDate() - first.getDay())
  const days: { date: Date; inMonth: boolean }[] = []
  const cur = new Date(start)
  for (let i = 0; i < 42; i++) {
    days.push({ date: new Date(cur), inMonth: cur.getMonth() === month })
    cur.setDate(cur.getDate() + 1)
  }
  return days
})

// ── Semana ──
const weekRange = computed(() => {
  const d = new Date(currentDate.value)
  d.setDate(d.getDate() - d.getDay())
  return Array.from({ length: 7 }, (_, i) => {
    const day = new Date(d)
    day.setDate(d.getDate() + i)
    return day
  })
})

// ── Helpers de fecha ──
const sameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()

const isToday = (d: Date) => sameDay(d, new Date())

const activitiesForDay = (date: Date) =>
  props.activities.filter(a => a.date && sameDay(new Date(a.date), date))

// Una actividad es "todo el día" si su hora es 00:00 (no se fijó hora concreta)
const hasTime = (a: Activity) => {
  const d = new Date(a.date)
  return d.getHours() !== 0 || d.getMinutes() !== 0
}
const eventHour = (a: Activity) => Math.min(Math.max(new Date(a.date).getHours(), START_HOUR), END_HOUR)

const allDayFor = (date: Date) => activitiesForDay(date).filter(a => !hasTime(a))
const timedFor = (date: Date) =>
  activitiesForDay(date)
    .filter(hasTime)
    .map(a => {
      const d = new Date(a.date)
      const minutesFromStart = (d.getHours() - START_HOUR) * 60 + d.getMinutes()
      return { a, top: Math.max(0, (minutesFromStart / 60) * HOUR_PX), height: HOUR_PX - 4 }
    })

const weekHasAllDay = computed(() => weekRange.value.some(d => allDayFor(d).length > 0))

const dayAllDay = computed(() => allDayFor(currentDate.value))
const dayTimedForHour = (h: number) =>
  activitiesForDay(currentDate.value).filter(a => hasTime(a) && eventHour(a) === h)

const atHour = (date: Date, h: number) => {
  const d = new Date(date)
  d.setHours(h, 0, 0, 0)
  return d
}

const hourLabel = (h: number) => `${String(h).padStart(2, '0')}:00`
const timePrefix = (a: Activity) => hasTime(a) ? `${String(new Date(a.date).getHours()).padStart(2, '0')}:${String(new Date(a.date).getMinutes()).padStart(2, '0')} ` : ''

// ── Color por estado (convención del sistema) ──
const isOverdue = (a: Activity) =>
  a.status === 'pending' && new Date(a.dueDate || a.date) < new Date()

const chipClass = (a: Activity) => {
  if (a.status === 'completed') return 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500 hover:bg-emerald-100 dark:hover:bg-emerald-500/20'
  if (a.status === 'cancelled') return 'bg-slate-100 dark:bg-slate-500/10 text-slate-500 dark:text-slate-400 border-slate-400 line-through'
  if (a.status === 'in-progress') return 'bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500 hover:bg-blue-100 dark:hover:bg-blue-500/20'
  if (isOverdue(a)) return 'bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500 hover:bg-rose-100 dark:hover:bg-rose-500/20'
  return 'bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500 hover:bg-amber-100 dark:hover:bg-amber-500/20'
}

const assigneeName = (a: Activity): string => {
  const assigned = a.assignedTo
  if (Array.isArray(assigned) && assigned.length) {
    const first = assigned[0] as any
    if (typeof first === 'string') return props.teamMembers.find(m => m._id === first)?.name || 'Sin asignar'
    if (first?.name) return first.name
  }
  return 'Sin asignar'
}

const emitQuickTask = (date: Date) => emit('quickTask', date)
const emitView = (a: Activity) => emit('viewActivity', a)
</script>

<style scoped>
.nav-btn {
  width: 32px;
  height: 32px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  color: #94a3b8;
  transition: all 0.15s ease;
}
.nav-btn:hover {
  background: #f1f5f9;
  color: #4f46e5;
}
.dark .nav-btn:hover {
  background: #273449;
  color: #a5b4fc;
}

.today-btn {
  height: 32px;
  padding: 0 14px;
  border-radius: 8px;
  background: #f1f5f9;
  color: #475569;
  font-size: 11px;
  font-weight: 700;
  transition: all 0.15s ease;
}
.today-btn:hover {
  background: #e2e8f0;
  color: #0f172a;
}
.dark .today-btn {
  background: #0f172a;
  color: #cbd5e1;
}
.dark .today-btn:hover {
  background: #273449;
}

.custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
.dark .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; }
</style>
