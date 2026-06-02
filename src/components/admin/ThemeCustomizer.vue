<template>
  <div class="space-y-5">
    <!-- Header -->
    <div>
      <div class="flex items-center gap-2 mb-0.5">
        <i class="fas fa-gem text-primary-400 text-[9px]"></i>
        <span class="text-[9px] font-black uppercase tracking-[0.22em] text-primary-400">GEMS Hub</span>
      </div>
      <h2 class="text-[18px] font-black text-slate-900 tracking-tight">Personalización de Marca</h2>
      <p class="text-slate-400 text-[10px] font-medium mt-0.5">Logo, color de acento y nombre — cambios en tiempo real, guardados en la nube</p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-5">

      <!-- ── LEFT: Settings ─────────────────────────────────────── -->
      <div class="space-y-3">

        <!-- Logo Upload -->
        <div class="bg-white p-4 rounded-xl border border-slate-100">
          <label class="block text-[9px] font-black text-slate-500 mb-2.5 uppercase tracking-[0.18em]">
            <i class="fas fa-image text-primary-400 mr-1.5"></i>Logo de la empresa
          </label>

          <!-- Current logo preview -->
          <div v-if="config.logo" class="flex items-center gap-3 p-3 bg-slate-50 rounded-xl mb-3 border border-slate-100">
            <img :src="config.logo" alt="Logo actual" class="h-10 w-auto max-w-[120px] object-contain" />
            <div class="flex-1 min-w-0">
              <p class="text-[10px] font-black text-slate-600 truncate">Logo activo</p>
              <p class="text-[9px] text-slate-400">Visible en sidebar y login</p>
            </div>
            <button @click="removeLogo" :disabled="saving"
              class="w-7 h-7 flex items-center justify-center rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-400 hover:text-rose-600 transition-all border border-rose-100">
              <i class="fas fa-trash text-[9px]"></i>
            </button>
          </div>

          <!-- Upload area -->
          <div
            class="relative border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all"
            :class="dragging
              ? 'border-primary-400 bg-primary-50'
              : 'border-slate-200 hover:border-primary-300 hover:bg-slate-50'"
            @click="fileInput?.click()"
            @dragover.prevent="dragging = true"
            @dragleave.prevent="dragging = false"
            @drop.prevent="onDrop"
          >
            <input ref="fileInput" type="file" accept="image/png,image/svg+xml,image/jpeg,image/jpg,image/webp,image/gif"
              class="hidden" @change="onFileChange" />
            <i v-if="!uploading" class="fas fa-cloud-upload-alt text-2xl text-slate-300 mb-1.5 block"></i>
            <i v-else class="fas fa-circle-notch fa-spin text-2xl text-primary-400 mb-1.5 block"></i>
            <p class="text-[10px] font-black text-slate-500">
              {{ uploading ? 'Subiendo...' : 'Arrastra o haz clic para subir' }}
            </p>
            <p class="text-[9px] text-slate-300 mt-0.5">PNG, SVG, JPG, WebP · Máx 3 MB</p>
          </div>

          <!-- URL manual (fallback) -->
          <div class="mt-2.5">
            <p class="text-[9px] font-black text-slate-400 uppercase tracking-wider mb-1.5">O ingresa una URL</p>
            <input
              v-model="logoUrlInput"
              type="text"
              placeholder="https://ejemplo.com/logo.png"
              class="w-full px-3 py-2 border border-slate-200 rounded-lg text-[11px] focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 outline-none transition-all"
              @blur="applyLogoUrl"
              @keydown.enter.prevent="applyLogoUrl"
            />
          </div>
        </div>

        <!-- Brand Name -->
        <div class="bg-white p-4 rounded-xl border border-slate-100">
          <label class="block text-[9px] font-black text-slate-500 mb-2 uppercase tracking-[0.18em]">
            <i class="fas fa-gem text-primary-400 mr-1.5"></i>Nombre de la empresa
          </label>
          <input
            v-model="brandName"
            type="text"
            placeholder="GEMS Hub"
            class="w-full px-3 py-2 border border-slate-200 rounded-lg text-[11px] font-semibold focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 outline-none transition-all"
          />
          <p class="text-[9px] text-slate-300 mt-1.5">Aparece en la barra lateral y la pantalla de login</p>
        </div>

        <!-- Accent Color -->
        <div class="bg-white p-4 rounded-xl border border-slate-100">
          <label class="block text-[9px] font-black text-slate-500 mb-2.5 uppercase tracking-[0.18em]">
            <i class="fas fa-palette text-primary-400 mr-1.5"></i>Color de acento
          </label>

          <!-- Color presets -->
          <div class="grid grid-cols-10 gap-1.5 mb-3">
            <button
              v-for="preset in colorPresets"
              :key="preset.value"
              @click="accentColor = preset.value"
              class="h-7 rounded-lg border-2 transition-all hover:scale-110 active:scale-95 flex items-center justify-center"
              :style="{
                backgroundColor: preset.value,
                borderColor: accentColor === preset.value ? '#1e1b4b' : 'transparent',
              }"
              :title="preset.name"
            >
              <i v-if="accentColor === preset.value" class="fas fa-check text-white text-[8px] drop-shadow"></i>
            </button>
          </div>

          <!-- Hex input + picker -->
          <div class="flex items-center gap-2">
            <input
              type="color"
              v-model="accentColor"
              class="w-10 h-10 rounded-xl cursor-pointer border-2 border-slate-200 transition-all hover:border-primary-300 shrink-0 p-0.5"
            />
            <input
              type="text"
              v-model="accentColor"
              placeholder="#8b5cf6"
              class="flex-1 px-3 py-2.5 border border-slate-200 rounded-xl text-[11px] font-mono font-bold focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 outline-none transition-all"
            />
            <!-- Live swatch -->
            <div class="w-10 h-10 rounded-xl border-2 border-slate-100 shrink-0 shadow-inner"
              :style="{ backgroundColor: accentColor }">
            </div>
          </div>
          <p class="text-[9px] text-slate-300 mt-1.5">Este color se aplica a toda la interfaz (botones, sidebar, badges, etc.)</p>
        </div>

        <!-- Dark Mode -->
        <div class="bg-white p-4 rounded-xl border border-slate-100">
          <label class="flex items-center gap-3 cursor-pointer group">
            <div
              @click="darkMode = !darkMode"
              class="relative w-11 h-6 rounded-full cursor-pointer transition-colors duration-200 flex-shrink-0"
              :class="darkMode ? 'bg-primary-600' : 'bg-slate-200'"
            >
              <div class="absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200"
                :class="darkMode ? 'translate-x-5' : 'translate-x-0'">
              </div>
            </div>
            <div>
              <p class="text-[11px] font-black text-slate-700">
                <i class="fas fa-moon text-primary-400 mr-1.5"></i>Modo Oscuro
              </p>
              <p class="text-[9px] text-slate-400 mt-0.5">Aplica tema oscuro a toda la interfaz</p>
            </div>
          </label>
        </div>

        <!-- Actions -->
        <div class="flex gap-2">
          <button
            @click="saveTheme"
            :disabled="saving"
            class="flex-1 py-2.5 bg-primary-600 hover:bg-primary-700 active:scale-95 text-white text-[11px] font-black rounded-xl transition-all shadow-lg shadow-primary-500/25 disabled:opacity-60 flex items-center justify-center gap-2"
          >
            <i v-if="saving" class="fas fa-circle-notch fa-spin"></i>
            <i v-else class="fas fa-save"></i>
            {{ saving ? 'Guardando...' : 'Guardar Cambios' }}
          </button>
          <button
            @click="resetTheme"
            :disabled="saving"
            class="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-500 text-[11px] font-black rounded-xl transition-colors disabled:opacity-60"
            title="Restaurar valores por defecto"
          >
            <i class="fas fa-redo mr-1"></i>Restaurar
          </button>
        </div>
      </div>

      <!-- ── RIGHT: Live Preview ─────────────────────────────────── -->
      <div class="space-y-3">

        <!-- App preview mockup -->
        <div class="bg-white p-4 rounded-xl border border-slate-100">
          <p class="text-[9px] font-black text-slate-400 uppercase tracking-[0.18em] mb-3">
            <i class="fas fa-eye mr-1.5"></i>Vista Previa en Tiempo Real
          </p>

          <!-- Sidebar + content mockup -->
          <div class="rounded-xl overflow-hidden border border-slate-200 flex h-48 shadow-sm">
            <!-- Mock sidebar -->
            <div class="w-14 flex flex-col items-center py-3 gap-2 border-r border-slate-100"
              :style="{ background: darkMode ? '#0f172a' : '#fff' }">
              <div class="w-8 h-8 rounded-lg overflow-hidden mb-1">
                <img v-if="config.logo" :src="config.logo" class="w-full h-full object-contain" />
                <div v-else class="w-8 h-8 rounded-lg flex items-center justify-center"
                  :style="{ backgroundColor: accentColor + '20' }">
                  <i class="fas fa-gem text-[10px]" :style="{ color: accentColor }"></i>
                </div>
              </div>
              <div v-for="i in 5" :key="i"
                class="w-7 h-7 rounded-lg"
                :style="{
                  backgroundColor: i === 1 ? accentColor : (darkMode ? '#1e293b' : '#f1f5f9'),
                }">
              </div>
            </div>
            <!-- Mock content -->
            <div class="flex-1 flex flex-col" :style="{ background: darkMode ? '#0f172a' : '#f8fafc' }">
              <!-- Header -->
              <div class="h-9 border-b flex items-center px-3 gap-2"
                :style="{ background: darkMode ? '#1e293b' : '#fff', borderColor: darkMode ? '#334155' : '#e2e8f0' }">
                <div class="flex-1 h-2.5 rounded-full bg-slate-200"></div>
                <div class="w-6 h-6 rounded-full"
                  :style="{ backgroundColor: accentColor + '30' }">
                </div>
              </div>
              <!-- Cards row -->
              <div class="flex-1 p-2 flex gap-2 items-start">
                <div v-for="i in 3" :key="i" class="flex-1 rounded-lg p-2 border"
                  :style="{
                    background: darkMode ? '#1e293b' : '#fff',
                    borderColor: darkMode ? '#334155' : '#e2e8f0'
                  }">
                  <div class="w-full h-1.5 rounded-full mb-1"
                    :style="{ backgroundColor: i === 1 ? accentColor : '#e2e8f0' }">
                  </div>
                  <div class="w-2/3 h-1.5 rounded-full bg-slate-100"></div>
                </div>
              </div>
              <!-- Footer bar -->
              <div class="h-6 flex items-center justify-center">
                <span class="text-[8px] font-black" :style="{ color: accentColor }">
                  {{ brandName || 'GEMS Hub' }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Button samples -->
        <div class="bg-white p-4 rounded-xl border border-slate-100">
          <p class="text-[9px] font-black text-slate-400 uppercase tracking-[0.18em] mb-3">Elementos de UI</p>
          <div class="space-y-2">
            <button class="w-full py-2 rounded-xl text-white text-[11px] font-black shadow-lg transition-all"
              :style="{ backgroundColor: accentColor, boxShadow: `0 4px 12px ${accentColor}40` }">
              <i class="fas fa-save mr-1.5"></i>Botón primario
            </button>
            <div class="flex gap-2">
              <span class="px-3 py-1.5 rounded-xl text-[10px] font-black text-white"
                :style="{ backgroundColor: accentColor }">
                Badge activo
              </span>
              <span class="px-3 py-1.5 rounded-xl text-[10px] font-black border-2"
                :style="{ color: accentColor, borderColor: accentColor }">
                Outline
              </span>
              <span class="px-3 py-1.5 rounded-xl text-[10px] font-black"
                :style="{ backgroundColor: accentColor + '18', color: accentColor }">
                Soft
              </span>
            </div>
            <div class="flex items-center gap-2 px-3 py-2 rounded-xl border-2"
              :style="{ borderColor: accentColor + '40' }">
              <div class="w-2 h-2 rounded-full animate-pulse"
                :style="{ backgroundColor: accentColor }"></div>
              <span class="text-[10px] font-bold text-slate-600">Input activo</span>
            </div>
          </div>
        </div>

        <!-- Login card preview -->
        <div class="bg-white p-4 rounded-xl border border-slate-100">
          <p class="text-[9px] font-black text-slate-400 uppercase tracking-[0.18em] mb-3">Login</p>
          <div class="rounded-xl p-3 border flex flex-col items-center gap-2"
            :style="{ borderColor: accentColor + '30', background: accentColor + '06' }">
            <img v-if="config.logo" :src="config.logo" class="h-8 w-auto object-contain" />
            <div v-else class="w-8 h-8 rounded-lg flex items-center justify-center"
              :style="{ background: accentColor + '20' }">
              <i class="fas fa-gem" :style="{ color: accentColor }"></i>
            </div>
            <p class="text-[11px] font-black" :style="{ color: accentColor }">
              {{ brandName || 'GEMS Hub' }}
            </p>
            <input disabled type="text" placeholder="usuario@empresa.com"
              class="w-full px-2.5 py-1.5 border rounded-lg text-[9px] bg-white"
              :style="{ borderColor: accentColor + '40' }" />
            <button disabled class="w-full py-1.5 rounded-lg text-white text-[9px] font-black"
              :style="{ backgroundColor: accentColor }">
              Iniciar Sesión
            </button>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useThemeStore } from '@/stores/theme'
