<template>
  <div class="space-y-5">
    <div class="flex items-center justify-between border-b border-slate-100 dark:border-[#334155] pb-3">
      <h3 class="text-[15px] font-black text-slate-800 dark:text-slate-100">Compromisos</h3>
    </div>

    <!-- Formulario añadir -->
    <div class="bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-[#334155] rounded-xl p-4 space-y-3">
      <div class="flex flex-wrap gap-3">
        <div class="flex-1 min-w-[200px]">
          <label class="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Título</label>
          <input v-model="commitTitle" placeholder="Ej: Enviar propuesta comercial"
            class="w-full bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-[#334155] rounded-xl px-3.5 py-2.5 text-slate-700 dark:text-slate-200 text-[13px] font-medium focus:outline-none focus:ring-2 focus:ring-primary-400 transition-all" />
        </div>
        <div class="w-full sm:w-44">
          <label class="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Fecha límite</label>
          <input v-model="commitDueDate" type="date"
            class="w-full bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-[#334155] rounded-xl px-3.5 py-2.5 text-slate-700 dark:text-slate-200 text-[13px] font-medium focus:outline-none focus:ring-2 focus:ring-primary-400 transition-all [color-scheme:light] dark:[color-scheme:dark] cursor-pointer" />
        </div>
        <div class="w-full sm:w-44">
          <label class="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Estado</label>
          <CustomSelect v-model="commitStatus" :options="commitStatusOptions" size="sm" />
        </div>
      </div>
      <button @click="handleCreate" :disabled="!commitTitle.trim()"
        class="h-9 px-5 rounded-xl bg-primary-600 text-white text-[12px] font-black hover:bg-primary-700 transition-colors shadow-sm flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed">
        <i class="fas fa-plus text-[10px]"></i> Agregar compromiso
      </button>
    </div>

    <!-- Lista -->
    <div v-if="client.commitments?.length" class="space-y-2.5">
      <div v-for="c in client.commitments" :key="c._id"
        class="bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-[#334155] rounded-xl p-4 shadow-sm hover:shadow-md transition-all">

        <!-- Vista normal -->
        <div v-if="editingCommitmentId !== c._id" class="flex items-start justify-between gap-3">
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 mb-1">
              <h4 class="text-[14px] font-black text-slate-800 dark:text-slate-100 truncate">{{ c.title }}</h4>
              <span :class="statusClass(c.status)" class="shrink-0 text-[9px] uppercase font-black tracking-wider px-2 py-0.5 rounded-lg border">
                {{ statusLabel(c.status) }}
              </span>
            </div>
            <div class="flex items-center gap-1.5 text-[11px] text-slate-400 font-medium">
              <i class="fas fa-calendar-alt text-[9px]"></i>
              {{ c.dueDate ? formatDate(c.dueDate) : 'Sin fecha' }}
            </div>
            <p v-if="c.description" class="text-[12px] text-slate-500 dark:text-slate-400 mt-2 p-2.5 bg-slate-50 dark:bg-[#0f172a] rounded-lg">{{ c.description }}</p>
          </div>
          <div class="flex gap-1.5 shrink-0">
            <button @click="startEdit(c)" class="h-7 px-3 text-[11px] font-bold bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-300 border border-primary-100 dark:border-primary-500/20 hover:bg-primary-100 rounded-lg transition-colors">Editar</button>
            <button @click="requestDelete(c._id)" class="h-7 px-3 text-[11px] font-bold bg-red-50 dark:bg-red-500/10 text-red-500 border border-red-100 dark:border-red-500/20 hover:bg-red-100 rounded-lg transition-colors">Eliminar</button>
          </div>
        </div>

        <!-- Modo edición -->
        <div v-else class="flex flex-col gap-3">
          <div class="flex flex-wrap gap-3">
            <input v-model="editCommitDueDate" type="date"
              class="flex-1 min-w-[160px] bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-[#334155] rounded-xl px-3.5 py-2 text-slate-700 dark:text-slate-200 text-[13px] focus:outline-none focus:ring-2 focus:ring-primary-400 [color-scheme:light] dark:[color-scheme:dark] cursor-pointer" />
            <div class="flex-1 min-w-[140px]">
              <CustomSelect v-model="editCommitStatus" :options="commitStatusOptions" size="sm" />
            </div>
          </div>
          <input v-model="editCommitDescription" placeholder="Descripción..."
            class="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-[#334155] rounded-xl px-3.5 py-2 text-slate-700 dark:text-slate-200 text-[13px] focus:outline-none focus:ring-2 focus:ring-primary-400 transition-all" />
          <div class="flex gap-2 justify-end">
            <button @click="cancelEdit" class="h-8 px-4 rounded-xl bg-slate-100 dark:bg-[#334155] text-slate-600 dark:text-slate-300 text-[11px] font-bold hover:bg-slate-200 transition-colors">Cancelar</button>
            <button @click="confirmEdit" class="h-8 px-4 rounded-xl bg-emerald-500 text-white text-[11px] font-bold hover:bg-emerald-600 transition-colors">Guardar</button>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="text-center py-10 bg-slate-50 dark:bg-[#0f172a] border border-dashed border-slate-200 dark:border-[#334155] rounded-xl">
      <i class="fas fa-check-circle text-3xl text-slate-300 dark:text-slate-600 mb-3"></i>
      <p class="text-slate-400 text-[12px] font-medium">No hay compromisos registrados.</p>
    </div>

    <!-- Modal confirmación — Teleport para evitar clipping -->
    <Teleport to="body">
      <div v-if="commitToDelete" class="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/50" @click.self="commitToDelete = null">
        <div class="bg-white dark:bg-[#1e293b] rounded-xl shadow-2xl w-full max-w-sm p-6 text-center">
          <div class="w-12 h-12 bg-red-50 dark:bg-red-500/10 rounded-xl flex items-center justify-center mx-auto mb-4">
            <i class="fas fa-trash text-red-500"></i>
          </div>
          <h4 class="text-[15px] font-black text-slate-900 dark:text-slate-100 mb-1">¿Eliminar compromiso?</h4>
          <p class="text-[12px] text-slate-400 mb-5">Esta acción no se puede deshacer.</p>
          <div class="flex gap-3">
            <button @click="commitToDelete = null" class="flex-1 h-9 rounded-xl border border-slate-200 dark:border-[#334155] text-slate-600 dark:text-slate-300 text-[12px] font-bold hover:bg-slate-50 dark:hover:bg-[#334155] transition-colors">Cancelar</button>
            <button @click="confirmDelete" class="flex-1 h-9 rounded-xl bg-red-500 text-white text-[12px] font-bold hover:bg-red-600 transition-colors">Eliminar</button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, inject } from 'vue'
