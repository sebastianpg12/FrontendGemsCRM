<template>
  <div class="space-y-5">
    <!-- Header -->
    <div>
      <div class="flex items-center gap-2 mb-1">
        <i class="fas fa-gem text-primary-400 text-[9px]"></i>
        <span class="text-[9px] font-black uppercase tracking-widest text-primary-400">GEMS Hub</span>
      </div>
      <h2 class="text-[22px] font-black text-slate-900 dark:text-slate-100 tracking-tight">Personalización de marca</h2>
      <p class="text-[11px] font-medium text-slate-400 dark:text-slate-500 mt-0.5">
        Logo, nombre y color de acento de tu organización — con legibilidad garantizada en toda la interfaz
      </p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">

      <!-- ── IZQUIERDA: Configuración ─────────────────────────────── -->
      <div class="space-y-4">

        <!-- Identidad -->
        <div class="card">
          <p class="card-title"><i class="fas fa-id-badge text-primary-400 mr-1.5"></i>Identidad</p>

          <div class="space-y-4">
            <div>
              <label class="field-label">Nombre de la empresa</label>
              <input
                v-model="brandName"
                type="text"
                placeholder="GEMS Hub"
                class="field-input"
              />
              <p class="field-hint">Visible en la barra lateral y la pantalla de login</p>
            </div>

            <div>
              <label class="field-label">Logo</label>
              <div v-if="config.logo" class="flex items-center gap-3 p-3 bg-slate-50 dark:bg-[#0f172a] rounded-xl mb-2.5 border border-slate-100 dark:border-[#334155]">
                <img :src="config.logo" alt="Logo actual" class="h-9 w-auto max-w-[110px] object-contain" />
                <div class="flex-1 min-w-0">
                  <p class="text-[11px] font-bold text-slate-600 dark:text-slate-300">Logo activo</p>
                  <p class="text-[9px] font-medium text-slate-400">Sidebar y login</p>
                </div>
                <button
                  class="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors"
                  title="Eliminar logo"
                  :disabled="saving"
                  @click="removeLogo"
                >
                  <i class="fas fa-trash text-[10px]"></i>
                </button>
              </div>

              <div
                class="relative border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all"
                :class="dragging
                  ? 'border-primary-400 bg-primary-50 dark:bg-primary-500/10'
                  : 'border-slate-200 dark:border-[#334155] hover:border-primary-300 hover:bg-slate-50 dark:hover:bg-[#273449]'"
                @click="fileInput?.click()"
                @dragover.prevent="dragging = true"
                @dragleave.prevent="dragging = false"
                @drop.prevent="onDrop"
              >
                <input ref="fileInput" type="file" accept="image/png,image/svg+xml,image/jpeg,image/jpg,image/webp,image/gif"
                  class="hidden" @change="onFileChange" />
                <i class="fas text-lg text-slate-300 dark:text-slate-600 mb-1 block" :class="uploading ? 'fa-circle-notch fa-spin text-primary-400' : 'fa-cloud-upload-alt'"></i>
                <p class="text-[11px] font-bold text-slate-500 dark:text-slate-400">
                  {{ uploading ? 'Subiendo...' : 'Arrastra o haz clic para subir' }}
                </p>
                <p class="text-[9px] font-medium text-slate-300 dark:text-slate-600 mt-0.5">PNG, SVG, JPG, WebP · Máx 3 MB</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Color de acento -->
        <div class="card">
          <p class="card-title"><i class="fas fa-palette text-primary-400 mr-1.5"></i>Color de acento</p>

          <!-- Presets curados (todos cumplen contraste AA) -->
          <label class="field-label">Paleta recomendada</label>
          <div class="grid grid-cols-6 sm:grid-cols-12 gap-1.5 mb-4">
            <button
              v-for="preset in colorPresets"
              :key="preset.value"
              class="h-8 rounded-lg transition-all hover:scale-110 active:scale-95 flex items-center justify-center ring-offset-2 dark:ring-offset-[#1e293b]"
              :class="{ 'ring-2 ring-slate-900 dark:ring-white': accentColor.toLowerCase() === preset.value }"
              :style="{ backgroundColor: preset.value }"
              :title="preset.name"
              @click="accentColor = preset.value"
            >
              <i v-if="accentColor.toLowerCase() === preset.value" class="fas fa-check text-white text-[9px]"></i>
            </button>
          </div>

          <!-- Color personalizado -->
          <label class="field-label">Color personalizado</label>
          <div class="flex items-center gap-2">
            <input
              type="color"
              :value="pickerValue"
              class="w-9 h-9 rounded-lg cursor-pointer border border-slate-200 dark:border-[#334155] shrink-0 p-0.5 bg-white dark:bg-[#0f172a]"
              @input="accentColor = ($event.target as HTMLInputElement).value"
            />
            <input
              v-model="accentColor"
              type="text"
              placeholder="#4f46e5"
              maxlength="7"
              class="field-input flex-1 font-mono !font-bold"
              :class="{ '!border-rose-400 focus:!ring-rose-200': accentColor && !isValidHex }"
            />
            <div class="w-9 h-9 rounded-lg border border-slate-100 dark:border-[#334155] shrink-0" :style="{ backgroundColor: safeAccent }"></div>
          </div>
          <p v-if="accentColor && !isValidHex" class="text-[10px] font-bold text-rose-500 mt-1.5">
            <i class="fas fa-circle-exclamation mr-1"></i>Hex inválido — usa el formato #RRGGBB
          </p>

          <!-- Medidor de contraste -->
          <div class="mt-4 p-3.5 rounded-xl border" :class="wasAdjusted
            ? 'border-amber-200 bg-amber-50 dark:border-amber-500/30 dark:bg-amber-500/10'
            : 'border-emerald-200 bg-emerald-50 dark:border-emerald-500/30 dark:bg-emerald-500/10'">
            <div class="flex items-center justify-between mb-2">
              <span class="text-[9px] font-black uppercase tracking-widest" :class="wasAdjusted ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'">
                <i class="fas mr-1" :class="wasAdjusted ? 'fa-wand-magic-sparkles' : 'fa-circle-check'"></i>
                Legibilidad
              </span>
              <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[9px] font-black"
                :class="contrastLevel === 'AAA'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-emerald-500 text-white'">
                WCAG {{ contrastLevel }} · {{ effectiveRatio.toFixed(1) }}:1
              </span>
            </div>

            <p v-if="wasAdjusted" class="text-[10px] font-medium text-amber-700 dark:text-amber-300 leading-relaxed">
              El color elegido no alcanza el contraste mínimo (4.5:1) para texto blanco
              <span class="font-black">({{ rawRatio.toFixed(1) }}:1)</span>.
              Se ajustó automáticamente el tono para garantizar la lectura:
            </p>
            <p v-else class="text-[10px] font-medium text-emerald-700 dark:text-emerald-300 leading-relaxed">
              Este color es legible sobre texto blanco en botones, badges y la barra lateral.
            </p>

            <div v-if="wasAdjusted" class="flex items-center gap-2 mt-2.5">
              <span class="flex items-center gap-1.5">
                <span class="w-6 h-6 rounded-md border border-amber-200 dark:border-amber-500/30" :style="{ backgroundColor: isValidHex ? accentColor : '#cccccc' }"></span>
                <span class="text-[9px] font-black text-amber-600 dark:text-amber-400 uppercase">Elegido</span>
              </span>
              <i class="fas fa-arrow-right text-[9px] text-amber-400"></i>
              <span class="flex items-center gap-1.5">
                <span class="w-6 h-6 rounded-md" :style="{ backgroundColor: safeAccent }"></span>
                <span class="text-[9px] font-black text-amber-600 dark:text-amber-400 uppercase">Se aplicará · {{ safeAccent }}</span>
              </span>
            </div>
          </div>
        </div>

        <!-- Apariencia -->
        <div class="card">
          <p class="card-title"><i class="fas fa-moon text-primary-400 mr-1.5"></i>Apariencia</p>
          <button class="w-full flex items-center justify-between gap-3 group" @click="darkMode = !darkMode">
            <span class="text-left">
              <span class="block text-[11px] font-bold text-slate-700 dark:text-slate-200">Modo oscuro</span>
              <span class="block text-[10px] font-medium text-slate-400 mt-0.5">Tema oscuro para toda la organización</span>
            </span>
            <span
              class="relative w-11 h-6 rounded-full transition-colors duration-200 shrink-0"
              :class="darkMode ? 'bg-primary-600' : 'bg-slate-200'"
            >
              <span class="absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200"
                :class="darkMode ? 'translate-x-5' : 'translate-x-0'"></span>
            </span>
          </button>
        </div>

        <!-- Acciones -->
        <div class="flex gap-2">
          <button class="btn-primary flex-1 justify-center" :disabled="saving || !isValidHex" @click="saveTheme">
            <i class="fas text-[10px]" :class="saving ? 'fa-circle-notch fa-spin' : 'fa-check'"></i>
            {{ saving ? 'Guardando...' : 'Guardar cambios' }}
          </button>
          <button class="btn-secondary" :disabled="saving" title="Restaurar valores por defecto" @click="resetTheme">
            <i class="fas fa-rotate-left text-[10px]"></i>Restaurar
          </button>
        </div>
      </div>

      <!-- ── DERECHA: Vista previa en vivo ────────────────────────── -->
      <div class="space-y-4">

        <!-- Mockup de la app -->
        <div class="card">
          <p class="card-title"><i class="fas fa-eye text-primary-400 mr-1.5"></i>Vista previa en tiempo real</p>

          <div class="rounded-xl overflow-hidden border border-slate-200 dark:border-[#334155] flex h-48">
            <!-- Sidebar mock -->
            <div class="w-14 flex flex-col items-center py-3 gap-2 border-r"
              :style="{ background: darkMode ? '#0f172a' : '#fff', borderColor: darkMode ? '#334155' : '#f1f5f9' }">
              <div class="w-8 h-8 rounded-lg overflow-hidden mb-1 flex items-center justify-center"
                :style="{ backgroundColor: safeAccent + '20' }">
                <img v-if="config.logo" :src="config.logo" class="w-full h-full object-contain" />
                <i v-else class="fas fa-gem text-[10px]" :style="{ color: safeAccent }"></i>
              </div>
              <div v-for="i in 5" :key="i" class="w-7 h-7 rounded-lg"
                :style="{ backgroundColor: i === 1 ? safeAccent : (darkMode ? '#1e293b' : '#f1f5f9') }"></div>
            </div>
            <!-- Contenido mock -->
            <div class="flex-1 flex flex-col" :style="{ background: darkMode ? '#0f172a' : '#f8fafc' }">
              <div class="h-9 border-b flex items-center px-3 gap-2"
                :style="{ background: darkMode ? '#1e293b' : '#fff', borderColor: darkMode ? '#334155' : '#e2e8f0' }">
                <div class="flex-1 h-2.5 rounded-full" :style="{ background: darkMode ? '#334155' : '#e2e8f0' }"></div>
                <div class="w-6 h-6 rounded-full" :style="{ backgroundColor: safeAccent + '30' }"></div>
              </div>
              <div class="flex-1 p-2 flex gap-2 items-start">
                <div v-for="i in 3" :key="i" class="flex-1 rounded-lg p-2 border"
                  :style="{ background: darkMode ? '#1e293b' : '#fff', borderColor: darkMode ? '#334155' : '#e2e8f0' }">
                  <div class="w-full h-1.5 rounded-full mb-1"
                    :style="{ backgroundColor: i === 1 ? safeAccent : (darkMode ? '#334155' : '#e2e8f0') }"></div>
                  <div class="w-2/3 h-1.5 rounded-full" :style="{ background: darkMode ? '#273449' : '#f1f5f9' }"></div>
                </div>
              </div>
              <div class="h-6 flex items-center justify-center">
                <span class="text-[8px] font-black" :style="{ color: darkMode ? '#94a3b8' : safeAccent }">
                  {{ brandName || 'GEMS Hub' }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Elementos de UI -->
        <div class="card">
          <p class="card-title">Elementos de interfaz</p>
          <div class="space-y-2.5">
            <button class="w-full h-9 rounded-lg text-white text-[11px] font-bold transition-all"
              :style="{ backgroundColor: safeAccent }">
              <i class="fas fa-check mr-1.5 text-[10px]"></i>Botón primario
            </button>
            <div class="flex flex-wrap gap-2">
              <span class="inline-flex items-center h-7 px-3 rounded-lg text-[10px] font-black text-white"
                :style="{ backgroundColor: safeAccent }">
                Badge sólido
              </span>
              <span class="inline-flex items-center h-7 px-3 rounded-lg text-[10px] font-black border"
                :style="{ color: safeAccent, borderColor: safeAccent + '60' }">
                Outline
              </span>
              <span class="inline-flex items-center h-7 px-3 rounded-lg text-[10px] font-black"
                :style="{ backgroundColor: safeAccent + '18', color: safeAccent }">
                Soft
              </span>
            </div>
            <div class="flex items-center gap-2 px-3 h-9 rounded-lg border"
              :style="{ borderColor: safeAccent + '50' }">
              <span class="w-2 h-2 rounded-full animate-pulse" :style="{ backgroundColor: safeAccent }"></span>
              <span class="text-[11px] font-bold text-slate-600 dark:text-slate-300">Input con foco activo</span>
            </div>
          </div>
        </div>

        <!-- Login preview -->
        <div class="card">
          <p class="card-title">Pantalla de login</p>
          <div class="rounded-xl p-4 border flex flex-col items-center gap-2.5"
            :style="{ borderColor: safeAccent + '30', background: safeAccent + '06' }">
            <img v-if="config.logo" :src="config.logo" class="h-8 w-auto object-contain" />
            <div v-else class="w-9 h-9 rounded-lg flex items-center justify-center" :style="{ background: safeAccent + '20' }">
              <i class="fas fa-gem text-[12px]" :style="{ color: safeAccent }"></i>
            </div>
            <p class="text-[11px] font-black" :style="{ color: safeAccent }">{{ brandName || 'GEMS Hub' }}</p>
            <input disabled type="text" placeholder="usuario@empresa.com"
              class="w-full px-3 h-8 border rounded-lg text-[10px] bg-white dark:bg-[#0f172a] dark:text-slate-400"
              :style="{ borderColor: safeAccent + '40' }" />
            <button disabled class="w-full h-8 rounded-lg text-white text-[10px] font-black"
              :style="{ backgroundColor: safeAccent }">
              Iniciar sesión
            </button>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useThemeStore, contrastRatio, ensureAccessibleAccent } from '@/stores/theme'
