<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center border-b border-slate-100 pb-3">
      <h3 class="text-lg font-black text-slate-800">Compromisos y Tareas</h3>
    </div>
    <!-- Inline add commitment -->
    <div class="flex flex-wrap gap-3 items-end bg-slate-50 border border-slate-200 rounded-xl p-4 shadow-sm">
      <div class="flex-1 min-w-[200px]">
        <label class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Título</label>
        <input v-model="commitTitle" placeholder="Ej: Enviar propuesta comercial" class="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 font-medium text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:outline-none shadow-sm transition-all" />
      </div>
      <div class="w-full sm:w-auto">
        <label class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5"><i class="fas fa-calendar-alt mr-1"></i>Fecha límite</label>
        <input v-model="commitDueDate" type="date" class="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-slate-700 font-medium text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:outline-none shadow-sm transition-all cursor-pointer" />
      </div>
      <div class="w-full sm:w-auto">
        <label class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5"><i class="fas fa-flag mr-1"></i>Estado</label>
        <div class="relative">
          <select v-model="commitStatus" class="w-full appearance-none bg-white border border-slate-200 rounded-xl pl-4 pr-9 py-2.5 text-slate-700 font-bold text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:outline-none shadow-sm transition-all cursor-pointer">
            <option value="pending">⏳ Pendiente</option>
            <option value="in_progress">🔄 En progreso</option>
            <option value="completed">✅ Completado</option>
            <option value="cancelled">❌ Cancelado</option>
          </select>
          <i class="fas fa-chevron-down absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-[10px] pointer-events-none"></i>
        </div>
      </div>
      <button @click="handleCreate" class="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-primary-600 text-white font-bold hover:bg-primary-700 shadow-sm transition-colors flex items-center justify-center gap-1.5">
        <i class="fas fa-plus text-xs"></i> Agregar
      </button>
    </div>
    
    <div v-if="client.commitments?.length" class="space-y-3">
      <div v-for="c in client.commitments" :key="c._id" class="bg-white border border-slate-200 rounded-xl p-5 hover:border-primary-300 hover:shadow-md transition-all shadow-sm">
        <!-- view mode -->
        <div v-if="editingCommitmentId !== c._id" class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div class="flex-1">
            <div class="flex items-center gap-3 mb-1">
              <h4 class="text-slate-800 font-black text-lg">{{ c.title }}</h4>
              <span :class="{
                'bg-slate-100 text-slate-600 border-slate-200': c.status === 'pending',
                'bg-primary-100 text-primary-700 border-primary-200': c.status === 'in_progress',
                'bg-emerald-100 text-emerald-700 border-emerald-200': c.status === 'completed',
                'bg-red-100 text-red-700 border-red-200': c.status === 'cancelled',
              }" class="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md border">
                {{ c.status === 'pending' ? 'Pendiente' : c.status === 'in_progress' ? 'En progreso' : c.status === 'completed' ? 'Completado' : 'Cancelado' }}
              </span>
            </div>
            <div class="flex items-center gap-2 text-sm text-slate-500 font-medium">
              <i class="fas fa-calendar-alt text-slate-400"></i> {{ c.dueDate ? formatDate(c.dueDate).split(',')[0] : 'Sin fecha' }}
            </div>
            <p v-if="c.description" class="text-slate-600 text-sm mt-3 p-3 bg-slate-50 rounded-lg border border-slate-100">{{ c.description }}</p>
          </div>
          <div class="flex gap-2 sm:flex-col self-end sm:self-center">
            <button @click="startEdit(c)" class="px-3 py-1.5 text-xs font-bold bg-primary-50 text-primary-700 border border-primary-100 hover:bg-primary-100 rounded-lg transition-colors">Editar</button>
            <button @click="requestDelete(c._id)" class="px-3 py-1.5 text-xs font-bold bg-red-50 text-red-700 border border-red-100 hover:bg-red-100 rounded-lg transition-colors">Eliminar</button>
          </div>
        </div>
        <!-- edit mode -->
        <div v-else class="flex flex-col gap-3">
          <div class="flex flex-col sm:flex-row gap-3">
            <input v-model="editCommitDueDate" type="date" class="w-full sm:w-1/3 bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-800 text-sm focus:ring-2 focus:ring-primary-500" />
            <select v-model="editCommitStatus" class="w-full sm:w-1/3 bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-800 text-sm focus:ring-2 focus:ring-primary-500">
              <option value="pending">Pendiente</option>
              <option value="in_progress">En progreso</option>
              <option value="completed">Completado</option>
              <option value="cancelled">Cancelado</option>
            </select>
          </div>
          <input v-model="editCommitDescription" placeholder="Descripción detallada..." class="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-800 text-sm focus:ring-2 focus:ring-primary-500" />
          <div class="flex gap-2 justify-end mt-2">
            <button @click="cancelEdit" class="px-4 py-2 rounded-lg bg-white border border-slate-200 text-slate-600 text-sm font-bold hover:bg-slate-50">Cancelar</button>
            <button @click="confirmEdit" class="px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm font-bold hover:bg-emerald-700">Guardar</button>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="text-center py-10 bg-slate-50 border border-dashed border-slate-200 rounded-xl">
      <i class="fas fa-check-circle text-3xl text-slate-300 mb-3"></i>
      <p class="text-slate-500 font-medium">No hay compromisos pendientes.</p>
    </div>

    <!-- Confirmación eliminar compromiso — sin blur -->
    <div v-if="commitToDelete" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-slate-900/50" @click="commitToDelete = null"></div>
      <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center border border-slate-100 animate-fade-in">
        <div class="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <i class="fas fa-trash text-red-500 text-xl"></i>
        </div>
        <h4 class="text-base font-black text-slate-900 mb-1">¿Eliminar compromiso?</h4>
        <p class="text-sm text-slate-400 font-medium mb-5">Esta acción no se puede deshacer.</p>
        <div class="flex gap-3">
          <button @click="commitToDelete = null" class="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50 transition-colors">Cancelar</button>
          <button @click="confirmDelete" class="flex-1 px-4 py-2.5 rounded-xl bg-red-500 text-white font-bold text-sm hover:bg-red-600 transition-colors">Eliminar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, inject } from 'vue'

