<template>
  <div class="space-y-4">
    <div class="border-b border-slate-100 dark:border-[#334155] pb-3">
      <h3 class="text-[13px] font-black text-slate-700 dark:text-slate-200 uppercase tracking-wide">Servicios contratados</h3>
    </div>

    <!-- Formulario añadir -->
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
      <div class="w-full sm:w-32 relative">
        <label class="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Estado</label>
        <select v-model="serviceStatus"
          class="w-full h-8 appearance-none bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-[#334155] rounded-lg pl-3 pr-7 text-[12px] text-slate-700 dark:text-slate-200 font-bold focus:outline-none focus:ring-2 focus:ring-primary-400 [color-scheme:light] dark:[color-scheme:dark] cursor-pointer">
          <option value="active">Activo</option>
          <option value="paused">Pausado</option>
          <option value="trial">Prueba</option>
          <option value="cancelled">Cancelado</option>
        </select>
        <i class="fas fa-chevron-down absolute right-2.5 bottom-2.5 text-slate-400 text-[8px] pointer-events-none"></i>
      </div>
      <button @click="handleCreate" :disabled="!serviceName.trim()"
        class="h-8 px-4 rounded-lg bg-primary-600 text-white text-[12px] font-black hover:bg-primary-700 transition-colors shadow-sm flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed shrink-0 self-end">
        <i class="fas fa-plus text-[9px]"></i> Agregar
      </button>
    </div>

    <!-- Lista -->
    <div v-if="client.services?.length" class="grid grid-cols-1 lg:grid-cols-2 gap-2.5">
      <div v-for="s in client.services" :key="s._id"
        class="bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-[#334155] rounded-xl p-3.5 shadow-sm hover:shadow-md transition-all">

        <div v-if="editingServiceId !== s._id" class="flex items-start justify-between gap-2">
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 mb-0.5 flex-wrap">
              <h4 class="text-[13px] font-black text-slate-800 dark:text-slate-100 truncate">{{ s.name }}</h4>
              <span :class="svcStatusClass(s.status)"
                class="text-[9px] uppercase font-black tracking-wider px-2 py-0.5 rounded-lg border shrink-0">
                {{ svcStatusLabel(s.status) }}
              </span>
            </div>
            <p v-if="s.plan" class="text-[11px] text-slate-400 font-medium">{{ s.plan }}</p>
            <p v-if="s.notes" class="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5 px-2.5 py-1.5 bg-slate-50 dark:bg-[#0f172a] rounded-lg">{{ s.notes }}</p>
          </div>
          <div class="flex gap-1 shrink-0">
            <button @click="startEdit(s)" class="h-7 w-7 rounded-lg flex items-center justify-center text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-500/10 transition-colors">
              <i class="fas fa-edit text-[10px]"></i>
            </button>
            <button @click="deleteService(s._id)" class="h-7 w-7 rounded-lg flex items-center justify-center text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors">
              <i class="fas fa-trash text-[10px]"></i>
            </button>
          </div>
        </div>

        <div v-else class="flex flex-col gap-2">
          <div class="flex gap-2 flex-wrap">
            <input v-model="editServicePlan" placeholder="Plan"
              class="flex-1 min-w-[120px] h-8 bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-[#334155] rounded-lg px-3 text-[12px] text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-400" />
            <div class="relative w-32">
              <select v-model="editServiceStatus"
                class="w-full h-8 appearance-none bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-[#334155] rounded-lg pl-3 pr-7 text-[12px] text-slate-700 dark:text-slate-200 font-bold focus:outline-none focus:ring-2 focus:ring-primary-400 [color-scheme:light] dark:[color-scheme:dark]">
                <option value="active">Activo</option>
                <option value="paused">Pausado</option>
                <option value="trial">Prueba</option>
                <option value="cancelled">Cancelado</option>
              </select>
              <i class="fas fa-chevron-down absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-[8px] pointer-events-none"></i>
            </div>
          </div>
          <input v-model="editServiceNotes" placeholder="Notas..."
            class="w-full h-8 bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-[#334155] rounded-lg px-3 text-[12px] text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-400" />
          <div class="flex gap-2 justify-end">
            <button @click="cancelEdit" class="h-7 px-3 rounded-lg bg-slate-100 dark:bg-[#334155] text-slate-600 dark:text-slate-300 text-[11px] font-bold hover:bg-slate-200 transition-colors">Cancelar</button>
            <button @click="confirmEdit" class="h-7 px-3 rounded-lg bg-emerald-500 text-white text-[11px] font-bold hover:bg-emerald-600 transition-colors">Guardar</button>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="text-center py-8 bg-slate-50 dark:bg-[#0f172a] border border-dashed border-slate-200 dark:border-[#334155] rounded-xl">
      <i class="fas fa-box-open text-2xl text-slate-300 dark:text-slate-600 mb-2"></i>
      <p class="text-slate-400 text-[12px] font-medium">No hay servicios registrados para este cliente.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, inject } from 'vue'

const ctx = inject('clientContext') as any
const client = ctx.client
const { createService, updateService, deleteService } = ctx

const serviceName = ref('')
const servicePlan = ref('')
const serviceStatus = ref<'active'|'paused'|'cancelled'|'trial'>('active')

const editingServiceId = ref<string | null>(null)
const editServicePlan = ref('')
const editServiceNotes = ref('')
const editServiceStatus = ref<'active'|'paused'|'cancelled'|'trial'>('active')

const svcStatusLabel = (s: string) => ({ active: 'Activo', paused: 'Pausado', trial: 'Prueba', cancelled: 'Cancelado' }[s] || s)
const svcStatusClass = (s: string) => ({
  active:    'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-500/30',
  paused:    'bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-500/30',
  trial:     'bg-primary-100 dark:bg-primary-500/20 text-primary-700 dark:text-primary-300 border-primary-200 dark:border-primary-500/30',
  cancelled: 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300 border-slate-200 dark:border-slate-600',
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
