<template>
  <div class="h-full flex overflow-hidden bg-[#f8fafc] dark:bg-[#0f172a]">

    <!-- Public header (unauthenticated only) -->
    <header v-if="!authStore.isAuthenticated" class="absolute inset-x-0 top-0 z-10 bg-white/80 dark:bg-[#0f172a]/80 backdrop-blur-sm border-b border-slate-100 dark:border-[#334155]">
      <div class="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
        <div class="flex items-center gap-2.5">
          <div class="w-7 h-7 bg-primary-600 rounded-lg flex items-center justify-center">
            <i class="fas fa-gem text-white text-[10px]"></i>
          </div>
          <div>
            <p class="text-xs font-black text-slate-800 dark:text-slate-100 tracking-tight leading-none">GEMS Hub</p>
            <p class="text-[9px] text-slate-400 font-bold uppercase tracking-[0.2em] leading-none mt-0.5">Soporte</p>
          </div>
        </div>
        <router-link to="/login" class="px-4 py-2 bg-slate-100 dark:bg-[#334155] hover:bg-slate-200 dark:hover:bg-[#334155]/80 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-300 transition-all">
          Iniciar sesión
        </router-link>
      </div>
    </header>

    <!-- Left Identity Rail (authenticated only) -->
    <aside v-if="authStore.isAuthenticated" class="w-56 flex-shrink-0 flex flex-col border-r border-slate-100 dark:border-[#334155] bg-white dark:bg-[#1e293b]">

      <!-- Brand mark -->
      <div class="px-6 pt-8 pb-6 border-b border-slate-50 dark:border-[#334155]">
        <div class="flex items-center gap-2.5 mb-1">
          <div class="w-7 h-7 bg-primary-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <i class="fas fa-gem text-white text-[10px]"></i>
          </div>
          <div>
            <p class="text-xs font-black text-slate-800 dark:text-slate-100 leading-none tracking-tight">GEMS Hub</p>
            <p class="text-[9px] text-slate-400 font-bold uppercase tracking-[0.2em] leading-none mt-0.5">Soporte</p>
          </div>
        </div>
      </div>

      <!-- Vertical nav -->
      <nav class="flex flex-col gap-0.5 p-3 flex-1">
        <button
          @click="activeTab = 'create'"
          :class="activeTab === 'create'
            ? 'bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400 border-l-2 border-primary-500 pl-3.5'
            : 'text-slate-500 dark:text-slate-400 border-l-2 border-transparent pl-3.5 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-[#334155]/30'"
          class="flex items-center gap-3 pr-4 py-2.5 text-[10px] font-black uppercase tracking-[0.15em] transition-all rounded-r-xl text-left"
        >
          <i class="fas fa-plus w-3 text-center text-[10px]"></i>
          Nueva Solicitud
        </button>
        <button
          @click="activeTab = 'history'"
          :class="activeTab === 'history'
            ? 'bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400 border-l-2 border-primary-500 pl-3.5'
            : 'text-slate-500 dark:text-slate-400 border-l-2 border-transparent pl-3.5 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-[#334155]/30'"
          class="flex items-center gap-3 pr-4 py-2.5 text-[10px] font-black uppercase tracking-[0.15em] transition-all rounded-r-xl text-left"
        >
          <i class="fas fa-list w-3 text-center text-[10px]"></i>
          Mi Historial
        </button>
      </nav>

      <!-- Quick stats -->
      <div class="p-5 border-t border-slate-50 dark:border-[#334155]">
        <p class="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Resumen</p>
        <div class="space-y-3">
          <div>
            <p class="text-[9px] text-slate-400 font-medium mb-0.5">Solicitudes totales</p>
            <p class="text-xl font-black text-slate-800 dark:text-slate-100 tabular-nums leading-none">{{ tickets.length }}</p>
          </div>
          <div>
            <p class="text-[9px] text-slate-400 font-medium mb-0.5">Abiertas</p>
            <p class="text-xl font-black text-emerald-500 tabular-nums leading-none">{{ tickets.filter(t => t.status === 'open').length }}</p>
          </div>
        </div>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 overflow-hidden flex flex-col" :class="{ 'pt-[57px]': !authStore.isAuthenticated }">

      <!-- Create tab -->
      <div v-if="activeTab === 'create' || !authStore.isAuthenticated" class="flex-1 overflow-y-auto p-5 animate-content-in">
        <PublicTicketForm />
      </div>

      <!-- History tab -->
      <div v-else class="flex-1 overflow-hidden flex flex-col p-5 animate-content-in">
        <div class="flex-1 overflow-hidden flex flex-col bg-white dark:bg-[#1e293b] rounded-xl shadow-sm">

          <!-- Toolbar -->
          <div class="px-5 py-3.5 border-b border-slate-100 dark:border-[#334155] flex items-center justify-between flex-shrink-0">
            <p class="text-[10px] font-black text-slate-800 dark:text-slate-100 uppercase tracking-widest">Mis Tickets</p>
            <div class="flex items-center gap-3">
              <span class="text-[9px] text-slate-400 font-bold uppercase tracking-widest tabular-nums">{{ tickets.length }} solicitudes</span>
              <button @click="loadData" class="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-primary-500 transition-colors">
                <i class="fas fa-rotate text-[10px]" :class="{ 'fa-spin': loading }"></i>
              </button>
            </div>
          </div>

          <!-- Table -->
          <div class="overflow-auto flex-1">
            <table class="w-full text-left min-w-[600px]">
              <thead class="sticky top-0 z-10">
                <tr class="bg-slate-50 dark:bg-[#0f172a]/60">
                  <th class="px-5 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest">ID</th>
                  <th class="px-5 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest">Asunto</th>
                  <th class="px-5 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest">Prioridad</th>
                  <th class="px-5 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest">Estado</th>
                  <th class="px-5 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest">Actualizado</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-50 dark:divide-[#334155]">
                <tr v-for="ticket in tickets" :key="ticket._id"
                  @click="openTicket(ticket)"
                  class="hover:bg-slate-50 dark:hover:bg-[#334155]/20 cursor-pointer transition-colors group"
                >
                  <td class="px-5 py-3.5">
                    <span class="text-[10px] font-black text-primary-600 dark:text-primary-400 font-mono tracking-tight">{{ ticket.ticketNumber }}</span>
                  </td>
                  <td class="px-5 py-3.5 max-w-xs">
                    <p class="text-[12px] font-bold text-slate-800 dark:text-slate-100 truncate group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">{{ ticket.subject }}</p>
                    <p class="text-[9px] text-slate-400 truncate">{{ ticket.category }}</p>
                  </td>
                  <td class="px-5 py-3.5">
                    <span :class="getPriorityClass(ticket.priority)" class="px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border">
                      {{ ticket.priority }}
                    </span>
                  </td>
                  <td class="px-5 py-3.5">
                    <div class="flex items-center gap-1.5">
                      <div class="w-1.5 h-1.5 rounded-full flex-shrink-0" :class="getStatusColor(ticket.status)"></div>
                      <span class="text-[9px] font-black text-slate-600 dark:text-slate-300 uppercase tracking-widest">{{ ticket.status }}</span>
                    </div>
                  </td>
                  <td class="px-5 py-3.5">
                    <span class="text-[9px] font-bold text-slate-400 tabular-nums">{{ formatDate(ticket.updatedAt) }}</span>
                  </td>
                </tr>
                <tr v-if="tickets.length === 0 && !loading">
                  <td colspan="5" class="px-5 py-16 text-center">
                    <div class="flex flex-col items-center gap-2 opacity-30">
                      <i class="fas fa-inbox text-3xl text-slate-400 dark:text-slate-600"></i>
                      <p class="text-[10px] font-black uppercase tracking-widest text-slate-400">Sin solicitudes</p>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Pagination -->
          <div v-if="pagination.pages > 1" class="px-5 py-3 border-t border-slate-100 dark:border-[#334155] flex items-center justify-center gap-1.5 flex-shrink-0">
            <button @click="changePage(pagination.page - 1)" :disabled="pagination.page === 1"
              class="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-primary-600 hover:bg-slate-50 dark:hover:bg-[#334155]/30 disabled:opacity-30 disabled:cursor-not-allowed transition-all">
              <i class="fas fa-chevron-left text-[9px]"></i>
            </button>
            <button v-for="p in pagination.pages" :key="p" @click="changePage(p)"
              :class="p === pagination.page ? 'bg-primary-600 text-white' : 'text-slate-400 hover:bg-slate-50 dark:hover:bg-[#334155]/30'"
              class="w-7 h-7 rounded-lg text-[9px] font-black transition-all">
              {{ p }}
            </button>
            <button @click="changePage(pagination.page + 1)" :disabled="pagination.page === pagination.pages"
              class="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-primary-600 hover:bg-slate-50 dark:hover:bg-[#334155]/30 disabled:opacity-30 disabled:cursor-not-allowed transition-all">
              <i class="fas fa-chevron-right text-[9px]"></i>
            </button>
          </div>
        </div>
      </div>
    </main>

    <!-- Slide-over Detail Panel -->
    <div v-if="selectedTicket" class="fixed inset-0 z-[60] flex justify-end animate-fade-in">
       <div class="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" @click="selectedTicket = null"></div>
       <div class="relative w-full max-w-2xl bg-white dark:bg-[#1e293b] h-full shadow-2xl animate-slide-left flex flex-col">
         <!-- Detail Header -->
         <div class="px-8 py-6 border-b border-slate-100 dark:border-[#334155] flex items-center justify-between shrink-0">
           <div class="flex items-center gap-4">
             <div class="w-10 h-10 bg-slate-50 dark:bg-[#334155] rounded-xl flex items-center justify-center text-slate-400">
                <i class="fas fa-ticket-alt"></i>
             </div>
             <div>
               <h3 class="text-lg font-black text-slate-800 dark:text-slate-100 tracking-tight">{{ selectedTicket.ticketNumber }}</h3>
               <p class="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Detalle de Solicitud</p>
             </div>
           </div>
           <button @click="selectedTicket = null" class="w-10 h-10 hover:bg-slate-100 dark:hover:bg-[#334155] rounded-full transition-colors flex items-center justify-center text-slate-400">
              <i class="fas fa-times"></i>
           </button>
         </div>

         <!-- Detail Content -->
         <div class="flex-1 overflow-y-auto p-8 space-y-8">
            <section class="space-y-4">
              <span :class="getPriorityClass(selectedTicket.priority)" class="px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border">
                {{ selectedTicket.priority }}
              </span>
              <h1 class="text-2xl font-black text-slate-800 dark:text-slate-100 tracking-tight">{{ selectedTicket.subject }}</h1>
              <p class="text-sm text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-[#0f172a]/60 p-6 rounded-2xl italic">
                "{{ selectedTicket.description }}"
              </p>
            </section>

            <!-- Metadata Info -->
            <div class="grid grid-cols-2 gap-8 py-6 border-t border-slate-100 dark:border-[#334155]">
               <div>
                 <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Asignado a</p>
                 <div v-if="selectedTicket.assignedTo" class="flex items-center gap-3">
                    <div class="w-8 h-8 rounded-full bg-slate-100 dark:bg-[#334155] overflow-hidden">
                       <img v-if="selectedTicket.assignedTo.avatar" src="" class="w-full h-full object-cover">
                       <div v-else class="w-full h-full flex items-center justify-center text-slate-400 text-[10px] font-black">
                         {{ selectedTicket.assignedTo.name.charAt(0) }}
                       </div>
                    </div>
                    <span class="text-sm font-bold text-slate-700 dark:text-slate-200">{{ selectedTicket.assignedTo.name }}</span>
                 </div>
                 <span v-else class="text-xs text-slate-400 italic font-medium">Buscando el mejor experto...</span>
               </div>
               <div>
                 <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Estado</p>
                 <div class="flex items-center gap-2">
                    <div class="w-2 h-2 rounded-full" :class="getStatusColor(selectedTicket.status)"></div>
                    <span class="text-sm font-black text-slate-800 dark:text-slate-100 uppercase tracking-widest">{{ selectedTicket.status }}</span>
                 </div>
               </div>
            </div>

            <!-- Attachments Section -->
            <div v-if="selectedTicket.attachments?.length > 0" class="space-y-4">
               <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Evidencias Adjuntas</p>
               <div class="grid grid-cols-3 gap-3">
                  <div v-for="(att, i) in selectedTicket.attachments" :key="i"
                    @click="viewAttachment(att)"
                    class="group relative aspect-square bg-slate-100 dark:bg-[#334155] rounded-xl overflow-hidden cursor-pointer border border-slate-200 dark:border-[#334155]"
                  >
                    <img v-if="isImgUrl(att)" :src="resolveImageUrl(att)" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    <div v-else class="w-full h-full flex flex-col items-center justify-center gap-2">
                       <i class="fas fa-file-alt text-slate-400 text-xl"></i>
                       <span class="text-[8px] font-black text-slate-400 uppercase">Ver Documento</span>
                    </div>
                    <div class="absolute inset-0 bg-slate-900/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                       <i class="fas fa-eye text-white"></i>
                    </div>
                  </div>
               </div>
            </div>

            <!-- Activity & Comments Section -->
            <div class="pt-8 border-t border-slate-100 dark:border-[#334155]">
               <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Actividad y Comentarios</p>
               <div v-if="selectedTicket.comments?.length > 0" class="space-y-6">
                 <div v-for="comment in selectedTicket.comments" :key="comment._id"
                   class="animate-slide-in"
                   v-show="!comment.isInternal"
                 >
                   <div class="flex gap-4">
                     <div class="flex-shrink-0 w-8 h-8 rounded-full bg-slate-100 dark:bg-[#334155] flex items-center justify-center text-[10px] font-black text-slate-400">
                       {{ comment.author?.name?.charAt(0) || '?' }}
                     </div>
                     <div class="flex-1 space-y-1">
                       <div class="flex items-center justify-between">
                         <span class="text-[11px] font-black text-slate-800 dark:text-slate-100">{{ comment.author?.name || 'Soporte Técnico' }}</span>
                         <span class="text-[9px] font-bold text-slate-400 uppercase">{{ formatDate(comment.createdAt) }}</span>
                       </div>
                        <p class="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{{ comment.text }}</p>
                        <div v-if="comment.attachments?.length" class="flex flex-wrap gap-2 mt-2">
                          <div v-for="(att, i) in comment.attachments" :key="i"
                            @click="viewAttachment(att)"
                            class="w-16 h-16 bg-slate-50 dark:bg-[#334155] border border-slate-200 dark:border-[#334155] rounded-lg overflow-hidden cursor-pointer hover:border-primary-400 transition-all"
                          >
                            <img v-if="isImgUrl(att)" :src="resolveImageUrl(att)" class="w-full h-full object-cover">
                            <div v-else class="w-full h-full flex items-center justify-center">
                              <i class="fas fa-file-alt text-slate-300 text-xs"></i>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
               </div>
               <div v-else class="text-center py-10 opacity-40">
                  <p class="text-xs font-bold text-slate-400">Aún no hay mensajes. Te notificaremos cuando haya novedades.</p>
               </div>
            </div>
         </div>

         <!-- Response Input -->
         <div class="p-6 bg-slate-50 dark:bg-[#0f172a]/60 border-t border-slate-100 dark:border-[#334155] shrink-0">
            <div class="relative">
               <input
                v-model="commentText"
                @keyup.enter="sendComment"
                placeholder="Añadir una respuesta rápida..."
                class="w-full pl-5 pr-12 py-4 bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-[#334155] text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 rounded-2xl text-sm font-medium focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all"
               />
                <div class="flex items-center justify-between pt-2">
                  <div class="flex items-center gap-2 pl-2">
                    <label class="p-2 text-slate-400 hover:text-primary-600 cursor-pointer transition-colors relative">
                      <i class="fas fa-paperclip text-sm"></i>
                      <input type="file" multiple @change="handleCommentFiles" class="hidden">
                      <span v-if="commentFiles.length" class="absolute -top-1 -right-1 w-4 h-4 bg-primary-600 text-[8px] text-white rounded-full flex items-center justify-center font-black animate-bounce">
                        {{ commentFiles.length }}
                      </span>
                    </label>
                    <div v-if="commentFiles.length" class="text-[9px] font-black text-primary-600 uppercase tracking-tighter">
                      {{ commentFiles.length }} archivos seleccionados
                    </div>
                  </div>
                  <button
                    @click="sendComment"
                    :disabled="sendingComment || (!commentText.trim() && !commentFiles.length)"
                    class="px-5 py-2.5 bg-primary-600 hover:bg-primary-700 disabled:opacity-30 text-white font-black rounded-xl text-xs flex items-center gap-3 shadow-md transition-all active:scale-95"
                  >
                     <span v-if="sendingComment">Enviando...</span>
                     <span v-else>Enviar</span>
                     <i v-if="sendingComment" class="fas fa-spinner fa-spin text-[10px]"></i>
                     <i v-else class="fas fa-paper-plane text-[10px]"></i>
                  </button>
                </div>
              </div>
            </div>
       </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'

import { useAuthStore } from '../../stores/auth'
import { ticketService } from '../../services/ticketService'
import PublicTicketForm from '../../components/tickets/PublicTicketForm.vue'
import { API_CONFIG } from '@/config/api'

const authStore = useAuthStore()
const tickets = ref<any[]>([])
const loading = ref(false)
const selectedTicket = ref<any>(null)
const activeTab = ref<'create' | 'history'>('create')
const pagination = ref({
  page: 1,
  limit: 10,
  total: 0,
  pages: 1
})

// Comment Logic
const commentText = ref('')
const commentFiles = ref<File[]>([])
const sendingComment = ref(false)

const handleCommentFiles = (e: any) => {
  const files = Array.from(e.target.files) as File[]
  commentFiles.value = [...commentFiles.value, ...files]
}

const sendComment = async () => {
  if (!selectedTicket.value || (!commentText.value.trim() && !commentFiles.value.length) || sendingComment.value) return
  
  sendingComment.value = true
  try {
    const formData = new FormData()
    formData.append('text', commentText.value)
    formData.append('isInternal', 'false')
    commentFiles.value.forEach(file => {
      formData.append('files', file)
    })

    const response = await ticketService.addComment(selectedTicket.value._id, formData)
    
    if (response) {
      // If client responds to a waiting ticket, move it to open
      if (selectedTicket.value.status === 'waiting') {
        await ticketService.updateStatus(selectedTicket.value._id, 'open')
      }
      
      // Re-fetch ticket to get updated comments and status
      const updatedTicket = await ticketService.getById(selectedTicket.value._id)
      if (updatedTicket) {
        selectedTicket.value = updatedTicket
        // Also update in the list
        const idx = tickets.value.findIndex(t => t._id === selectedTicket.value._id)
        if (idx !== -1) tickets.value[idx] = updatedTicket
      } else {
        // Fallback: just push the comment (might have limited info)
        selectedTicket.value.comments.push(response)
      }
      commentText.value = ''
      commentFiles.value = []
    }
  } catch (err) {
    console.error('Error sending comment:', err)
  } finally {
    sendingComment.value = false
  }
}

const loadData = async (page = 1) => {
    if (!authStore.isAuthenticated) return
    loading.value = true
    try {
        const result = await ticketService.getClientHistory(page, pagination.value.limit)
        if (result.success) {
          tickets.value = result.data
          pagination.value = result.pagination
        }
    } catch (err) {
        console.error(err)
    } finally {
        loading.value = false
    }
}

const changePage = (page: number) => {
  if (page < 1 || page > pagination.value.pages) return
  loadData(page)
}

onMounted(() => {
    activeTab.value = 'create'
    if (authStore.isAuthenticated) {
        loadData()
    }
})

const getPriorityClass = (priority: string) => {
    const base = 'px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border'
    const colors = {
        'low': 'bg-emerald-50 text-emerald-600 border-emerald-100',
        'medium': 'bg-amber-50 text-amber-600 border-amber-100',
        'high': 'bg-orange-50 text-orange-600 border-orange-100',
        'urgent': 'bg-rose-50 text-rose-600 border-rose-100'
    }
    return `${base} ${colors[priority as keyof typeof colors] || colors.medium}`
}

const getStatusColor = (status: string) => {
    const colors = {
        'open': 'bg-emerald-500',
        'waiting': 'bg-amber-500',
        'resolved': 'bg-slate-300'
    }
    return colors[status as keyof typeof colors] || 'bg-slate-300'
}

const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('es-ES', { 
        day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' 
    })
}

const openTicket = (ticket: any) => {
    selectedTicket.value = ticket
}

const isImgUrl = (url: string) => /\.(jpg|jpeg|png|webp|avif|gif)$/.test(url.toLowerCase())

const resolveImageUrl = (url: string) => {
  if (url.startsWith('http')) return url
  const origin = String(API_CONFIG.BASE_URL).replace(/\/?api\/?$/i, '')
  return `${origin.replace(/\/$/, '')}/${url.replace(/^\//, '')}`
}

const viewAttachment = (url: string) => {
  window.open(resolveImageUrl(url), '_blank')
}
</script>

<style scoped>
@keyframes slide-left {
  from { transform: translateX(100%); }
  to { transform: translateX(0); }
}

@keyframes content-in {
  from { opacity: 0; filter: blur(5px); transform: scale(0.98); }
  to { opacity: 1; filter: blur(0); transform: scale(1); }
}

.animate-slide-left { animation: slide-left 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
.animate-content-in { animation: content-in 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
.animate-fade-in { animation: fade-in 0.4s ease-out forwards; }

@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}
</style>
