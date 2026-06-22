<template>
  <div class="w-full h-full flex items-end gap-1">
    <div
      v-for="(p, i) in points"
      :key="i"
      class="flex-1 rounded-t transition-colors bg-primary-500/70 hover:bg-primary-600 relative group"
      :style="{ height: heightFor(p.value) + '%' }"
      :title="`${p.label}: ${p.value}`"
    >
      <span
        class="opacity-0 group-hover:opacity-100 absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[12px] font-bold px-2 py-1 rounded whitespace-nowrap pointer-events-none transition-opacity"
      >{{ p.label }}: {{ p.value }}</span>
    </div>
    <div v-if="!points.length" class="w-full h-full flex items-center justify-center text-slate-400 text-xs">
      Sin datos
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
interface Point { label: string; value: number }
const props = defineProps<{ points: Point[] }>()
const max = computed(() => Math.max(1, ...props.points.map(p => p.value)))
const heightFor = (v: number) => Math.max(4, (v / max.value) * 100)
</script>
