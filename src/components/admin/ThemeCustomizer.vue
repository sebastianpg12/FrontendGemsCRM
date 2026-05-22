<template>
  <div class="space-y-4">
    <!-- Header GEMS style -->
    <div>
      <div class="flex items-center gap-2 mb-0.5">
        <i class="fas fa-gem text-primary-400 text-[9px]"></i>
        <span class="text-[9px] font-black uppercase tracking-[0.22em] text-primary-400">GEMS CRM</span>
      </div>
      <h2 class="text-[18px] font-black text-slate-900 tracking-tight">Personalización de Marca</h2>
      <p class="text-slate-400 text-[10px] font-medium mt-0.5">Logo, color de acento y nombre — cambios en tiempo real</p>
    </div>

    <!-- Grid principal -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">

      <!-- Settings Panel -->
      <div class="space-y-3">

        <!-- Logo Upload -->
        <div class="bg-white p-4 rounded-xl border border-slate-100">
          <label class="block text-[9px] font-black text-slate-500 mb-2 uppercase tracking-[0.18em]">
            <i class="fas fa-image text-primary-400 mr-1.5"></i>Logo
          </label>
          <div class="space-y-2">
            <div v-if="themeStore.config.logo" class="flex items-center gap-2.5 p-2.5 bg-slate-50 rounded-lg">
              <img :src="themeStore.config.logo" alt="Current logo" class="h-8 w-auto object-contain" />
              <button @click="removeLogo" class="ml-auto text-[10px] font-black text-rose-400 hover:text-rose-600 transition-colors">
                <i class="fas fa-trash mr-1"></i>Eliminar
              </button>
            </div>
            <input
              type="text"
              v-model="logoUrl"
              placeholder="https://ejemplo.com/logo.png"
              class="w-full px-3 py-2 border border-slate-200 rounded-lg text-[11px] focus:ring-1 focus:ring-primary-500/20 focus:border-primary-400 outline-none transition-all"
            />
            <p class="text-[9px] text-slate-300">URL completa del logo (PNG, SVG o JPG)</p>
          </div>
        </div>

        <!-- Brand Name -->
        <div class="bg-white p-4 rounded-xl border border-slate-100">
          <label class="block text-[9px] font-black text-slate-500 mb-2 uppercase tracking-[0.18em]">
            <i class="fas fa-gem text-primary-400 mr-1.5"></i>Nombre de Marca
          </label>
          <input
            type="text"
            v-model="brandName"
            placeholder="GEMS CRM"
            class="w-full px-3 py-2 border border-slate-200 rounded-lg text-[11px] font-semibold focus:ring-1 focus:ring-primary-500/20 focus:border-primary-400 outline-none transition-all"
          />
          <p class="text-[9px] text-slate-300 mt-1.5">Nombre visible en la barra lateral</p>
        </div>

        <!-- Accent Color -->
        <div class="bg-white p-4 rounded-xl border border-slate-100">
          <label class="block text-[9px] font-black text-slate-500 mb-2 uppercase tracking-[0.18em]">
            <i class="fas fa-palette text-primary-400 mr-1.5"></i>Color de Acento
          </label>
          <div class="flex items-center gap-2.5">
            <input
              type="color"
              v-model="accentColor"
              class="w-9 h-9 rounded-lg cursor-pointer border border-slate-200 transition-all hover:border-primary-300 shrink-0"
            />
            <input
              type="text"
              v-model="accentColor"
              class="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-[11px] font-mono focus:ring-1 focus:ring-primary-500/20 focus:border-primary-400 outline-none transition-all"
            />
          </div>
          <p class="text-[9px] text-slate-300 mt-1.5">Formato hexadecimal (#8b5cf6)</p>
        </div>

        <!-- Dark Mode -->
        <div class="bg-white p-4 rounded-xl border border-slate-100">
          <label class="flex items-center gap-2.5 cursor-pointer group">
            <input
              type="checkbox"
              v-model="darkMode"
              class="peer appearance-none w-4 h-4 rounded border border-slate-200 checked:bg-primary-500 checked:border-primary-500 transition-all cursor-pointer shrink-0"
            />
            <span class="text-[11px] font-black text-slate-600 group-hover:text-primary-600 transition-colors">
              <i class="fas fa-moon text-primary-400 mr-1.5"></i>Modo Oscuro
            </span>
          </label>
          <p class="text-[9px] text-slate-300 mt-1.5 ml-6">Aplicar tema oscuro a toda la interfaz</p>
        </div>

        <!-- Actions -->
        <div class="flex gap-2">
          <button
            @click="saveTheme"
            class="flex-1 py-2 bg-primary-600 hover:bg-primary-700 active:scale-95 text-white text-[11px] font-black rounded-xl transition-all shadow-md shadow-primary-500/20"
          >
            <i class="fas fa-save mr-1.5"></i>Guardar
          </button>
          <button
            @click="resetTheme"
            class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-500 text-[11px] font-black rounded-xl transition-colors"
          >
            <i class="fas fa-redo mr-1"></i>Restaurar
          </button>
        </div>
      </div>

      <!-- Live Preview -->
      <div class="space-y-3">

        <!-- Preview card -->
        <div class="bg-white p-4 rounded-xl border border-slate-100">
          <p class="text-[9px] font-black text-slate-400 uppercase tracking-[0.18em] mb-3">Vista Previa</p>
          <div
            class="relative rounded-xl overflow-hidden border"
            :style="{ borderColor: previewAccentColor + '40' }"
          >
            <div class="absolute inset-0 opacity-[0.04]" :style="{ backgroundColor: accentColor }"></div>
            <div class="relative p-4 space-y-3">
              <!-- Logo -->
              <div class="flex justify-center">
                <img v-if="logoUrl" :src="logoUrl" alt="Preview" class="h-10 w-auto object-contain" @error="logoError = true" />
                <div v-else class="h-10 w-10 bg-slate-100 rounded-lg flex items-center justify-center">
                  <i class="fas fa-image text-slate-300"></i>
                </div>
              </div>
              <!-- Brand -->
              <h3 class="text-center text-[14px] font-black" :style="{ color: accentColor }">
                {{ brandName || 'GEMS CRM' }}
              </h3>
              <!-- Sample input -->
              <div class="space-y-1.5">
                <input type="text" placeholder="usuario@email.com" disabled
                  class="w-full px-3 py-2 bg-slate-50 border rounded-lg text-[11px]"
                  :style="{ borderColor: `${accentColor}30` }" />
                <button disabled
                  class="w-full py-2 text-white text-[11px] font-black rounded-lg"
                  :style="{ backgroundColor: accentColor }">
                  Acceder
                </button>
              </div>
              <!-- Mode badge -->
              <div class="flex justify-center">
                <span class="px-2 py-0.5 rounded-full text-[9px] font-black text-white"
                  :style="{ backgroundColor: accentColor }">
                  {{ darkMode ? 'Oscuro' : 'Claro' }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Color Presets -->
        <div class="bg-white p-4 rounded-xl border border-slate-100">
          <p class="text-[9px] font-black text-slate-400 uppercase tracking-[0.18em] mb-2.5">Colores rápidos</p>
          <div class="grid grid-cols-8 gap-1.5">
            <button
              v-for="preset in colorPresets"
              :key="preset.value"
              @click="accentColor = preset.value"
              class="h-7 rounded-lg border-2 transition-all hover:scale-110 active:scale-95"
              :style="{
                backgroundColor: preset.value,
                borderColor: accentColor === preset.value ? '#1e1b4b' : preset.value + '30'
              }"
              :title="preset.name"
            >
              <i v-if="accentColor === preset.value" class="fas fa-check text-white text-[9px]"></i>
            </button>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useThemeStore } from '@/stores/theme'