import { settingsService } from '@/services/settingsService'
import { useNotifications } from '@/composables/useNotifications'

const themeStore = useThemeStore()
const { showSuccess, showError } = useNotifications()

const accentColor = ref(themeStore.config.accentColor)
const brandName   = ref(themeStore.config.brandName)
const darkMode    = ref(themeStore.config.darkMode)
const dragging = ref(false)
const uploading = ref(false)
const saving   = ref(false)
const fileInput = ref<HTMLInputElement | null>(null)

const config = computed(() => themeStore.config)

// ── Contraste ─────────────────────────────────────────────────────
const isValidHex = computed(() => /^#[0-9a-f]{6}$/i.test(accentColor.value || ''))
const safeAccent = computed(() => ensureAccessibleAccent(isValidHex.value ? accentColor.value : themeStore.config.accentColor))
const rawRatio = computed(() => isValidHex.value ? contrastRatio(accentColor.value, '#ffffff') : 0)
const effectiveRatio = computed(() => contrastRatio(safeAccent.value, '#ffffff'))
const wasAdjusted = computed(() => isValidHex.value && safeAccent.value !== accentColor.value.toLowerCase())
const contrastLevel = computed(() => effectiveRatio.value >= 7 ? 'AAA' : 'AA')

const pickerValue = computed(() => isValidHex.value ? accentColor.value : safeAccent.value)

// Live preview: aplicar al DOM mientras se edita (siempre con el color seguro)
watch([accentColor, darkMode], () => {
  if (!isValidHex.value) return
  themeStore.config.accentColor = safeAccent.value
  themeStore.config.darkMode = darkMode.value
  themeStore.apply()
})

// ── Logo ──────────────────────────────────────────────────────────
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

async function removeLogo() {
  try {
    await settingsService.deleteLogo()
  } catch {}
  await themeStore.update({ logo: null })
  showSuccess('Logo eliminado')
}

// ── Guardar ───────────────────────────────────────────────────────
async function saveTheme() {
  if (!isValidHex.value) {
    showError('El color de acento no es un hex válido')
    return
  }
  saving.value = true
  try {
    // Se persiste el color YA ajustado: la BD nunca guarda un acento ilegible
    await themeStore.update({
      accentColor: safeAccent.value,
      brandName: brandName.value || 'GEMS Hub',
      darkMode: darkMode.value,
    })
    accentColor.value = safeAccent.value
    showSuccess(wasAdjusted.value
      ? 'Guardado con el tono ajustado para legibilidad'
      : 'Personalización guardada')
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

// ── Presets: curados para cumplir WCAG AA sobre texto blanco ──────
const colorPresets = [
  { name: 'GEMS Violet', value: '#7c3aed' },
  { name: 'Indigo',      value: '#4f46e5' },
  { name: 'Blue',        value: '#1d4ed8' },
  { name: 'Sky',         value: '#0369a1' },
  { name: 'Teal',        value: '#0f766e' },
  { name: 'Emerald',     value: '#047857' },
  { name: 'Amber',       value: '#b45309' },
  { name: 'Orange',      value: '#c2410c' },
  { name: 'Red',         value: '#dc2626' },
  { name: 'Rose',        value: '#e11d48' },
  { name: 'Fuchsia',     value: '#c026d3' },
  { name: 'Slate',       value: '#475569' },
]

onMounted(async () => {
  await themeStore.load()
  accentColor.value = themeStore.config.accentColor
  brandName.value   = themeStore.config.brandName
  darkMode.value    = themeStore.config.darkMode
})
</script>

<style scoped>
.card {
  background: white;
  padding: 16px;
  border-radius: 16px;
  border: 1px solid #f1f5f9;
}
.dark .card {
  background: #1e293b;
  border-color: #334155;
}

.card-title {
  font-size: 9px;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  color: #94a3b8;
  margin-bottom: 14px;
}
.dark .card-title {
  color: #64748b;
}

.field-label {
  display: block;
  font-size: 9px;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #94a3b8;
  margin-bottom: 6px;
}
.dark .field-label {
  color: #64748b;
}

.field-input {
  width: 100%;
  padding: 8px 12px;
  border-radius: 10px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  font-size: 11px;
  font-weight: 600;
  color: #1e293b;
  outline: none;
  transition: all 0.15s ease;
}
.field-input:focus {
  border-color: var(--brand-accent, #4f46e5);
  box-shadow: 0 0 0 3px rgba(var(--brand-accent-rgb, 79, 70, 229), 0.1);
  background: white;
}
.dark .field-input {
  background: #0f172a;
  border-color: #334155;
  color: #e2e8f0;
}
.dark .field-input:focus {
  background: #0f172a;
}

.field-hint {
  font-size: 9px;
  font-weight: 500;
  color: #cbd5e1;
  margin-top: 6px;
}
.dark .field-hint {
  color: #475569;
}

.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 36px;
  padding: 0 16px;
  border-radius: 10px;
  background: var(--brand-accent, #4f46e5);
  color: white;
  font-size: 11px;
  font-weight: 700;
  transition: all 0.15s ease;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.08);
}
.btn-primary:hover:not(:disabled) {
  filter: brightness(1.1);
}
.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-secondary {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 36px;
  padding: 0 16px;
  border-radius: 10px;
  background: white;
  color: #475569;
  font-size: 11px;
  font-weight: 700;
  border: 1px solid #e2e8f0;
  transition: all 0.15s ease;
}
.btn-secondary:hover:not(:disabled) {
  background: #f8fafc;
  color: #0f172a;
}
.btn-secondary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
.dark .btn-secondary {
  background: #1e293b;
  color: #cbd5e1;
  border-color: #334155;
}
.dark .btn-secondary:hover:not(:disabled) {
  background: #273449;
  color: #f1f5f9;
}
</style>