import { settingsService } from '@/services/settingsService'
import { useNotifications } from '@/composables/useNotifications'

const themeStore = useThemeStore()
const { showSuccess, showError } = useNotifications()

// Local reactive copies for live preview
const accentColor = ref(themeStore.config.accentColor)
const brandName   = ref(themeStore.config.brandName)
const darkMode    = ref(themeStore.config.darkMode)
const logoUrlInput = ref('')
const dragging = ref(false)
const uploading = ref(false)
const saving   = ref(false)
const fileInput = ref<HTMLInputElement | null>(null)

// Expose config for live preview
const config = computed(() => themeStore.config)

// Live preview: apply changes immediately to DOM as user tweaks values
watch(accentColor, (val) => {
  themeStore.config.accentColor = val
  themeStore.apply()
})
watch(darkMode, (val) => {
  themeStore.config.darkMode = val
  themeStore.apply()
})

// ── Logo handling ─────────────────────────────────────────────────
async function onFileChange(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (file) await uploadFile(file)
}

function onDrop(e: DragEvent) {
  dragging.value = false
  const file = e.dataTransfer?.files?.[0]
  if (file) uploadFile(file)
}

async function uploadFile(file: File) {
  if (file.size > 3 * 1024 * 1024) {
    showError('El archivo es demasiado grande (máx 3 MB)')
    return
  }
  uploading.value = true
  try {
    const url = await settingsService.uploadLogo(file)
    await themeStore.update({ logo: url })
    showSuccess('Logo subido correctamente')
  } catch (err: any) {
    showError(err?.message || 'Error al subir el logo')
  } finally {
    uploading.value = false
    if (fileInput.value) fileInput.value.value = ''
  }
}