import { useNotifications } from '@/composables/useNotifications'

const themeStore = useThemeStore()
const { showSuccess, showError } = useNotifications()

const logoUrl = ref(themeStore.config.logo || '')
const brandName = ref(themeStore.config.brandName || 'GEMS CRM')
const accentColor = ref(themeStore.config.accentColor || '#8b5cf6')
const darkMode = ref(themeStore.config.darkMode || false)
const logoError = ref(false)

const colorPresets = [
  { name: 'GEMS Violet', value: '#8b5cf6' },
  { name: 'Purple', value: '#a855f7' },
  { name: 'Rose', value: '#ec4899' },
  { name: 'Teal', value: '#14b8a6' },
  { name: 'Amber', value: '#f59e0b' },
  { name: 'Slate', value: '#64748b' },
  { name: 'Emerald', value: '#10b981' },
  { name: 'Indigo', value: '#6366f1' }
]

const previewAccentColor = computed(() => {
  try { return accentColor.value } catch { return '#8b5cf6' }
})

const saveTheme = () => {
  if (logoUrl.value && logoError.value) { showError('El URL del logo no es válido'); return }
  themeStore.update({
    logo: logoUrl.value || null,
    brandName: brandName.value || 'GEMS CRM',
    accentColor: accentColor.value || '#8b5cf6',
    darkMode: darkMode.value
  })
  showSuccess('Personalización guardada')
}

const removeLogo = () => { logoUrl.value = ''; logoError.value = false }

const resetTheme = () => {
  logoUrl.value = ''
  brandName.value = 'GEMS CRM'
  accentColor.value = '#8b5cf6'
  darkMode.value = false
  logoError.value = false
  themeStore.reset()
  showSuccess('Tema restaurado')
}

onMounted(() => { themeStore.load() })
</script>
