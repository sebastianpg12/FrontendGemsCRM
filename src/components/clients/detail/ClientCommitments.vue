<template>
  <div class="space-y-4">
    <!-- Header -->
    <div class="flex items-center justify-between border-b border-slate-100 dark:border-[#334155] pb-3">
      <div class="flex items-center gap-2">
        <i class="fas fa-handshake text-[12px] text-primary-400"></i>
        <span class="text-[13px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Compromisos</span>
        <span v-if="client.commitments?.length" class="px-1.5 py-0.5 rounded-md bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-300 text-[11px] font-black">{{ client.commitments.length }}</span>
      </div>
    </div>

    <!-- Form -->
    <div class="bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-[#334155] rounded-xl p-3 space-y-2.5">
      <input v-model="commitTitle" placeholder="Título del compromiso..."
        class="w-full h-8 bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-[#334155] rounded-lg px-3 text-[14px] text-slate-700 dark:text-slate-200 font-medium focus:outline-none focus:ring-2 focus:ring-primary-400 transition-all" />
      <div class="flex flex-wrap gap-2">
        <div class="flex-1 min-w-[140px]">
          <DatePicker v-model="commitDueDate" placeholder="Fecha límite" />
        </div>
        <div class="flex-1 min-w-[140px]">
          <CustomSelect v-model="commitStatus" :options="statusOptions" size="sm" />
        </div>
        <button @click="handleCreate" :disabled="!commitTitle.trim()"
          class="h-8 px-4 rounded-lg bg-primary-600 text-white text-[14px] font-black hover:bg-primary-700 transition-colors shadow-sm flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed shrink-0">
          <i class="fas fa-plus text-[11px]"></i> Agregar
        </button>
      </div>
    </div>

    <!-- Lista -->
    <div v-if="client.commitments?.length" class="space-y-2">
      <div v-for="c in client.commitments" :key="c._id"
        class="bg-white dark:bg-[#1e293b] rounded-xl border-l-4 pl-4 pr-3.5 py-3 shadow-sm hover:shadow-md transition-all"
        :class="statusBorder(c.status)">

        <!-- Vista -->
        <div v-if="editingCommitmentId !== c._id" class="flex items-start justify-between gap-3">
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 flex-wrap">
              <h4 class="text-[14px] font-black text-slate-800 dark:text-slate-100 leading-tight">{{ c.title }}</h4>
              <span :class="statusChip(c.status)" class="text-[11px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full">
                {{ statusLabel(c.status) }}
              </span>
            </div>
            <div v-if="c.dueDate" class="flex items-center gap-1 mt-1">
              <i class="fas fa-calendar-alt text-[10px] text-slate-400"></i>
              <span class="text-[12px] text-slate-400 font-medium">{{ formatDate(c.dueDate) }}</span>
            </div>
            <p v-if="c.description" class="text-[13px] text-slate-500 dark:text-slate-400 mt-1.5">{{ c.description }}</p>
          </div>
          <div class="flex gap-1 shrink-0">
            <button @click="startEdit(c)" class="h-6 w-6 rounded-lg flex items-center justify-center text-slate-400 hover:text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-500/10 transition-colors">
              <i class="fas fa-edit text-[11px]"></i>
            </button>
            <button @click="requestDelete(c._id)" class="h-6 w-6 rounded-lg flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors">
              <i class="fas fa-trash text-[11px]"></i>
            </button>
          </div>
        </div>

        <!-- Edición -->
        <div v-else class="space-y-2">
          <input v-model="editCommitTitle"
            class="w-full h-8 bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-[#334155] rounded-lg px-3 text-[14px] text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-400" />
          <div class="flex gap-2 flex-wrap">
            <div class="flex-1 min-w-[140px]">
              <DatePicker v-model="editCommitDueDate" placeholder="Fecha límite" />
            </div>
            <div class="flex-1 min-w-[140px]">
              <CustomSelect v-model="editCommitStatus" :options="statusOptions" size="sm" />
            </div>
          </div>
          <input v-model="editCommitDescription" placeholder="Descripción..."
            class="w-full h-8 bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-[#334155] rounded-lg px-3 text-[14px] text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-400" />
          <div class="flex gap-2 justify-end">
            <button @click="cancelEdit" class="h-7 px-3 rounded-lg bg-slate-100 dark:bg-[#334155] text-slate-500 dark:text-slate-300 text-[13px] font-bold hover:bg-slate-200 transition-colors">Cancelar</button>
            <button @click="confirmEdit" class="h-7 px-3 rounded-lg bg-emerald-500 text-white text-[13px] font-bold hover:bg-emerald-600 transition-colors">Guardar</button>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="text-center py-10 border border-dashed border-slate-200 dark:border-[#334155] rounded-xl">
      <i class="fas fa-handshake text-2xl text-slate-200 dark:text-slate-700 mb-2"></i>
      <p class="text-slate-400 text-[13px]">Sin compromisos registrados.</p>
    </div>

    <!-- Modal -->
    <Teleport to="body">
      <div v-if="commitToDelete" class="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/50" @click.self="commitToDelete = null">
        <div class="bg-white dark:bg-[#1e293b] rounded-xl shadow-2xl w-full max-w-sm p-6 text-center">
          <div class="w-10 h-10 bg-red-50 dark:bg-red-500/10 rounded-xl flex items-center justify-center mx-auto mb-3">
            <i class="fas fa-trash text-red-500 text-sm"></i>
          </div>
          <h4 class="text-[15px] font-black text-slate-900 dark:text-slate-100 mb-1">¿Eliminar compromiso?</h4>
          <p class="text-[13px] text-slate-400 mb-4">Esta acción no se puede deshacer.</p>
          <div class="flex gap-2">
            <button @click="commitToDelete = null" class="flex-1 h-8 rounded-xl border border-slate-200 dark:border-[#334155] text-slate-600 dark:text-slate-300 text-[13px] font-bold hover:bg-slate-50 dark:hover:bg-[#334155] transition-colors">Cancelar</button>
            <button @click="confirmDelete" class="flex-1 h-8 rounded-xl bg-red-500 text-white text-[13px] font-bold hover:bg-red-600 transition-colors">Eliminar</button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, inject } from 'vue'
