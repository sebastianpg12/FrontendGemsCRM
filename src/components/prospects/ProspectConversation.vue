<template>
  <div class="flex flex-col h-full">
    <!-- Messages -->
    <div ref="messagesContainer" class="flex-1 overflow-y-auto custom-scrollbar p-5 space-y-4">
      <div v-if="!prospect.messages?.length" class="text-center py-12">
        <i class="fas fa-comments text-3xl text-slate-200 mb-2 block"></i>
        <p class="text-xs font-bold text-slate-400">Sin mensajes aún</p>
      </div>

      <div
        v-for="(msg, idx) in prospect.messages"
        :key="idx"
        :class="['flex gap-3', msg.role === 'user' ? 'justify-end' : 'justify-start']"
      >
        <div
          v-if="msg.role === 'assistant'"
          class="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 text-white flex items-center justify-center flex-shrink-0 shadow-md shadow-primary-500/20"
        >
          <i class="fas fa-wand-magic-sparkles text-[11px]"></i>
        </div>

        <div
          :class="[
            'max-w-[85%] rounded-xl px-4 py-3 shadow-sm',
            msg.role === 'user'
              ? 'bg-primary-600 text-white rounded-br-md'
              : 'bg-white text-slate-800 rounded-bl-md',
          ]"
        >
          <div
            v-if="msg.role === 'assistant'"
            class="prose-msg text-[12.5px] leading-relaxed"
            v-html="renderMarkdown(msg.content)"
          ></div>
          <p v-else class="text-[12.5px] leading-relaxed whitespace-pre-wrap font-medium">{{ msg.content }}</p>

          <div class="flex items-center justify-between gap-3 mt-2 pt-2 border-t" :class="msg.role === 'user' ? 'border-primary-500/30' : 'border-slate-100'">
            <span :class="['text-[9px] font-bold', msg.role === 'user' ? 'text-primary-200' : 'text-slate-400']">
              {{ formatTime(msg.timestamp) }}
            </span>
            <button
              v-if="msg.role === 'assistant'"
              @click="copyMessage(msg.content)"
              class="text-[9px] font-bold text-slate-400 hover:text-primary-600 transition-colors flex items-center gap-1"
            >
              <i class="fas fa-copy"></i>Copiar
            </button>
          </div>
        </div>

        <div
          v-if="msg.role === 'user'"
          class="w-8 h-8 rounded-xl bg-slate-200 text-slate-600 flex items-center justify-center flex-shrink-0"
        >
          <i class="fas fa-user text-[11px]"></i>
        </div>
      </div>

      <!-- AI thinking -->
      <div v-if="aiThinking" class="flex gap-3 justify-start">
        <div class="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 text-white flex items-center justify-center flex-shrink-0">
          <i class="fas fa-wand-magic-sparkles text-[11px]"></i>
        </div>
        <div class="bg-white rounded-xl rounded-bl-md px-4 py-3 shadow-sm">
          <div class="flex gap-1.5">
            <span class="w-1.5 h-1.5 rounded-full bg-primary-400 animate-bounce" style="animation-delay: 0ms"></span>
            <span class="w-1.5 h-1.5 rounded-full bg-primary-400 animate-bounce" style="animation-delay: 150ms"></span>
            <span class="w-1.5 h-1.5 rounded-full bg-primary-400 animate-bounce" style="animation-delay: 300ms"></span>
          </div>
        </div>
      </div>
    </div>

    <!-- Input -->
    <div class="px-4 py-3 border-t border-slate-100 bg-white">
      <div class="flex items-end gap-2">
        <div class="flex-1 relative">
          <textarea
            v-model="newMessage"
            @keydown.enter.exact.prevent="askAI"
            @keydown.shift.enter.exact="newMessage += '\n'"
            rows="1"
            placeholder="Pregúntale al coach: ¿Qué le digo? ¿Cómo lo cierro? ¿Cuál es el siguiente paso?..."
            class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:bg-white focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10 outline-none transition-all resize-none max-h-32"
            :disabled="aiThinking"
          ></textarea>
        </div>
        <button
          @click="askAI"
          :disabled="!newMessage.trim() || aiThinking"
          class="w-10 h-10 bg-gradient-to-br from-primary-600 to-primary-800 text-white rounded-xl shadow-lg shadow-primary-500/30 hover:shadow-primary-500/50 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center"
          title="Enviar y obtener respuesta IA (Enter)"
        >
          <i v-if="aiThinking" class="fas fa-circle-notch fa-spin text-[11px]"></i>
          <i v-else class="fas fa-paper-plane text-[11px]"></i>
        </button>
      </div>
      <p class="text-[9px] text-slate-400 mt-1.5 px-1 font-medium">
        <kbd class="px-1 py-0.5 bg-slate-100 rounded text-[8px] font-mono">Enter</kbd> enviar y obtener respuesta ·
        <kbd class="px-1 py-0.5 bg-slate-100 rounded text-[8px] font-mono">Shift+Enter</kbd> salto de línea
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { nextTick, ref, watch } from 'vue'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { marked } from 'marked'
import DOMPurify from 'dompurify'
import { prospectService } from '@/services/prospectService'
import type { Prospect } from '@/types/prospect'
import { useNotifications } from '@/composables/useNotifications'

