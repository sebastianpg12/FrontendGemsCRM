<template>
  <div class="min-h-screen p-6" :style="{ background: 'var(--bg-primary, #f0f2f6)' }">

    <!-- Header -->
    <div class="max-w-6xl mx-auto">
      <div class="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <div class="flex items-center gap-3 mb-1">
            <div class="w-9 h-9 rounded-xl flex items-center justify-center text-white text-sm"
              style="background:linear-gradient(135deg,#4f46e5,#7c3aed)">
              <i class="fas fa-shield-halved"></i>
            </div>
            <h1 class="text-xl font-bold" style="color:var(--text-primary,#111827)">Auditoría de acceso</h1>
          </div>
          <p class="text-sm pl-12" style="color:var(--text-secondary,#6b7280)">
            Registro de acciones de administración de la plataforma
          </p>
        </div>

        <div class="flex items-center gap-2 flex-wrap">
          <!-- Filtro de acción -->
          <select v-model="filterAction"
            class="text-sm rounded-lg px-3 py-2 border outline-none"
            style="background:var(--bg-card,#fff);border-color:var(--border,#e3e6ef);color:var(--text-primary,#111827)">
            <option value="">Todas las acciones</option>
            <option value="login_as_superadmin">Login superadmin</option>
            <option value="org_create">Crear organización</option>
            <option value="org_update">Actualizar organización</option>
            <option value="org_archive">Archivar organización</option>
            <option value="superadmin_grant">Otorgar superadmin</option>
            <option value="superadmin_revoke">Revocar superadmin</option>
          </select>

          <!-- Descargar PDF -->
          <button @click="downloadPDF" :disabled="!logs.length || exportingPdf"
            class="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white transition-all disabled:opacity-50"
            style="background:linear-gradient(135deg,#4f46e5,#7c3aed);box-shadow:0 4px 12px rgba(124,58,237,.25)">
            <i v-if="exportingPdf" class="fas fa-spinner fa-spin text-xs"></i>
            <i v-else class="fas fa-file-pdf text-xs"></i>
            {{ exportingPdf ? 'Generando...' : 'Descargar PDF' }}
          </button>
        </div>
      </div>

      <!-- Stats strip -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <div v-for="stat in stats" :key="stat.label"
          class="rounded-xl p-4 border"
          style="background:var(--bg-card,#fff);border-color:var(--border,#e3e6ef)">
          <p class="text-xs font-semibold mb-1" style="color:var(--text-secondary,#6b7280)">{{ stat.label }}</p>
          <p class="text-2xl font-bold" :style="{ color: stat.color }">{{ stat.value }}</p>
        </div>
      </div>

      <!-- Table card -->
      <div class="rounded-2xl border overflow-hidden"
        style="background:var(--bg-card,#fff);border-color:var(--border,#e3e6ef)">

        <!-- Table header -->
        <div class="flex items-center justify-between px-5 py-3 border-b text-xs font-semibold uppercase tracking-wide"
          style="background:var(--bg-secondary,#f7f8fb);border-color:var(--border,#e3e6ef);color:var(--text-secondary,#6b7280)">
          <span>{{ pagination.total }} registros</span>
          <span v-if="isLoading" class="flex items-center gap-1.5">
            <i class="fas fa-spinner fa-spin"></i> Cargando…
          </span>
        </div>

        <!-- Loading skeleton -->
        <div v-if="isLoading" class="divide-y" style="border-color:var(--border,#e3e6ef)">
          <div v-for="i in 8" :key="i" class="px-5 py-4 flex gap-4 animate-pulse">
            <div class="w-8 h-8 rounded-full flex-shrink-0" style="background:var(--bg-secondary,#f0f2f6)"></div>
            <div class="flex-1 space-y-2">
              <div class="h-3 rounded w-1/3" style="background:var(--bg-secondary,#f0f2f6)"></div>
              <div class="h-3 rounded w-1/2" style="background:var(--bg-secondary,#f0f2f6)"></div>
            </div>
          </div>
        </div>

        <!-- Empty state -->
        <div v-else-if="!filteredLogs.length" class="py-16 text-center">
          <i class="fas fa-shield-halved text-4xl mb-3 opacity-20" style="color:var(--text-primary,#111827)"></i>
          <p class="font-semibold" style="color:var(--text-secondary,#6b7280)">No hay registros de auditoría</p>
        </div>

        <!-- Log rows -->
        <div v-else class="divide-y" style="border-color:var(--border,#e3e6ef)">
          <div v-for="log in filteredLogs" :key="log._id"
            class="px-5 py-4 flex items-start gap-4 hover:bg-opacity-50 transition-colors"
            style="transition: background 0.15s"
            @mouseenter="(e:any) => e.currentTarget.style.background='var(--bg-secondary,#f7f8fb)'"
            @mouseleave="(e:any) => e.currentTarget.style.background=''">

            <!-- Action icon -->
            <div class="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-sm"
              :style="actionStyle(log.action)">
              <i :class="actionIcon(log.action)"></i>
            </div>

            <!-- Content -->
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 flex-wrap mb-0.5">
                <span class="font-semibold text-sm" style="color:var(--text-primary,#111827)">
                  {{ log.superAdminId?.name || 'Sistema' }}
                </span>
                <span class="text-xs px-2 py-0.5 rounded-full font-semibold"
                  :style="badgeStyle(log.action)">
                  {{ actionLabel(log.action) }}
                </span>
              </div>
              <p class="text-xs truncate" style="color:var(--text-secondary,#6b7280)">
                <span v-if="log.organizationId">
                  Org: <strong>{{ log.organizationId.name }}</strong> ·&nbsp;
                </span>
                <span>{{ log.superAdminId?.email || '—' }}</span>
                <span v-if="log.ipAddress"> · IP: {{ log.ipAddress }}</span>
              </p>
            </div>

            <!-- Date -->
            <div class="text-right flex-shrink-0">
              <p class="text-xs font-semibold" style="color:var(--text-primary,#111827)">
                {{ formatDate(log.createdAt) }}
              </p>
              <p class="text-xs" style="color:var(--text-secondary,#9ca3af)">
                {{ formatTime(log.createdAt) }}
              </p>
            </div>
          </div>
        </div>

        <!-- Pagination -->
        <div v-if="pagination.totalPages > 1"
          class="flex items-center justify-between px-5 py-3 border-t text-sm"
          style="background:var(--bg-secondary,#f7f8fb);border-color:var(--border,#e3e6ef)">
          <button @click="goPage(pagination.page - 1)" :disabled="pagination.page <= 1"
            class="px-3 py-1.5 rounded-lg font-semibold disabled:opacity-40 transition"
            style="background:var(--bg-card,#fff);border:1px solid var(--border,#e3e6ef);color:var(--text-primary,#111827)">
            <i class="fas fa-chevron-left text-xs"></i>
          </button>
          <span style="color:var(--text-secondary,#6b7280)">
            Página {{ pagination.page }} / {{ pagination.totalPages }}
          </span>
          <button @click="goPage(pagination.page + 1)" :disabled="pagination.page >= pagination.totalPages"
            class="px-3 py-1.5 rounded-lg font-semibold disabled:opacity-40 transition"
            style="background:var(--bg-card,#fff);border:1px solid var(--border,#e3e6ef);color:var(--text-primary,#111827)">
            <i class="fas fa-chevron-right text-xs"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'
