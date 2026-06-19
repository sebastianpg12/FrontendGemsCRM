<template>
  <div class="space-y-4">
    <!-- Header -->
    <div class="flex items-center justify-between border-b border-slate-100 dark:border-[#334155] pb-3">
      <div class="flex items-center gap-2">
        <i class="fas fa-box text-[10px] text-primary-400"></i>
        <span class="text-[11px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Servicios</span>
        <span v-if="client.services?.length" class="px-1.5 py-0.5 rounded-md bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-300 text-[9px] font-black">{{ client.services.length }}</span>
      </div>
    </div>

    <!-- Form -->
    <div class="bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-[#334155] rounded-xl p-3 flex flex-wrap gap-2 items-end">
      <div class="flex-1 min-w-[180px]">
        <label class="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Servicio</label>
        <input v-model="serviceName" placeholder="Ej: Mantenimiento Mensual"
          class="w-full h-8 bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-[#334155] rounded-lg px-3 text-[12px] text-slate-700 dark:text-slate-200 font-medium focus:outline-none focus:ring-2 focus:ring-primary-400 transition-all" />
      </div>
      <div class="w-full sm:w-36">
        <label class="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Plan</label>
        <input v-model="servicePlan" placeholder="Plan Premium"
          class="w-full h-8 bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-[#334155] rounded-lg px-3 text-[12px] text-slate-700 dark:text-slate-200 font-medium focus:outline-none focus:ring-2 focus:ring-primary-400 transition-all" />
      </div>
      <div class="w-full sm:w-36">
        <label class="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Estado</label>
        <CustomSelect v-model="serviceStatus" :options="svcOptions" size="sm" />
      </div>
      <button @click="handleCreate" :disabled="!serviceName.trim()"
        class="h-8 px-4 rounded-lg bg-primary-600 text-white text-[12px] font-black hover:bg-primary-700 transition-colors shadow-sm flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed shrink-0 self-end">
        <i class="fas fa-plus text-[9px]"></i> Agregar
      </button>
    </div>

    <!-- Lista -->
    <div v-if="client.services?.length" class="grid grid-cols-1 lg:grid-cols-2 gap-2">
      <div v-for="s in client.services" :key="s._id"
        class="bg-white dark:bg-[#1e293b] rounded-xl border border-slate-100 dark:border-[#334155] shadow-sm hover:shadow-md transition-all overflow-hidden">

        <!-- Vista -->
        <div v-if="editingServiceId !== s._id" class="flex items-stretch">
          <div :class="svcDot(s.status)" class="w-1 shrink-0 rounded-l-xl"></div>
          <div class="flex-1 px-3.5 py-3 flex items-start justify-between gap-2">
            <div class="min-w-0">
              <div class="flex items-center gap-2 flex-wrap">
                <h4 class="text-[13px] font-black text-slate-800 dark:text-slate-100">{{ s.name }}</h4>
                <span :class="svcChip(s.status)" class="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full">{{ svcLabel(s.status) }}</span>
              </div>
              <p v-if="s.plan" class="text-[10px] text-slate-400 font-medium mt-0.5">{{ s.plan }}</p>
              <p v-if="s.notes" class="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5 italic">{{ s.notes }}</p>
            </div>
            <div class="flex gap-1 shrink-0">
              <button @click="startEdit(s)" class="h-6 w-6 rounded-lg flex items-center justify-center text-slate-400 hover:text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-500/10 transition-colors">
                <i class="fas fa-edit text-[9px]"></i>
              </button>
              <button @click="deleteService(s._id)" class="h-6 w-6 rounded-lg flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors">
                <i class="fas fa-trash text-[9px]"></i>
              </button>
            </div>
          </div>
        </div>

        <!-- Edición -->
        <div v-else class="p-3 space-y-2">
          <div class="flex gap-2 flex-wrap">
            <input v-model="editServicePlan" placeholder="Plan"
              class="flex-1 min-w-[100px] h-8 bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-[#334155] rounded-lg px-3 text-[12px] text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-400" />
            <div class="w-32">
              <CustomSelect v-model="editServiceStatus" :options="svcOptions" size="sm" />
            </div>
          </div>
          <input v-model="editServiceNotes" placeholder="Notas..."
            class="w-full h-8 bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-[#334155] rounded-lg px-3 text-[12px] text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-400" />
          <div class="flex gap-2 justify-end">
            <button @click="cancelEdit" class="h-7 px-3 rounded-lg bg-slate-100 dark:bg-[#334155] text-slate-500 text-[11px] font-bold hover:bg-slate-200 transition-colors">Cancelar</button>
            <button @click="confirmEdit" class="h-7 px-3 rounded-lg bg-emerald-500 text-white text-[11px] font-bold hover:bg-emerald-600 transition-colors">Guardar</button>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="text-center py-10 border border-dashed border-slate-200 dark:border-[#334155] rounded-xl">
      <i class="fas fa-box-open text-2xl text-slate-200 dark:text-slate-700 mb-2"></i>
      <p class="text-slate-400 text-[11px]">Sin servicios registrados.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, inject } from 'vue'
import CustomSelect from '@/components/ui/CustomSelect.vue'

const ctx = inject('clientContext') as any
const client = ctx.client
const { createService, updateService, deleteService } = ctx

const serviceName = ref('')
const servicePlan = ref('')
const serviceStatus = ref<string>('active')

const editingServiceId = ref<string | null>(null)
const editServicePlan = ref('')
const editServiceNotes = ref('')
const editServiceStatus = ref<string>('active')

const svcOptions = [
  { value: 'active',    label: 'Activo' },
  { value: 'paused',    label: 'Pausado' },
  { value: 'trial',     label: 'Prueba' },
  { value: 'cancelled', label: 'Cancelado' },
]

const svcLabel = (s: string) => ({ active: 'Activo', paused: 'Pausado', trial: 'Prueba', cancelled: 'Cancelado' }[s] || s)

const svcDot = (s: string) => ({
  active:    'bg-emerald-400',
  paused:    'bg-amber-400',
  trial:     'bg-primary-400',
  cancelled: 'bg-slate-300 dark:bg-slate-600',
}[s] || 'bg-slate-300')

const svcChip = (s: string) => ({
  active:    'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-300',
  paused:    'bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-300',
  trial:     'bg-primary-100 dark:bg-primary-500/20 text-primary-600 dark:text-primary-300',
  cancelled: 'bg-slate-100 dark:bg-slate-700/60 text-slate-500 dark:text-slate-400',
}[s] || '')

const handleCreate = async () => {
  const name = serviceName.value.trim()
  if (!name) return
  const success = await createService({ name, plan: servicePlan.value || undefined, status: serviceStatus.value })
  if (success) { serviceName.value = ''; servicePlan.value = ''; serviceStatus.value = 'active' }
}

const startEdit = (s: any) => {
  editingServiceId.value = s._id
  editServicePlan.value = s.plan || ''
  editServiceNotes.value = s.notes || ''
  editServiceStatus.value = s.status || 'active'
}
const cancelEdit = () => { editingServiceId.value = null }
const confirmEdit = async () => {
  if (!editingServiceId.value) return
  const success = await updateService(editingServiceId.value, {
    plan: editServicePlan.value || undefined,
    notes: editServiceNotes.value || undefined,
    status: editServiceStatus.value
  })
  if (success) cancelEdit()
}
</script>
