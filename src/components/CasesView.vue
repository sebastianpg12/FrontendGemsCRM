<template>
  <div class="space-y-4">

    <!-- ════════ VISTA LISTA ════════ -->
    <template v-if="!selectedCase">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 class="text-[22px] font-black text-slate-800 dark:text-slate-100 tracking-tight">Casos</h1>
          <p class="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-0.5">
            Seguimientos, incidencias y documentos operativos
          </p>
        </div>
        <button class="btn-primary self-start sm:self-auto" @click="openCreateModal()">
          <i class="fas fa-plus text-[10px]"></i>Nuevo caso
        </button>
      </div>

      <!-- Filtros -->
      <div class="bg-white dark:bg-[#1e293b] rounded-xl p-3 space-y-3">
        <!-- Chips de estado -->
        <div class="flex flex-wrap items-center gap-1.5">
          <button
            v-for="chip in statusChips"
            :key="chip.id"
            class="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg text-[11px] font-bold transition-colors border"
            :class="filterEstado === chip.id
              ? 'bg-slate-800 dark:bg-slate-100 text-white dark:text-slate-900 border-transparent'
              : 'bg-white dark:bg-[#0f172a] text-slate-500 dark:text-slate-400 border-slate-200 dark:border-[#334155] dark:hover:border-slate-500'"
            @click="filterEstado = chip.id"
          >
            <span v-if="chip.dot" class="w-1.5 h-1.5 rounded-full" :class="chip.dot"></span>
            {{ chip.label }}
            <span class="text-[9px] font-black opacity-60">{{ chip.count }}</span>
          </button>
        </div>

        <!-- Selects + búsqueda -->
        <div class="flex flex-col sm:flex-row gap-2">
          <div class="relative flex-1">
            <i class="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[10px]"></i>
            <input
              v-model="searchTerm"
              type="text"
              placeholder="Buscar por título, cliente o categoría..."
              class="w-full h-9 pl-8 pr-3 bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-[#334155] rounded-lg text-[11px] font-medium text-slate-700 dark:text-slate-200 placeholder:text-slate-400 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
            />
          </div>
          <div class="relative">
            <i class="fas fa-exclamation-circle absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-[9px] pointer-events-none"></i>
            <select v-model="filterPrioridad" class="select-filter appearance-none" style="padding-left:1.75rem;padding-right:1.75rem;">
              <option value="">Prioridad: todas</option>
              <option value="critica">Crítica</option>
              <option value="alta">Alta</option>
              <option value="media">Media</option>
              <option value="baja">Baja</option>
            </select>
            <i class="fas fa-chevron-down absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-[8px] pointer-events-none"></i>
          </div>
          <div class="relative">
            <i class="fas fa-user absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-[9px] pointer-events-none"></i>
            <select v-model="filterResponsable" class="select-filter appearance-none" style="padding-left:1.75rem;padding-right:1.75rem;">
              <option value="">Responsable: todos</option>
              <option v-for="m in team" :key="m._id" :value="m._id">{{ m.name }}</option>
            </select>
            <i class="fas fa-chevron-down absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-[8px] pointer-events-none"></i>
          </div>
          <div class="relative">
            <i class="fas fa-layer-group absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-[9px] pointer-events-none"></i>
            <select v-model="filterTipo" class="select-filter appearance-none" style="padding-left:1.75rem;padding-right:1.75rem;">
              <option value="">Tipo: todos</option>
              <option value="seguimiento">Seguimiento</option>
              <option value="incidencia">Incidencia</option>
              <option value="documento">Documento</option>
            </select>
            <i class="fas fa-chevron-down absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-[8px] pointer-events-none"></i>
          </div>
        </div>
      </div>

      <!-- Cargando -->
      <div v-if="loading" class="flex justify-center items-center h-48">
        <div class="animate-spin rounded-full h-10 w-10 border-4 border-slate-200 dark:border-[#334155] border-t-primary-600"></div>
      </div>

      <!-- Empty state -->
      <div v-else-if="filteredCases.length === 0" class="bg-white dark:bg-[#1e293b] rounded-xl py-16 flex flex-col items-center text-center px-6">
        <div class="w-16 h-16 bg-primary-50 dark:bg-primary-500/10 rounded-2xl flex items-center justify-center mb-4">
          <i class="fas fa-folder-open text-xl text-primary-500"></i>
        </div>
        <h3 class="text-[15px] font-black text-slate-800 dark:text-slate-100 mb-1">
          {{ cases.length === 0 ? 'Aún no hay casos' : 'Sin resultados con estos filtros' }}
        </h3>
        <p class="text-[11px] font-medium text-slate-500 dark:text-slate-400 max-w-sm mb-5">
          {{ cases.length === 0
            ? 'Crea el primer caso para hacer seguimiento de incidencias, proyectos y documentos.'
            : 'Prueba ajustando la búsqueda o limpiando los filtros.' }}
        </p>
        <button v-if="cases.length === 0" class="btn-primary" @click="openCreateModal()">
          <i class="fas fa-plus text-[10px]"></i>Crear primer caso
        </button>
        <button v-else class="btn-secondary" @click="clearFilters">Limpiar filtros</button>
      </div>

      <!-- Lista tipo Linear -->
      <div v-else class="bg-white dark:bg-[#1e293b] rounded-xl overflow-hidden divide-y divide-slate-100 dark:divide-[#334155]">
        <button
          v-for="c in filteredCases"
          :key="c._id"
          class="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-slate-50 dark:hover:bg-[#273449] transition-colors group"
          @click="openCase(c)"
        >
          <!-- Prioridad -->
          <span class="w-6 h-6 rounded-md flex items-center justify-center shrink-0" :class="priorityConfig[c.prioridad]?.soft" :title="`Prioridad ${c.prioridad}`">
            <i :class="priorityConfig[c.prioridad]?.icon" class="text-[9px]"></i>
          </span>

          <!-- Título + meta -->
          <div class="flex-1 min-w-0">
            <p class="text-[12px] font-bold text-slate-800 dark:text-slate-100 truncate group-hover:text-primary-600 dark:group-hover:text-primary-300 transition-colors">
              {{ c.titulo }}
            </p>
            <p class="text-[10px] font-medium text-slate-400 dark:text-slate-500 truncate mt-0.5">
              <i :class="typeConfig[c.tipo]?.icon" class="mr-1 text-[9px]"></i>{{ typeConfig[c.tipo]?.label }}
              <template v-if="clientName(c)"> · {{ clientName(c) }}</template>
              <template v-if="c.categoria"> · {{ c.categoria }}</template>
            </p>
          </div>

          <!-- Estado -->
          <span class="hidden sm:inline-flex items-center gap-1.5 h-6 px-2.5 rounded-md text-[9px] font-black uppercase tracking-widest shrink-0" :class="statusConfig[c.estado]?.badge">
            <span class="w-1.5 h-1.5 rounded-full" :class="statusConfig[c.estado]?.dot"></span>
            {{ statusConfig[c.estado]?.label }}
          </span>

          <!-- Responsable -->
          <span
            class="w-6 h-6 rounded-full bg-slate-100 dark:bg-[#334155] flex items-center justify-center text-[8px] font-black text-slate-500 dark:text-slate-300 shrink-0"
            :title="assigneeName(c) || 'Sin responsable'"
          >
            {{ initials(assigneeName(c)) }}
          </span>

          <!-- Fecha -->
          <span class="hidden md:block text-[10px] font-bold text-slate-400 dark:text-slate-500 w-20 text-right shrink-0">
            {{ relativeDate(c.updatedAt) }}
          </span>
        </button>
      </div>
    </template>

    <!-- ════════ VISTA DETALLE ════════ -->
    <template v-else>
      <!-- Barra superior -->
      <div class="flex items-center gap-2 flex-wrap">
        <button class="btn-secondary" @click="closeCase">
          <i class="fas fa-arrow-left text-[10px]"></i><span class="hidden sm:inline">Casos</span>
        </button>

        <!-- Dropdown de estado -->
        <div class="relative">
          <button
            class="inline-flex items-center gap-2 h-9 px-3.5 rounded-lg text-[11px] font-bold border transition-colors"
            :class="statusConfig[selectedCase.estado]?.badgeStrong"
            @click="statusMenuOpen = !statusMenuOpen"
          >
            <span class="w-1.5 h-1.5 rounded-full" :class="statusConfig[selectedCase.estado]?.dot"></span>
            {{ statusConfig[selectedCase.estado]?.label }}
            <i class="fas fa-chevron-down text-[8px] opacity-60"></i>
          </button>
          <div v-if="statusMenuOpen" class="absolute left-0 top-full mt-1 w-44 bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-[#334155] rounded-xl shadow-xl z-30 p-1">
            <button
              v-for="(cfg, key) in statusConfig"
              :key="key"
              class="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-[11px] font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-[#273449] transition-colors"
              :class="{ 'opacity-40 pointer-events-none': key === selectedCase.estado }"
              @click="changeStatus(key as CaseStatus)"
            >
              <span class="w-1.5 h-1.5 rounded-full" :class="cfg.dot"></span>
              {{ cfg.label }}
              <i v-if="key === selectedCase.estado" class="fas fa-check text-[9px] ml-auto text-primary-500"></i>
            </button>
          </div>
        </div>

        <div class="flex-1"></div>

        <button class="btn-secondary" @click="openEditModal">
          <i class="fas fa-pen text-[10px]"></i><span class="hidden sm:inline">Editar</span>
        </button>
        <button
          class="w-9 h-9 flex items-center justify-center rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors"
          title="Eliminar caso"
          @click="askDeleteCase"
        >
          <i class="fas fa-trash text-[12px]"></i>
        </button>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <!-- Columna principal -->
        <div class="lg:col-span-2 space-y-4">
          <!-- Cabecera del caso -->
          <div class="bg-white dark:bg-[#1e293b] rounded-xl p-5">
            <div class="flex items-start gap-3">
              <span class="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5" :class="priorityConfig[selectedCase.prioridad]?.soft">
                <i :class="typeConfig[selectedCase.tipo]?.icon" class="text-[13px]"></i>
              </span>
              <div class="min-w-0">
                <h1 class="text-[22px] font-black text-slate-800 dark:text-slate-100 tracking-tight leading-tight">
                  {{ selectedCase.titulo }}
                </h1>
                <p class="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-1">
                  {{ typeConfig[selectedCase.tipo]?.label }} · Creado {{ relativeDate(selectedCase.createdAt) }}
                  <template v-if="selectedCase.categoria"> · {{ selectedCase.categoria }}</template>
                </p>
              </div>
            </div>
            <p v-if="selectedCase.descripcion" class="text-[12px] font-medium text-slate-600 dark:text-slate-300 leading-relaxed mt-4">
              {{ selectedCase.descripcion }}
            </p>
          </div>

          <!-- Documentación -->
          <div class="bg-white dark:bg-[#1e293b] rounded-xl p-5">
            <div class="flex items-center justify-between mb-3">
              <p class="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Documentación</p>
              <button v-if="!editingDocs && selectedCase.wikiContent" class="btn-ghost" @click="startEditDocs">
                <i class="fas fa-pen text-[9px]"></i>Editar
              </button>
            </div>
            <template v-if="editingDocs">
              <WikiEditor v-model="docsDraft" placeholder="Documenta el contexto, decisiones y solución del caso..." />
              <div class="flex justify-end gap-2 mt-3">
                <button class="btn-secondary" @click="editingDocs = false">Cancelar</button>
                <button class="btn-primary" :disabled="savingDocs" @click="saveDocs">
                  <i class="fas text-[10px]" :class="savingDocs ? 'fa-circle-notch fa-spin' : 'fa-check'"></i>Guardar
                </button>
              </div>
            </template>
            <template v-else>
              <WikiContent v-if="selectedCase.wikiContent" :content="selectedCase.wikiContent" />
              <button
                v-else
                class="w-full py-8 rounded-xl border-2 border-dashed border-slate-200 dark:border-[#334155] text-slate-400 dark:text-slate-500 hover:text-primary-500 transition-colors text-[11px] font-bold"
                @click="startEditDocs"
              >
                <i class="fas fa-pen mr-2 text-[10px]"></i>Documentar este caso
              </button>
            </template>
          </div>

          <!-- Timeline de actividad -->
          <div class="bg-white dark:bg-[#1e293b] rounded-xl p-5">
            <p class="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4">
              Actividad
              <span class="ml-1 px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-[#334155] text-slate-500 dark:text-slate-400">{{ timeline.length }}</span>
            </p>

            <!-- Composer -->
            <div class="flex gap-2.5 mb-5">
              <span class="w-7 h-7 rounded-full bg-primary-100 dark:bg-primary-500/20 flex items-center justify-center text-[9px] font-black text-primary-600 dark:text-primary-300 shrink-0">
                {{ initials(authStore.user?.name) }}
              </span>
              <div class="flex-1">
                <textarea
                  v-model="newComment"
                  rows="2"
                  placeholder="Escribe un comentario interno..."
                  class="w-full px-3 py-2 bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-[#334155] rounded-xl text-[11px] font-medium text-slate-700 dark:text-slate-200 placeholder:text-slate-400 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all resize-none"
                ></textarea>
                <div class="flex justify-end mt-1.5">
                  <button class="btn-primary !h-8 !px-3.5" :disabled="!newComment.trim() || sendingComment" @click="addComment">
                    <i class="fas text-[9px]" :class="sendingComment ? 'fa-circle-notch fa-spin' : 'fa-paper-plane'"></i>Comentar
                  </button>
                </div>
              </div>
            </div>

            <!-- Eventos -->
            <div v-if="timeline.length" class="space-y-4 relative pl-3.5 before:absolute before:left-0 before:top-1 before:bottom-1 before:w-px before:bg-slate-100 dark:before:bg-[#334155]">
              <div v-for="(ev, idx) in timeline" :key="idx" class="relative">
                <span class="absolute -left-[18px] top-1 w-2 h-2 rounded-full border-2 border-white dark:border-[#1e293b]" :class="ev.dotClass"></span>

                <!-- Evento de sistema (cambio de estado) -->
                <div v-if="ev.kind === 'system'" class="flex items-center gap-2 text-[11px] font-medium text-slate-500 dark:text-slate-400">
                  <i :class="ev.icon" class="text-[10px]"></i>
                  <span><span class="font-bold text-slate-600 dark:text-slate-300">{{ ev.author }}</span> — {{ ev.text }}</span>
                  <span class="text-[9px] font-bold text-slate-300 dark:text-slate-600 ml-auto shrink-0">{{ relativeDate(ev.fecha) }}</span>
                </div>

                <!-- Comentario / bitácora -->
                <div v-else class="bg-slate-50 dark:bg-[#0f172a] rounded-xl px-3.5 py-2.5">
                  <div class="flex items-center gap-2 mb-1">
                    <span v-if="ev.emoji" class="text-[13px]">{{ ev.emoji }}</span>
                    <span class="text-[10px] font-black text-slate-600 dark:text-slate-300">{{ ev.author }}</span>
                    <span v-if="ev.kind === 'log'" class="text-[8px] font-black uppercase tracking-widest text-primary-500 bg-primary-50 dark:bg-primary-500/10 px-1.5 py-0.5 rounded">Bitácora</span>
                    <span class="text-[9px] font-bold text-slate-300 dark:text-slate-600 ml-auto">{{ relativeDate(ev.fecha) }}</span>
                  </div>
                  <p class="text-[11px] font-medium text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">{{ ev.text }}</p>
                </div>
              </div>
            </div>
            <p v-else class="text-[11px] font-medium text-slate-400 text-center py-4">Sin actividad todavía — escribe el primer comentario.</p>
          </div>
        </div>

        <!-- Panel lateral -->
        <div class="space-y-4">
          <!-- Detalles -->
          <div class="bg-white dark:bg-[#1e293b] rounded-xl p-5 space-y-3.5">
            <p class="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Detalles</p>

            <div class="detail-row">
              <span class="detail-label">Prioridad</span>
              <span class="inline-flex items-center gap-1.5 h-6 px-2 rounded-md text-[9px] font-black uppercase tracking-widest" :class="priorityConfig[selectedCase.prioridad]?.soft">
                <i :class="priorityConfig[selectedCase.prioridad]?.icon" class="text-[8px]"></i>
                {{ selectedCase.prioridad }}
              </span>
            </div>

            <div class="detail-row">
              <span class="detail-label">Cliente</span>
              <span class="text-[11px] font-bold text-slate-700 dark:text-slate-200 truncate">{{ clientName(selectedCase) || 'Interno' }}</span>
            </div>

            <div class="detail-row">
              <span class="detail-label">Responsable</span>
              <span class="flex items-center gap-1.5 min-w-0">
                <span class="w-5 h-5 rounded-full bg-slate-100 dark:bg-[#334155] flex items-center justify-center text-[7px] font-black text-slate-500 dark:text-slate-300">
                  {{ initials(assigneeName(selectedCase)) }}
                </span>
                <span class="text-[11px] font-bold text-slate-700 dark:text-slate-200 truncate">{{ assigneeName(selectedCase) || 'Sin asignar' }}</span>
              </span>
            </div>

            <div v-if="selectedCase.fecha_limite" class="detail-row">
              <span class="detail-label">Fecha límite</span>
              <span class="text-[11px] font-bold" :class="isOverdue ? 'text-rose-500' : 'text-slate-700 dark:text-slate-200'">
                {{ shortDate(selectedCase.fecha_limite) }}
              </span>
            </div>

            <div v-if="selectedCase.fecha_resolucion" class="detail-row">
              <span class="detail-label">Resuelto</span>
              <span class="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">{{ shortDate(selectedCase.fecha_resolucion) }}</span>
            </div>

            <div v-if="selectedCase.tipo === 'seguimiento'" class="pt-1">
              <div class="flex items-center justify-between mb-1.5">
                <span class="detail-label">Progreso</span>
                <span class="text-[11px] font-black text-slate-700 dark:text-slate-200">{{ selectedCase.progreso || 0 }}%</span>
              </div>
              <div class="h-1.5 bg-slate-100 dark:bg-[#334155] rounded-full overflow-hidden">
                <div class="h-full bg-primary-500 rounded-full transition-all duration-300" :style="{ width: `${selectedCase.progreso || 0}%` }"></div>
              </div>
              <input
                type="range" min="0" max="100" step="5"
                :value="selectedCase.progreso || 0"
                class="w-full mt-2 accent-current"
                :style="{ color: 'var(--brand-accent)' }"
                @change="updateProgress(($event.target as HTMLInputElement).valueAsNumber)"
              />
            </div>
          </div>

          <!-- Adjuntos -->
          <div class="bg-white dark:bg-[#1e293b] rounded-xl p-5">
            <div class="flex items-center justify-between mb-3">
              <p class="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                Adjuntos
                <span v-if="selectedCase.archivos?.length" class="ml-1 px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-[#334155] text-slate-500 dark:text-slate-400">{{ selectedCase.archivos.length }}</span>
              </p>
              <label class="btn-ghost cursor-pointer">
                <i class="fas text-[9px]" :class="uploadingFiles ? 'fa-circle-notch fa-spin' : 'fa-plus'"></i>Subir
                <input type="file" multiple class="hidden" @change="uploadFiles" />
              </label>
            </div>
            <div v-if="selectedCase.archivos?.length" class="space-y-1.5">
              <div
                v-for="(file, idx) in selectedCase.archivos"
                :key="idx"
                class="group flex items-center gap-2.5 px-2.5 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-[#273449] transition-colors"
              >
                <i :class="fileIcon(file.nombre)" class="text-[13px] shrink-0"></i>
                <a :href="fileUrl(file.url)" target="_blank" class="flex-1 min-w-0 text-[11px] font-bold text-slate-600 dark:text-slate-300 truncate hover:text-primary-600 dark:hover:text-primary-300 transition-colors">
                  {{ file.nombre }}
                </a>
                <span class="text-[9px] font-bold text-slate-300 dark:text-slate-600 shrink-0">{{ fileSize(file.tamaño) }}</span>
                <button
                  class="w-6 h-6 hidden group-hover:flex items-center justify-center rounded-md text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors shrink-0"
                  title="Eliminar adjunto"
                  @click="askDeleteFile(idx)"
                >
                  <i class="fas fa-trash text-[9px]"></i>
                </button>
              </div>
            </div>
            <p v-else class="text-[11px] font-medium text-slate-400 text-center py-3">Sin archivos adjuntos</p>
          </div>

          <!-- Tickets vinculados -->
          <div class="bg-white dark:bg-[#1e293b] rounded-xl p-5">
            <div class="flex items-center justify-between mb-3">
              <p class="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Tickets</p>
              <button class="btn-ghost" @click="openLinkTicketModal">
                <i class="fas fa-link text-[9px]"></i>Vincular
              </button>
            </div>
            <div v-if="selectedCase.linkedTickets?.length" class="space-y-1.5">
              <div
                v-for="ticket in selectedCase.linkedTickets"
                :key="ticket._id"
                class="group flex items-center gap-2.5 px-2.5 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-[#273449] transition-colors"
              >
                <span class="text-[9px] font-black text-slate-400 shrink-0">#{{ ticket.ticketNumber || ticket._id?.slice(-5).toUpperCase() }}</span>
                <span class="flex-1 min-w-0 text-[11px] font-bold text-slate-600 dark:text-slate-300 truncate">{{ ticket.subject || ticket.titulo }}</span>
                <button
                  class="w-6 h-6 hidden group-hover:flex items-center justify-center rounded-md text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors shrink-0"
                  title="Desvincular"
                  @click="unlinkTicket(ticket._id)"
                >
                  <i class="fas fa-unlink text-[9px]"></i>
                </button>
              </div>
            </div>
            <p v-else class="text-[11px] font-medium text-slate-400 text-center py-3">Sin tickets vinculados</p>
          </div>
        </div>
      </div>
    </template>

    <!-- ════════ MODAL CREAR / EDITAR ════════ -->
    <div v-if="showFormModal" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50">
      <div class="bg-white dark:bg-[#1e293b] rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden">
        <div class="px-5 py-4 border-b border-slate-100 dark:border-[#334155] flex items-center justify-between shrink-0 bg-slate-50 dark:bg-[#273449]">
          <h3 class="text-[15px] font-black text-slate-800 dark:text-slate-100 tracking-tight">
            {{ form._id ? 'Editar caso' : 'Nuevo caso' }}
          </h3>
          <button class="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-[#273449] transition-colors" @click="showFormModal = false">
            <i class="fas fa-times text-[12px]"></i>
          </button>
        </div>

        <div class="p-5 space-y-4 overflow-y-auto">
          <div>
            <label class="form-label">Título *</label>
            <input v-model="form.titulo" type="text" placeholder="Ej: Migración de servidor a Oracle Cloud" class="form-input" />
          </div>

          <div>
            <label class="form-label">Descripción *</label>
            <textarea v-model="form.descripcion" rows="3" placeholder="Contexto y objetivo del caso..." class="form-input resize-none"></textarea>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label class="form-label">Tipo</label>
              <div class="relative">
                <i class="fas fa-layer-group absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[10px] pointer-events-none"></i>
                <select v-model="form.tipo" class="form-input appearance-none" style="padding-left:2rem;padding-right:2rem;">
                  <option value="seguimiento">Seguimiento</option>
                  <option value="incidencia">Incidencia</option>
                  <option value="documento">Documento</option>
                </select>
                <i class="fas fa-chevron-down absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-[9px] pointer-events-none"></i>
              </div>
            </div>
            <div>
              <label class="form-label">Prioridad</label>
              <div class="relative">
                <i class="fas fa-exclamation-circle absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[10px] pointer-events-none"></i>
                <select v-model="form.prioridad" class="form-input appearance-none" style="padding-left:2rem;padding-right:2rem;">
                  <option value="baja">Baja</option>
                  <option value="media">Media</option>
                  <option value="alta">Alta</option>
                  <option value="critica">Crítica</option>
                </select>
                <i class="fas fa-chevron-down absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-[9px] pointer-events-none"></i>
              </div>
            </div>
            <div>
              <label class="form-label">Cliente</label>
              <div class="relative">
                <i class="fas fa-briefcase absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[10px] pointer-events-none"></i>
                <select v-model="form.cliente_id" class="form-input appearance-none" style="padding-left:2rem;padding-right:2rem;">
                  <option value="">Interno (sin cliente)</option>
                  <option v-for="c in clients" :key="c._id" :value="c._id">{{ c.name }}</option>
                </select>
                <i class="fas fa-chevron-down absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-[9px] pointer-events-none"></i>
              </div>
            </div>
            <div>
              <label class="form-label">Responsable</label>
              <div class="relative">
                <i class="fas fa-user absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[10px] pointer-events-none"></i>
                <select v-model="form.asignado_a" class="form-input appearance-none" style="padding-left:2rem;padding-right:2rem;">
                  <option value="">Sin asignar</option>
                  <option v-for="m in team" :key="m._id" :value="m._id">{{ m.name }}</option>
                </select>
                <i class="fas fa-chevron-down absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-[9px] pointer-events-none"></i>
              </div>
            </div>
            <div>
              <label class="form-label">Fecha límite</label>
              <input v-model="form.fecha_limite" type="date" class="form-input" />
            </div>
            <div>
              <label class="form-label">Categoría</label>
              <input v-model="form.categoria" type="text" placeholder="Backend, Legal, Soporte..." class="form-input" />
            </div>
          </div>
        </div>

        <div class="px-5 py-4 border-t border-slate-100 dark:border-[#334155] flex justify-end gap-2 shrink-0">
          <button class="btn-secondary" @click="showFormModal = false">Cancelar</button>
          <button class="btn-primary" :disabled="savingForm" @click="submitForm">
            <i class="fas text-[10px]" :class="savingForm ? 'fa-circle-notch fa-spin' : 'fa-check'"></i>
            {{ form._id ? 'Guardar cambios' : 'Crear caso' }}
          </button>
        </div>
      </div>
    </div>

    <!-- ════════ MODAL VINCULAR TICKET ════════ -->
    <div v-if="showLinkModal" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50">
      <div class="bg-white dark:bg-[#1e293b] rounded-xl shadow-2xl w-full max-w-md max-h-[80vh] flex flex-col overflow-hidden">
        <div class="px-5 py-4 border-b border-slate-100 dark:border-[#334155] flex items-center justify-between shrink-0 bg-slate-50 dark:bg-[#273449]">
          <h3 class="text-[15px] font-black text-slate-800 dark:text-slate-100 tracking-tight">Vincular ticket</h3>
          <button class="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-[#273449] transition-colors" @click="showLinkModal = false">
            <i class="fas fa-times text-[12px]"></i>
          </button>
        </div>
        <div class="p-4 shrink-0">
          <div class="relative">
            <i class="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[10px]"></i>
            <input
              v-model="ticketSearch"
              type="text"
              placeholder="Buscar por título o número..."
              class="w-full h-9 pl-8 pr-3 bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-[#334155] rounded-lg text-[11px] font-medium text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
            />
          </div>
        </div>
        <div class="px-4 pb-4 overflow-y-auto space-y-1">
          <div v-if="loadingTickets" class="py-8 text-center">
            <i class="fas fa-circle-notch fa-spin text-slate-300 text-lg"></i>
          </div>
          <template v-else>
            <button
              v-for="t in filteredTickets"
              :key="t._id"
              class="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-left hover:bg-slate-50 dark:hover:bg-[#273449] transition-colors"
              @click="linkTicket(t)"
            >
              <span class="text-[9px] font-black text-slate-400 shrink-0">#{{ t.ticketNumber || t._id.slice(-5).toUpperCase() }}</span>
              <span class="flex-1 min-w-0 text-[11px] font-bold text-slate-700 dark:text-slate-200 truncate">{{ t.subject || t.titulo }}</span>
              <i class="fas fa-plus text-[9px] text-primary-500 shrink-0"></i>
            </button>
            <p v-if="!filteredTickets.length" class="text-[11px] font-medium text-slate-400 text-center py-6">No se encontraron tickets</p>
          </template>
        </div>
      </div>
    </div>

    <!-- ════════ MODAL CONFIRMACIÓN (sin blur) ════════ -->
    <div v-if="confirmDialog" class="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/50">
      <div class="bg-white dark:bg-[#1e293b] rounded-xl shadow-2xl w-full max-w-sm p-6">
        <div class="w-11 h-11 rounded-xl bg-rose-50 dark:bg-rose-500/10 text-rose-500 flex items-center justify-center mb-4">
          <i class="fas fa-trash text-[16px]"></i>
        </div>
        <h3 class="text-[15px] font-black text-slate-800 dark:text-slate-100 tracking-tight mb-1.5">{{ confirmDialog.title }}</h3>
        <p class="text-[11px] font-medium text-slate-500 dark:text-slate-400 leading-relaxed mb-6">{{ confirmDialog.message }}</p>
        <div class="flex justify-end gap-2">
          <button class="btn-secondary" @click="confirmDialog = null">Cancelar</button>
          <button
            class="inline-flex items-center gap-2 h-9 px-4 text-[11px] font-bold rounded-lg text-white bg-rose-600 hover:bg-rose-700 transition-colors"
            @click="confirmDialog.onConfirm(); confirmDialog = null"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { casesService, type Case } from '../services/casesService'
