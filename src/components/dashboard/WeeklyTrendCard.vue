<template>
  <div class="bg-white dark:bg-[#1e293b] rounded-xl px-4 py-3.5">
    <!-- Header patrón unificado -->
    <div class="flex items-center justify-between mb-1">
      <div class="flex items-center gap-2">
        <div class="w-6 h-6 rounded-lg bg-primary-50 dark:bg-primary-500/10 flex items-center justify-center shrink-0">
          <i class="fas fa-chart-area text-primary-500 text-[11px]"></i>
        </div>
        <div>
          <div class="text-[10px] font-black uppercase tracking-[0.18em] text-primary-400 leading-none">Tendencia semanal</div>
          <div class="text-[14px] font-black text-slate-900 dark:text-slate-100 leading-tight">Últimos 7 días</div>
        </div>
      </div>
      <div class="flex items-center gap-3">
        <span class="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-widest text-slate-400">
          <span class="w-2 h-2 rounded-sm" :style="{ background: 'var(--brand-accent)' }"></span>Completadas
        </span>
        <span class="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-widest text-slate-400">
          <span class="w-2 h-2 rounded-sm bg-slate-300 dark:bg-slate-600"></span>Creadas
        </span>
        <span class="text-[13px] font-black" :class="completionDelta >= 0 ? 'text-emerald-500' : 'text-rose-500'">
          <i :class="completionDelta >= 0 ? 'fas fa-arrow-trend-up' : 'fas fa-arrow-trend-down'" class="text-[11px] mr-0.5"></i>
          {{ totalCompleted }} completadas
        </span>
      </div>
    </div>

    <apexchart type="bar" height="150" :options="chartOptions" :series="series" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import ApexCharts from 'vue3-apexcharts'
import { useActivitiesStore } from '../../stores'

const apexchart = ApexCharts
const activitiesStore = useActivitiesStore()

// Construye los últimos 7 días (incluido hoy)
const days = computed(() => {
  const arr: { label: string; date: Date }[] = []
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const names = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(today.getDate() - i)
    arr.push({ label: names[d.getDay()], date: d })
  }
  return arr
})

const sameDay = (raw: any, ref: Date) => {
  if (!raw) return false
  const d = new Date(raw)
  return d.getFullYear() === ref.getFullYear() && d.getMonth() === ref.getMonth() && d.getDate() === ref.getDate()
}

const completedPerDay = computed(() =>
  days.value.map(day =>
    activitiesStore.activities.filter((a: any) => a.status === 'completed' && sameDay(a.updatedAt || a.dueDate || a.date, day.date)).length
  )
)
const createdPerDay = computed(() =>
  days.value.map(day =>
    activitiesStore.activities.filter((a: any) => sameDay(a.createdAt || a.date, day.date)).length
  )
)

const totalCompleted = computed(() => completedPerDay.value.reduce((s, n) => s + n, 0))
const completionDelta = computed(() => {
  const c = completedPerDay.value
  const lastHalf = c.slice(4).reduce((s, n) => s + n, 0)
  const firstHalf = c.slice(0, 3).reduce((s, n) => s + n, 0)
  return lastHalf - firstHalf
})

const series = computed(() => [
  { name: 'Completadas', data: completedPerDay.value },
  { name: 'Creadas', data: createdPerDay.value },
])

const chartOptions = computed(() => ({
  chart: { toolbar: { show: false }, fontFamily: 'Inter, sans-serif', sparkline: { enabled: false }, animations: { easing: 'easeinout', speed: 400 } },
  colors: ['var(--brand-accent)', '#cbd5e1'],
  plotOptions: { bar: { columnWidth: '55%', borderRadius: 4, borderRadiusApplication: 'end' } },
  dataLabels: { enabled: false },
  grid: { borderColor: 'rgba(148,163,184,0.15)', strokeDashArray: 4, padding: { top: -8, bottom: -4, left: 4, right: 4 } },
  xaxis: {
    categories: days.value.map(d => d.label),
    axisBorder: { show: false }, axisTicks: { show: false },
    labels: { style: { colors: '#94a3b8', fontSize: '9px', fontWeight: 700 } },
  },
  yaxis: { labels: { style: { colors: '#cbd5e1', fontSize: '9px', fontWeight: 700 }, formatter: (v: number) => String(Math.round(v)) }, tickAmount: 3 },
  legend: { show: false },
  tooltip: { theme: 'light', style: { fontSize: '11px' } },
  states: { hover: { filter: { type: 'darken', value: 0.9 } } },
}))
</script>
