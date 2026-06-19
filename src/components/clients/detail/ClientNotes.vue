<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center border-b border-slate-100 pb-3">
      <h3 class="text-lg font-black text-slate-800">Notas Adicionales</h3>
    </div>
    <div class="flex gap-3 items-start">
      <div class="flex-1">
        <textarea
          v-model="newNote"
          placeholder="Escribe una nueva nota o actualización (Ctrl + Enter para guardar)"
          rows="3"
          @keydown.ctrl.enter="handleAddNote"
          class="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-800 font-medium text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none shadow-sm resize-y"
        ></textarea>
      </div>
      <button
        @click="handleAddNote"
        :disabled="saving || !newNote.trim()"
        class="px-5 py-3 rounded-xl bg-primary-600 text-white font-bold hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm transition-colors flex flex-col items-center gap-1 min-w-[72px]"
      >
        <i v-if="saving" class="fas fa-circle-notch fa-spin text-lg"></i>
        <i v-else class="fas fa-save text-lg"></i>
        <span class="text-xs">{{ saving ? 'Guardando' : 'Guardar' }}</span>
      </button>
    </div>

    <div class="space-y-4">
      <div v-for="n in sortedNotes" :key="n._id" class="bg-white border text-sm rounded-xl p-5 shadow-sm transition-all" :class="n.pinned ? 'border-amber-300 bg-amber-50/30' : 'border-slate-200'">
        <div class="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
          <span class="text-slate-500 text-xs font-bold flex items-center">
            <i class="fas fa-clock mr-1.5 opacity-70"></i> {{ formatDate(n.createdAt) }}
          </span>
          <div class="flex gap-2">
            <button @click="togglePinNote(n)" :class="n.pinned ? 'text-amber-500 bg-amber-50 border border-amber-200' : 'text-slate-400 bg-slate-50 border border-slate-200 hover:text-amber-500'" class="w-8 h-8 rounded-lg flex items-center justify-center transition-colors">
              <i class="fas fa-thumbtack" :class="{ 'rotate-45': !n.pinned }"></i>
            </button>
            <button @click="requestDeleteNote(n._id)" class="w-8 h-8 rounded-lg flex items-center justify-center text-red-400 bg-red-50 border border-red-100 hover:text-red-600 transition-colors">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>
        <p class="text-slate-700 font-medium leading-relaxed whitespace-pre-wrap">{{ n.content }}</p>
      </div>

      <div v-if="!sortedNotes.length" class="text-center py-10 bg-slate-50 border border-dashed border-slate-200 rounded-xl">
        <i class="fas fa-sticky-note text-3xl text-slate-300 mb-3"></i>
        <p class="text-slate-500 font-medium">Aún no hay notas para este cliente.</p>
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
