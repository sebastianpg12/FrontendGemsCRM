<template>
  <Teleport to="body">
    <!-- Botón ? flotante — alineado horizontalmente con el notification bell -->
    <button
      v-if="pageHelp"
      @click="open = true"
      class="fixed z-[180] w-9 h-9 rounded-full bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-[#334155] shadow-md flex items-center justify-center text-slate-400 dark:text-slate-500 hover:text-primary-600 dark:hover:text-primary-400 hover:border-primary-400 transition-all duration-150 hover:scale-110 bottom-28 right-[68px] lg:bottom-6 lg:right-[84px]"
      title="Ayuda de esta página"
    >
      <span class="text-[13px] font-black leading-none">?</span>
    </button>

    <!-- Modal de tutorial -->
    <Transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div v-if="open" class="fixed inset-0 z-[200] flex items-end sm:items-center justify-center sm:p-4 p-0" @click.self="open = false">
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-slate-900/40" @click="open = false"></div>

        <!-- Panel -->
        <div class="relative w-full sm:max-w-sm bg-white dark:bg-[#1e293b] sm:rounded-xl rounded-t-2xl shadow-2xl overflow-hidden z-10 max-h-[85vh] flex flex-col">

          <!-- Header -->
          <div class="px-5 pt-5 pb-4 border-b border-slate-100 dark:border-[#334155] shrink-0">
            <div class="flex items-start justify-between gap-3">
              <div>
                <div class="flex items-center gap-1.5 mb-1">
                  <i class="fas fa-gem text-primary-400 text-[8px]"></i>
                  <span class="text-[8px] font-black uppercase tracking-[0.2em] text-primary-400">GEMS Hub · Ayuda</span>
                </div>
                <h3 class="text-[15px] font-black text-slate-900 dark:text-slate-100 leading-tight">{{ pageHelp?.title }}</h3>
                <p class="text-[11px] text-slate-400 mt-0.5">{{ pageHelp?.subtitle }}</p>
              </div>
              <button @click="open = false"
                class="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#334155] transition-all shrink-0 mt-0.5">
                <i class="fas fa-times text-[11px]"></i>
              </button>
            </div>
          </div>

          <!-- Steps -->
          <div class="overflow-y-auto custom-scrollbar">
            <div class="p-4 space-y-2">
              <div
                v-for="(step, i) in pageHelp?.steps"
                :key="i"
                class="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-[#0f172a]/60"
              >
                <div class="w-7 h-7 rounded-lg bg-primary-50 dark:bg-primary-500/15 flex items-center justify-center shrink-0 mt-0.5">
                  <i :class="['fas', step.icon, 'text-primary-500 text-[10px]']"></i>
                </div>
                <div class="min-w-0">
                  <div class="flex items-center gap-2 mb-0.5">
                    <span class="text-[8px] font-black text-primary-400 uppercase tracking-widest">{{ i + 1 }}</span>
                    <p class="text-[12px] font-black text-slate-800 dark:text-slate-200 leading-tight">{{ step.title }}</p>
                  </div>
                  <p class="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">{{ step.desc }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div class="px-4 pb-4 pt-2 shrink-0">
            <button @click="open = false"
              class="w-full h-8 rounded-lg bg-primary-600 hover:bg-primary-700 text-white text-[12px] font-black transition-colors">
              Entendido
            </button>
          </div>

        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { helpContent } from '../../config/helpContent'

const route = useRoute()
const open = ref(false)

const pageHelp = computed(() => {
  const path = '/' + route.path.split('/')[1]
  return helpContent[path] ?? helpContent[route.path] ?? null
})
</script>
