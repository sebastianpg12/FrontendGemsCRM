<template>
  <div class="min-h-screen bg-slate-50 dark:bg-slate-950 p-6 sm:p-10">
    <div class="max-w-6xl mx-auto">
      <!-- Header -->
      <div class="flex items-center justify-between mb-8">
        <div>
          <div class="flex items-center gap-2 text-xs font-bold text-primary-600 uppercase tracking-widest mb-1">
            <i class="fas fa-crown"></i> Super-administración
          </div>
          <h1 class="text-2xl font-black text-slate-900 dark:text-white">Panel de Control</h1>
          <p class="text-slate-500 dark:text-slate-400 text-sm mt-1">Gestión de tenants y auditoría</p>
          <div v-if="authStore.organization" class="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 text-amber-700 dark:text-amber-300 text-[13px] font-bold">
            <i class="fas fa-building text-[11px]"></i>
            Dentro de: <span class="font-black ml-0.5">{{ authStore.organization.name }}</span>
          </div>
        </div>
        <button
          v-if="activeTab === 'orgs'"
          @click="openCreate"
          class="px-5 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-bold text-sm flex items-center gap-2 transition-all shadow-lg shadow-primary-600/20"
        >
          <i class="fas fa-plus text-xs"></i> Nueva organización
        </button>
        <button
          v-else-if="activeTab === 'audit' && auditLogs.length > 0"
          @click="downloadAuditPDF"
          :disabled="exportingPdf"
          class="px-5 py-2.5 rounded-xl text-white font-bold text-sm flex items-center gap-2 transition-all shadow-lg disabled:opacity-50"
          style="background:linear-gradient(135deg,#4f46e5,#7c3aed);box-shadow:0 4px 14px rgba(124,58,237,.3)"
        >
          <i v-if="exportingPdf" class="fas fa-spinner fa-spin text-xs"></i>
          <i v-else class="fas fa-file-pdf text-xs"></i>
          {{ exportingPdf ? 'Generando…' : 'Descargar PDF' }}
        </button>
      </div>

      <!-- Tabs -->
      <div class="flex gap-4 border-b border-slate-200 dark:border-slate-800 mb-6">
        <button
          @click="activeTab = 'orgs'"
          class="pb-3 text-sm font-bold transition-all border-b-2"
          :class="activeTab === 'orgs' ? 'border-primary-600 text-primary-600' : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-white'"
        >
          <i class="fas fa-building mr-1.5"></i> Organizaciones
        </button>
        <button
          @click="activeTab = 'audit'; loadAudit()"
          class="pb-3 text-sm font-bold transition-all border-b-2"
          :class="activeTab === 'audit' ? 'border-primary-600 text-primary-600' : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-white'"
        >
          <i class="fas fa-shield-alt mr-1.5"></i> Auditoría de Accesos
        </button>
      </div>

      <div v-if="activeTab === 'orgs'">

      <!-- Filters -->
      <div class="flex flex-col sm:flex-row gap-3 mb-6">
        <div class="relative flex-1">
          <i class="far fa-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm"></i>
          <input
            v-model="search"
            type="text"
            placeholder="Buscar por nombre o slug..."
            class="w-full pl-10 pr-4 py-3 rounded-xl text-sm text-slate-800 dark:text-white bg-white dark:bg-slate-900 placeholder:text-slate-400 outline-none focus:border-primary-400 transition"
          />
        </div>
        <select
          v-model="statusFilter"
          class="px-4 py-3 rounded-xl text-sm text-slate-800 dark:text-white bg-white dark:bg-slate-900 outline-none focus:border-primary-400 transition"
        >
          <option value="">Todos los estados</option>
          <option value="active">Activos</option>
          <option value="suspended">Suspendidos</option>
          <option value="pending">Pendientes</option>
          <option value="archived">Archivados</option>
        </select>
      </div>

      <!-- Loading / Empty -->
      <div v-if="loading" class="text-center py-20 text-slate-400 text-sm">
        <i class="fas fa-circle-notch fa-spin text-2xl mb-3"></i>
        <p>Cargando organizaciones…</p>
      </div>
      <div v-else-if="filteredOrgs.length === 0" class="text-center py-20 text-slate-400 text-sm">
        <i class="fas fa-building text-3xl mb-3 opacity-30"></i>
        <p>No hay organizaciones que coincidan.</p>
      </div>

      <!-- Grid -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div
          v-for="org in filteredOrgs"
          :key="org._id"
          class="org-card p-5 rounded-2xl bg-white dark:bg-slate-900"
        >
          <div class="flex items-start gap-3 mb-4">
            <div
              class="w-12 h-12 rounded-xl flex items-center justify-center text-white font-black shrink-0 overflow-hidden"
              :style="{ background: org.branding?.accentColor || '#8b5cf6' }"
            >
              <img
                v-if="org.branding?.logo && !failedLogos.has(org.branding.logo)"
                :src="org.branding.logo"
                alt=""
                class="w-full h-full object-contain"
                @error="failedLogos.add(org.branding.logo)"
              />
              <span v-else>{{ initials(org.name) }}</span>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-slate-900 dark:text-white font-bold text-sm truncate">{{ org.name }}</p>
              <p class="text-slate-400 text-[13px] truncate font-mono">{{ org.slug }}</p>
            </div>
            <span
              class="text-[12px] font-bold uppercase tracking-wider px-2 py-1 rounded-md"
              :class="statusClass(org.status)"
            >
              {{ org.status }}
            </span>
          </div>

          <div class="grid grid-cols-2 gap-2 text-[13px] mb-4">
            <div class="rounded-lg p-2 bg-slate-50 dark:bg-slate-800/50">
              <p class="text-slate-400">Plan</p>
              <p class="text-slate-800 dark:text-white font-bold uppercase">{{ org.plan }}</p>
            </div>
            <div class="rounded-lg p-2 bg-slate-50 dark:bg-slate-800/50">
              <p class="text-slate-400">Miembros</p>
              <p class="text-slate-800 dark:text-white font-bold">{{ org.memberCount || 0 }}</p>
            </div>
          </div>

          <div class="flex gap-2">
            <button
              @click="enterOrg(org)"
              :disabled="org.status !== 'active'"
              class="flex-1 py-2 rounded-lg text-xs font-bold text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              <i class="fas fa-arrow-right-to-bracket mr-1"></i> Entrar
            </button>
            <button
              @click="openEdit(org)"
              class="px-3 py-2 rounded-lg text-xs text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white bg-slate-100 dark:bg-slate-800 transition"
              title="Editar"
            >
              <i class="far fa-pen-to-square"></i>
            </button>
            <button
              v-if="org.status !== 'archived'"
              @click="archiveOrg(org)"
              class="px-3 py-2 rounded-lg text-xs text-rose-500 hover:text-rose-600 bg-rose-50 dark:bg-rose-500/10 transition"
              title="Archivar"
            >
              <i class="far fa-trash-can"></i>
            </button>
          </div>
        </div>
      </div>
      </div>

      <div v-else-if="activeTab === 'audit'">
        <div v-if="loadingAudit" class="text-center py-20 text-slate-400 text-sm">
          <i class="fas fa-circle-notch fa-spin text-2xl mb-3"></i>
          <p>Cargando auditoría…</p>
        </div>
        <div v-else-if="auditLogs.length === 0" class="text-center py-20 text-slate-400 text-sm">
          <p>No hay registros de auditoría.</p>
        </div>
        <div v-else class="bg-white dark:bg-slate-900 rounded-xl shadow-sm dark:border-slate-800 overflow-hidden">
          <table class="w-full text-left text-sm">
            <thead class="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider">
              <tr>
                <th class="px-6 py-4 font-bold">Fecha / Hora</th>
                <th class="px-6 py-4 font-bold">Super Admin</th>
                <th class="px-6 py-4 font-bold">Organización</th>
                <th class="px-6 py-4 font-bold">IP</th>
                <th class="px-6 py-4 font-bold">User Agent</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
              <tr v-for="log in auditLogs" :key="log._id" class="hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors">
                <td class="px-6 py-4 whitespace-nowrap text-slate-600 dark:text-slate-300">
                  {{ new Date(log.createdAt).toLocaleString() }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="font-bold text-slate-900 dark:text-white">{{ log.superAdminId?.name || 'Desconocido' }}</div>
                  <div class="text-[13px] text-slate-500">{{ log.superAdminId?.email }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-primary-50 text-primary-700 dark:bg-primary-500/10 dark:text-primary-300">
                    {{ log.organizationId?.name || 'Eliminada' }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-slate-500 font-mono text-xs">
                  {{ log.ipAddress || 'N/A' }}
                </td>
                <td class="px-6 py-4 text-slate-500 text-xs truncate max-w-xs" :title="log.userAgent">
                  {{ log.userAgent || 'N/A' }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Create/Edit modal -->
    <div v-if="modal.open" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/70 backdrop-blur-sm">
      <div class="rounded-2xl max-w-lg w-full p-7 max-h-[90vh] overflow-y-auto bg-white dark:bg-slate-900 shadow-2xl">
        <h3 class="text-slate-900 dark:text-white text-lg font-bold mb-1">{{ modal.mode === 'create' ? 'Nueva organización' : 'Editar organización' }}</h3>
        <p class="text-slate-500 dark:text-slate-400 text-xs mb-5">{{ modal.mode === 'create' ? 'Crea un nuevo tenant en la plataforma' : 'Actualiza los datos del tenant' }}</p>

        <form @submit.prevent="submit" class="space-y-3 text-sm">
          <div>
            <label class="block text-slate-600 dark:text-slate-300 text-xs font-bold mb-1.5">Nombre *</label>
            <input v-model="form.name" required class="form-input" />
          </div>
          <div v-if="modal.mode === 'create'">
            <label class="block text-slate-600 dark:text-slate-300 text-xs font-bold mb-1.5">
              Slug * <span class="text-slate-400 font-normal">(minúsculas, sin espacios — ej. <code class="font-mono text-primary-600">jovenes-creativos</code>)</span>
            </label>
            <input
              v-model="form.slug"
              @input="form.slug = form.slug.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-')"
              required
              pattern="^[a-z0-9](?:[a-z0-9-]{0,38}[a-z0-9])?$"
              class="form-input font-mono"
              placeholder="jovenes-creativos"
            />
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-slate-600 dark:text-slate-300 text-xs font-bold mb-1.5">Plan</label>
              <select v-model="form.plan" class="form-input">
                <option value="free">Free</option>
                <option value="starter">Starter</option>
                <option value="pro">Pro</option>
                <option value="enterprise">Enterprise</option>
              </select>
            </div>
            <div v-if="modal.mode === 'edit'">
              <label class="block text-slate-600 dark:text-slate-300 text-xs font-bold mb-1.5">Estado</label>
              <select v-model="form.status" class="form-input">
                <option value="active">Activo</option>
                <option value="suspended">Suspendido</option>
                <option value="pending">Pendiente</option>
                <option value="archived">Archivado</option>
              </select>
            </div>
          </div>
          <div>
            <label class="block text-slate-600 dark:text-slate-300 text-xs font-bold mb-1.5">Color de marca</label>
            <div class="flex items-center gap-3">
              <input v-model="form.branding.accentColor" type="color" class="h-10 w-16 rounded-lg cursor-pointer border border-slate-200 dark:border-slate-700" />
              <input v-model="form.branding.accentColor" type="text" class="form-input flex-1 font-mono text-xs" />
            </div>
          </div>

          <div v-if="modal.mode === 'create'" class="pt-4 mt-4 border-t border-slate-200 dark:border-slate-800">
            <p class="text-slate-400 text-[13px] font-bold uppercase tracking-wider mb-3">Owner inicial (opcional)</p>
            <div class="space-y-2">
              <input v-model="form.ownerEmail" type="email" placeholder="Email del owner" class="form-input" />
              <input v-model="form.ownerName" type="text" placeholder="Nombre" class="form-input" />
              <input v-model="form.ownerPassword" type="password" minlength="8" placeholder="Contraseña (≥8 chars, solo si es nuevo)" class="form-input" />
            </div>
          </div>

          <div v-if="modal.error" class="p-3 rounded-lg text-rose-700 dark:text-rose-300 text-xs bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20">
            {{ modal.error }}
          </div>

          <div class="flex gap-2 pt-3">
            <button type="button" @click="closeModal" class="flex-1 py-2.5 rounded-xl text-slate-600 dark:text-slate-300 text-sm font-bold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition">
              Cancelar
            </button>
            <button type="submit" :disabled="modal.saving" class="flex-1 py-2.5 rounded-xl text-white text-sm font-bold bg-primary-600 hover:bg-primary-700 disabled:opacity-50 transition">
              {{ modal.saving ? 'Guardando…' : (modal.mode === 'create' ? 'Crear' : 'Guardar') }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'
import { adminService, type OrganizationAdmin } from '@/services/adminService'
import { useAuthStore } from '@/stores/auth'
import { useThemeStore } from '@/stores/theme'

const router = useRouter()
const authStore = useAuthStore()
const themeStore = useThemeStore()

const orgs = ref<OrganizationAdmin[]>([])
const loading = ref(true)
const failedLogos = reactive(new Set<string>())
const search = ref('')
const statusFilter = ref('')
const activeTab = ref('orgs')

const auditLogs = ref<any[]>([])
const loadingAudit = ref(false)
const exportingPdf = ref(false)

const modal = reactive({
  open: false,
  mode: 'create' as 'create' | 'edit',
  editingId: '' as string,
  saving: false,
  error: '' as string
})

const form = reactive({
  name: '',
  slug: '',
  plan: 'free' as OrganizationAdmin['plan'],
  status: 'active' as OrganizationAdmin['status'],
  branding: { accentColor: '#8b5cf6' } as any,
  ownerEmail: '',
  ownerName: '',
  ownerPassword: ''
})

const filteredOrgs = computed(() =>
  orgs.value.filter(o => {
    if (statusFilter.value && o.status !== statusFilter.value) return false
    if (search.value) {
      const q = search.value.toLowerCase()
      if (!o.name.toLowerCase().includes(q) && !o.slug.toLowerCase().includes(q)) return false
    }
    return true
  })
)

function initials(name: string) {
  return name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
}

function statusClass(status: string) {
  return {
    active: 'bg-emerald-100 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-300',
    suspended: 'bg-amber-100 dark:bg-amber-500/15 text-amber-700 dark:text-amber-300',
    pending: 'bg-sky-100 dark:bg-sky-500/15 text-sky-700 dark:text-sky-300',
    archived: 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
  }[status] || 'bg-slate-100 text-slate-500'
}

async function load() {
  loading.value = true
  try { orgs.value = await adminService.listOrganizations() }
  finally { loading.value = false }
}

async function loadAudit() {
  if (auditLogs.value.length > 0) return
  loadingAudit.value = true
  try {
    const response = await adminService.getAuditLogs(1, 100)
    auditLogs.value = response.data || []
  } catch (err) {
    console.error(err)
  } finally {
    loadingAudit.value = false
  }
}

async function downloadAuditPDF() {
  exportingPdf.value = true
  try {
    // Traer todos los registros para el PDF (hasta 1000)
    let source = auditLogs.value
    try {
      const res = await adminService.getAuditLogs(1, 1000)
      source = res.data || auditLogs.value
    } catch { /* usa los ya cargados */ }

    const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' })

    // Header violeta
    doc.setFillColor(79, 70, 229)
    doc.rect(0, 0, 297, 22, 'F')
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.text('GEMS Hub — Auditoría de Acceso Super-Admin', 14, 14)
    doc.setFontSize(9)
    doc.setFont('helvetica', 'normal')
    doc.text(`Generado: ${new Date().toLocaleString('es-CR')}`, 185, 14)

    // Sub-header
    doc.setTextColor(80, 80, 80)
    doc.setFontSize(8)
    doc.text(`Total registros exportados: ${source.length}`, 14, 30)

    autoTable(doc, {
      startY: 35,
      head: [['Fecha / Hora', 'Administrador', 'Email', 'Organización', 'IP', 'User Agent']],
      body: source.map(l => [
        new Date(l.createdAt).toLocaleString('es-CR'),
        l.superAdminId?.name || 'Sistema',
        l.superAdminId?.email || '—',
        l.organizationId?.name || '—',
        l.ipAddress || '—',
        l.userAgent ? l.userAgent.slice(0, 80) : '—',
      ]),
      headStyles: {
        fillColor: [79, 70, 229],
        textColor: 255,
        fontSize: 8,
        fontStyle: 'bold',
      },
      bodyStyles: { fontSize: 7, textColor: [30, 30, 30] },
      alternateRowStyles: { fillColor: [247, 248, 251] },
      columnStyles: {
        0: { cellWidth: 30 },
        1: { cellWidth: 32 },
        2: { cellWidth: 52 },
        3: { cellWidth: 35 },
        4: { cellWidth: 28 },
        5: { cellWidth: 'auto' },
      },
      margin: { left: 14, right: 14 },
      didDrawPage: (data: any) => {
        doc.setFontSize(7)
        doc.setTextColor(150)
        doc.text(
          `GEMS Hub — Auditoría Super-Admin — Pág. ${data.pageNumber}`,
          14, doc.internal.pageSize.height - 8
        )
        doc.text(
          `© ${new Date().getFullYear()} GEMS Innovations`,
          245, doc.internal.pageSize.height - 8
        )
      }
    })

    doc.save(`gems-hub-auditoria-superadmin-${new Date().toISOString().slice(0, 10)}.pdf`)
  } catch (e) {
    console.error('Error generando PDF:', e)
  } finally {
    exportingPdf.value = false
  }
}

function resetForm() {
  form.name = ''
  form.slug = ''
  form.plan = 'free'
  form.status = 'active'
  form.branding = { accentColor: '#8b5cf6' }
  form.ownerEmail = ''
  form.ownerName = ''
  form.ownerPassword = ''
  modal.error = ''
}

function openCreate() {
  resetForm()
  modal.mode = 'create'
  modal.editingId = ''
  modal.open = true
}

function openEdit(org: OrganizationAdmin) {
  resetForm()
  modal.mode = 'edit'
  modal.editingId = org._id
  form.name = org.name
  form.slug = org.slug
  form.plan = org.plan
  form.status = org.status
  form.branding = { ...(org.branding || {}), accentColor: org.branding?.accentColor || '#8b5cf6' }
  modal.open = true
}

function closeModal() {
  modal.open = false
}

async function submit() {
  modal.saving = true
  modal.error = ''
  try {
    if (modal.mode === 'create') {
      await adminService.createOrganization({
        name: form.name,
        slug: form.slug,
        plan: form.plan,
        branding: form.branding,
        ownerEmail: form.ownerEmail || undefined,
        ownerName: form.ownerName || undefined,
        ownerPassword: form.ownerPassword || undefined
      })
    } else {
      await adminService.updateOrganization(modal.editingId, {
        name: form.name,
        plan: form.plan,
        status: form.status,
        branding: form.branding
      })
    }
    modal.open = false
    await load()
  } catch (err: any) {
    modal.error = err.response?.data?.message || err.message || 'Error desconocido'
  } finally {
    modal.saving = false
  }
}

async function archiveOrg(org: OrganizationAdmin) {
  if (!confirm(`¿Archivar "${org.name}"? Quedará inaccesible para sus miembros.`)) return
  await adminService.archiveOrganization(org._id)
  await load()
}

async function enterOrg(org: OrganizationAdmin) {
  const result = await authStore.selectOrganization(org._id)
  if (result.success) {
    try { await themeStore.load() } catch {}
    await router.push('/')
  }
}

onMounted(load)
</script>

<style scoped>
.org-card {
  transition: all 0.2s ease;
}
.org-card:hover {
  border-color: rgba(var(--brand-accent-rgb), 0.35);
  transform: translateY(-2px);
  box-shadow: 0 10px 30px -10px rgba(var(--brand-accent-rgb), 0.15);
}
.form-input {
  width: 100%;
  padding: 0.65rem 0.9rem;
  border-radius: 0.65rem;
  background: rgb(248 250 252);
  border: 1px solid rgb(226 232 240);
  color: rgb(15 23 42);
  font-size: 0.875rem;
  outline: none;
  transition: border-color 0.2s, background 0.2s;
}
:global(.dark) .form-input {
  background: rgb(15 23 42);
  border-color: rgb(51 65 85);
  color: white;
}
.form-input:focus {
  border-color: rgba(var(--brand-accent-rgb), 0.55);
  background: white;
}
:global(.dark) .form-input:focus {
  background: rgb(2 6 23);
}
</style>
