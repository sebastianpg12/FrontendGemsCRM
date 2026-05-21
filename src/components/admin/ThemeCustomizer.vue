<template>
  <div class="space-y-8">
    <!-- Header -->
    <div>
      <h2 class="text-2xl font-black text-slate-800 mb-2">Personalización de Marca</h2>
      <p class="text-slate-500 text-sm">Configura el logo, color de acento y nombre de tu organización en GEMS CRM</p>
    </div>

    <!-- Theme Preview -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- Settings Panel -->
      <div class="space-y-6">
        <!-- Logo Upload -->
        <div class="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <label class="block text-sm font-black text-slate-700 mb-3 uppercase tracking-wide">
            <i class="fas fa-image text-primary-500 mr-2"></i>Logo
          </label>
          <div class="space-y-3">
            <div v-if="themeStore.config.logo" class="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
              <img :src="themeStore.config.logo" alt="Current logo" class="h-12 w-auto object-contain" />
              <button
                @click="removeLogo"
                class="ml-auto text-xs font-bold text-rose-500 hover:text-rose-600 transition-colors"
              >
                <i class="fas fa-trash"></i> Eliminar
              </button>
            </div>
            <input
              type="text"
              v-model="logoUrl"
              placeholder="https://ejemplo.com/logo.png"
              class="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all"
            />
            <p class="text-xs text-slate-400">Ingresa la URL completa del logo (PNG, SVG o JPG)</p>
          </div>
        </div>

        <!-- Brand Name -->
        <div class="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <label class="block text-sm font-black text-slate-700 mb-3 uppercase tracking-wide">
            <i class="fas fa-gem text-primary-500 mr-2"></i>Nombre de Marca
          </label>
          <input
            type="text"
            v-model="brandName"
            placeholder="GEMS CRM"
            class="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all"
          />
          <p class="text-xs text-slate-400 mt-2">Nombre de tu organización en el sistema</p>
        </div>

        <!-- Accent Color -->
        <div class="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <label class="block text-sm font-black text-slate-700 mb-3 uppercase tracking-wide">
            <i class="fas fa-palette text-primary-500 mr-2"></i>Color Secundario
          </label>
          <div class="flex items-center gap-3">
            <input
              type="color"
              v-model="accentColor"
              class="w-16 h-16 rounded-xl cursor-pointer border-2 border-slate-200 transition-all hover:border-primary-400"
            />
            <div class="flex-1">
              <input
                type="text"
                v-model="accentColor"
                class="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm font-mono focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all"
              />
              <p class="text-xs text-slate-400 mt-1">Usa hexadecimal (#8b5cf6)</p>
            </div>
          </div>
        </div>

        <!-- Dark Mode Toggle -->
        <div class="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <label class="flex items-center cursor-pointer group">
            <input
              type="checkbox"
              v-model="darkMode"
              class="peer appearance-none w-5 h-5 rounded-md border-2 border-slate-200 checked:bg-primary-500 checked:border-primary-500 transition-all cursor-pointer"
            />
            <i class="fas fa-check absolute text-white text-sm pointer-events-none opacity-0 peer-checked:opacity-100"></i>
            <span class="ml-3 text-sm font-bold text-slate-700 group-hover:text-primary-600 transition-colors">
              <i class="fas fa-moon text-primary-500 mr-2"></i>Modo Oscuro
            </span>
          </label>
          <p class="text-xs text-slate-400 mt-2 ml-8">Aplicar tema oscuro a toda la interfaz</p>
        </div>

        <!-- Save Button -->
        <button
          @click="saveTheme"
          class="w-full py-4 bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 text-white font-black rounded-2xl transition-all duration-300 shadow-lg shadow-primary-500/20 active:scale-95"
        >
          <i class="fas fa-save mr-2"></i>Guardar Personalización
        </button>

        <!-- Reset Button -->
        <button
          @click="resetTheme"
          class="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-xl transition-colors"
        >
          <i class="fas fa-redo mr-2"></i>Restaurar Valores Predeterminados
        </button>
      </div>

      <!-- Live Preview -->
      <div class="space-y-6">
        <div class="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <p class="text-xs font-black text-slate-400 uppercase tracking-wide mb-4">Vista Previa en Vivo</p>

          <!-- Mini Login Preview -->
          <div
            class="relative rounded-2xl overflow-hidden border-2"
            :style="{ borderColor: previewAccentColor }"
          >
            <!-- Background gradient -->
            <div
              class="absolute inset-0 opacity-5"
              :style="{ backgroundColor: accentColor }"
            ></div>

            <div class="relative p-6 space-y-4">
              <!-- Logo preview -->
              <div class="flex justify-center mb-4">
                <img
                  v-if="logoUrl"
                  :src="logoUrl"
                  alt="Preview logo"
                  class="h-16 w-auto object-contain"
                  @error="logoError = true"
                />
                <div v-else class="h-16 w-16 bg-slate-200 rounded-xl flex items-center justify-center text-slate-400">
                  <i class="fas fa-image text-2xl"></i>
                </div>
              </div>

              <!-- Brand name preview -->
              <h3 class="text-center text-2xl font-black" :style="{ color: accentColor }">
                {{ brandName || 'GEMS CRM' }}
              </h3>

              <!-- Sample input with accent color -->
              <div class="space-y-2">
                <div class="relative">
                  <input
                    type="text"
                    placeholder="usuario@email.com"
                    disabled
                    class="w-full px-4 py-3 bg-slate-50 border-2 rounded-xl text-sm"
                    :style="{ borderColor: `${accentColor}40` }"
                  />
                </div>
                <button
                  disabled
                  class="w-full py-3 text-white font-bold rounded-xl transition-all text-sm"
                  :style="{ backgroundColor: accentColor }"
                >
                  Acceder
                </button>
              </div>

              <!-- Theme indicators -->
              <div class="flex justify-center gap-2 pt-2">
                <span class="text-[10px] font-bold text-slate-400 uppercase">Tema:</span>
                <span
                  class="px-3 py-1 rounded-full text-[10px] font-black text-white"
                  :style="{ backgroundColor: accentColor }"
                >
                  {{ darkMode ? 'Oscuro' : 'Claro' }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Color Presets -->
        <div class="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <p class="text-xs font-black text-slate-400 uppercase tracking-wide mb-3">Colores Rápidos</p>
          <div class="grid grid-cols-4 gap-2">
            <button
              v-for="preset in colorPresets"
              :key="preset.value"
              @click="accentColor = preset.value"
              class="h-12 rounded-xl border-2 transition-all hover:scale-105 active:scale-95"
              :style="{
                backgroundColor: preset.value,
                borderColor: accentColor === preset.value ? '#000' : preset.value + '40'
              }"
              :title="preset.name"
            >
              <i v-if="accentColor === preset.value" class="fas fa-check text-white text-sm"></i>
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
  try {
    return accentColor.value
  } catch {
    return '#8b5cf6'
  }
})

const saveTheme = () => {
  if (logoUrl.value && logoError.value) {
    showError('El URL del logo no es válido')
    return
  }

  themeStore.update({
    logo: logoUrl.value || null,
    brandName: brandName.value || 'GEMS CRM',
    accentColor: accentColor.value || '#8b5cf6',
    darkMode: darkMode.value
  })

  showSuccess('Personalización guardada exitosamente')
}

const removeLogo = () => {
  logoUrl.value = ''
  logoError.value = false
}

const resetTheme = () => {
  logoUrl.value = ''
  brandName.value = 'GEMS CRM'
  accentColor.value = '#8b5cf6'
  darkMode.value = false
  logoError.value = false
  themeStore.reset()
  showSuccess('Tema restaurado a valores predeterminados')
}

onMounted(() => {
  themeStore.load()
})
</script>
