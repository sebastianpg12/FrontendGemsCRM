<template>
  <div class="grid grid-cols-12 gap-3 h-full">
    <!-- Main pane -->
    <div class="col-span-12 lg:col-span-9 flex flex-col bg-white rounded-xl shadow-sm overflow-hidden min-h-0">
      <!-- Header -->
      <div class="px-5 py-4 border-b border-slate-100 bg-gradient-to-br from-slate-50 to-white">
        <div class="flex items-start justify-between gap-3 mb-3">
          <div class="flex items-center gap-3 min-w-0 flex-1">
            <div class="w-11 h-11 rounded-xl flex items-center justify-center text-sm font-black flex-shrink-0 bg-gradient-to-br from-primary-500 to-primary-700 text-white shadow-lg shadow-primary-500/30">
              {{ initials }}
            </div>
            <div class="min-w-0 flex-1">
              <h2 class="text-sm font-black text-slate-900 truncate">{{ prospect.prospectName }}</h2>
              <p v-if="prospect.company" class="text-xs font-bold text-slate-500 truncate mt-0.5">
                <i class="fas fa-building text-[12px] mr-1 opacity-60"></i>{{ prospect.company }}
              </p>
            </div>
          </div>
          <button
            @click="$emit('delete', prospect)"
            class="w-8 h-8 rounded-lg text-slate-400 hover:bg-rose-50 hover:text-rose-500 transition-colors flex items-center justify-center"
            title="Eliminar prospecto"
          >
            <i class="fas fa-trash text-xs"></i>
          </button>
        </div>

        <!-- Pipeline Progress -->
        <div class="mb-2">
          <div class="flex items-center justify-between mb-1.5">
            <span class="text-[11px] font-black text-slate-400 uppercase tracking-widest">Pipeline</span>
            <span class="text-[12px] font-black text-slate-600">{{ currentProb }}% probabilidad</span>
          </div>
          <div class="flex gap-1">
            <button
              v-for="(stage, i) in pipelineStages"
              :key="stage.value"
              @click="updateStatus(stage.value)"
              :class="[
                'flex-1 h-2 rounded-full transition-all relative group',
                isStageActive(stage.value, i) ? activeColorFor(stage.value) : 'bg-slate-200 hover:bg-slate-300',
              ]"
              :title="`${stage.label} · ${stage.probability}%`"
            >
              <span :class="[
                'absolute -top-5 left-1/2 -translate-x-1/2 text-[10px] font-black uppercase opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap',
                isStageActive(stage.value, i) ? 'text-slate-900' : 'text-slate-500',
              ]">
                {{ stage.label }}
              </span>
            </button>
          </div>
        </div>
      </div>

      <!-- Action Bar -->
      <div class="px-5 py-3 border-b border-slate-100 flex items-center gap-2 overflow-x-auto custom-scrollbar bg-white">
        <span class="text-[11px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap mr-1">Atacar:</span>
        <button @click="openOutreach('email')" class="px-3 py-1.5 bg-primary-50 hover:bg-primary-100 text-primary-700 border border-primary-200 rounded-lg text-[12px] font-black flex items-center gap-1.5 whitespace-nowrap transition-all">
          <i class="fas fa-envelope text-[12px]"></i>Email
        </button>
        <button @click="openOutreach('call')" class="px-3 py-1.5 bg-cyan-50 hover:bg-cyan-100 text-cyan-700 border border-cyan-200 rounded-lg text-[12px] font-black flex items-center gap-1.5 whitespace-nowrap transition-all">
          <i class="fas fa-phone text-[12px]"></i>Script llamada
        </button>
        <button
          @click="scheduleOpen = true"
          class="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 rounded-lg text-[12px] font-black flex items-center gap-1.5 whitespace-nowrap transition-all"
        >
          <i class="fas fa-calendar-plus text-[12px]"></i>Agendar seguimiento
        </button>
        <button
          v-if="proposalMarkdown"
          @click="exportPdf"
          class="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg text-[12px] font-black flex items-center gap-1.5 whitespace-nowrap transition-all"
          title="Descargar la propuesta en PDF"
        >
          <i class="fas fa-file-pdf text-[12px]"></i>PDF
        </button>
        <div class="w-px h-5 bg-slate-200 mx-1"></div>
        <button
          @click="convertToClient"
          :disabled="converting"
          class="px-3 py-1.5 bg-gradient-to-br from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white border border-emerald-600 rounded-lg text-[12px] font-black flex items-center gap-1.5 whitespace-nowrap transition-all shadow-sm disabled:opacity-60"
        >
          <i :class="['fas', converting ? 'fa-circle-notch fa-spin' : 'fa-trophy', 'text-[12px]']"></i>
          {{ prospect.status === 'ganado' ? 'Convertir a cliente' : 'Cerrar como ganado' }}
        </button>
      </div>

      <!-- Tabs -->
      <div class="px-5 py-2 border-b border-slate-100 bg-slate-50/50 flex gap-1 overflow-x-auto custom-scrollbar">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="activeTab = tab.id"
          :class="[
            'px-3 py-1.5 rounded-lg text-[12px] font-black flex items-center gap-1.5 transition-all whitespace-nowrap',
            activeTab === tab.id ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700',
          ]"
        >
          <i :class="['fas', tab.icon, 'text-[12px]']"></i>
          {{ tab.label }}
          <span v-if="tab.count !== undefined" class="text-[11px] font-bold opacity-60">{{ tab.count }}</span>
        </button>
      </div>

      <!-- Tab Content -->
      <div class="flex-1 overflow-y-auto custom-scrollbar bg-slate-50/30">
        <!-- Resumen -->
        <ProspectSummary
          v-if="activeTab === 'summary'"
          :prospect="prospect"
          :tasks="extras.tasks"
          @generated="refreshExtras"
        />

        <!-- Conversación (chat con IA) -->
        <ProspectConversation
          v-else-if="activeTab === 'conversation'"
          :prospect="prospect"
          @updated="$emit('updated', $event)"
        />

        <!-- Notas -->
        <ProspectNotes
          v-else-if="activeTab === 'notes'"
          :notes="extras.notes"
          @add="onAddNote"
          @remove="onRemoveNote"
        />

        <!-- Tareas -->
        <ProspectTasks
          v-else-if="activeTab === 'tasks'"
          :tasks="extras.tasks"
          @add="onAddTask"
          @toggle="onToggleTask"
          @remove="onRemoveTask"
        />

        <!-- Timeline -->
        <ProspectTimeline
          v-else-if="activeTab === 'timeline'"
          :timeline="extras.timeline"
        />
      </div>
    </div>

    <!-- Sidebar -->
    <div class="col-span-12 lg:col-span-3 min-h-0 hidden lg:block">
      <ProspectSidebar
        :prospect="prospect"
        :tasks="extras.tasks"
        @updated="$emit('updated', $event)"
      />
    </div>

    <!-- Modal Agendar Seguimiento (se crea como Actividad) -->
    <div v-if="scheduleOpen" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50">
      <div class="bg-white dark:bg-[#1e293b] rounded-xl shadow-2xl w-full max-w-sm p-5">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-[17px] font-black text-slate-800 dark:text-slate-100 tracking-tight">Agendar seguimiento</h3>
          <button class="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-[#273449] transition-colors" @click="scheduleOpen = false">
            <i class="fas fa-times text-[14px]"></i>
          </button>
        </div>
        <div class="space-y-3.5">
          <div>
            <label class="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Acción *</label>
            <input
              v-model="scheduleForm.title"
              type="text"
              :placeholder="`Llamar a ${prospect.contactName || prospect.prospectName}`"
              class="w-full px-3 py-2 bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-[#334155] rounded-lg text-[13px] font-semibold text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
            />
          </div>
          <div>
            <label class="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Fecha *</label>
            <input
              v-model="scheduleForm.date"
              type="date"
              :min="todayIso"
              class="w-full px-3 py-2 bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-[#334155] rounded-lg text-[13px] font-semibold text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
            />
          </div>
          <div>
            <label class="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Notas</label>
            <textarea
              v-model="scheduleForm.notes"
              rows="2"
              placeholder="Contexto para el seguimiento..."
              class="w-full px-3 py-2 bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-[#334155] rounded-lg text-[13px] font-medium text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all resize-none"
            ></textarea>
          </div>
          <p class="text-[12px] font-medium text-slate-400 leading-relaxed">
            <i class="fas fa-circle-info mr-1"></i>Se creará una actividad en el módulo de Actividades y una tarea en este prospecto.
          </p>
        </div>
        <div class="flex justify-end gap-2 mt-5">
          <button
            class="inline-flex items-center gap-2 h-9 px-4 text-[13px] font-bold rounded-lg bg-white dark:bg-[#1e293b] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-[#334155] hover:bg-slate-50 dark:hover:bg-[#273449] transition-colors"
            @click="scheduleOpen = false"
          >Cancelar</button>
          <button
            class="inline-flex items-center gap-2 h-9 px-4 text-[13px] font-bold rounded-lg text-white bg-primary-600 hover:bg-primary-700 transition-colors disabled:opacity-60"
            :disabled="!scheduleForm.title.trim() || !scheduleForm.date || scheduling"
            @click="scheduleFollowUp"
          >
            <i class="fas text-[12px]" :class="scheduling ? 'fa-circle-notch fa-spin' : 'fa-calendar-check'"></i>Agendar
          </button>
        </div>
      </div>
    </div>

    <!-- Outreach Modal -->
    <ProspectOutreachModal
      v-if="outreachOpen"
      :is-open="outreachOpen"
      :prospect="prospect"
      :channel="outreachChannel"
      @close="outreachOpen = false"
      @updated="onOutreachUpdated"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { prospectService } from '@/services/prospectService'
