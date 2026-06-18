<template>
  <div class="dp-root" ref="root">
    <!-- Trigger -->
    <button
      type="button"
      class="dp-trigger"
      :class="{ 'dp-trigger--open': open, 'dp-trigger--filled': modelValue }"
      @click.stop="open = !open"
    >
      <i class="fas fa-calendar-alt dp-icon"></i>
      <span class="dp-value" :class="{ 'dp-value--placeholder': !modelValue }">
        {{ displayValue }}
      </span>
      <i v-if="modelValue" class="fas fa-times dp-clear" @click.stop="clear" title="Borrar"></i>
    </button>

    <Transition name="dp-drop">
      <div v-if="open" class="dp-panel" @click.stop>
        <!-- Header: month navigation -->
        <div class="dp-header">
          <button type="button" class="dp-nav" @click="prevMonth">
            <i class="fas fa-chevron-left"></i>
          </button>
          <span class="dp-month-label">{{ monthLabel }}</span>
          <button type="button" class="dp-nav" @click="nextMonth">
            <i class="fas fa-chevron-right"></i>
          </button>
        </div>

        <!-- Weekday headers -->
        <div class="dp-weekdays">
          <span v-for="d in WEEK_DAYS" :key="d">{{ d }}</span>
        </div>

        <!-- Days grid -->
        <div class="dp-days">
          <button
            v-for="day in calendarDays"
            :key="day.key"
            type="button"
            class="dp-day"
            :class="{
              'dp-day--other': day.otherMonth,
              'dp-day--today': day.isToday,
              'dp-day--selected': day.isSelected,
            }"
            @click="selectDay(day)"
          >{{ day.num }}</button>
        </div>

        <!-- Footer -->
        <div class="dp-footer">
          <button type="button" class="dp-footer-btn" @click="clear">Borrar</button>
          <button type="button" class="dp-footer-btn dp-footer-today" @click="selectToday">Hoy</button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

const props = withDefaults(defineProps<{
  modelValue: string
  placeholder?: string
}>(), {
  placeholder: 'dd/mm/aaaa'
})

const emit = defineEmits(['update:modelValue'])

const WEEK_DAYS = ['DO', 'LU', 'MA', 'MI', 'JU', 'VI', 'SA']
const MONTHS = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre']

const root = ref<HTMLElement | null>(null)
const open = ref(false)
const today = new Date()

const parseDate = (s: string) => {
  if (!s) return null
  const d = new Date(s + 'T12:00:00')
  return isNaN(d.getTime()) ? null : d
}

const viewYear = ref(parseDate(props.modelValue)?.getFullYear() ?? today.getFullYear())
const viewMonth = ref(parseDate(props.modelValue)?.getMonth() ?? today.getMonth())

const displayValue = computed(() => {
  const d = parseDate(props.modelValue)
  if (!d) return props.placeholder
  return d.toLocaleDateString('es-CO', { day: '2-digit', month: '2-digit', year: 'numeric' })
})

const monthLabel = computed(() => `${MONTHS[viewMonth.value]} de ${viewYear.value}`)

interface CalDay { key: string; num: number; date: Date; otherMonth: boolean; isToday: boolean; isSelected: boolean }

const calendarDays = computed((): CalDay[] => {
  const first = new Date(viewYear.value, viewMonth.value, 1)
  const last = new Date(viewYear.value, viewMonth.value + 1, 0)
  const days: CalDay[] = []

  // Pad from Sunday
  for (let i = 0; i < first.getDay(); i++) {
    const d = new Date(viewYear.value, viewMonth.value, -i)
    const pad = new Date(viewYear.value, viewMonth.value, 1 - first.getDay() + i)
    days.push(mkDay(pad, true))
  }
  for (let d = 1; d <= last.getDate(); d++) {
    days.push(mkDay(new Date(viewYear.value, viewMonth.value, d), false))
  }
  // Pad to end
  const remaining = 42 - days.length
  for (let d = 1; d <= remaining; d++) {
    days.push(mkDay(new Date(viewYear.value, viewMonth.value + 1, d), true))
  }
  return days
})

function mkDay(date: Date, otherMonth: boolean): CalDay {
  const sel = parseDate(props.modelValue)
  const isToday = date.toDateString() === today.toDateString()
  const isSelected = !!sel && date.toDateString() === sel.toDateString()
  return { key: date.toISOString().slice(0, 10), num: date.getDate(), date, otherMonth, isToday, isSelected }
}

function prevMonth() {
  if (viewMonth.value === 0) { viewMonth.value = 11; viewYear.value-- }
  else viewMonth.value--
}
function nextMonth() {
  if (viewMonth.value === 11) { viewMonth.value = 0; viewYear.value++ }
  else viewMonth.value++
}

function selectDay(day: CalDay) {
  if (day.otherMonth) return
  emit('update:modelValue', day.key)
  open.value = false
}

function selectToday() {
  const key = today.toISOString().slice(0, 10)
  emit('update:modelValue', key)
  viewYear.value = today.getFullYear()
  viewMonth.value = today.getMonth()
  open.value = false
}

function clear() {
  emit('update:modelValue', '')
  open.value = false
}

function onClickOutside(e: MouseEvent) {
  if (root.value && !root.value.contains(e.target as Node)) open.value = false
}

onMounted(() => document.addEventListener('click', onClickOutside))
onUnmounted(() => document.removeEventListener('click', onClickOutside))
</script>

<style scoped>
.dp-root { position: relative; display: inline-block; width: 100%; }