import CustomSelect from '@/components/ui/CustomSelect.vue'

const ctx = inject('clientContext') as any
const client = ctx.client
const { createCommitment, updateCommitment, deleteCommitment } = ctx

const commitToDelete = ref<string | null>(null)
const commitTitle = ref('')
const commitDueDate = ref('')
const commitStatus = ref<'pending'|'in_progress'|'completed'|'cancelled'>('pending')

const editingCommitmentId = ref<string | null>(null)
const editCommitDescription = ref('')
const editCommitDueDate = ref('')
const editCommitStatus = ref<'pending'|'in_progress'|'completed'|'cancelled'>('pending')

const commitStatusOptions = [
  { value: 'pending',     label: 'Pendiente' },
  { value: 'in_progress', label: 'En progreso' },
  { value: 'completed',   label: 'Completado' },
  { value: 'cancelled',   label: 'Cancelado' },
]

const statusLabel = (s: string) => ({ pending: 'Pendiente', in_progress: 'En progreso', completed: 'Completado', cancelled: 'Cancelado' }[s] || s)

const statusClass = (s: string) => ({
  pending:     'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-600',
  in_progress: 'bg-primary-100 dark:bg-primary-500/20 text-primary-700 dark:text-primary-300 border-primary-200 dark:border-primary-500/30',
  completed:   'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-500/30',
  cancelled:   'bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-300 border-red-200 dark:border-red-500/30',
}[s] || '')

const formatDate = (d?: string|Date) => d ? new Date(d).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'

const handleCreate = async () => {
  const title = commitTitle.value.trim()
  if (!title) return
  const success = await createCommitment({
    title,
    status: commitStatus.value,
    dueDate: commitDueDate.value ? new Date(commitDueDate.value).toISOString() : undefined
  })
  if (success) { commitTitle.value = ''; commitDueDate.value = ''; commitStatus.value = 'pending' }
}

const startEdit = (c: any) => {
  editingCommitmentId.value = c._id
  editCommitDescription.value = c.description || ''
  editCommitStatus.value = c.status || 'pending'
  editCommitDueDate.value = c.dueDate ? new Date(c.dueDate).toISOString().slice(0, 10) : ''
}
const cancelEdit = () => { editingCommitmentId.value = null }
const confirmEdit = async () => {
  if (!editingCommitmentId.value) return
  const success = await updateCommitment(editingCommitmentId.value, {
    description: editCommitDescription.value || undefined,
    status: editCommitStatus.value,
    dueDate: editCommitDueDate.value ? new Date(editCommitDueDate.value).toISOString() : undefined
  })
  if (success) cancelEdit()
}

const requestDelete = (id: string) => { commitToDelete.value = id }
const confirmDelete = async () => {
  if (!commitToDelete.value) return
  await deleteCommitment(commitToDelete.value)
  commitToDelete.value = null
}
</script>
