<template>
  <div>
    <div
      class="group flex items-center gap-1 rounded-lg pr-1 transition-colors cursor-pointer select-none"
      :class="[
        isActive
          ? 'bg-primary-50 dark:bg-primary-500/10 text-primary-700 dark:text-primary-300'
          : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#273449]',
        dragOver ? 'ring-2 ring-primary-400 ring-inset' : ''
      ]"
      :style="{ paddingLeft: `${depth * 14 + 4}px` }"
      draggable="true"
      @click="$emit('select', node._id)"
      @dragstart.stop="onDragStart"
      @dragover.prevent.stop="dragOver = true"
      @dragleave.stop="dragOver = false"
      @drop.prevent.stop="onDrop"
    >
      <!-- Chevron expand/collapse -->
      <button
        class="w-5 h-5 flex items-center justify-center rounded-md shrink-0 text-slate-400 hover:bg-slate-200 dark:hover:bg-[#334155] transition-colors"
        :class="{ 'opacity-0 pointer-events-none': !hasChildren }"
        @click.stop="$emit('toggle', node._id)"
      >
        <i class="fas fa-chevron-right text-[8px] transition-transform duration-150" :class="{ 'rotate-90': isExpanded }"></i>
      </button>

      <i class="fas fa-file-lines text-[10px] shrink-0" :class="isActive ? 'text-primary-500' : 'text-slate-400 dark:text-slate-500'"></i>

      <!-- Título / edición inline -->
      <input
        v-if="renaming"
        ref="renameInput"
        v-model="renameValue"
        class="flex-1 min-w-0 bg-white dark:bg-[#0f172a] border border-primary-400 rounded-md px-1.5 py-0.5 text-[11px] font-bold text-slate-800 dark:text-slate-100 outline-none"
        @click.stop
        @keyup.enter="commitRename"
        @keyup.esc="cancelRename"
        @blur="commitRename"
      />
      <span
        v-else
        class="flex-1 min-w-0 truncate py-1.5 text-[11px] font-bold"
        @dblclick.stop="startRename"
      >
        {{ node.titulo }}
      </span>

      <!-- Acciones hover -->
      <div v-if="!renaming" class="hidden group-hover:flex items-center gap-0.5 shrink-0">
        <button class="tree-action" title="Subir" @click.stop="$emit('move-up', node._id)">
          <i class="fas fa-arrow-up text-[8px]"></i>
        </button>
        <button class="tree-action" title="Bajar" @click.stop="$emit('move-down', node._id)">
          <i class="fas fa-arrow-down text-[8px]"></i>
        </button>
        <button class="tree-action" title="Nueva sub-página" @click.stop="$emit('create-child', node._id)">
          <i class="fas fa-plus text-[8px]"></i>
        </button>
        <button class="tree-action hover:!text-rose-500" title="Archivar" @click.stop="$emit('archive', node._id)">
          <i class="fas fa-box-archive text-[8px]"></i>
        </button>
      </div>
    </div>

    <!-- Hijos -->
    <div v-if="isExpanded && hasChildren">
      <WikiTreeItem
        v-for="child in children"
        :key="child._id"
        :node="child"
        :children-map="childrenMap"
        :current-id="currentId"
        :expanded-ids="expandedIds"
        :depth="depth + 1"
        @select="$emit('select', $event)"
        @toggle="$emit('toggle', $event)"
        @create-child="$emit('create-child', $event)"
        @rename="(id: string, titulo: string) => $emit('rename', id, titulo)"
        @archive="$emit('archive', $event)"
        @move-up="$emit('move-up', $event)"
        @move-down="$emit('move-down', $event)"
        @move-into="(id: string, parentId: string) => $emit('move-into', id, parentId)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'
import type { WikiTreeNode } from '@/services/wikiService'

const props = defineProps<{
  node: WikiTreeNode
  childrenMap: Record<string, WikiTreeNode[]>
  currentId: string | null
  expandedIds: Set<string>
  depth: number
}>()

const emit = defineEmits<{
  select: [id: string]
  toggle: [id: string]
  'create-child': [id: string]
  rename: [id: string, titulo: string]
  archive: [id: string]
  'move-up': [id: string]
  'move-down': [id: string]
  'move-into': [id: string, parentId: string]
}>()

const renaming = ref(false)
const renameValue = ref('')
const renameInput = ref<HTMLInputElement | null>(null)
const dragOver = ref(false)

const children = computed(() => props.childrenMap[props.node._id] || [])
const hasChildren = computed(() => children.value.length > 0)
const isExpanded = computed(() => props.expandedIds.has(props.node._id))
const isActive = computed(() => props.currentId === props.node._id)

const startRename = async () => {
  renameValue.value = props.node.titulo
  renaming.value = true
  await nextTick()
  renameInput.value?.focus()
  renameInput.value?.select()
}

const commitRename = () => {
  if (!renaming.value) return
  renaming.value = false
  const titulo = renameValue.value.trim()
  if (titulo && titulo !== props.node.titulo) emit('rename', props.node._id, titulo)
}

const cancelRename = () => {
  renaming.value = false
}

const onDragStart = (e: DragEvent) => {
  e.dataTransfer?.setData('text/wiki-page-id', props.node._id)
  if (e.dataTransfer) e.dataTransfer.effectAllowed = 'move'
}

const onDrop = (e: DragEvent) => {
  dragOver.value = false
  const draggedId = e.dataTransfer?.getData('text/wiki-page-id')
  if (draggedId && draggedId !== props.node._id) {
    emit('move-into', draggedId, props.node._id)
  }
}
</script>

<style scoped>
.tree-action {
  width: 20px;
  height: 20px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  color: #94a3b8;
  transition: all 0.15s ease;
}
.tree-action:hover {
  background: #e2e8f0;
  color: #0f172a;
}
.dark .tree-action:hover {
  background: #334155;
  color: #f1f5f9;
}
</style>