import { clientService } from '@/services/clientService'
import { activityService } from '@/services/activityService'
import { exportProposalPdf } from '@/utils/proposalPdf'
import type { Prospect, ProspectStatus, ProspectNote, ProspectTask, ProspectTimelineEntry } from '@/types/prospect'
import { PROSPECT_STATUSES } from '@/types/prospect'
import { useNotifications } from '@/composables/useNotifications'
import type { OutreachChannel } from '@/services/prospectOutreach'
import ProspectOutreachModal from './ProspectOutreachModal.vue'
import ProspectSummary from './ProspectSummary.vue'
import ProspectConversation from './ProspectConversation.vue'
import ProspectNotes from './ProspectNotes.vue'
import ProspectTasks from './ProspectTasks.vue'
import ProspectTimeline from './ProspectTimeline.vue'
import ProspectSidebar from './ProspectSidebar.vue'

interface Props {
  prospect: Prospect
}

const props = defineProps<Props>()

const emit = defineEmits<{
  updated: [prospect: Prospect]
  delete: [prospect: Prospect]
}>()

const { showSuccess, showError, confirmDelete } = useNotifications()
const router = useRouter()

const activeTab = ref<'summary' | 'conversation' | 'notes' | 'tasks' | 'timeline'>('summary')
const outreachOpen = ref(false)
const outreachChannel = ref<OutreachChannel>('email')
const converting = ref(false)

