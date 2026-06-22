<template>
  <div class="space-y-2.5">
    <div v-for="item in items" :key="item.label" class="text-xs">
      <div class="flex items-center justify-between mb-1">
        <span class="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
          <span class="w-1.5 h-1.5 rounded-full" :class="item.dotClass"></span>
          {{ item.label }}
        </span>
        <span class="tabular-nums text-slate-500 dark:text-slate-400">
          <strong class="text-slate-800 dark:text-white">{{ item.value }}</strong>
          <span class="text-[12px] ml-1">({{ pctOf(item.value) }}%)</span>
        </span>
      </div>
      <div class="h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
        <div class="h-full rounded-full transition-all" :class="item.barClass" :style="{ width: pctOf(item.value) + '%' }"></div>
      </div>
    </div>
    <div v-if="!items.length" class="text-center py-6 text-slate-400 text-xs">Sin datos</div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
interface Item { label: string; value: number; dotClass: string; barClass: string }
const props = defineProps<{ items: Item[] }>()
const total = computed(() => props.items.reduce((s, i) => s + i.value, 0) || 1)
const pctOf = (v: number) => Math.round((v / total.value) * 1000) / 10
</script>
