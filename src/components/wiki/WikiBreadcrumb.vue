<template>
  <nav class="flex items-center gap-1 min-w-0 overflow-hidden">
    <button
      class="crumb shrink-0"
      title="Inicio de la Wiki"
      @click="$emit('navigate', null)"
    >
      <i class="fas fa-book-open text-[12px]"></i>
    </button>
    <template v-for="(crumb, idx) in trail" :key="crumb._id">
      <i class="fas fa-chevron-right text-[9px] text-slate-300 dark:text-slate-600 shrink-0"></i>
      <button
        class="crumb truncate"
        :class="{ 'text-slate-800 dark:text-slate-100 pointer-events-none': idx === trail.length - 1 }"
        @click="$emit('navigate', crumb._id)"
      >
        {{ crumb.titulo }}
      </button>
    </template>
  </nav>
</template>

<script setup lang="ts">
import type { WikiTreeNode } from '@/services/wikiService'

defineProps<{
  trail: WikiTreeNode[]
}>()

defineEmits<{
  navigate: [id: string | null]
}>()
</script>

<style scoped>
.crumb {
  padding: 4px 8px;
  border-radius: 8px;
  font-size: 11px;
  font-weight: 700;
  color: #94a3b8;
  transition: all 0.15s ease;
  max-width: 180px;
}
.crumb:hover {
  background: #f1f5f9;
  color: #0f172a;
}
.dark .crumb:hover {
  background: #273449;
  color: #f1f5f9;
}
</style>
