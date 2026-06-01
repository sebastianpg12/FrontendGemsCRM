<template>
  <div
    class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 hover:border-primary-300 dark:hover:border-primary-700 transition-colors group cursor-default"
    :class="{ 'cursor-pointer': clickable }"
  >
    <div class="flex items-start justify-between mb-3">
      <div class="flex items-center gap-2.5 text-slate-500 dark:text-slate-400">
        <i :class="['fas', icon, 'text-sm']" v-if="icon"></i>
        <span class="text-[10px] font-bold uppercase tracking-widest">{{ label }}</span>
      </div>
      <TrendBadge v-if="delta !== undefined && delta !== null" :value="delta" :invert="invertDelta" />
    </div>
    <div class="flex items-baseline gap-2 mb-1">
      <p class="text-3xl font-black text-slate-900 dark:text-white tabular-nums">{{ formattedValue }}</p>
      <span v-if="unit" class="text-xs font-bold text-slate-400">{{ unit }}</span>
    </div>
    <p v-if="sublabel" class="text-[11px] text-slate-400 font-medium">{{ sublabel }}</p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import TrendBadge from './TrendBadge.vue'

interface Props {
  label: string
  value: number | string
  icon?: string
  delta?: number | null
  sublabel?: string
  unit?: string
  format?: 'number' | 'currency' | 'percent'
  invertDelta?: boolean // true si "menos es mejor" (ej. tickets vencidos)
  clickable?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  format: 'number',
  invertDelta: false,
  clickable: false
})

const formattedValue = computed(() => {
  const v = typeof props.value === 'number' ? props.value : Number(props.value)
  if (Number.isNaN(v)) return String(props.value)
  if (props.format === 'currency') return '$' + v.toLocaleString('es-CR', { maximumFractionDigits: 0 })
  if (props.format === 'percent') return v.toFixed(1) + '%'
  return v.toLocaleString('es-CR')
})
</script>
