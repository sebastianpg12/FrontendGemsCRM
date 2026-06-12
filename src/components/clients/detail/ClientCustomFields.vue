<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center border-b border-slate-100 pb-3">
      <h3 class="text-lg font-black text-slate-800">Campos Personalizados</h3>
    </div>
    <div class="flex flex-wrap gap-3 items-center bg-slate-50 border border-slate-200 rounded-xl p-4 shadow-sm">
      <div class="flex-1 min-w-[150px]">
        <input v-model="newFieldKey" placeholder="Nombre del Campo" class="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-slate-800 font-medium text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none shadow-sm" />
      </div>
      <div class="flex-1 min-w-[200px]">
        <input v-model="newFieldValue" placeholder="Valor" class="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-slate-800 font-medium text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none shadow-sm" />
      </div>
      <button @click="handleAddCustomField" class="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-primary-600 text-white font-bold hover:bg-primary-700 shadow-sm transition-colors">
        <i class="fas fa-plus mr-1"></i> Agregar
      </button>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div v-for="f in (client.customFields || [])" :key="f._id || f.key" class="bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between shadow-sm transition-colors">
        <div>
          <p class="text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-1">{{ f.key }}</p>
          <p class="text-slate-800 font-medium">{{ f.value }}</p>
        </div>
        <button @click="removeCustomField(f)" class="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
          <i class="fas fa-times"></i>
        </button>
      </div>
    </div>
    <div v-if="!(client.customFields || []).length" class="text-center py-10 bg-slate-50 border border-dashed border-slate-200 rounded-xl">
      <i class="fas fa-sliders-h text-3xl text-slate-300 mb-3"></i>
      <p class="text-slate-500 font-medium">Añade campos personalizados a la medida de tu requerimiento.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, inject } from 'vue'

const ctx = inject('clientContext') as any
const client = ctx.client
const { addCustomField, removeCustomField } = ctx

const newFieldKey = ref('')
const newFieldValue = ref('')

const handleAddCustomField = async () => {
  const key = newFieldKey.value.trim()
  const value = newFieldValue.value.trim()
  if (!key) return
  const success = await addCustomField(key, value)
  if (success) {
    newFieldKey.value = ''
    newFieldValue.value = ''
  }
}
</script>
