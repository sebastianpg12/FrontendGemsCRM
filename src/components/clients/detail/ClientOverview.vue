<template>
  <div class="grid grid-cols-1 lg:grid-cols-3 gap-5">
    <!-- Columna izquierda -->
    <div class="lg:col-span-2 space-y-4">
      <div>
        <label class="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Acerca de</label>
        <textarea v-model="draft.profile.about" :readonly="!editOverview" rows="5"
          class="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-[#334155] rounded-xl px-4 py-3 text-slate-700 dark:text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 transition-all resize-none"
          :class="!editOverview ? 'cursor-default' : ''"
          placeholder="Descripción del cliente..."
        ></textarea>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div v-for="f in overviewFields" :key="f.key">
          <label class="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">{{ f.label }}</label>
          <input v-model="draft.profile[f.key]" :readonly="!editOverview" :placeholder="f.placeholder"
            class="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-[#334155] rounded-xl px-3.5 py-2.5 text-slate-700 dark:text-slate-200 text-[13px] font-medium focus:outline-none focus:ring-2 focus:ring-primary-400 transition-all"
            :class="!editOverview ? 'cursor-default' : ''" />
        </div>
      </div>
    </div>

    <!-- Columna derecha — labels alineados con los del left -->
    <div class="space-y-4">
      <!-- Etiquetas -->
      <div>
        <label class="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Etiquetas</label>
        <div class="bg-primary-50 dark:bg-primary-500/10 border border-primary-100 dark:border-primary-500/20 rounded-xl px-3 py-2.5 flex flex-wrap gap-1.5 min-h-[42px]">
          <span v-for="(tag, i) in draft.tags" :key="i"
            class="px-2.5 py-0.5 rounded-lg bg-white dark:bg-[#1e293b] text-primary-700 dark:text-primary-300 text-[10px] font-black uppercase tracking-wider border border-primary-200 dark:border-primary-500/30 flex items-center gap-1.5">
            {{ tag }}
            <button v-if="editOverview" @click="draft.tags = draft.tags.filter((_: any, idx: number) => idx !== i)"
              class="text-primary-400 hover:text-rose-500 transition-colors leading-none">
              <i class="fas fa-times text-[8px]"></i>
            </button>
          </span>
          <input v-if="editOverview" v-model="newTag" @keyup.enter="handleAddTag"
            placeholder="+ etiqueta"
            class="bg-transparent text-[11px] text-primary-700 dark:text-primary-300 placeholder:text-primary-400 focus:outline-none flex-1 min-w-[80px]"/>
        </div>
      </div>

      <!-- Info de contacto -->
      <div class="bg-slate-50 dark:bg-[#0f172a] rounded-xl p-3.5 space-y-3">
        <div v-for="cf in contactFields" :key="cf.key">
          <label class="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-1">
            <i :class="['fas', cf.icon, 'text-[9px]']"></i>{{ cf.label }}
          </label>
          <input v-model="(draft as any)[cf.key]" :readonly="!editOverview" :placeholder="cf.placeholder"
            class="w-full bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-[#334155] rounded-lg px-3 py-2 text-slate-700 dark:text-slate-200 text-[12px] font-medium focus:outline-none focus:ring-2 focus:ring-primary-400 transition-all"
            :class="!editOverview ? 'cursor-default' : ''" />
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
