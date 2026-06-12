<template>
  <!-- Modal Backdrop -->
  <div
    v-if="show"
    class="fixed inset-0 bg-slate-900/50 z-50 flex items-center justify-center p-4"
    @click="closeModal"
  >
    <!-- Modal Content -->
    <div
      class="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto"
      @click.stop
    >
      <!-- Header -->
      <div class="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
        <h2 class="text-base font-black text-slate-800">
          {{ editingTransaction ? 'Editar Transacción' : 'Nueva Transacción' }}
        </h2>
        <button @click="closeModal" class="btn-icon">
          <i class="fas fa-times text-sm"></i>
        </button>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleSubmit" class="p-6 space-y-4">
        <!-- Tipo -->
        <div>
          <label class="label-base">Tipo de Transacción *</label>
          <select v-model="form.tipo" required class="select-base">
            <option value="">Seleccionar tipo</option>
            <option value="ingreso">Ingreso</option>
            <option value="egreso">Egreso</option>
          </select>
        </div>

        <!-- Concepto -->
        <div>
          <label class="label-base">Concepto *</label>
          <input
            v-model="form.concepto"
            type="text"
            required
            placeholder="Descripción de la transacción"
            class="input-base"
          >
        </div>

        <!-- Monto -->
        <div>
          <label class="label-base">Monto *</label>
          <input
            v-model.number="form.monto"
            type="number"
            required
            min="0"
            step="0.01"
            placeholder="0.00"
            class="input-base"
          >
        </div>

        <!-- Fecha -->
        <div>
          <label class="label-base">Fecha *</label>
          <input v-model="form.fecha" type="date" required class="input-base">
        </div>

        <!-- Método de Pago -->
        <div>
          <label class="label-base">Método de Pago</label>
          <select v-model="form.metodo" class="select-base">
            <option value="">Seleccionar método</option>
            <option value="efectivo">Efectivo</option>
            <option value="transferencia">Transferencia</option>
            <option value="tarjeta_credito">Tarjeta de Crédito</option>
            <option value="tarjeta_debito">Tarjeta de Débito</option>
            <option value="cheque">Cheque</option>
            <option value="pse">PSE</option>
            <option value="nequi">Nequi</option>
            <option value="daviplata">Daviplata</option>
          </select>
        </div>

        <!-- Cliente -->
        <div v-if="clients.length > 0">
          <label class="label-base">Cliente (opcional)</label>
          <select v-model="form.cliente_id" class="select-base">
            <option value="">Sin cliente asignado</option>
            <option v-for="client in clients" :key="client._id" :value="client._id">
              {{ client.nombre }} {{ client.apellido }}
            </option>
          </select>
        </div>

        <!-- Pago Recurrente -->
        <div v-if="form.tipo === 'ingreso'">
          <label class="flex items-center gap-3 cursor-pointer">
            <input
              v-model="form.es_recurrente"
              type="checkbox"
              class="h-4 w-4 text-primary-600 focus:ring-primary-500 rounded border-slate-300"
            >
            <span class="text-sm font-medium text-slate-700">Es un pago recurrente</span>
          </label>

          <div v-if="form.es_recurrente" class="mt-3">
            <label class="label-base">Frecuencia *</label>
            <select v-model="form.frecuencia" required class="select-base">
              <option value="">Seleccionar frecuencia</option>
              <option value="mensual">Mensual</option>
              <option value="trimestral">Trimestral</option>
              <option value="semestral">Semestral</option>
              <option value="anual">Anual</option>
            </select>
          </div>
        </div>

        <!-- Buttons -->
        <div class="flex gap-2 pt-2">
          <button type="button" @click="closeModal" class="btn btn-secondary flex-1">
            Cancelar
          </button>
          <button type="submit" :disabled="loading" class="btn btn-primary flex-1">
            <i v-if="loading" class="fas fa-spinner fa-spin"></i>
            <span>{{ loading ? 'Guardando...' : (editingTransaction ? 'Actualizar' : 'Crear') }}</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import type { Transaction } from '../../services/accountingService'
import { clientService, type Client } from '../../services/clientService'

interface Props {
  show: boolean
  editingTransaction?: Transaction | null
  loading: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  close: []
  submit: [transaction: Omit<Transaction, '_id'>]
}>()

const clients = ref<Client[]>([])

const form = ref({
  tipo: '' as 'ingreso' | 'egreso' | '',
  concepto: '',
  monto: 0,
  fecha: '',
  metodo: '',
  cliente_id: '',
  es_recurrente: false,
  frecuencia: '',
  estado_pago: 'pendiente'
})

const resetForm = () => {
  form.value = {
    tipo: '',
    concepto: '',
    monto: 0,
    fecha: new Date().toISOString().split('T')[0],
    metodo: '',
    cliente_id: '',
    es_recurrente: false,
    frecuencia: '',
    estado_pago: 'pendiente'
  }
}

const closeModal = () => {
  emit('close')
}

const handleSubmit = () => {
  const transactionData: Omit<Transaction, '_id'> = {
    tipo: form.value.tipo as 'ingreso' | 'egreso',
    concepto: form.value.concepto,
    monto: form.value.monto,
    fecha: form.value.fecha,
    metodo: form.value.metodo || undefined,
    cliente_id: form.value.cliente_id || undefined,
    es_recurrente: form.value.es_recurrente,
    frecuencia: form.value.es_recurrente ? form.value.frecuencia : undefined,
    estado_pago: form.value.estado_pago as 'pendiente' | 'pagado' | 'vencido'
  }
  
  emit('submit', transactionData)
}

const loadClients = async () => {
  try {
    clients.value = await clientService.getClients()
  } catch (error) {
    console.error('Error loading clients:', error)
    clients.value = []
  }
}

// Watch for editing transaction changes
watch(() => props.editingTransaction, (newTransaction) => {
  if (newTransaction) {
    form.value = {
      tipo: newTransaction.tipo,
      concepto: newTransaction.concepto,
      monto: newTransaction.monto,
      fecha: newTransaction.fecha,
      metodo: newTransaction.metodo || '',
      cliente_id: newTransaction.cliente_id || '',
      es_recurrente: newTransaction.es_recurrente || false,
      frecuencia: newTransaction.frecuencia || '',
      estado_pago: newTransaction.estado_pago || 'pendiente'
    }
  } else {
    resetForm()
  }
}, { immediate: true })

// Watch for modal show/hide
watch(() => props.show, (newShow) => {
  if (newShow && !props.editingTransaction) {
    resetForm()
  }
})

onMounted(() => {
  loadClients()
  resetForm()
})
</script>