const ctx = inject('clientContext') as any
const client = ctx.client
const { createCommitment, updateCommitment, deleteCommitment } = ctx

const commitToDelete = ref<string | null>(null)

const requestDelete = (id: string) => {
  commitToDelete.value = id
}

const confirmDelete = async () => {
  if (!commitToDelete.value) return
  await deleteCommitment(commitToDelete.value)
  commitToDelete.value = null
}

const commitTitle = ref('')
const commitDueDate = ref<string>('')
const commitStatus = ref<'pending'|'in_progress'|'completed'|'cancelled'>('pending')

const editingCommitmentId = ref<string | null>(null)
const editCommitDescription = ref('')
const editCommitDueDate = ref<string>('')
const editCommitStatus = ref<'pending'|'in_progress'|'completed'|'cancelled'>('pending')

const formatDate = (d?: string|Date) => d ? new Date(d).toLocaleString('es-ES') : '—'

const handleCreate = async () => {
  const title = commitTitle.value.trim()
  if (!title) return
  const success = await createCommitment({
    title,
    status: commitStatus.value,
    dueDate: commitDueDate.value ? new Date(commitDueDate.value).toISOString() : undefined
  })
  if (success) {
    commitTitle.value = ''
    commitDueDate.value = ''
    commitStatus.value = 'pending'
  }
}

const startEdit = (c: any) => {
  editingCommitmentId.value = c._id
  editCommitDescription.value = c.description || ''
  editCommitStatus.value = c.status || 'pending'
  editCommitDueDate.value = c.dueDate ? new Date(c.dueDate).toISOString().slice(0,10) : ''
}

const cancelEdit = () => {
  editingCommitmentId.value = null
}

const confirmEdit = async () => {
  if (!editingCommitmentId.value) return
  const success = await updateCommitment(editingCommitmentId.value, {
    description: editCommitDescription.value || undefined,
    status: editCommitStatus.value,
    dueDate: editCommitDueDate.value ? new Date(editCommitDueDate.value).toISOString() : undefined
  })
  if (success) cancelEdit()
}
</script>