import CustomSelect from '@/components/ui/CustomSelect.vue'
import DatePicker from '@/components/ui/DatePicker.vue'

const ctx = inject('clientContext') as any
const client = ctx.client
const { createCommitment, updateCommitment, deleteCommitment } = ctx

const commitToDelete = ref<string | null>(null)
const commitTitle = ref('')
const commitDueDate = ref('')
const commitStatus = ref<string>('pending')

const editingCommitmentId = ref<string | null>(null)
const editCommitTitle = ref('')
const editCommitDescription = ref('')
const editCommitDueDate = ref('')
const editCommitStatus = ref<string>('pending')

const statusOptions = [
  { value: 'pending',     label: 'Pendiente' },
  { value: 'in_progress', label: 'En progreso' },
  { value: 'completed',   label: 'Completado' },
  { value: 'cancelled',   label: 'Cancelado' },
]

const statusLabel = (s: string) => ({ pending: 'Pendiente', in_progress: 'En progreso', completed: 'Completado', cancelled: 'Cancelado' }[s] || s)

const statusChip = (s: string) => ({
  pending:     'bg-slate-100 dark:bg-slate-700/60 text-slate-500 dark:text-slate-400',
  in_progress: 'bg-primary-100 dark:bg-primary-500/20 text-primary-600 dark:text-primary-300',
  completed:   'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-300',
  cancelled:   'bg-red-100 dark:bg-red-500/20 text-red-500 dark:text-red-300',
}[s] || '')

const statusBorder = (s: string) => ({
  pending:     'border-l-slate-300 dark:border-l-slate-600',
  in_progress: 'border-l-primary-400 dark:border-l-primary-500',
  completed:   'border-l-emerald-400 dark:border-l-emerald-500',
  cancelled:   'border-l-red-300 dark:border-l-red-500/60',
}[s] || 'border-l-slate-200')

const formatDate = (d?: string | Date) => d ? new Date(d).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'

const handleCreate = async () => {
  const title = commitTitle.value.trim()
  if (!title) return
  const success = await createCommitment({
    title,
    status: commitStatus.value,
    dueDate: commitDueDate.value ? new Date(commitDueDate.value + 'T12:00:00').toISOString() : undefined
  })
  if (success) { commitTitle.value = ''; commitDueDate.value = ''; commitStatus.value = 'pending' }
}

const startEdit = (c: any) => {
  editingCommitmentId.value = c._id
  editCommitTitle.value = c.title || ''
  editCommitDescription.value = c.description || ''
  editCommitStatus.value = c.status || 'pending'
  editCommitDueDate.value = c.dueDate ? new Date(c.dueDate).toISOString().slice(0, 10) : ''
}
const cancelEdit = () => { editingCommitmentId.value = null }
const confirmEdit = async () => {
  if (!editingCommitmentId.value) return
  const success = await updateCommitment(editingCommitmentId.value, {
    title: editCommitTitle.value || undefined,
    description: editCommitDescription.value || undefined,
    status: editCommitStatus.value,
    dueDate: editCommitDueDate.value ? new Date(editCommitDueDate.value + 'T12:00:00').toISOString() : undefined
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