import apiClient from '@/services/authService'

interface AuditLog {
  _id: string
  superAdminId?: { name: string; email: string }
  organizationId?: { name: string; slug: string }
  action: string
  ipAddress?: string
  userAgent?: string
  metadata?: any
  createdAt: string
}

const logs        = ref<AuditLog[]>([])
const isLoading   = ref(false)
const exportingPdf = ref(false)
const filterAction = ref('')
const pagination  = ref({ total: 0, page: 1, limit: 100, totalPages: 1 })

const filteredLogs = computed(() =>
  filterAction.value ? logs.value.filter(l => l.action === filterAction.value) : logs.value
)

const stats = computed(() => {
  const total     = pagination.value.total
  const logins    = logs.value.filter(l => l.action === 'login_as_superadmin').length
  const orgCreate = logs.value.filter(l => l.action === 'org_create').length
  const grants    = logs.value.filter(l => l.action.includes('superadmin')).length
  return [
    { label: 'Total eventos', value: total, color: '#4f46e5' },
    { label: 'Accesos admin', value: logins, color: '#0369a1' },
    { label: 'Orgs creadas',  value: orgCreate, color: '#16a34a' },
    { label: 'Cambios de rol', value: grants, color: '#d97706' },
  ]
})

// ── Helpers ──────────────────────────────────────────────────────────────────
const ACTION_CONFIG: Record<string, { label: string; icon: string; color: string; bg: string }> = {
  login_as_superadmin: { label: 'Acceso admin',        icon: 'fas fa-right-to-bracket', color: '#2563eb', bg: 'rgba(37,99,235,.1)'  },
  org_create:          { label: 'Org creada',           icon: 'fas fa-building-circle-check', color: '#16a34a', bg: 'rgba(22,163,74,.1)' },
  org_update:          { label: 'Org actualizada',      icon: 'fas fa-pen-to-square',    color: '#d97706', bg: 'rgba(217,119,6,.1)'  },
  org_archive:         { label: 'Org archivada',        icon: 'fas fa-box-archive',      color: '#dc2626', bg: 'rgba(220,38,38,.1)'  },
  superadmin_grant:    { label: 'Superadmin otorgado',  icon: 'fas fa-user-shield',      color: '#7c3aed', bg: 'rgba(124,58,237,.1)' },
  superadmin_revoke:   { label: 'Superadmin revocado',  icon: 'fas fa-user-slash',       color: '#64748b', bg: 'rgba(100,116,139,.1)'},
}