interface ProspectExtras {
  notes: ProspectNote[]
  tasks: ProspectTask[]
  timeline: ProspectTimelineEntry[]
}

const extras = ref<ProspectExtras>({ notes: [], tasks: [], timeline: [] })

const loadExtras = async () => {
  // Carga rápida desde localStorage para respuesta instantánea
  extras.value = {
    notes: prospectService.getNotes(props.prospect._id),
    tasks: prospectService.getTasks(props.prospect._id),
    timeline: prospectService.getTimeline(props.prospect._id),
  }
  // Y en paralelo sincroniza con backend (silencioso si falla)
  try {
    const fresh = await prospectService.syncExtras(props.prospect)
    extras.value = fresh
  } catch {
    /* mantiene la versión local */
  }
}

const refreshExtras = () => loadExtras()

watch(
  () => props.prospect._id,
  () => loadExtras(),
  { immediate: true }
)

const initials = computed(() => {
  const source = props.prospect.company || props.prospect.prospectName || '?'
  return (
    source
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((s) => s[0]?.toUpperCase() || '')
      .join('') || '?'
  )
})

// Pipeline stages (sin perdido en la barra, perdido se setea desde otro lado)
const pipelineStages = PROSPECT_STATUSES.filter((s) => s.value !== 'perdido')

const currentProb = computed(() => {
  return PROSPECT_STATUSES.find((s) => s.value === (props.prospect.status || 'nuevo'))?.probability || 0
})

const isStageActive = (stage: ProspectStatus, idx: number) => {
  const order = ['nuevo', 'calificado', 'propuesta', 'seguimiento', 'ganado']
  const currentIdx = order.indexOf(props.prospect.status || 'nuevo')
  return idx <= currentIdx && props.prospect.status !== 'perdido'
}

const activeColorFor = (stage: ProspectStatus) => {
  if (props.prospect.status === 'perdido') return 'bg-rose-400'
  if (stage === 'ganado') return 'bg-emerald-500'
  return 'bg-gradient-to-r from-primary-500 to-primary-700'
}

const tabs = computed(() => [
  { id: 'summary' as const,      label: 'Resumen',     icon: 'fa-wand-magic-sparkles', count: undefined },
  { id: 'conversation' as const, label: 'Conversación', icon: 'fa-comments', count: props.prospect.messages?.length },
  { id: 'notes' as const,        label: 'Notas',       icon: 'fa-note-sticky', count: extras.value.notes.length },
  { id: 'tasks' as const,        label: 'Tareas',      icon: 'fa-list-check', count: extras.value.tasks.filter((t) => !t.done).length },
  { id: 'timeline' as const,     label: 'Actividad',   icon: 'fa-clock-rotate-left', count: extras.value.timeline.length },
])

// ─── Status actions ───
const updateStatus = async (status: ProspectStatus) => {
  await prospectService.setStatus(props.prospect._id, status)
  emit('updated', { ...props.prospect, status })
  showSuccess(`Estado: ${PROSPECT_STATUSES.find((s) => s.value === status)?.label}`)
  loadExtras()
}

