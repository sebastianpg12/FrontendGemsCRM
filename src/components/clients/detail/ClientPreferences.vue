<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center border-b border-slate-100 pb-3">
      <h3 class="text-lg font-black text-slate-800">Preferencias del Cliente</h3>
    </div>
    <div class="flex flex-wrap gap-3 items-center bg-slate-50 border border-slate-200 rounded-xl p-4 shadow-sm">
      <div class="flex-1 min-w-[150px]">
        <input v-model="newPrefKey" placeholder="Clave (ej. Tono de comunicación)" class="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-slate-800 font-medium text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none shadow-sm" />
      </div>
      <div class="flex-1 min-w-[200px]">
        <input v-model="newPrefValue" placeholder="Valor (ej. Formal pero cercano)" class="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-slate-800 font-medium text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none shadow-sm" />
      </div>
      <button @click="handleAddPreference" class="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-primary-600 text-white font-bold hover:bg-primary-700 shadow-sm transition-colors">
        <i class="fas fa-plus mr-1"></i> Agregar
      </button>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div v-for="p in (client.preferences || [])" :key="p._id || p.key" class="bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between shadow-sm transition-colors">
        <div>
          <p class="text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-1">{{ p.key }}</p>
          <p class="text-slate-800 font-medium">{{ p.value }}</p>
        </div>
        <button @click="removePreference(p)" class="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
          <i class="fas fa-times"></i>
        </button>
      </div>
    </div>
    <div v-if="!(client.preferences || []).length" class="text-center py-10 bg-slate-50 border border-dashed border-slate-200 rounded-xl">
      <i class="fas fa-heart text-3xl text-slate-300 mb-3"></i>
      <p class="text-slate-500 font-medium">No se han registrado preferencias.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, inject } from 'vue'

const ctx = inject('clientContext') as any
const client = ctx.client
const { addPreference, removePreference } = ctx

const newPrefKey = ref('')
const newPrefValue = ref('')

const handleAddPreference = async () => {
  const key = newPrefKey.value.trim()
  const value = newPrefValue.value.trim()
  if (!key) return
  const success = await addPreference(key, value)
  if (success) {
    newPrefKey.value = ''
    newPrefValue.value = ''
  }
}
</script>
