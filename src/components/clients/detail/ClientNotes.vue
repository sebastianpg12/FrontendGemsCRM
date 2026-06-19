<template>
  <div class="space-y-6">
    <div class="border-b border-slate-100 dark:border-[#334155] pb-3">
      <h3 class="text-[13px] font-black text-slate-700 dark:text-slate-200 uppercase tracking-wide">Notas</h3>
    </div>

    <div class="flex gap-2 items-start">
      <textarea v-model="newNote"
        placeholder="Escribe una nota... (Ctrl + Enter para guardar)"
        rows="2"
        @keydown.ctrl.enter="handleAddNote"
        class="flex-1 bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-[#334155] rounded-xl px-3.5 py-2.5 text-slate-700 dark:text-slate-200 text-[12px] font-medium focus:ring-2 focus:ring-primary-400 focus:outline-none transition-all resize-none"
      ></textarea>
      <button @click="handleAddNote" :disabled="saving || !newNote.trim()"
        class="h-8 px-4 rounded-lg bg-primary-600 text-white text-[12px] font-black hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm transition-colors flex items-center gap-1.5 shrink-0 self-start mt-0.5">
        <i v-if="saving" class="fas fa-circle-notch fa-spin text-[9px]"></i>
        <i v-else class="fas fa-save text-[9px]"></i>
        {{ saving ? 'Guardando' : 'Guardar' }}
      </button>
    </div>

    <div class="space-y-2">
      <div v-for="n in sortedNotes" :key="n._id"
        class="bg-white dark:bg-[#1e293b] border rounded-xl px-3.5 py-3 shadow-sm transition-all"
        :class="n.pinned ? 'border-amber-300 dark:border-amber-500/40 bg-amber-50/30 dark:bg-amber-500/5' : 'border-slate-200 dark:border-[#334155]'">
        <div class="flex items-center justify-between mb-2">
          <span class="text-[10px] text-slate-400 font-medium flex items-center gap-1">
            <i class="fas fa-clock text-[8px]"></i> {{ formatDate(n.createdAt) }}
          </span>
          <div class="flex gap-1">
            <button @click="togglePinNote(n)"
              class="h-6 w-6 rounded-lg flex items-center justify-center transition-colors"
              :class="n.pinned ? 'text-amber-500 bg-amber-50 dark:bg-amber-500/10' : 'text-slate-400 hover:text-amber-500 hover:bg-slate-50 dark:hover:bg-slate-700'">
              <i class="fas fa-thumbtack text-[9px]" :class="{ 'rotate-45': !n.pinned }"></i>
            </button>
            <button @click="requestDeleteNote(n._id)"
              class="h-6 w-6 rounded-lg flex items-center justify-center text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-500 transition-colors">
              <i class="fas fa-trash text-[9px]"></i>
            </button>
          </div>
        </div>
        <p class="text-[12px] text-slate-700 dark:text-slate-300 font-medium leading-relaxed whitespace-pre-wrap">{{ n.content }}</p>
      </div>

      <div v-if="!sortedNotes.length" class="text-center py-8 bg-slate-50 dark:bg-[#0f172a] border border-dashed border-slate-200 dark:border-[#334155] rounded-xl">
        <i class="fas fa-sticky-note text-2xl text-slate-300 dark:text-slate-600 mb-2"></i>
        <p class="text-slate-400 text-[12px] font-medium">Aún no hay notas para este cliente.</p>
      </div>
    </div>

    <!-- Confirmación borrar nota — Teleport para cubrir todo el viewport -->
    <Teleport to="body">
      <div v-if="noteToDelete" class="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/50" @click.self="noteToDelete = null">
        <div class="bg-white dark:bg-[#1e293b] rounded-xl shadow-2xl w-full max-w-sm p-6 text-center">
          <div class="w-12 h-12 bg-red-50 dark:bg-red-500/10 rounded-xl flex items-center justify-center mx-auto mb-4">
            <i class="fas fa-trash text-red-500"></i>
          </div>
          <h4 class="text-[15px] font-black text-slate-900 dark:text-slate-100 mb-1">¿Eliminar nota?</h4>
          <p class="text-[12px] text-slate-400 mb-5">Esta acción no se puede deshacer.</p>
          <div class="flex gap-3">
            <button @click="noteToDelete = null" class="flex-1 h-9 rounded-xl border border-slate-200 dark:border-[#334155] text-slate-600 dark:text-slate-300 text-[12px] font-bold hover:bg-slate-50 dark:hover:bg-[#334155] transition-colors">Cancelar</button>
            <button @click="confirmDeleteNote" class="flex-1 h-9 rounded-xl bg-red-500 text-white text-[12px] font-bold hover:bg-red-600 transition-colors">Eliminar</button>
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

const formatDate = (d?: string | Date) => d ? new Date(d).toLocaleString('es-ES') : '—'

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

const requestDeleteNote = (id: string) => {
  noteToDelete.value = id
}

const confirmDeleteNote = async () => {
  if (!noteToDelete.value) return
  await deleteNote(noteToDelete.value)
  noteToDelete.value = null
}
</script>
