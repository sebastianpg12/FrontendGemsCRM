<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center border-b border-slate-100 pb-3">
      <h3 class="text-lg font-black text-slate-800">Notas Adicionales</h3>
    </div>
    <div class="flex gap-3 items-start">
      <div class="flex-1">
        <textarea v-model="newNote" placeholder="Escribe una nueva nota o actualización (Presiona Ctr + Enter para guardar)" rows="3" class="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-800 font-medium text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none shadow-sm resize-y"></textarea>
      </div>
      <button @click="handleAddNote" class="px-5 py-3 rounded-xl bg-primary-600 text-white font-bold hover:bg-primary-700 shadow-sm transition-colors h-full">
        <i class="fas fa-save mb-1 block text-lg"></i>
        Guardar
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
            <button @click="deleteNote(n._id)" class="w-8 h-8 rounded-lg flex items-center justify-center text-red-400 bg-red-50 border border-red-100 hover:text-red-600 transition-colors">
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
  </div>
</template>

<script setup lang="ts">
import { ref, inject } from 'vue'

const ctx = inject('clientContext') as any
const { sortedNotes, addNote, togglePinNote, deleteNote } = ctx

const newNote = ref('')

const formatDate = (d?: string | Date) => d ? new Date(d).toLocaleString('es-ES') : '—'

const handleAddNote = async () => {
  const content = newNote.value.trim()
  if (!content) return
  const success = await addNote(content)
  if (success) {
    newNote.value = ''
  }
}
</script>
