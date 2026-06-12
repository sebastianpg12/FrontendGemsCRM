<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center border-b border-slate-100 pb-3">
      <h3 class="text-lg font-black text-slate-800">Servicios Contratados</h3>
    </div>
    <!-- Inline add service -->
    <div class="flex flex-wrap gap-3 items-center bg-slate-50 border border-slate-200 rounded-xl p-4 shadow-sm">
      <div class="flex-1 min-w-[200px]">
        <label class="sr-only">Nombre del servicio</label>
        <input v-model="serviceName" placeholder="Ej: Mantenimiento Mensual" class="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-slate-800 font-medium text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none shadow-sm" />
      </div>
      <div class="w-full sm:w-auto">
        <label class="sr-only">Plan (opcional)</label>
        <input v-model="servicePlan" placeholder="Plan Premium" class="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-slate-800 font-medium text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none shadow-sm" />
      </div>
      <div class="w-full sm:w-auto">
        <label class="sr-only">Estado</label>
        <select v-model="serviceStatus" class="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-slate-800 font-medium text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none shadow-sm">
          <option value="active">Activo</option>
          <option value="paused">Pausado</option>
          <option value="cancelled">Cancelado</option>
          <option value="trial">Prueba</option>
        </select>
      </div>
      <button @click="handleCreate" class="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-primary-600 text-white font-bold hover:bg-primary-700 shadow-sm transition-colors">
        <i class="fas fa-plus mr-1"></i> Agregar
      </button>
    </div>
    
    <div v-if="client.services?.length" class="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div v-for="s in client.services" :key="s._id" class="bg-white border border-slate-200 rounded-xl p-5 hover:shadow-md transition-all shadow-sm">
        <!-- view mode -->
        <div v-if="editingServiceId !== s._id" class="flex flex-col h-full justify-between gap-3">
          <div class="flex justify-between items-start">
            <div>
              <h4 class="text-slate-800 font-black">{{ s.name }}</h4>
              <div class="flex items-center gap-2 mt-1">
                <span class="text-slate-500 text-sm font-medium">{{ s.plan || 'Sin plan' }}</span>
                <span class="text-slate-300">•</span>
                <span :class="{
                  'bg-emerald-100 text-emerald-700 border-emerald-200': s.status === 'active',
                  'bg-amber-100 text-amber-700 border-amber-200': s.status === 'paused',
                  'bg-primary-100 text-primary-700 border-primary-200': s.status === 'trial',
                  'bg-slate-100 text-slate-600 border-slate-200': s.status === 'cancelled',
                }" class="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md border">
                  {{ s.status === 'active' ? 'Activo' : s.status === 'paused' ? 'Pausado' : s.status === 'trial' ? 'Prueba' : 'Cancelado' }}
                </span>
              </div>
            </div>
            <div class="flex gap-1">
              <button @click="startEdit(s)" class="p-2 text-primary-500 hover:bg-primary-50 rounded-lg transition-colors"><i class="fas fa-edit"></i></button>
              <button @click="deleteService(s._id)" class="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"><i class="fas fa-trash"></i></button>
            </div>
          </div>
          <p v-if="s.notes" class="text-slate-600 text-sm p-3 bg-slate-50 rounded-lg mt-2">{{ s.notes }}</p>
        </div>
        <!-- edit mode -->
        <div v-else class="flex flex-col gap-3">
          <div class="flex flex-col sm:flex-row gap-3">
            <input v-model="editServicePlan" placeholder="Plan" class="w-full sm:w-1/2 bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-800 text-sm focus:ring-2 focus:ring-primary-500" />
            <select v-model="editServiceStatus" class="w-full sm:w-1/2 bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-800 text-sm focus:ring-2 focus:ring-primary-500">
              <option value="active">Activo</option>
              <option value="paused">Pausado</option>
              <option value="cancelled">Cancelado</option>
              <option value="trial">Prueba</option>
            </select>
          </div>
          <input v-model="editServiceNotes" placeholder="Notas del servicio..." class="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-800 text-sm focus:ring-2 focus:ring-primary-500" />
          <div class="flex gap-2 justify-end mt-2">
            <button @click="cancelEdit" class="px-4 py-2 rounded-lg bg-white border border-slate-200 text-slate-600 text-sm font-bold hover:bg-slate-50">Cancelar</button>
            <button @click="confirmEdit" class="px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm font-bold hover:bg-emerald-700">Guardar</button>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="text-center py-10 bg-slate-50 border border-dashed border-slate-200 rounded-xl">
      <i class="fas fa-box-open text-3xl text-slate-300 mb-3"></i>
      <p class="text-slate-500 font-medium">No hay servicios registrados para este cliente.</p>
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
const serviceStatus = ref<'active' | 'paused' | 'cancelled' | 'trial'>('active')

const editingServiceId = ref<string | null>(null)
const editServicePlan = ref('')
const editServiceNotes = ref('')
const editServiceStatus = ref<'active' | 'paused' | 'cancelled' | 'trial'>('active')

const handleCreate = async () => {
  const name = serviceName.value.trim()
  if (!name) return
  const success = await createService({ 
    name, 
    plan: servicePlan.value || undefined, 
    status: serviceStatus.value 
  })
  if (success) {
    serviceName.value = ''
    servicePlan.value = ''
    serviceStatus.value = 'active'
  }
}

const startEdit = (s: any) => {
  editingServiceId.value = s._id
  editServicePlan.value = s.plan || ''
  editServiceNotes.value = s.notes || ''
  editServiceStatus.value = s.status || 'active'
}

const cancelEdit = () => {
  editingServiceId.value = null
}

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
