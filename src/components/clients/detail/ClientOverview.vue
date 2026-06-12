<template>
  <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
    <div class="lg:col-span-2 space-y-6">
      <div>
        <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Acerca de</label>
        <textarea v-model="draft.profile.about" :readonly="!editOverview"
          class="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-slate-800 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all min-h-[140px] resize-y"
          :class="!editOverview ? 'opacity-80' : 'shadow-sm'"
        ></textarea>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Dirección</label>
          <input v-model="draft.profile.address" :readonly="!editOverview" class="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-slate-800 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all font-medium" :class="!editOverview ? 'opacity-80' : 'shadow-sm'"/>
        </div>
        <div>
          <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Sitio web</label>
          <input v-model="draft.profile.website" :readonly="!editOverview" class="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-slate-800 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all font-medium" :class="!editOverview ? 'opacity-80' : 'shadow-sm'"/>
        </div>
        <div>
          <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Industria</label>
          <input v-model="draft.profile.industry" :readonly="!editOverview" class="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-slate-800 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all font-medium" :class="!editOverview ? 'opacity-80' : 'shadow-sm'"/>
        </div>
        <div>
          <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Tamaño de la Empresa</label>
          <input v-model="draft.profile.size" :readonly="!editOverview" class="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-slate-800 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all font-medium" :class="!editOverview ? 'opacity-80' : 'shadow-sm'"/>
        </div>
      </div>
    </div>
    
    <div class="space-y-6">
      <div class="bg-primary-50 p-5 rounded-xl border border-primary-100 shadow-sm">
        <label class="block text-xs font-bold text-primary-800 uppercase tracking-wider mb-3">Etiquetas</label>
        <div class="flex flex-wrap gap-2">
          <span v-for="(tag, i) in draft.tags" :key="i" class="px-2.5 py-1 rounded-md bg-white text-primary-700 text-[11px] font-bold uppercase tracking-wider border border-primary-200 shadow-sm">{{ tag }}</span>
          <input v-if="editOverview" v-model="newTag" @keyup.enter="handleAddTag" placeholder="+ Agregar etiqueta (Enter)" class="bg-white border border-primary-200 rounded-md px-3 py-1.5 text-xs text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 flex-1 min-w-[120px]"/>
        </div>
      </div>
      
      <div class="bg-slate-50 rounded-xl p-5 space-y-4 shadow-sm">
        <div>
          <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2"><i class="fas fa-envelope mr-1 text-slate-400"></i> Correo Electrónico</label>
          <input v-model="draft.email" :readonly="!editOverview" class="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all font-medium" :class="!editOverview ? 'opacity-80' : 'shadow-sm'"/>
        </div>
        <div>
          <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2"><i class="fas fa-phone mr-1 text-slate-400"></i> Teléfono</label>
          <input v-model="draft.phone" :readonly="!editOverview" class="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all font-medium" :class="!editOverview ? 'opacity-80' : 'shadow-sm'"/>
        </div>
        <div>
          <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2"><i class="fas fa-building mr-1 text-slate-400"></i> Nombre Comercial</label>
          <input v-model="draft.company" :readonly="!editOverview" class="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all font-medium" :class="!editOverview ? 'opacity-80' : 'shadow-sm'"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, inject } from 'vue'

// Props to sync edit state
defineProps<{
  editOverview: boolean
}>()

const ctx = inject('clientContext') as any
const draft = ctx.draft

const newTag = ref('')

const handleAddTag = () => {
  const v = newTag.value.trim()
  if (!v) return
  draft.tags = [...(draft.tags || []), v]
  newTag.value = ''
}
</script>
