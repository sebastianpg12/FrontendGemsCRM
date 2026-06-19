<template>
  <div class="space-y-4">
    <div class="flex items-center gap-2 border-b border-slate-100 dark:border-[#334155] pb-3">
      <i class="fas fa-sliders-h text-[10px] text-primary-400"></i>
      <span class="text-[11px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Campos personalizados</span>
      <span v-if="(client.customFields || []).length" class="px-1.5 py-0.5 rounded-md bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-300 text-[9px] font-black">{{ client.customFields.length }}</span>
    </div>

    <div class="bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-[#334155] rounded-xl p-3 flex flex-wrap gap-2 items-end">
      <div class="flex-1 min-w-[140px]">
        <label class="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Campo</label>
        <input v-model="newFieldKey" placeholder="Nombre del campo"
          class="w-full h-8 bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-[#334155] rounded-lg px-3 text-[12px] text-slate-700 dark:text-slate-200 font-medium focus:outline-none focus:ring-2 focus:ring-primary-400 transition-all" />
      </div>
      <div class="flex-1 min-w-[160px]">
        <label class="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Valor</label>
        <input v-model="newFieldValue" placeholder="Valor"
          class="w-full h-8 bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-[#334155] rounded-lg px-3 text-[12px] text-slate-700 dark:text-slate-200 font-medium focus:outline-none focus:ring-2 focus:ring-primary-400 transition-all" />
      </div>
      <button @click="handleAddCustomField" :disabled="!newFieldKey.trim()"
        class="h-8 px-4 rounded-lg bg-primary-600 text-white text-[12px] font-black hover:bg-primary-700 transition-colors shadow-sm flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed shrink-0 self-end">
        <i class="fas fa-plus text-[9px]"></i> Agregar
      </button>
    </div>

    <div v-if="(client.customFields || []).length" class="divide-y divide-slate-100 dark:divide-[#334155] rounded-xl border border-slate-100 dark:border-[#334155] overflow-hidden">
      <div v-for="f in (client.customFields || [])" :key="f._id || f.key"
        class="bg-white dark:bg-[#1e293b] px-4 py-2.5 flex items-center justify-between gap-3 hover:bg-slate-50/50 dark:hover:bg-[#273449] transition-colors">
        <div class="flex items-baseline gap-3 min-w-0">
          <span class="text-[9px] font-black text-slate-400 uppercase tracking-widest shrink-0">{{ f.key }}</span>
          <span class="text-[12px] text-slate-700 dark:text-slate-200 font-semibold truncate">{{ f.value }}</span>
        </div>
        <button @click="removeCustomField(f)"
          class="h-5 w-5 rounded-md flex items-center justify-center text-slate-300 dark:text-slate-600 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors shrink-0">
          <i class="fas fa-times text-[8px]"></i>
        </button>
      </div>
    </div>

    <div v-else class="text-center py-10 border border-dashed border-slate-200 dark:border-[#334155] rounded-xl">
      <i class="fas fa-sliders-h text-2xl text-slate-200 dark:text-slate-700 mb-2"></i>
      <p class="text-slate-400 text-[11px]">Sin campos personalizados.</p>
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