interface Props {
  prospect: Prospect
}

const props = defineProps<Props>()

const emit = defineEmits<{
  updated: [prospect: Prospect]
}>()

const { showSuccess, showError } = useNotifications()

const newMessage = ref('')
const aiThinking = ref(false)
const messagesContainer = ref<HTMLElement | null>(null)

marked.setOptions({ breaks: true, gfm: true })
const renderMarkdown = (text: string) => DOMPurify.sanitize(marked.parse(text) as string)

const formatTime = (ts?: string | number) => {
  if (!ts) return ''
  try {
    return format(new Date(ts), "d MMM, HH:mm", { locale: es })
  } catch {
    return ''
  }
}

const scrollToBottom = () => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  })
}

watch(() => props.prospect._id, () => scrollToBottom(), { immediate: true })
watch(() => props.prospect.messages?.length, () => scrollToBottom())

const sendMessage = async () => {
  const content = newMessage.value.trim()
  if (!content || aiThinking.value) return
  try {
    const updated = await prospectService.sendMessage(props.prospect._id, { role: 'user', content })
    newMessage.value = ''
    emit('updated', updated)
  } catch (err: any) {
    showError(err?.message || 'No se pudo guardar el mensaje')
  }
}

const askAI = async () => {
  const userQuestion = newMessage.value.trim()
  if (!userQuestion || aiThinking.value) return

  aiThinking.value = true
  newMessage.value = ''
  try {
    const userMsgSaved = await prospectService.sendMessage(props.prospect._id, { role: 'user', content: userQuestion })
    emit('updated', userMsgSaved)

    const history = (props.prospect.messages || [])
      .slice(-8)
      .map((m) => `${m.role === 'user' ? 'Asesor' : 'IA'}: ${m.content}`)
      .join('\n\n')

    const prompt = `Eres un coach comercial interno de GEMS Innovations.
Tu rol es ayudar AL ASESOR DE VENTAS (quien escribe) a gestionar y cerrar este prospecto.
NUNCA hables como si le escribieras al prospecto/cliente. Siempre habla CON el asesor.

Nuestro producto: GEMS Hub — plataforma operativa todo-en-uno (clientes, tickets, casos,
Kanban, chat, reportes, seguimientos, asistente IA). Alternativa a HubSpot y Salesforce.
Nichos: agencias creativas, empresas TI/MSP, mantenimiento y field service.

PROSPECTO QUE SE ESTÁ TRABAJANDO:
- Nombre: ${props.prospect.prospectName}
- Empresa: ${props.prospect.company || '(no especificada)'}
- Estado en pipeline: ${props.prospect.status || 'nuevo'}

HISTORIAL DE LA CONVERSACIÓN INTERNA:
${history}

PREGUNTA DEL ASESOR:
"${userQuestion}"

Responde siempre en primera persona dirigiéndote al asesor (usa "te recomiendo", "puedes decirle", "el próximo paso es").
Si el asesor pide un mensaje o script para enviarle al cliente, redáctalo en un bloque separado con el label "📝 Mensaje sugerido:".
Responde en Markdown, en español, breve y accionable. Máximo 3 pasos si piden acciones.`

    const aiResponse = await prospectService.generateWithGemini({ prompt })
    const aiMsgSaved = await prospectService.sendMessage(props.prospect._id, { role: 'assistant', content: aiResponse })
    emit('updated', aiMsgSaved)
  } catch (err: any) {
    showError(err?.message || 'No se pudo generar respuesta')
  } finally {
    aiThinking.value = false
  }
}

const copyMessage = async (content: string) => {
  try {
    await navigator.clipboard.writeText(content)
    showSuccess('Copiado al portapapeles')
  } catch {
    showError('No se pudo copiar')
  }
}
</script>

<style scoped>
.prose-msg :deep(h1), .prose-msg :deep(h2), .prose-msg :deep(h3) {
  font-weight: 800; margin: 0.75rem 0 0.4rem; color: #0f172a; line-height: 1.25;
}
.prose-msg :deep(h1) { font-size: 1.05rem; }
.prose-msg :deep(h2) { font-size: 0.95rem; }
.prose-msg :deep(h3) { font-size: 0.85rem; }
.prose-msg :deep(p) { margin: 0.4rem 0; }
.prose-msg :deep(strong) { font-weight: 800; color: #0f172a; }
.prose-msg :deep(ul), .prose-msg :deep(ol) { padding-left: 1.25rem; margin: 0.4rem 0; }
.prose-msg :deep(li) { margin: 0.15rem 0; }
.prose-msg :deep(code) { background: #f1f5f9; color: #be123c; padding: 0.1rem 0.3rem; border-radius: 0.25rem; font-size: 0.85em; font-family: 'JetBrains Mono', monospace; }
.prose-msg :deep(pre) { background: #0f172a; color: #e2e8f0; padding: 0.75rem 1rem; border-radius: 0.5rem; margin: 0.5rem 0; overflow-x: auto; font-size: 11px; }
.prose-msg :deep(blockquote) { border-left: 3px solid #a78bfa; padding-left: 0.75rem; margin: 0.5rem 0; color: #64748b; font-style: italic; }
</style>
