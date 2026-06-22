<template>
  <div class="space-y-4">
    <div class="flex items-center gap-2 border-b border-slate-100 dark:border-[#334155] pb-3">
      <i class="fas fa-heart text-[12px] text-primary-400"></i>
      <span class="text-[13px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Preferencias</span>
      <span v-if="(client.preferences || []).length" class="px-1.5 py-0.5 rounded-md bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-300 text-[11px] font-black">{{ client.preferences.length }}</span>
    </div>

    <div class="bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-[#334155] rounded-xl p-3 flex flex-wrap gap-2 items-end">
      <div class="flex-1 min-w-[140px]">
        <label class="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1">Clave</label>
        <input v-model="newPrefKey" placeholder="Ej: Tono de comunicación"
          class="w-full h-8 bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-[#334155] rounded-lg px-3 text-[14px] text-slate-700 dark:text-slate-200 font-medium focus:outline-none focus:ring-2 focus:ring-primary-400 transition-all" />
      </div>
      <div class="flex-1 min-w-[160px]">
        <label class="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1">Valor</label>
        <input v-model="newPrefValue" placeholder="Ej: Formal pero cercano"
          class="w-full h-8 bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-[#334155] rounded-lg px-3 text-[14px] text-slate-700 dark:text-slate-200 font-medium focus:outline-none focus:ring-2 focus:ring-primary-400 transition-all" />
      </div>
      <button @click="handleAddPreference" :disabled="!newPrefKey.trim()"
        class="h-8 px-4 rounded-lg bg-primary-600 text-white text-[14px] font-black hover:bg-primary-700 transition-colors shadow-sm flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed shrink-0 self-end">
        <i class="fas fa-plus text-[11px]"></i> Agregar
      </button>
    </div>

    <div v-if="(client.preferences || []).length" class="divide-y divide-slate-100 dark:divide-[#334155] rounded-xl border border-slate-100 dark:border-[#334155] overflow-hidden">
      <div v-for="p in (client.preferences || [])" :key="p._id || p.key"
        class="bg-white dark:bg-[#1e293b] px-4 py-2.5 flex items-center justify-between gap-3 hover:bg-slate-50/50 dark:hover:bg-[#273449] transition-colors">
        <div class="flex items-baseline gap-3 min-w-0">
          <span class="text-[11px] font-black text-slate-400 uppercase tracking-widest shrink-0">{{ p.key }}</span>
          <span class="text-[14px] text-slate-700 dark:text-slate-200 font-semibold truncate">{{ p.value }}</span>
        </div>
        <button @click="removePreference(p)"
          class="h-5 w-5 rounded-md flex items-center justify-center text-slate-300 dark:text-slate-600 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors shrink-0">
          <i class="fas fa-times text-[10px]"></i>
        </button>
      </div>
    </div>

    <div v-else class="text-center py-10 border border-dashed border-slate-200 dark:border-[#334155] rounded-xl">
      <i class="fas fa-heart text-2xl text-slate-200 dark:text-slate-700 mb-2"></i>
      <p class="text-slate-400 text-[13px]">Sin preferencias registradas.</p>
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
