<template>
  <span
    class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-black tabular-nums"
    :class="badgeClass"
  >
    <i :class="['fas', iconClass, 'text-[8px]']"></i>
    {{ displayValue }}
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  value: number
  invert?: boolean // si true, valores negativos son "buenos" (verde)
}
const props = withDefaults(defineProps<Props>(), { invert: false })

const isPositive = computed(() => props.value > 0)
const isNeutral = computed(() => props.value === 0)

const isGood = computed(() => {
  if (isNeutral.value) return null
  return props.invert ? !isPositive.value : isPositive.value
})

const badgeClass = computed(() => {
  if (isNeutral.value) return 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
  return isGood.value
    ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400'
    : 'bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400'
})

const iconClass = computed(() => {
  if (isNeutral.value) return 'fa-minus'
  return isPositive.value ? 'fa-arrow-trend-up' : 'fa-arrow-trend-down'
})

const displayValue = computed(() => {
  const sign = isPositive.value ? '+' : ''
  return `${sign}${props.value.toFixed(1)}%`
})
</script>
