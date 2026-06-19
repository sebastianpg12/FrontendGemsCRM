<template>
  <div class="space-y-4">
    <div class="border-b border-slate-100 dark:border-[#334155] pb-3">
      <h3 class="text-[13px] font-black text-slate-700 dark:text-slate-200 uppercase tracking-wide">Preferencias del cliente</h3>
    </div>

    <div class="bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-[#334155] rounded-xl p-3 flex flex-wrap gap-2 items-end">
      <div class="flex-1 min-w-[140px]">
        <label class="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Clave</label>
        <input v-model="newPrefKey" placeholder="Ej: Tono de comunicación"
          class="w-full h-8 bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-[#334155] rounded-lg px-3 text-[12px] text-slate-700 dark:text-slate-200 font-medium focus:outline-none focus:ring-2 focus:ring-primary-400 transition-all" />
      </div>
      <div class="flex-1 min-w-[180px]">
        <label class="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Valor</label>
        <input v-model="newPrefValue" placeholder="Ej: Formal pero cercano"
          class="w-full h-8 bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-[#334155] rounded-lg px-3 text-[12px] text-slate-700 dark:text-slate-200 font-medium focus:outline-none focus:ring-2 focus:ring-primary-400 transition-all" />
      </div>
      <button @click="handleAddPreference" :disabled="!newPrefKey.trim()"
        class="h-8 px-4 rounded-lg bg-primary-600 text-white text-[12px] font-black hover:bg-primary-700 transition-colors shadow-sm flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed shrink-0 self-end">
        <i class="fas fa-plus text-[9px]"></i> Agregar
      </button>
    </div>

    <div v-if="(client.preferences || []).length" class="grid grid-cols-1 md:grid-cols-2 gap-2">
      <div v-for="p in (client.preferences || [])" :key="p._id || p.key"
        class="bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-[#334155] rounded-xl px-3.5 py-2.5 flex items-center justify-between gap-2 shadow-sm">
        <div class="min-w-0">
          <p class="text-[9px] uppercase tracking-widest font-black text-slate-400 mb-0.5">{{ p.key }}</p>
          <p class="text-[12px] text-slate-700 dark:text-slate-200 font-semibold truncate">{{ p.value }}</p>
        </div>
        <button @click="removePreference(p)"
          class="h-6 w-6 rounded-lg flex items-center justify-center text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-500 transition-colors shrink-0">
          <i class="fas fa-times text-[9px]"></i>
        </button>
      </div>
    </div>

    <div v-else class="text-center py-8 bg-slate-50 dark:bg-[#0f172a] border border-dashed border-slate-200 dark:border-[#334155] rounded-xl">
      <i class="fas fa-heart text-2xl text-slate-300 dark:text-slate-600 mb-2"></i>
      <p class="text-slate-400 text-[12px] font-medium">No se han registrado preferencias.</p>
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
  if (success) { newPrefKey.value = ''; newPrefValue.value = '' }
}
</script>