function actionIcon(a: string)  { return ACTION_CONFIG[a]?.icon  ?? 'fas fa-circle-dot' }
function actionLabel(a: string) { return ACTION_CONFIG[a]?.label ?? a }
function actionStyle(a: string) {
  const c = ACTION_CONFIG[a]
  return c ? `background:${c.bg};color:${c.color}` : 'background:#f0f2f6;color:#6b7280'
}
function badgeStyle(a: string) {
  const c = ACTION_CONFIG[a]
  return c ? `background:${c.bg};color:${c.color}` : 'background:#f0f2f6;color:#6b7280'
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('es-CR', { year:'numeric', month:'short', day:'2-digit' })
}
function formatTime(d: string) {
  return new Date(d).toLocaleTimeString('es-CR', { hour:'2-digit', minute:'2-digit' })
}

// ── Fetch ────────────────────────────────────────────────────────────────────
async function fetchLogs(page = 1) {
  isLoading.value = true
  try {
    const res = await apiClient.get('/admin/audit-logs', { params: { page, limit: 100 } })
    logs.value      = res.data.data || []
    pagination.value = { ...pagination.value, ...res.data.pagination, page }
  } catch (e) {
    console.error('Error cargando auditoría:', e)
  } finally {
    isLoading.value = false
  }
}

function goPage(p: number) {
  if (p < 1 || p > pagination.value.totalPages) return
  fetchLogs(p)
}

// ── PDF export ───────────────────────────────────────────────────────────────
async function downloadPDF() {
  exportingPdf.value = true
  try {
    // Cargar TODOS los registros para el PDF (hasta 1000)
    let allLogs = logs.value
    if (pagination.value.total > logs.value.length) {
      const res = await apiClient.get('/admin/audit-logs', { params: { page: 1, limit: 1000 } })
      allLogs = res.data.data || []
    }

    const source = filterAction.value ? allLogs.filter(l => l.action === filterAction.value) : allLogs

    const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' })

    // ── Header ──
    doc.setFillColor(79, 70, 229)
    doc.rect(0, 0, 297, 22, 'F')
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.text('GEMS Hub — Auditoría de Acceso', 14, 14)
    doc.setFontSize(9)
    doc.setFont('helvetica', 'normal')
    doc.text(`Generado: ${new Date().toLocaleString('es-CR')}`, 200, 14)

    // ── Stats row ──
    doc.setTextColor(80, 80, 80)
    doc.setFontSize(8)
    doc.text(`Total registros: ${pagination.value.total}`, 14, 30)
    doc.text(`Filtro: ${filterAction.value ? actionLabel(filterAction.value) : 'Todos'}`, 80, 30)
    doc.text(`Mostrando: ${source.length} entradas`, 160, 30)

    // ── Table ──
    autoTable(doc, {
      startY: 35,
      head: [['Fecha', 'Hora', 'Administrador', 'Email', 'Acción', 'Organización', 'IP']],
      body: source.map(l => [
        formatDate(l.createdAt),
        formatTime(l.createdAt),
        l.superAdminId?.name || 'Sistema',
        l.superAdminId?.email || '—',
        actionLabel(l.action),
        l.organizationId?.name || '—',
        l.ipAddress || '—',
      ]),
      headStyles: {
        fillColor: [79, 70, 229],
        textColor: 255,
        fontSize: 8,
        fontStyle: 'bold',
      },
      bodyStyles: { fontSize: 7.5, textColor: [30, 30, 30] },
      alternateRowStyles: { fillColor: [247, 248, 251] },
      columnStyles: {
        0: { cellWidth: 25 },
        1: { cellWidth: 18 },
        2: { cellWidth: 38 },
        3: { cellWidth: 52 },
        4: { cellWidth: 38 },
        5: { cellWidth: 42 },
        6: { cellWidth: 28 },
      },
      margin: { left: 14, right: 14 },
      didDrawPage: (data: any) => {
        // Footer en cada página
        doc.setFontSize(7)
        doc.setTextColor(150)
        doc.text(
          `GEMS Hub — Auditoría de Acceso — Página ${data.pageNumber}`,
          14,
          doc.internal.pageSize.height - 8
        )
        doc.text(
          `© ${new Date().getFullYear()} GEMS Innovations`,
          250,
          doc.internal.pageSize.height - 8
        )
      }
    })

    const date = new Date().toISOString().slice(0, 10)
    doc.save(`gems-hub-auditoria-${date}.pdf`)
  } catch (e) {
    console.error('Error generando PDF:', e)
  } finally {
    exportingPdf.value = false
  }
}

onMounted(() => fetchLogs())
watch(filterAction, () => {}) // reactivo, filteredLogs computed se actualiza solo
</script>
