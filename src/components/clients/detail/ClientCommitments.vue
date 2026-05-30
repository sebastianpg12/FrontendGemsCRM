<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center border-b border-slate-100 pb-3">
      <h3 class="text-lg font-black text-slate-800">Compromisos y Tareas</h3>
    </div>
    <!-- Inline add commitment -->
    <div class="flex flex-wrap gap-3 items-center bg-slate-50 border border-slate-200 rounded-xl p-4 shadow-sm">
      <div class="flex-1 min-w-[200px]">
        <label class="sr-only">Título del compromiso</label>
        <input v-model="commitTitle" placeholder="Ej: Enviar propuesta comercial" class="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-slate-800 font-medium text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none shadow-sm" />
      </div>
      <div class="w-full sm:w-auto">
        <label class="sr-only">Fecha límite</label>
        <input v-model="commitDueDate" type="date" class="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-slate-800 font-medium text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none shadow-sm" />
      </div>
      <div class="w-full sm:w-auto">
        <label class="sr-only">Estado</label>
        <select v-model="commitStatus" class="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-slate-800 font-medium text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none shadow-sm">
          <option value="pending">Pendiente</option>
          <option value="in_progress">En progreso</option>
          <option value="completed">Completado</option>
          <option value="cancelled">Cancelado</option>
        </select>
      </div>
      <button @click="handleCreate" class="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-primary-600 text-white font-bold hover:bg-primary-700 shadow-sm transition-colors">
        <i class="fas fa-plus mr-1"></i> Agregar
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
            <button @click="deleteCommitment(c._id)" class="px-3 py-1.5 text-xs font-bold bg-red-50 text-red-700 border border-red-100 hover:bg-red-100 rounded-lg transition-colors">Eliminar</button>
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
  </div>
</template>

<script setup lang="ts">
import { ref, inject } from 'vue'

const ctx = inject('clientContext') as any
const client = ctx.client
const { createCommitment, updateCommitment, deleteCommitment } = ctx

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
