<template>
  <div>
    <!-- Header -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
      <div>
        <h2 class="text-2xl font-bold text-white">Transacciones</h2>
        <p class="text-gray-400">Registra ingresos y egresos</p>
      </div>
      <button
        @click="$emit('create')"
        class="px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl hover:from-primary-700 hover:to-primary-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center gap-2"
      >
        <i class="fas fa-plus"></i>
        Nueva Transacción
      </button>
    </div>

    <!-- Filters -->
    <div class="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-lg p-6 mb-6 border border-primary-500/20">
      <div class="flex flex-col sm:flex-row gap-4">
        <div class="flex-1">
          <input
            v-model="searchTerm"
            type="text"
            placeholder="Buscar por concepto..."
            class="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
          >
        </div>
        <div class="acc-chip" :class="{ 'acc-chip--on': typeFilter }" @click.stop="openAccChip = openAccChip === 'type' ? null : 'type'">
          <i class="fas fa-exchange-alt"></i>
          <span class="acc-label">{{ typeFilter === 'ingreso' ? 'Ingresos' : typeFilter === 'egreso' ? 'Egresos' : 'Todos los tipos' }}</span>
          <i class="fas fa-chevron-down acc-caret" :class="{ 'rotate-180': openAccChip === 'type' }"></i>
          <div v-if="openAccChip === 'type'" class="acc-dropdown" @click.stop>
            <div class="acc-dropdown-item" :class="{ 'acc-dropdown-item--active': typeFilter === '' }" @click="typeFilter = ''; openAccChip = null">
              <span>Todos los tipos</span><i v-if="typeFilter === ''" class="fas fa-check text-[10px] text-primary-500"></i>
            </div>
            <div class="acc-dropdown-item" :class="{ 'acc-dropdown-item--active': typeFilter === 'ingreso' }" @click="typeFilter = 'ingreso'; openAccChip = null">
              <span>Ingresos</span><i v-if="typeFilter === 'ingreso'" class="fas fa-check text-[10px] text-primary-500"></i>
            </div>
            <div class="acc-dropdown-item" :class="{ 'acc-dropdown-item--active': typeFilter === 'egreso' }" @click="typeFilter = 'egreso'; openAccChip = null">
              <span>Egresos</span><i v-if="typeFilter === 'egreso'" class="fas fa-check text-[10px] text-primary-500"></i>
            </div>
          </div>
        </div>
        <input
          v-model="dateFilter"
          type="month"
          class="px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
        >
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="text-center py-8">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-400"></div>
      <p class="mt-2 text-gray-300">Cargando transacciones...</p>
    </div>

    <!-- Empty State -->
    <div v-else-if="filteredTransactions.length === 0" class="text-center py-12">
      <i class="fas fa-exchange-alt text-4xl text-gray-500 mb-4"></i>
      <p class="text-gray-400 text-lg">No se encontraron transacciones</p>
    </div>

    <!-- Transactions List -->
    <div v-else class="space-y-4">
      <div
        v-for="transaction in filteredTransactions"
        :key="transaction._id"
        class="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-primary-500/20 hover:border-primary-400"
      >
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <!-- Transaction Info -->
          <div class="flex items-center gap-4 flex-1">
            <div :class="[
              'p-3 rounded-full',
              transaction.tipo === 'ingreso' 
                ? 'bg-green-500/20 text-green-400' 
                : 'bg-red-500/20 text-red-400'
            ]">
              <i :class="[
                'text-xl',
                transaction.tipo === 'ingreso' ? 'fas fa-arrow-up' : 'fas fa-arrow-down'
              ]"></i>
            </div>
            <div class="flex-1">
              <h3 class="font-bold text-white text-lg">{{ transaction.concepto }}</h3>
              <div class="flex flex-wrap gap-4 text-sm text-gray-400 mt-1">
                <span>
                  <i class="fas fa-calendar mr-1"></i>
                  {{ formatDate(transaction.fecha) }}
                </span>
                <span v-if="transaction.metodo">
                  <i class="fas fa-credit-card mr-1"></i>
                  {{ transaction.metodo }}
                </span>
                <span v-if="transaction.cliente_id">
                  <i class="fas fa-user mr-1"></i>
                  Cliente: {{ transaction.cliente_id }}
                </span>
              </div>
            </div>
          </div>

          <!-- Amount -->
          <div class="flex items-center gap-4">
            <div :class="[
              'text-right',
              transaction.tipo === 'ingreso' ? 'text-green-400' : 'text-red-400'
            ]">
              <p class="text-2xl font-bold">
                {{ transaction.tipo === 'ingreso' ? '+' : '-' }}${{ formatCurrency(transaction.monto) }}
              </p>
              <p class="text-sm text-gray-400 capitalize">{{ transaction.tipo }}</p>
            </div>

            <!-- Actions -->
            <div class="flex gap-2">
              <button
                @click="$emit('edit', transaction)"
                class="p-2 bg-primary-600/20 text-primary-400 rounded-lg hover:bg-primary-600/30 transition-colors border border-primary-500/30"
              >
                <i class="fas fa-edit"></i>
              </button>
              <button
                @click="$emit('delete', transaction._id!)"
                class="p-2 bg-red-600/20 text-red-400 rounded-lg hover:bg-red-600/30 transition-colors border border-red-500/30"
              >
                <i class="fas fa-trash"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import type { Transaction } from '../../services/accountingService'

