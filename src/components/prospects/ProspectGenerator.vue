<template>
  <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
    <!-- Header -->
    <div class="px-6 py-5 border-b border-slate-100 bg-gradient-to-br from-slate-50 to-white">
      <div class="flex items-start justify-between gap-4">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white shadow-lg shadow-primary-500/30">
            <i class="fas fa-wand-magic-sparkles text-sm"></i>
          </div>
          <div>
            <h2 class="text-base font-black text-slate-900">Nuevo Prospecto con IA</h2>
            <p class="text-xs text-slate-500 font-medium mt-0.5">Genera propuestas comerciales en segundos</p>
          </div>
        </div>
        <!-- Mode Switcher -->
        <div class="flex bg-slate-100 rounded-xl p-1">
          <button
            @click="mode = 'simple'"
            :class="[
              'px-3 py-1.5 rounded-lg text-[11px] font-black transition-all flex items-center gap-1.5',
              mode === 'simple' ? 'bg-white text-primary-600 shadow-sm' : 'text-slate-500 hover:text-slate-700',
            ]"
          >
            <i class="fas fa-bolt"></i>Rápido
          </button>
          <button
            @click="mode = 'architect'"
            :class="[
              'px-3 py-1.5 rounded-lg text-[11px] font-black transition-all flex items-center gap-1.5',
              mode === 'architect' ? 'bg-white text-primary-600 shadow-sm' : 'text-slate-500 hover:text-slate-700',
            ]"
          >
            <i class="fas fa-sitemap"></i>Arquitecto
          </button>
        </div>
      </div>
    </div>

    <!-- Form -->
    <div class="p-6 space-y-5">
      <!-- Datos del prospecto -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1.5">Empresa</label>
          <input
            v-model="company"
            type="text"
            placeholder="Ej. Acme Corp"
            class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 placeholder-slate-400 focus:bg-white focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10 outline-none transition-all"
          />
        </div>
        <div>
          <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1.5">Contacto (opcional)</label>
          <input
            v-model="contactName"
            type="text"
            placeholder="Nombre del contacto"
            class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 placeholder-slate-400 focus:bg-white focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10 outline-none transition-all"
          />
        </div>
      </div>

      <!-- Diagnóstico -->
      <div>
        <div class="flex items-center justify-between mb-1.5">
          <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            Diagnóstico del prospecto <span class="text-rose-500">*</span>
          </label>
          <VoiceDictateButton v-model="inputText" />
        </div>
        <div class="relative">
          <textarea
            v-model="inputText"
            rows="5"
            placeholder="Describe la empresa, sector, problemas detectados, oportunidades, contexto comercial... o haz click en Dictar y habla."
            class="w-full px-3.5 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 placeholder-slate-400 focus:bg-white focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10 outline-none transition-all resize-none leading-relaxed"
          ></textarea>
        </div>
        <div class="flex justify-between items-center mt-1.5 px-1">
          <span class="text-[10px] text-slate-400 font-bold">{{ inputText.length }} caracteres</span>
          <span v-if="inputText.length > 0 && inputText.length < 30" class="text-[10px] text-amber-600 font-bold">
            <i class="fas fa-info-circle mr-1"></i>Añade más contexto para mejor calidad
          </span>
        </div>
      </div>

      <!-- Architect-only fields -->
      <transition name="expand">
        <div v-if="mode === 'architect'" class="space-y-4 pt-3 border-t border-slate-100">
          <!-- Módulos a proponer -->
          <div>
            <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">
              Módulos GEMS Hub a incluir
            </label>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="mod in GEMS_MODULES"
                :key="mod.id"
                type="button"
                @click="toggleModule(mod.id)"
                :class="[
                  'px-3 py-1.5 rounded-lg text-[11px] font-bold border transition-all flex items-center gap-1.5',
                  selectedModules.includes(mod.id)
                    ? 'bg-primary-50 text-primary-700 border-primary-400 ring-1 ring-primary-300 shadow-sm'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-primary-300 hover:text-primary-600'
                ]"
              >
                <span class="text-base leading-none">{{ mod.icon }}</span>{{ mod.label }}
              </button>
            </div>
          </div>
          <!-- Notas adicionales -->
          <div>
            <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1.5">
              Contexto adicional (opcional)
            </label>
            <textarea
              v-model="techNotes"
              rows="2"
              placeholder="Integraciones existentes, restricciones, presupuesto aproximado..."
              class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 placeholder-slate-400 focus:bg-white focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10 outline-none transition-all resize-none"
            ></textarea>
          </div>
        </div>
      </transition>

      <!-- Image Upload -->
      <div>
        <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1.5">
          Evidencia visual (opcional, multimodal)
        </label>
        <div
          @drop.prevent="onDrop"
          @dragover.prevent
          @dragenter.prevent
          class="relative border-2 border-dashed border-slate-200 rounded-xl bg-slate-50 hover:bg-slate-100/50 transition-all"
        >
          <input
            ref="fileInput"
            type="file"
            accept="image/*"
            multiple
            class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            @change="onFilesSelected"
          />
          <div v-if="!images.length" class="px-4 py-6 text-center pointer-events-none">
            <i class="fas fa-cloud-arrow-up text-2xl text-slate-300 mb-2 block"></i>
            <p class="text-xs font-bold text-slate-500">Arrastra imágenes o haz click para seleccionar</p>
            <p class="text-[10px] text-slate-400 mt-0.5">PNG, JPG, WebP — máx 4MB cada una</p>
          </div>
          <div v-else class="p-3 grid grid-cols-4 gap-2 pointer-events-none">
            <div
              v-for="(img, idx) in images"
              :key="idx"
              class="relative group aspect-square rounded-lg overflow-hidden border border-slate-200 bg-white"
            >
              <img :src="img.dataUrl" class="w-full h-full object-cover" />
              <button
                type="button"
                class="absolute top-1 right-1 w-6 h-6 rounded-full bg-rose-500 text-white text-[10px] flex items-center justify-center pointer-events-auto opacity-0 group-hover:opacity-100 transition-opacity"
                @click.stop="removeImage(idx)"
              >
                <i class="fas fa-xmark"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Submit -->
      <button
        @click="handleGenerate"
        :disabled="loading"
        :class="[
          'w-full py-3.5 rounded-xl text-sm font-black transition-all flex items-center justify-center gap-2 shadow-lg',
          canGenerate && !loading
            ? 'bg-gradient-to-br from-primary-600 to-primary-800 text-white hover:shadow-primary-500/30 active:scale-[0.99]'
            : loading ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-slate-100 text-slate-400 hover:bg-slate-200 cursor-pointer',
        ]"
      >
        <template v-if="loading">
          <i class="fas fa-circle-notch fa-spin"></i>
          <span>Analizando con Gemini...</span>
        </template>
        <template v-else>
          <i class="fas fa-wand-magic-sparkles"></i>
          <span>Generar propuesta con IA</span>
        </template>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { prospectService } from '@/services/prospectService'
