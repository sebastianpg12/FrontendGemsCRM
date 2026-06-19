<template>
  <div class="space-y-4">
    <!-- Header -->
    <div class="flex items-center gap-2 border-b border-slate-100 dark:border-[#334155] pb-3">
      <i class="fas fa-sticky-note text-[10px] text-primary-400"></i>
      <span class="text-[11px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Notas</span>
      <span v-if="sortedNotes.length" class="px-1.5 py-0.5 rounded-md bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-300 text-[9px] font-black">{{ sortedNotes.length }}</span>
    </div>

    <!-- Input -->
    <div class="flex gap-2 items-start">
      <textarea v-model="newNote" rows="2"
        placeholder="Nueva nota... (Ctrl+Enter para guardar)"
        @keydown.ctrl.enter="handleAddNote"
        class="flex-1 bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-[#334155] rounded-xl px-3.5 py-2.5 text-slate-700 dark:text-slate-200 text-[12px] font-medium focus:ring-2 focus:ring-primary-400 focus:outline-none transition-all resize-none"
      ></textarea>
      <button @click="handleAddNote" :disabled="saving || !newNote.trim()"
        class="h-8 px-3.5 rounded-lg bg-primary-600 text-white text-[12px] font-black hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm transition-colors flex items-center gap-1.5 shrink-0 mt-0.5">
        <i v-if="saving" class="fas fa-circle-notch fa-spin text-[9px]"></i>
        <i v-else class="fas fa-save text-[9px]"></i>
        {{ saving ? '...' : 'Guardar' }}
      </button>
    </div>

    <!-- Lista timeline -->
    <div v-if="sortedNotes.length" class="space-y-2">
      <div v-for="n in sortedNotes" :key="n._id"
        class="group relative bg-white dark:bg-[#1e293b] rounded-xl px-4 py-3 shadow-sm transition-all border-l-[3px]"
        :class="n.pinned
          ? 'border-l-amber-400 dark:border-l-amber-400 ring-1 ring-amber-200/60 dark:ring-amber-500/20'
          : 'border-l-slate-200 dark:border-l-[#334155] hover:border-l-primary-300 dark:hover:border-l-primary-500/50'">

        <div class="flex items-start justify-between gap-2">
          <p class="text-[12px] text-slate-700 dark:text-slate-300 font-medium leading-relaxed whitespace-pre-wrap flex-1 min-w-0">{{ n.content }}</p>
          <div class="flex gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
            <button @click="togglePinNote(n)"
              class="h-6 w-6 rounded-lg flex items-center justify-center transition-colors"
              :class="n.pinned ? 'text-amber-500 bg-amber-50 dark:bg-amber-500/10' : 'text-slate-400 hover:text-amber-500 hover:bg-slate-50 dark:hover:bg-slate-700'">
              <i class="fas fa-thumbtack text-[8px]" :class="{ 'rotate-45': !n.pinned }"></i>
            </button>
            <button @click="requestDeleteNote(n._id)"
              class="h-6 w-6 rounded-lg flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors">
              <i class="fas fa-trash text-[8px]"></i>
            </button>
          </div>
        </div>

        <div class="flex items-center gap-1.5 mt-1.5">
          <i v-if="n.pinned" class="fas fa-thumbtack text-amber-400 text-[7px]"></i>
          <span class="text-[10px] text-slate-400 font-medium">{{ formatDate(n.createdAt) }}</span>
        </div>
      </div>
    </div>

    <div v-else class="text-center py-10 border border-dashed border-slate-200 dark:border-[#334155] rounded-xl">
      <i class="fas fa-sticky-note text-2xl text-slate-200 dark:text-slate-700 mb-2"></i>
      <p class="text-slate-400 text-[11px]">Sin notas para este cliente.</p>
    </div>

    <!-- Modal -->
    <Teleport to="body">
      <div v-if="noteToDelete" class="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/50" @click.self="noteToDelete = null">
        <div class="bg-white dark:bg-[#1e293b] rounded-xl shadow-2xl w-full max-w-sm p-6 text-center">
          <div class="w-10 h-10 bg-red-50 dark:bg-red-500/10 rounded-xl flex items-center justify-center mx-auto mb-3">
            <i class="fas fa-trash text-red-500 text-sm"></i>
          </div>
          <h4 class="text-[14px] font-black text-slate-900 dark:text-slate-100 mb-1">¿Eliminar nota?</h4>
          <p class="text-[11px] text-slate-400 mb-4">Esta acción no se puede deshacer.</p>
          <div class="flex gap-2">
            <button @click="noteToDelete = null" class="flex-1 h-8 rounded-xl border border-slate-200 dark:border-[#334155] text-slate-600 dark:text-slate-300 text-[11px] font-bold hover:bg-slate-50 dark:hover:bg-[#334155] transition-colors">Cancelar</button>
            <button @click="confirmDeleteNote" class="flex-1 h-8 rounded-xl bg-red-500 text-white text-[11px] font-bold hover:bg-red-600 transition-colors">Eliminar</button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, inject } from 'vue'

const ctx = inject('clientContext') as any
const { sortedNotes, addNote, togglePinNote, deleteNote } = ctx

const newNote = ref('')
const saving = ref(false)
const noteToDelete = ref<string | null>(null)

const formatDate = (d?: string | Date) => d ? new Date(d).toLocaleString('es-ES', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : '—'

const handleAddNote = async () => {
  const content = newNote.value.trim()
  if (!content || saving.value) return
  saving.value = true
  try {
    const success = await addNote(content)
    if (success) newNote.value = ''
  } finally {
    saving.value = false
  }
}

const requestDeleteNote = (id: string) => { noteToDelete.value = id }
const confirmDeleteNote = async () => {
  if (!noteToDelete.value) return
  await deleteNote(noteToDelete.value)
  noteToDelete.value = null
}
</script>