interface Props {
  transactions: Transaction[]
  loading: boolean
}

const searchTerm = ref('')
const typeFilter = ref('')
const dateFilter = ref('')
const openAccChip = ref<string | null>(null)

const closeAccChip = () => { openAccChip.value = null }
onMounted(() => document.addEventListener('click', closeAccChip))
onUnmounted(() => document.removeEventListener('click', closeAccChip))

const filteredTransactions = computed(() => {
  return props.transactions.filter(transaction => {
    const matchesSearch = transaction.concepto.toLowerCase().includes(searchTerm.value.toLowerCase())
    const matchesType = !typeFilter.value || transaction.tipo === typeFilter.value
    const matchesDate = !dateFilter.value || 
      new Date(transaction.fecha).toISOString().slice(0, 7) === dateFilter.value
    
    return matchesSearch && matchesType && matchesDate
  })
})

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('es-CO', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount)
}

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const props = defineProps<Props>()
</script>

<style>
.acc-chip {
  position: relative; display: inline-flex; align-items: center; gap: 6px;
  height: 36px; padding: 0 10px; border-radius: 8px;
  background: #1e293b; border: 1px solid #334155;
  font-size: 11px; font-weight: 700; color: #94a3b8;
  cursor: pointer; user-select: none; white-space: nowrap; transition: all 0.15s;
}
.acc-chip:hover { background: #273449; }
.acc-chip--on { background: #3b1f6e33; border-color: #7c3aed55; color: #a78bfa; }
.acc-chip i:first-child { font-size: 9px; }
.acc-caret { font-size: 8px; transition: transform 0.2s; }
.acc-label { font-size: 11px; font-weight: 700; }
.acc-dropdown {
  position: absolute; top: calc(100% + 6px); left: 0; z-index: 50;
  min-width: 160px; background: #1e293b; border: 1px solid #334155;
  border-radius: 10px; box-shadow: 0 4px 20px rgba(0,0,0,0.4);
  padding: 4px; max-height: 240px; overflow-y: auto;
}
.acc-dropdown-item {
  display: flex; align-items: center; justify-content: space-between; gap: 8px;
  padding: 7px 10px; border-radius: 7px;
  font-size: 11px; font-weight: 600; color: #94a3b8; cursor: pointer; transition: background 0.12s;
}
.acc-dropdown-item:hover { background: #273449; color: #e2e8f0; }
.acc-dropdown-item--active { color: #818cf8; font-weight: 700; }
</style>