function applyLogoUrl() {
  const url = logoUrlInput.value.trim()
  if (!url) return
  themeStore.update({ logo: url })
  logoUrlInput.value = ''
}

async function removeLogo() {
  try {
    await settingsService.deleteLogo()
  } catch {}
  await themeStore.update({ logo: null })
  showSuccess('Logo eliminado')
}

// ── Save ──────────────────────────────────────────────────────────
async function saveTheme() {
  saving.value = true
  try {
    await themeStore.update({
      accentColor: accentColor.value,
      brandName: brandName.value || 'GEMS Hub',
      darkMode: darkMode.value,
    })
    showSuccess('Personalización guardada en la nube')
  } catch (err: any) {
    showError(err?.message || 'No se pudo guardar')
  } finally {
    saving.value = false
  }
}

async function resetTheme() {
  saving.value = true
  try {
    await themeStore.reset()
    accentColor.value = themeStore.config.accentColor
    brandName.value   = themeStore.config.brandName
    darkMode.value    = themeStore.config.darkMode
    showSuccess('Tema restaurado a los valores por defecto')
  } finally {
    saving.value = false
  }
}

// ── Color presets ─────────────────────────────────────────────────
const colorPresets = [
  { name: 'GEMS Violet',  value: '#8b5cf6' },
  { name: 'Purple',       value: '#a855f7' },
  { name: 'Fuchsia',      value: '#d946ef' },
  { name: 'Rose',         value: '#f43f5e' },
  { name: 'Orange',       value: '#f97316' },
  { name: 'Amber',        value: '#f59e0b' },
  { name: 'Emerald',      value: '#10b981' },
  { name: 'Teal',         value: '#14b8a6' },
  { name: 'Sky',          value: '#0ea5e9' },
  { name: 'Indigo',       value: '#6366f1' },
]

onMounted(async () => {
  await themeStore.load()
  accentColor.value = themeStore.config.accentColor
  brandName.value   = themeStore.config.brandName
  darkMode.value    = themeStore.config.darkMode
})
</script>
