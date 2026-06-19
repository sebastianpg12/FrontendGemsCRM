<template>
  <div class="space-y-4">
    <div class="border-b border-slate-100 dark:border-[#334155] pb-3">
      <h3 class="text-[13px] font-black text-slate-700 dark:text-slate-200 uppercase tracking-wide">Campos personalizados</h3>
    </div>

    <div class="bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-[#334155] rounded-xl p-3 flex flex-wrap gap-2 items-end">
      <div class="flex-1 min-w-[140px]">
        <label class="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Campo</label>
        <input v-model="newFieldKey" placeholder="Nombre del campo"
          class="w-full h-8 bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-[#334155] rounded-lg px-3 text-[12px] text-slate-700 dark:text-slate-200 font-medium focus:outline-none focus:ring-2 focus:ring-primary-400 transition-all" />
      </div>
      <div class="flex-1 min-w-[180px]">
        <label class="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Valor</label>
        <input v-model="newFieldValue" placeholder="Valor"
          class="w-full h-8 bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-[#334155] rounded-lg px-3 text-[12px] text-slate-700 dark:text-slate-200 font-medium focus:outline-none focus:ring-2 focus:ring-primary-400 transition-all" />
      </div>
      <button @click="handleAddCustomField" :disabled="!newFieldKey.trim()"
        class="h-8 px-4 rounded-lg bg-primary-600 text-white text-[12px] font-black hover:bg-primary-700 transition-colors shadow-sm flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed shrink-0 self-end">
        <i class="fas fa-plus text-[9px]"></i> Agregar
      </button>
    </div>

    <div v-if="(client.customFields || []).length" class="grid grid-cols-1 md:grid-cols-2 gap-2">
      <div v-for="f in (client.customFields || [])" :key="f._id || f.key"
        class="bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-[#334155] rounded-xl px-3.5 py-2.5 flex items-center justify-between gap-2 shadow-sm">
        <div class="min-w-0">
          <p class="text-[9px] uppercase tracking-widest font-black text-slate-400 mb-0.5">{{ f.key }}</p>
          <p class="text-[12px] text-slate-700 dark:text-slate-200 font-semibold truncate">{{ f.value }}</p>
        </div>
        <button @click="removeCustomField(f)"
          class="h-6 w-6 rounded-lg flex items-center justify-center text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-500 transition-colors shrink-0">
          <i class="fas fa-times text-[9px]"></i>
        </button>
      </div>
    </div>

    <div v-else class="text-center py-8 bg-slate-50 dark:bg-[#0f172a] border border-dashed border-slate-200 dark:border-[#334155] rounded-xl">
      <i class="fas fa-sliders-h text-2xl text-slate-300 dark:text-slate-600 mb-2"></i>
      <p class="text-slate-400 text-[12px] font-medium">Añade campos personalizados a la medida.</p>
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
  if (success) { newFieldKey.value = ''; newFieldValue.value = '' }
}
</script>