// ─── Outreach ───
const openOutreach = (channel: OutreachChannel) => {
  outreachChannel.value = channel
  outreachOpen.value = true
}

const onOutreachUpdated = async (updated: Prospect) => {
  const eventType = outreachChannel.value === 'email' ? 'outreach_email' : 'outreach_call'
  await prospectService.addTimelineEntry(updated._id, {
    type: eventType,
    description: outreachChannel.value === 'email' ? 'Email enviado' : 'Script de llamada generado',
  })
  loadExtras()
  emit('updated', updated)
}

// ─── Notes ───
const onAddNote = async (content: string) => {
  await prospectService.addNote(props.prospect._id, content)
  loadExtras()
}
const onRemoveNote = async (id: string) => {
  await prospectService.deleteNote(props.prospect._id, id)
  loadExtras()
}

// ─── Tasks ───
const onAddTask = async (payload: { title: string; dueDate?: string }) => {
  await prospectService.addTask(props.prospect._id, payload)
  loadExtras()
}
const onToggleTask = async (id: string) => {
  await prospectService.toggleTask(props.prospect._id, id)
  loadExtras()
}
const onRemoveTask = async (id: string) => {
  await prospectService.deleteTask(props.prospect._id, id)
  loadExtras()
}

// ─── Propuesta + PDF ───
const proposalMarkdown = computed(() => {
  // La propuesta es el primer mensaje del asistente IA
  return props.prospect.messages?.find((m) => m.role === 'assistant')?.content || ''
})

const exportPdf = () => {
  if (!proposalMarkdown.value) return
  const accent = getComputedStyle(document.documentElement).getPropertyValue('--brand-accent').trim() || '#7c3aed'
  exportProposalPdf(props.prospect, proposalMarkdown.value, accent)
  showSuccess('PDF descargado')
}

// ─── Agendar seguimiento (integrado con Actividades) ───
const scheduleOpen = ref(false)
const scheduling = ref(false)
const todayIso = new Date().toISOString().slice(0, 10)
const scheduleForm = ref({ title: '', date: '', notes: '' })

const scheduleFollowUp = async () => {
  if (!scheduleForm.value.title.trim() || !scheduleForm.value.date || scheduling.value) return
  scheduling.value = true
  try {
    await activityService.create({
      title: scheduleForm.value.title.trim(),
      description: [
        `Seguimiento de prospecto: ${props.prospect.prospectName}`,
        props.prospect.company ? `Empresa: ${props.prospect.company}` : '',
        scheduleForm.value.notes.trim(),
      ].filter(Boolean).join('\n'),
      date: scheduleForm.value.date,
      status: 'pending',
      priority: 'medium',
    } as any)

    await prospectService.addTask(props.prospect._id, {
      title: scheduleForm.value.title.trim(),
      dueDate: scheduleForm.value.date,
    })
    await prospectService.addTimelineEntry(props.prospect._id, {
      type: 'task_created',
      description: `Seguimiento agendado para el ${new Date(scheduleForm.value.date + 'T12:00:00').toLocaleDateString('es-CO', { day: 'numeric', month: 'long' })}`,
    })
    loadExtras()

    scheduleOpen.value = false
    scheduleForm.value = { title: '', date: '', notes: '' }
    showSuccess('Seguimiento agendado en Actividades')
  } catch (err: any) {
    showError(err?.message || 'No se pudo agendar el seguimiento')
  } finally {
    scheduling.value = false
  }
}

// ─── Convert to client ───
const convertToClient = async () => {
  if (converting.value) return
  const result = await confirmDelete(
    `¿Convertir "${props.prospect.prospectName}" en cliente activo? El prospecto quedará marcado como "Ganado".`
  )
  if (!result.isConfirmed) return

  converting.value = true
  try {
    const fallbackEmail = `${props.prospect._id}@prospecto-pendiente.local`
    const created = await clientService.create({
      name: props.prospect.contactName?.trim() || props.prospect.prospectName,
      email: props.prospect.contactEmail?.trim() || fallbackEmail,
      phone: props.prospect.contactPhone?.trim() || '',
      company: props.prospect.company?.trim() || '',
      status: 'active',
      address: '',
    } as any)

    await prospectService.setStatus(props.prospect._id, 'ganado')
    const updated = { ...props.prospect, status: 'ganado' as ProspectStatus }
    emit('updated', updated)

    await prospectService.addTimelineEntry(props.prospect._id, {
      type: 'converted',
      description: `Convertido a cliente — ficha creada`,
      meta: { clientId: (created as any)._id },
    })
    loadExtras()

    showSuccess('Cliente creado correctamente')
    if ((created as any)._id) {
      router.push(`/clients/${(created as any)._id}`)
    }
  } catch (err: any) {
    showError(err?.message || 'No se pudo convertir a cliente')
  } finally {
    converting.value = false
  }
}
</script>