import { clientService, type ClientData } from '../services/clientService'
import { teamService } from '../services/teamService'
import type { TeamMember } from '../types'
import { ticketService } from '../services/ticketService'
import { useNotifications } from '../composables/useNotifications'
import { useAuthStore } from '../stores/auth'
import { API_CONFIG } from '../config/api'
import { formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'
import WikiEditor from './wiki/WikiEditor.vue'
import WikiContent from './wiki/WikiContent.vue'

type CaseStatus = Case['estado']

const { showSuccess, showError } = useNotifications()
const authStore = useAuthStore()
const route = useRoute()
const router = useRouter()

// ── Configuración visual (colores consistentes por convención) ──────────────
const statusConfig: Record<CaseStatus, { label: string; dot: string; badge: string; badgeStrong: string }> = {
  abierto: {
    label: 'Abierto',
    dot: 'bg-blue-500',
    badge: 'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-300',
    badgeStrong: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-300 dark:border-blue-500/30',
  },
  en_progreso: {
    label: 'En progreso',
    dot: 'bg-amber-500',
    badge: 'bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-300',
    badgeStrong: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-300 dark:border-amber-500/30',
  },
  resuelto: {
    label: 'Resuelto',
    dot: 'bg-emerald-500',
    badge: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-300',
    badgeStrong: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:border-emerald-500/30',
  },
  cerrado: {
    label: 'Cerrado',
    dot: 'bg-slate-400',
    badge: 'bg-slate-100 text-slate-500 dark:bg-slate-500/10 dark:text-slate-400',
    badgeStrong: 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-500/10 dark:text-slate-400 dark:border-slate-500/30',
  },
}

const priorityConfig: Record<string, { icon: string; soft: string }> = {
  baja:    { icon: 'fas fa-angle-down',        soft: 'bg-slate-100 text-slate-500 dark:bg-slate-500/10 dark:text-slate-400' },
  media:   { icon: 'fas fa-equals',            soft: 'bg-sky-50 text-sky-600 dark:bg-sky-500/10 dark:text-sky-300' },
  alta:    { icon: 'fas fa-angle-up',          soft: 'bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-300' },
  critica: { icon: 'fas fa-angles-up',         soft: 'bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-300' },
}

const typeConfig: Record<string, { label: string; icon: string }> = {
  seguimiento: { label: 'Seguimiento', icon: 'fas fa-project-diagram' },
  incidencia:  { label: 'Incidencia',  icon: 'fas fa-bug' },
  documento:   { label: 'Documento',   icon: 'fas fa-file-contract' },
}

// ── Estado ───────────────────────────────────────────────────────────────────
const cases = ref<Case[]>([])
const clients = ref<ClientData[]>([])
const team = ref<TeamMember[]>([])
const loading = ref(true)

const selectedCase = ref<Case | null>(null)
const statusMenuOpen = ref(false)

const searchTerm = ref('')
const filterEstado = ref('')
const filterPrioridad = ref('')
const filterResponsable = ref('')
const filterTipo = ref('')

const editingDocs = ref(false)
const docsDraft = ref('')
const savingDocs = ref(false)

const newComment = ref('')
const sendingComment = ref(false)
const uploadingFiles = ref(false)

const showFormModal = ref(false)
const savingForm = ref(false)
const form = ref<any>({})

const showLinkModal = ref(false)
const loadingTickets = ref(false)
const ticketSearch = ref('')
const availableTickets = ref<any[]>([])

const confirmDialog = ref<{ title: string; message: string; onConfirm: () => void } | null>(null)

// ── Computeds ────────────────────────────────────────────────────────────────
const statusChips = computed(() => {
  const count = (estado: string) => cases.value.filter(c => !estado || c.estado === estado).length
  return [
    { id: '', label: 'Todos', dot: '', count: count('') },
    ...Object.entries(statusConfig).map(([id, cfg]) => ({ id, label: cfg.label, dot: cfg.dot, count: count(id) })),
  ]
})

const filteredCases = computed(() => {
  const q = searchTerm.value.trim().toLowerCase()
  return cases.value.filter(c => {
    if (filterEstado.value && c.estado !== filterEstado.value) return false
    if (filterPrioridad.value && c.prioridad !== filterPrioridad.value) return false
    if (filterTipo.value && c.tipo !== filterTipo.value) return false
    if (filterResponsable.value && assigneeId(c) !== filterResponsable.value) return false
    if (q) {
      const haystack = `${c.titulo} ${clientName(c)} ${c.categoria || ''}`.toLowerCase()
      if (!haystack.includes(q)) return false
    }
    return true
  })
})

interface TimelineEvent {
  kind: 'comment' | 'log' | 'system'
  author: string
  text: string
  fecha: Date | string
  icon?: string
  emoji?: string
  dotClass: string
}

const timeline = computed<TimelineEvent[]>(() => {
  if (!selectedCase.value) return []
  const events: TimelineEvent[] = []

  for (const com of selectedCase.value.comentarios || []) {
    const author = (com.autor as any)?.name || 'Sistema'
    if (com.tipo === 'actualizacion' || com.tipo === 'resolucion') {
      events.push({
        kind: 'system',
        author,
        text: com.comentario,
        fecha: com.fecha,
        icon: com.tipo === 'resolucion' ? 'fas fa-circle-check text-emerald-500' : 'fas fa-arrows-rotate text-slate-400',
        dotClass: com.tipo === 'resolucion' ? 'bg-emerald-400' : 'bg-slate-300 dark:bg-slate-600',
      })
    } else {
      events.push({ kind: 'comment', author, text: com.comentario, fecha: com.fecha, dotClass: 'bg-primary-400' })
    }
  }

  for (const log of selectedCase.value.dailyLogs || []) {
    events.push({
      kind: 'log',
      author: (log.autor as any)?.name || 'Equipo',
      text: log.que_se_hizo,
      fecha: log.fecha,
      emoji: log.sentimiento,
      dotClass: 'bg-amber-400',
    })
  }

  return events.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
})

const filteredTickets = computed(() => {
  const q = ticketSearch.value.trim().toLowerCase()
  const linkedIds = new Set((selectedCase.value?.linkedTickets || []).map((t: any) => t._id))
  return availableTickets.value
    .filter(t => !linkedIds.has(t._id))
    .filter(t => !q || (t.subject || t.titulo || '').toLowerCase().includes(q) || (t.ticketNumber || '').toLowerCase().includes(q))
    .slice(0, 30)
})

const isOverdue = computed(() => {
  const c = selectedCase.value
  if (!c?.fecha_limite || c.estado === 'resuelto' || c.estado === 'cerrado') return false
  return new Date(c.fecha_limite).getTime() < Date.now()
})

// ── Helpers ──────────────────────────────────────────────────────────────────
const clientName = (c: Case) => {
  const cli = c.cliente_id as any
  if (!cli) return ''
  if (typeof cli === 'object') return cli.name || cli.nombre || cli.empresa || ''
  return clients.value.find(x => x._id === cli)?.name || ''
}

const assigneeId = (c: Case) => {
  const a = c.asignado_a as any
  return typeof a === 'object' ? a?._id : a
}

const assigneeName = (c: Case) => {
  const a = c.asignado_a as any
  if (!a) return ''
  if (typeof a === 'object') return a.name || ''
  return team.value.find(m => m._id === a)?.name || ''
}

const initials = (name?: string) => (name || '—').split(' ').map(p => p[0]).join('').toUpperCase().slice(0, 2)
const relativeDate = (d?: Date | string) => d ? formatDistanceToNow(new Date(d), { addSuffix: true, locale: es }) : ''
const shortDate = (d?: Date | string) => d ? new Date(d).toLocaleDateString('es-CO', { day: 'numeric', month: 'short', year: 'numeric' }) : ''
const fileIcon = (name: string) => casesService.getFileIcon(name)
const fileSize = (bytes?: number) => bytes ? casesService.formatFileSize(bytes) : ''
const fileUrl = (url: string) => url?.startsWith('http') ? url : `${API_CONFIG.BASE_URL.replace(/\/api$/, '')}${url}`

const clearFilters = () => {
  searchTerm.value = ''
  filterEstado.value = ''
  filterPrioridad.value = ''
  filterResponsable.value = ''
  filterTipo.value = ''
}

// ── Carga ────────────────────────────────────────────────────────────────────
const loadData = async () => {
  loading.value = true
  try {
    const [casesData, clientsData, teamData] = await Promise.all([
      casesService.getAll({ limit: 200 }),
      clientService.getAll(),
      teamService.getAll().catch(() => [] as TeamMember[]),
    ])
    cases.value = casesData
    clients.value = clientsData
    team.value = teamData
  } catch {
    showError('Error', 'No se pudieron cargar los casos.')
  } finally {
    loading.value = false
  }
}

// ── Navegación lista/detalle ─────────────────────────────────────────────────
const openCase = async (c: Case) => {
  selectedCase.value = c
  editingDocs.value = false
  statusMenuOpen.value = false
  try {
    selectedCase.value = await casesService.getCaseById(c._id!)
  } catch { /* se queda con la versión de la lista */ }
}

const closeCase = () => {
  selectedCase.value = null
  statusMenuOpen.value = false
}

const syncCaseInList = (updated: Case) => {
  const idx = cases.value.findIndex(c => c._id === updated._id)
  if (idx !== -1) cases.value[idx] = updated
  selectedCase.value = updated
}

// ── Acciones ─────────────────────────────────────────────────────────────────
const changeStatus = async (estado: CaseStatus) => {
  if (!selectedCase.value?._id) return
  statusMenuOpen.value = false
  try {
    const updated = await casesService.changeStatus(selectedCase.value._id, estado)
    syncCaseInList(updated)
  } catch (err: any) {
    showError('Error', err.message)
  }
}

const addComment = async () => {
  if (!selectedCase.value?._id || !newComment.value.trim()) return
  sendingComment.value = true
  try {
    const updated = await casesService.addComment(selectedCase.value._id, {
      comentario: newComment.value.trim(),
      autor: authStore.user?._id,
      tipo: 'comentario',
    })
    syncCaseInList(updated)
    newComment.value = ''
  } catch (err: any) {
    showError('Error', err.message)
  } finally {
    sendingComment.value = false
  }
}

const startEditDocs = () => {
  docsDraft.value = selectedCase.value?.wikiContent || ''
  editingDocs.value = true
}

const saveDocs = async () => {
  if (!selectedCase.value?._id) return
  savingDocs.value = true
  try {
    const updated = await casesService.updateCase(selectedCase.value._id, { wikiContent: docsDraft.value })
    syncCaseInList(updated)
    editingDocs.value = false
  } catch (err: any) {
    showError('Error', err.message)
  } finally {
    savingDocs.value = false
  }
}

const updateProgress = async (progreso: number) => {
  if (!selectedCase.value?._id) return
  try {
    await casesService.updateProgress(selectedCase.value._id, progreso)
    selectedCase.value.progreso = progreso
  } catch (err: any) {
    showError('Error', err.message)
  }
}

const uploadFiles = async (e: Event) => {
  const input = e.target as HTMLInputElement
  if (!selectedCase.value?._id || !input.files?.length) return
  uploadingFiles.value = true
  try {
    await casesService.uploadFiles(selectedCase.value._id, input.files)
    selectedCase.value = await casesService.getCaseById(selectedCase.value._id)
    showSuccess('Listo', 'Archivos subidos.')
  } catch (err: any) {
    showError('Error', err.message)
  } finally {
    uploadingFiles.value = false
    input.value = ''
  }
}

const askDeleteFile = (idx: number) => {
  const file = selectedCase.value?.archivos?.[idx]
  confirmDialog.value = {
    title: 'Eliminar adjunto',
    message: `«${file?.nombre}» se eliminará permanentemente del caso.`,
    onConfirm: async () => {
      try {
        await casesService.deleteFile(selectedCase.value!._id!, idx)
        selectedCase.value!.archivos.splice(idx, 1)
      } catch (err: any) {
        showError('Error', err.message)
      }
    },
  }
}

const askDeleteCase = () => {
  confirmDialog.value = {
    title: 'Eliminar caso',
    message: `«${selectedCase.value?.titulo}» y todo su historial se eliminarán permanentemente. Esta acción no se puede deshacer.`,
    onConfirm: async () => {
      try {
        await casesService.deleteCase(selectedCase.value!._id!)
        cases.value = cases.value.filter(c => c._id !== selectedCase.value?._id)
        closeCase()
        showSuccess('Eliminado', 'El caso ha sido eliminado.')
      } catch (err: any) {
        showError('Error', err.message)
      }
    },
  }
}

// ── Formulario crear/editar ──────────────────────────────────────────────────
const openCreateModal = (clientId = '') => {
  form.value = {
    titulo: '',
    descripcion: '',
    tipo: 'seguimiento',
    prioridad: 'media',
    cliente_id: clientId,
    asignado_a: '',
    fecha_limite: '',
    categoria: '',
  }
  showFormModal.value = true
}

const openEditModal = () => {
  const c = selectedCase.value!
  form.value = {
    _id: c._id,
    titulo: c.titulo,
    descripcion: c.descripcion,
    tipo: c.tipo,
    prioridad: c.prioridad,
    cliente_id: (c.cliente_id as any)?._id || c.cliente_id || '',
    asignado_a: assigneeId(c) || '',
    fecha_limite: c.fecha_limite ? new Date(c.fecha_limite).toISOString().slice(0, 10) : '',
    categoria: c.categoria || '',
  }
  showFormModal.value = true
}

const submitForm = async () => {
  if (!form.value.titulo?.trim() || !form.value.descripcion?.trim()) {
    showError('Campos requeridos', 'El título y la descripción son obligatorios.')
    return
  }
  savingForm.value = true
  try {
    const payload = { ...form.value }
    if (!payload.cliente_id) delete payload.cliente_id
    if (!payload.asignado_a) delete payload.asignado_a
    if (!payload.fecha_limite) delete payload.fecha_limite

    if (form.value._id) {
      const updated = await casesService.updateCase(form.value._id, payload)
      syncCaseInList(updated)
      showSuccess('Guardado', 'Caso actualizado.')
    } else {
      const created = await casesService.createCase(payload)
      cases.value.unshift(created)
      showSuccess('Creado', 'El caso ha sido creado.')
      openCase(created)
    }
    showFormModal.value = false
  } catch (err: any) {
    showError('Error', err.message)
  } finally {
    savingForm.value = false
  }
}

// ── Tickets ──────────────────────────────────────────────────────────────────
const openLinkTicketModal = async () => {
  showLinkModal.value = true
  loadingTickets.value = true
  ticketSearch.value = ''
  try {
    const response = await ticketService.getAll({ limit: 100 })
    availableTickets.value = response.data || []
  } catch {
    showError('Error', 'No se pudieron cargar los tickets.')
  } finally {
    loadingTickets.value = false
  }
}

const linkTicket = async (ticket: any) => {
  if (!selectedCase.value?._id) return
  try {
    const updated = await casesService.linkTicket(selectedCase.value._id, ticket._id)
    syncCaseInList(updated)
    showLinkModal.value = false
  } catch (err: any) {
    showError('Error', err.message)
  }
}

const unlinkTicket = async (ticketId: string) => {
  if (!selectedCase.value?._id) return
  try {
    const updated = await casesService.unlinkTicket(selectedCase.value._id, ticketId)
    syncCaseInList(updated)
  } catch (err: any) {
    showError('Error', err.message)
  }
}

// ── Init ─────────────────────────────────────────────────────────────────────
const onClickOutside = (e: MouseEvent) => {
  if (statusMenuOpen.value && !(e.target as HTMLElement).closest('.relative')) {
    statusMenuOpen.value = false
  }
}

onMounted(async () => {
  document.addEventListener('click', onClickOutside)
  await loadData()
  // Entrada directa: /cases?nuevo=1&cliente=<id> abre el formulario prellenado
  if (route.query.nuevo === '1') {
    openCreateModal((route.query.cliente as string) || '')
    router.replace({ query: {} })
  } else if (route.query.id) {
    const target = cases.value.find(c => c._id === route.query.id)
    if (target) openCase(target)
  }
})

onBeforeUnmount(() => {
  document.removeEventListener('click', onClickOutside)
})
</script>

<style scoped>
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
.btn-secondary:hover {
  background: #f8fafc;
  color: #0f172a;
}
.dark .btn-secondary {
  background: #1e293b;
  color: #cbd5e1;
  border-color: #334155;
}
.dark .btn-secondary:hover {
  background: #273449;
  color: #f1f5f9;
}

.btn-ghost {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 28px;
  padding: 0 10px;
  border-radius: 8px;
  color: #64748b;
  font-size: 10px;
  font-weight: 700;
  transition: all 0.15s ease;
}
.btn-ghost:hover {
  background: #f1f5f9;
  color: #0f172a;
}
.dark .btn-ghost {
  color: #94a3b8;
}
.dark .btn-ghost:hover {
  background: #273449;
  color: #f1f5f9;
}

.select-filter {
  height: 36px;
  padding: 0 12px;
  border-radius: 8px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  font-size: 11px;
  font-weight: 700;
  color: #475569;
  outline: none;
  transition: all 0.15s ease;
}
.select-filter:focus {
  border-color: var(--brand-accent, #4f46e5);
}
.dark .select-filter {
  background: #0f172a;
  border-color: #334155;
  color: #cbd5e1;
}

.form-label {
  display: block;
  font-size: 9px;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #94a3b8;
  margin-bottom: 6px;
}
.dark .form-label {
  color: #64748b;
}

.form-input {
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
.form-input:focus {
  border-color: var(--brand-accent, #4f46e5);
  box-shadow: 0 0 0 3px rgba(var(--brand-accent-rgb, 79, 70, 229), 0.1);
  background: white;
}
.dark .form-input {
  background: #0f172a;
  border-color: #334155;
  color: #e2e8f0;
}
.dark .form-input:focus {
  background: #0f172a;
}

.detail-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}
.detail-label {
  font-size: 9px;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #94a3b8;
  flex-shrink: 0;
}
.dark .detail-label {
  color: #64748b;
}
</style>