import { useNotifications } from '@/composables/useNotifications'
import VoiceDictateButton from '@/components/ui/VoiceDictateButton.vue'

const emit = defineEmits<{
  created: [prospectId: string]
}>()

const { showError } = useNotifications()

type Mode = 'simple' | 'architect'

const GEMS_MODULES = [
  { id: 'clientes', icon: '👥', label: 'Clientes' },
  { id: 'tickets', icon: '🎫', label: 'Tickets' },
  { id: 'casos', icon: '📁', label: 'Casos' },
  { id: 'kanban', icon: '✅', label: 'Kanban' },
  { id: 'chat', icon: '💬', label: 'Chat' },
  { id: 'reportes', icon: '📊', label: 'Reportes' },
  { id: 'actividades', icon: '📅', label: 'Seguimientos' },
  { id: 'ia', icon: '🤖', label: 'Asistente IA' },
  { id: 'minutas', icon: '🧾', label: 'Minutas' },
]

const mode = ref<Mode>('simple')
const company = ref('')
const contactName = ref('')
const inputText = ref('')
const techNotes = ref('')
const selectedModules = ref<string[]>([])
const loading = ref(false)
const fileInput = ref<HTMLInputElement | null>(null)

const toggleModule = (id: string) => {
  const idx = selectedModules.value.indexOf(id)
  if (idx === -1) selectedModules.value.push(id)
  else selectedModules.value.splice(idx, 1)
}