.dp-trigger {
  display: flex; align-items: center; gap: 6px;
  width: 100%; height: 34px; padding: 0 10px;
  border-radius: 8px; border: 1px solid #e2e8f0;
  background: #f8fafc; cursor: pointer;
  font-size: 11px; font-weight: 600; color: #94a3b8;
  transition: all 0.15s; outline: none;
}
.dp-trigger:hover { border-color: #c4b5fd; background: #faf5ff; }
.dp-trigger--open { border-color: var(--brand-accent); box-shadow: 0 0 0 3px rgba(var(--brand-accent-rgb), 0.12); background: #fff; }
.dp-trigger--filled { color: #475569; }
.dp-icon { font-size: 10px; color: var(--brand-accent); flex-shrink: 0; }
.dp-value { flex: 1; text-align: left; font-size: 11px; }
.dp-value--placeholder { color: #94a3b8; }
.dp-clear { font-size: 9px; color: #94a3b8; flex-shrink: 0; padding: 2px 4px; border-radius: 4px; }
.dp-clear:hover { color: #ef4444; background: #fee2e2; }

/* Dark trigger */
:global(.dark) .dp-trigger {
  background: #1e293b; border-color: #334155; color: #94a3b8;
}
:global(.dark) .dp-trigger:hover { border-color: #7c3aed; background: #273449; }
:global(.dark) .dp-trigger--open { background: #273449; border-color: var(--brand-accent); }
:global(.dark) .dp-trigger--filled { color: #e2e8f0; }

/* Panel */
.dp-panel {
  position: absolute; top: calc(100% + 6px); left: 0; z-index: 200;
  width: 260px; background: #fff; border: 1px solid #e2e8f0;
  border-radius: 14px; box-shadow: 0 8px 32px -8px rgba(0,0,0,0.18), 0 2px 8px -2px rgba(0,0,0,0.08);
  overflow: hidden;
}
:global(.dark) .dp-panel {
  background: #1e293b; border-color: #334155;
  box-shadow: 0 8px 32px rgba(0,0,0,0.45);
}

/* Header */
.dp-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 10px 12px 6px; border-bottom: 1px solid #f1f5f9;
}
:global(.dark) .dp-header { border-color: #334155; }
.dp-nav {
  width: 26px; height: 26px; border-radius: 7px;
  display: flex; align-items: center; justify-content: center;
  font-size: 9px; color: #64748b; transition: all 0.12s; cursor: pointer;
}
.dp-nav:hover { background: #f1f5f9; color: var(--brand-accent); }
:global(.dark) .dp-nav { color: #94a3b8; }
:global(.dark) .dp-nav:hover { background: #273449; }
.dp-month-label {
  font-size: 12px; font-weight: 800; color: #1e293b;
  text-transform: capitalize; letter-spacing: -0.01em;
}
:global(.dark) .dp-month-label { color: #e2e8f0; }

/* Weekdays */
.dp-weekdays {
  display: grid; grid-template-columns: repeat(7, 1fr);
  padding: 6px 8px 2px; gap: 2px;
}
.dp-weekdays span {
  text-align: center; font-size: 9px; font-weight: 800;
  text-transform: uppercase; color: #94a3b8; padding: 2px 0;
}

/* Days grid */
.dp-days {
  display: grid; grid-template-columns: repeat(7, 1fr);
  padding: 2px 8px 8px; gap: 2px;
}
.dp-day {
  height: 30px; border-radius: 7px; font-size: 11px; font-weight: 600;
  color: #374151; cursor: pointer; transition: all 0.12s;
  display: flex; align-items: center; justify-content: center;
}
.dp-day:hover:not(.dp-day--other):not(.dp-day--selected) {
  background: #f1f5f9; color: var(--brand-accent);
}
:global(.dark) .dp-day { color: #cbd5e1; }
:global(.dark) .dp-day:hover:not(.dp-day--other):not(.dp-day--selected) {
  background: #273449;
}
.dp-day--other { color: #cbd5e1; cursor: default; opacity: 0.4; }
:global(.dark) .dp-day--other { color: #475569; }

.dp-day--today {
  color: var(--brand-accent); font-weight: 800;
  box-shadow: inset 0 0 0 1.5px rgba(var(--brand-accent-rgb), 0.4);
}
.dp-day--selected {
  background: var(--brand-accent) !important;
  color: #fff !important; font-weight: 800;
  box-shadow: 0 2px 8px -2px rgba(var(--brand-accent-rgb), 0.5);
}

/* Footer */
.dp-footer {
  display: flex; align-items: center; justify-content: space-between;
  padding: 8px 12px; border-top: 1px solid #f1f5f9;
}
:global(.dark) .dp-footer { border-color: #334155; }
.dp-footer-btn {
  font-size: 11px; font-weight: 700; color: #64748b;
  padding: 4px 10px; border-radius: 7px; cursor: pointer; transition: all 0.12s;
}
.dp-footer-btn:hover { background: #f1f5f9; color: #374151; }
:global(.dark) .dp-footer-btn { color: #94a3b8; }
:global(.dark) .dp-footer-btn:hover { background: #273449; color: #e2e8f0; }
.dp-footer-today { color: var(--brand-accent) !important; font-weight: 800; }
.dp-footer-today:hover { background: rgba(var(--brand-accent-rgb), 0.08) !important; }

/* Transition */
.dp-drop-enter-active { transition: all 0.18s cubic-bezier(0.16, 1, 0.3, 1); }
.dp-drop-leave-active { transition: all 0.12s ease-in; }
.dp-drop-enter-from { opacity: 0; transform: translateY(-6px) scale(0.97); }
.dp-drop-leave-to { opacity: 0; transform: translateY(-4px) scale(0.97); }
</style>
