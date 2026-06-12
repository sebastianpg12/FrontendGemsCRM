<template>
  <aside class="w-64 shrink-0 h-full flex flex-col bg-white dark:bg-[#1e293b] rounded-2xl overflow-hidden">
    <!-- Header -->
    <div class="px-4 pt-4 pb-3 border-b border-slate-100 dark:border-[#334155]">
      <div class="flex items-center justify-between mb-3">
        <span class="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Páginas</span>
        <button
          class="w-7 h-7 flex items-center justify-center rounded-lg bg-primary-600 hover:bg-primary-700 text-white transition-colors shadow-sm"
          title="Nueva página raíz"
          @click="$emit('create-page', null)"
        >
          <i class="fas fa-plus text-[10px]"></i>
        </button>
      </div>
      <div class="relative">
        <i class="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[10px]"></i>
        <input
          v-model="search"
          type="text"
          placeholder="Buscar páginas..."
          class="w-full pl-8 pr-3 h-8 bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-[#334155] rounded-lg text-[11px] font-medium text-slate-700 dark:text-slate-200 placeholder:text-slate-400 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
        />
      </div>
    </div>

    <!-- Árbol / resultados de búsqueda -->
    <div class="flex-1 overflow-y-auto custom-scrollbar px-2 py-2" @dragover.prevent @drop.prevent="onDropRoot">
      <template v-if="search.trim()">
        <button
          v-for="page in searchResults"
          :key="page._id"
          class="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-left transition-colors"
          :class="currentId === page._id
            ? 'bg-primary-50 dark:bg-primary-500/10 text-primary-700 dark:text-primary-300'
            : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#273449]'"
          @click="$emit('select', page._id)"
        >
          <i class="fas fa-file-lines text-[10px] text-slate-400"></i>
          <span class="text-[11px] font-bold truncate">{{ page.titulo }}</span>
        </button>
        <p v-if="searchResults.length === 0" class="px-2 py-4 text-[11px] font-medium text-slate-400 text-center">
          Sin resultados para «{{ search }}»
        </p>
      </template>

      <template v-else>
        <WikiTreeItem
          v-for="node in rootNodes"
          :key="node._id"
          :node="node"
          :children-map="childrenMap"
          :current-id="currentId"
          :expanded-ids="expandedIds"
          :depth="0"
          @select="$emit('select', $event)"
          @toggle="$emit('toggle', $event)"
          @create-child="$emit('create-page', $event)"
          @rename="(id: string, titulo: string) => $emit('rename', id, titulo)"
          @archive="$emit('archive', $event)"
          @move-up="$emit('move-up', $event)"
          @move-down="$emit('move-down', $event)"
          @move-into="(id: string, parentId: string) => $emit('move-into', id, parentId)"
        />

        <p v-if="rootNodes.length === 0" class="px-2 py-4 text-[11px] font-medium text-slate-400 text-center">
          Aún no hay páginas
        </p>
      </template>
    </div>

    <!-- Archivadas -->
    <div class="border-t border-slate-100 dark:border-[#334155]">
      <button
        class="w-full flex items-center justify-between px-4 h-9 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-[#273449] transition-colors"
        @click="$emit('toggle-archived')"
      >
        <span class="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest">
          <i class="fas fa-box-archive text-[10px]"></i>
          Archivadas
          <span v-if="archivedPages.length" class="px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-[#334155] text-slate-500 dark:text-slate-400 text-[9px] font-black">
            {{ archivedPages.length }}
          </span>
        </span>
        <i class="fas fa-chevron-down text-[8px] transition-transform duration-150" :class="{ 'rotate-180': showArchived }"></i>
      </button>

      <div v-if="showArchived" class="max-h-44 overflow-y-auto custom-scrollbar px-2 pb-2">
        <div
          v-for="page in archivedPages"
          :key="page._id"
          class="group flex items-center gap-2 px-2 py-1.5 rounded-lg text-slate-400 dark:text-slate-500 hover:bg-slate-50 dark:hover:bg-[#273449] transition-colors"
        >
          <i class="fas fa-file-lines text-[10px]"></i>
          <span class="flex-1 min-w-0 truncate text-[11px] font-medium line-through">{{ page.titulo }}</span>
          <div class="hidden group-hover:flex items-center gap-0.5 shrink-0">
            <button
              class="w-5 h-5 flex items-center justify-center rounded-md text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 transition-colors"
              title="Restaurar"
              @click="$emit('restore', page._id)"
            >
              <i class="fas fa-rotate-left text-[8px]"></i>
            </button>
            <button
              class="w-5 h-5 flex items-center justify-center rounded-md text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors"
              title="Eliminar permanentemente"
              @click="$emit('delete-permanent', page._id)"
            >
              <i class="fas fa-trash text-[8px]"></i>
            </button>
          </div>
        </div>
        <p v-if="archivedPages.length === 0" class="px-2 py-3 text-[11px] font-medium text-slate-400 text-center">
          Nada archivado
        </p>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import WikiTreeItem from './WikiTreeItem.vue'
import type { WikiTreeNode } from '@/services/wikiService'

const props = defineProps<{
  tree: WikiTreeNode[]
  childrenMap: Record<string, WikiTreeNode[]>
  rootNodes: WikiTreeNode[]
  archivedPages: WikiTreeNode[]
  currentId: string | null
  expandedIds: Set<string>
  showArchived: boolean
}>()

const emit = defineEmits<{
  select: [id: string]
  toggle: [id: string]
  'create-page': [parentId: string | null]
  rename: [id: string, titulo: string]
  archive: [id: string]
  restore: [id: string]
  'delete-permanent': [id: string]
  'move-up': [id: string]
  'move-down': [id: string]
  'move-into': [id: string, parentId: string]
  'move-to-root': [id: string]
  'toggle-archived': []
}>()

const search = ref('')

const searchResults = computed(() => {
  const q = search.value.trim().toLowerCase()
  if (!q) return []
  return props.tree.filter(p => p.titulo.toLowerCase().includes(q))
})

const onDropRoot = (e: DragEvent) => {
  const draggedId = e.dataTransfer?.getData('text/wiki-page-id')
  if (draggedId) emit('move-to-root', draggedId)
}
</script>
