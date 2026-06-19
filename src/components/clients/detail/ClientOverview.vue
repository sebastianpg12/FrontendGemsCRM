<template>
  <div class="grid grid-cols-1 lg:grid-cols-3 gap-5">
    <!-- Columna izquierda -->
    <div class="lg:col-span-2 space-y-3">
      <!-- Acerca de -->
      <div>
        <label class="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Acerca de</label>
        <textarea v-model="draft.profile.about" :readonly="!editOverview" rows="4"
          class="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-100 dark:border-[#334155] rounded-xl px-3.5 py-2.5 text-slate-700 dark:text-slate-200 text-[12px] leading-relaxed focus:outline-none focus:ring-2 focus:ring-primary-400 transition-all resize-none"
          :class="!editOverview ? 'cursor-default opacity-80' : ''"
          placeholder="Descripción del cliente..."
        ></textarea>
      </div>
      <!-- Campos del perfil -->
      <div class="grid grid-cols-2 gap-2">
        <div v-for="f in overviewFields" :key="f.key">
          <label class="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{{ f.label }}</label>
          <input v-model="draft.profile[f.key]" :readonly="!editOverview" :placeholder="f.placeholder"
            class="w-full h-8 bg-slate-50 dark:bg-[#0f172a] border border-slate-100 dark:border-[#334155] rounded-lg px-3 text-slate-700 dark:text-slate-200 text-[12px] font-medium focus:outline-none focus:ring-2 focus:ring-primary-400 transition-all"
            :class="!editOverview ? 'cursor-default opacity-80' : ''" />
        </div>
      </div>
    </div>

    <!-- Columna derecha -->
    <div class="space-y-3">
      <!-- Etiquetas -->
      <div>
        <label class="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Etiquetas</label>
        <div class="bg-slate-50 dark:bg-[#0f172a] border border-slate-100 dark:border-[#334155] rounded-xl px-3 py-2.5 flex flex-wrap gap-1.5 min-h-[38px]">
          <span v-for="(tag, i) in draft.tags" :key="i"
            class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-primary-100 dark:bg-primary-500/20 text-primary-700 dark:text-primary-300 text-[10px] font-black">
            {{ tag }}
            <button v-if="editOverview" @click="draft.tags = draft.tags.filter((_: any, idx: number) => idx !== i)"
              class="text-primary-400 hover:text-rose-500 transition-colors">
              <i class="fas fa-times text-[7px]"></i>
            </button>
          </span>
          <input v-if="editOverview" v-model="newTag" @keyup.enter="handleAddTag"
            placeholder="+ etiqueta"
            class="bg-transparent text-[11px] text-slate-500 placeholder:text-slate-400 focus:outline-none flex-1 min-w-[70px]"/>
          <span v-if="!draft.tags?.length && !editOverview" class="text-[11px] text-slate-400">Sin etiquetas</span>
        </div>
      </div>

      <!-- Contacto — lista limpia -->
      <div>
        <label class="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Contacto</label>
        <div class="divide-y divide-slate-100 dark:divide-[#334155] border border-slate-100 dark:border-[#334155] rounded-xl overflow-hidden">
          <div v-for="cf in contactFields" :key="cf.key" class="bg-white dark:bg-[#1e293b] px-3 py-2 flex items-center gap-2.5">
            <i :class="['fas', cf.icon, 'text-[9px] text-slate-400 w-3 shrink-0']"></i>
            <input v-model="(draft as any)[cf.key]" :readonly="!editOverview" :placeholder="cf.placeholder"
              class="flex-1 bg-transparent text-[12px] text-slate-700 dark:text-slate-200 font-medium focus:outline-none min-w-0"
              :class="!editOverview ? 'cursor-default' : ''" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, inject } from 'vue'

defineProps<{ editOverview: boolean }>()

const ctx = inject('clientContext') as any
const draft = ctx.draft

const newTag = ref('')

const overviewFields = [
  { key: 'address',  label: 'Dirección',         placeholder: 'Calle 123...' },
  { key: 'website',  label: 'Sitio web',          placeholder: 'https://...' },
  { key: 'industry', label: 'Industria',          placeholder: 'Alimentos, TI...' },
  { key: 'size',     label: 'Tamaño de empresa',  placeholder: 'Pequeña, Mediana...' },
]

const contactFields = [
  { key: 'email',   label: 'Correo electrónico', icon: 'fa-envelope', placeholder: 'correo@empresa.com' },
  { key: 'phone',   label: 'Teléfono',           icon: 'fa-phone',    placeholder: '+57 300...' },
  { key: 'company', label: 'Nombre comercial',   icon: 'fa-building', placeholder: 'Empresa S.A.' },
]

const handleAddTag = () => {
  const v = newTag.value.trim()
  if (!v) return
  draft.tags = [...(draft.tags || []), v]
  newTag.value = ''
}
</script>