interface ImageItem {
  mimeType: string
  data: string // base64 sin prefijo
  dataUrl: string // con prefijo para preview
}
const images = ref<ImageItem[]>([])

const MIN_CHARS = 30
const canGenerate = computed(() => inputText.value.trim().length >= MIN_CHARS)

const onFilesSelected = (e: Event) => {
  const target = e.target as HTMLInputElement
  if (!target.files) return
  addImages(Array.from(target.files))
  target.value = ''
}

const onDrop = (e: DragEvent) => {
  if (!e.dataTransfer?.files) return
  addImages(Array.from(e.dataTransfer.files))
}

const addImages = (files: File[]) => {
  files
    .filter((f) => f.type.startsWith('image/'))
    .filter((f) => f.size <= 4 * 1024 * 1024)
    .slice(0, 6 - images.value.length)
    .forEach((file) => {
      const reader = new FileReader()
      reader.onload = () => {
        const dataUrl = reader.result as string
        const data = dataUrl.split(',')[1]
        images.value.push({ mimeType: file.type, data, dataUrl })
      }
      reader.readAsDataURL(file)
    })
}

const removeImage = (idx: number) => {
  images.value.splice(idx, 1)
}

// Sanitiza el input para evitar prompt injection grosero
const sanitize = (text: string) =>
  text
    .replace(/```/g, "'''")
    .replace(/<\/?(system|user|assistant|prompt)>/gi, '')
    .trim()

const buildPrompt = () => {
  const userBrief = sanitize(inputText.value)
  const userCompany = sanitize(company.value || '(empresa no especificada)')
  const userContact = sanitize(contactName.value || '(no especificado)')

  const modulesLine = selectedModules.value.length
    ? `MÓDULOS A PROPONER: ${selectedModules.value.join(', ')}`
    : ''

  if (mode.value === 'simple') {
    return `Eres un consultor comercial senior de GEMS Innovations.
Nuestro producto es GEMS Hub: plataforma operativa todo-en-uno para equipos de servicio
(gestión de clientes, tickets de soporte, casos internos, Kanban de tareas, chat de equipo,
reportes, seguimientos, asistente IA y minutas). Alternativa económica a HubSpot y Salesforce.

Genera una propuesta comercial breve y persuasiva en formato Markdown para este prospecto.

EMPRESA: ${userCompany}
CONTACTO: ${userContact}
DIAGNÓSTICO:
"""
${userBrief}
"""

ESTRUCTURA REQUERIDA:
1. **Resumen ejecutivo** (3 líneas, qué problema resolvemos con GEMS Hub)
2. **Dolor identificado** (lo que están sufriendo hoy, en sus propias palabras)
3. **Solución con GEMS Hub** (módulos concretos que aplican a su caso)
4. **Beneficios clave** (3 bullets, ROI tangible vs lo que usan hoy)
5. **Próximos pasos** (CTA claro: demo, piloto 30 días, etc.)

Tono: profesional, directo, en español neutral. Sin alucinar datos. Si falta info, márcala como "(a confirmar con cliente)".
Si hay imágenes adjuntas, úsalas como contexto adicional.`
  }

  return `Eres un consultor técnico-comercial de GEMS Innovations.
Nuestro producto es GEMS Hub: plataforma operativa todo-en-uno (clientes, tickets, casos, Kanban,
chat, reportes, seguimientos, asistente IA, minutas). Corre en Oracle Cloud Free Tier.
Apuntamos a: agencias creativas, empresas de TI/MSP y mantenimiento/field service (5–150 personas).

Genera una propuesta TÉCNICA-COMERCIAL detallada en Markdown.

EMPRESA: ${userCompany}
CONTACTO: ${userContact}

DIAGNÓSTICO DEL CLIENTE:
"""
${userBrief}
"""

${modulesLine ? modulesLine + '\n' : ''}
${techNotes.value ? `CONTEXTO ADICIONAL:\n"""\n${sanitize(techNotes.value)}\n"""\n` : ''}

ESTRUCTURA REQUERIDA:
## 1. Diagnóstico
3 retos críticos detectados en su operación, ordenados por impacto.

## 2. Solución con GEMS Hub
Qué módulos resuelven cada dolor. Sé concreto y específico a su sector.

## 3. Comparativa de valor
Tabla: Situación actual | Con GEMS Hub | Beneficio.

## 4. Plan de adopción
3 fases: arranque (semana 1), adopción (mes 1), optimización (mes 2+).

## 5. Cierre comercial
Propuesta de valor única en 4–5 líneas. Por qué GEMS Hub vs HubSpot/Salesforce/Excel.

Tono: técnico pero comercial. Sin alucinar precios. Si hay imágenes, intégralas en el análisis.`
}

const generateName = async (proposalText: string): Promise<string> => {
  try {
    const namePrompt = `A partir de esta propuesta comercial, genera un nombre corto y memorable
en formato "Prospecto [Adjetivo] [Sector/Vertical]" (máx 4 palabras, sin comillas).

Propuesta:
"""
${proposalText.slice(0, 600)}
"""

Responde SOLO con el nombre, nada más.`
    const result = await prospectService.generateWithGemini({ prompt: namePrompt })
    return result.replace(/["\n]/g, '').trim().slice(0, 60) || 'Prospecto sin nombre'
  } catch {
    return company.value.trim() || 'Prospecto sin nombre'
  }
}

const handleGenerate = () => {
  if (loading.value) return
  if (!canGenerate.value) {
    const chars = inputText.value.trim().length
    if (chars === 0) {
      showError('Escribe el diagnóstico del prospecto antes de generar.')
    } else {
      showError(`El diagnóstico necesita al menos ${MIN_CHARS} caracteres para generar una propuesta de calidad. Llevas ${chars}.`)
    }
    return
  }
  generate()
}

const generate = async () => {
  if (!canGenerate.value || loading.value) return
  loading.value = true
  try {
    const proposal = await prospectService.generateWithGemini({
      prompt: buildPrompt(),
      images: images.value.map((i) => ({ mimeType: i.mimeType, data: i.data })),
    })

    const name = await generateName(proposal)

    // Crea el prospecto con el diagnóstico como mensaje del asesor
    const created = await prospectService.create({
      prospectName: name,
      company: company.value.trim() || undefined,
      initialMessage: inputText.value.trim(),
    })

    if (contactName.value.trim()) {
      prospectService.setMetadata(created._id, { contactName: contactName.value.trim() })
    }

    // Agrega la propuesta IA como mensaje del asistente (se renderiza en markdown)
    await prospectService.sendMessage(created._id, {
      role: 'assistant',
      content: proposal,
    })

    // Reset form
    company.value = ''
    contactName.value = ''
    inputText.value = ''
    techNotes.value = ''
    selectedModules.value = []
    images.value = []

    emit('created', created._id)
  } catch (err: any) {
    showError(err?.message || 'No se pudo generar la propuesta')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.expand-enter-active,
.expand-leave-active {
  transition: all 0.25s ease;
  overflow: hidden;
}
.expand-enter-from,
.expand-leave-to {
  opacity: 0;
  max-height: 0;
}
.expand-enter-to,
.expand-leave-from {
  opacity: 1;
  max-height: 500px;
}
</style>
