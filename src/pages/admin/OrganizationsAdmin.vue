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
        <button
          @click="activeTab = 'modules'; loadGlobalModules()"
          class="pb-3 text-sm font-bold transition-all border-b-2"
          :class="activeTab === 'modules' ? 'border-primary-600 text-primary-600' : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-white'"
        >
          <i class="fas fa-toggle-on mr-1.5"></i> Módulos
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
            <div class="flex flex-col items-end gap-1 shrink-0">
              <span
                class="text-[12px] font-bold uppercase tracking-wider px-2 py-1 rounded-md"
                :class="statusClass(org.status)"
              >
                {{ org.status }}
              </span>
              <span
                v-if="trialBadge(org)"
                class="text-[11px] font-bold px-2 py-0.5 rounded-md whitespace-nowrap"
                :class="trialBadge(org)!.class"
              >
                {{ trialBadge(org)!.text }}
              </span>
            </div>
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
              @click="openStats(org)"
              class="px-3 py-2 rounded-lg text-xs text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white bg-slate-100 dark:bg-slate-800 transition"
              title="Ver estadísticas"
            >
              <i class="fas fa-chart-pie"></i>
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

      <div v-else-if="activeTab === 'modules'" class="max-w-2xl">
        <p class="text-slate-500 dark:text-slate-400 text-sm mb-5">
          Interruptor maestro — apaga aquí un módulo que todavía está en desarrollo para que
          <strong>ninguna</strong> organización lo vea, sin importar el rol de sus usuarios. Cada
          organización puede tener su propia excepción desde su modal de estadísticas.
        </p>
        <div v-if="loadingModules" class="text-center py-16 text-slate-400 text-sm">
          <i class="fas fa-circle-notch fa-spin text-2xl mb-3"></i>
          <p>Cargando módulos…</p>
        </div>
        <div v-else class="space-y-2">
          <div
            v-for="m in MODULE_REGISTRY"
            :key="m.key"
            class="flex items-center justify-between p-4 rounded-xl bg-white dark:bg-slate-900 shadow-sm"
          >
            <div class="flex items-center gap-3">
              <div class="w-9 h-9 rounded-lg bg-primary-50 dark:bg-primary-500/10 flex items-center justify-center shrink-0">
                <i :class="['fas', m.icon]" class="text-primary-500 text-sm"></i>
              </div>
              <span class="text-sm font-bold text-slate-800 dark:text-white">{{ m.label }}</span>
            </div>
            <button
              @click="toggleGlobalModule(m.key)"
              :disabled="savingModule === m.key"
              class="relative w-11 h-6 rounded-full transition-colors disabled:opacity-50 shrink-0"
              :class="globalModules[m.key] !== false ? 'bg-primary-600' : 'bg-slate-300 dark:bg-slate-700'"
            >
              <span
                class="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform"
                :class="globalModules[m.key] !== false ? 'translate-x-5' : 'translate-x-0'"
              ></span>
            </button>
          </div>
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

    <!-- Stats modal -->
    <div v-if="statsModal.open" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/70 backdrop-blur-sm">
      <div class="rounded-xl max-w-2xl w-full p-7 max-h-[90vh] overflow-y-auto bg-white dark:bg-slate-900 shadow-2xl">
        <div class="flex items-start justify-between mb-5">
          <div class="flex items-center gap-3 min-w-0">
            <div
              class="w-10 h-10 rounded-xl flex items-center justify-center text-white font-black shrink-0"
              :style="{ background: statsModal.org?.branding?.accentColor || '#8b5cf6' }"
            >
              {{ statsModal.org ? initials(statsModal.org.name) : '' }}
            </div>
            <div class="min-w-0">
              <h3 class="text-slate-900 dark:text-white text-lg font-bold truncate">{{ statsModal.org?.name }}</h3>
              <p class="text-slate-400 text-xs font-mono truncate">{{ statsModal.org?.slug }}</p>
            </div>
          </div>
          <button @click="closeStats" class="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition">
            <i class="fas fa-xmark"></i>
          </button>
        </div>

        <div v-if="statsModal.loading" class="text-center py-16 text-slate-400 text-sm">
          <i class="fas fa-circle-notch fa-spin text-2xl mb-3"></i>
          <p>Cargando estadísticas…</p>
        </div>
        <div v-else-if="statsModal.error" class="p-4 rounded-xl text-rose-700 dark:text-rose-300 text-sm bg-rose-50 dark:bg-rose-500/10">
          {{ statsModal.error }}
        </div>
        <div v-else-if="statsModal.data">
          <!-- Salud + Trial -->
          <div class="flex flex-wrap items-center gap-4 mb-5 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50">
            <div class="flex items-center gap-2">
              <span class="w-2.5 h-2.5 rounded-full" :class="health.dot"></span>
              <span class="text-[13px] font-bold" :class="health.text">{{ health.label }}</span>
            </div>
            <div v-if="trialInfo" class="text-[13px] font-bold" :class="trialInfo.class">
              <i class="fas fa-hourglass-half mr-1 text-[11px]"></i>{{ trialInfo.label }}
            </div>
            <div class="text-[13px] text-slate-400 font-medium ml-auto">
              Creada el {{ new Date(statsModal.data.createdAt).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }) }}
            </div>
          </div>

          <!-- KPI grid -->
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-6">
            <div v-for="kpi in statsKpis" :key="kpi.label" class="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
              <i :class="['fas', kpi.icon]" class="text-primary-500 text-[13px] mb-1.5"></i>
              <p class="text-slate-900 dark:text-white font-black text-lg leading-none">{{ kpi.value }}</p>
              <p class="text-slate-400 text-[11px] font-bold uppercase tracking-wide mt-1">{{ kpi.label }}</p>
              <p v-if="kpi.sub" class="text-amber-500 text-[11px] font-bold mt-0.5">{{ kpi.sub }}</p>
            </div>
          </div>

          <!-- Miembros por rol -->
          <div v-if="Object.keys(statsModal.data.membersByRole || {}).length" class="mb-6">
            <p class="text-slate-400 text-[11px] font-bold uppercase tracking-wide mb-2">Miembros por rol</p>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="[role, count] in membersByRoleList(statsModal.data)"
                :key="role"
                class="text-[12px] font-bold px-2.5 py-1 rounded-lg bg-primary-50 dark:bg-primary-500/10 text-primary-700 dark:text-primary-300"
              >
                {{ role }} · {{ count }}
              </span>
            </div>
          </div>

          <!-- Módulos: excepción puntual para esta organización -->
          <div class="mb-6">
            <p class="text-slate-400 text-[11px] font-bold uppercase tracking-wide mb-2">
              Módulos habilitados <span class="normal-case font-medium">(excepción sólo para esta organización)</span>
            </p>
            <div class="space-y-1.5">
              <div v-for="m in MODULE_REGISTRY" :key="m.key" class="flex items-center justify-between px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                <span class="text-[13px] font-bold text-slate-700 dark:text-slate-300">{{ m.label }}</span>
                <div class="flex rounded-lg overflow-hidden shadow-sm">
                  <button
                    v-for="opt in (['inherit', 'on', 'off'] as const)"
                    :key="opt"
                    @click="setOrgModuleOverride(m.key, opt)"
                    :disabled="savingOverride"
                    class="px-2.5 py-1 text-[11px] font-bold uppercase transition-colors disabled:opacity-50"
                    :class="orgOverrideState(m.key) === opt
                      ? (opt === 'off' ? 'bg-rose-500 text-white' : opt === 'on' ? 'bg-emerald-500 text-white' : 'bg-slate-400 text-white')
                      : 'bg-white dark:bg-slate-900 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'"
                  >
                    {{ opt === 'inherit' ? 'Global' : opt === 'on' ? 'Activo' : 'Apagado' }}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Distribución de uso -->
          <div v-if="hasAnyData">
            <p class="text-slate-400 text-[11px] font-bold uppercase tracking-wide mb-2">Distribución de uso</p>
            <apexchart type="donut" height="240" :options="chartOptions" :series="chartSeries" />
          </div>
          <div v-else class="text-center py-8 text-slate-400 text-sm">
            <i class="fas fa-chart-pie text-2xl mb-2 opacity-30"></i>
            <p>Esta organización todavía no tiene datos registrados.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'
import { adminService, MODULE_REGISTRY, type OrganizationAdmin, type OrgStats } from '@/services/adminService'
import { useAuthStore } from '@/stores/auth'
import { useThemeStore } from '@/stores/theme'
import { useNotifications } from '@/composables/useNotifications'
import ApexCharts from 'vue3-apexcharts'

const apexchart = ApexCharts

const router = useRouter()
const authStore = useAuthStore()
const themeStore = useThemeStore()
const { showError } = useNotifications()

const orgs = ref<OrganizationAdmin[]>([])
const loading = ref(true)
const failedLogos = reactive(new Set<string>())
const search = ref('')
const statusFilter = ref('')
const activeTab = ref('orgs')

const auditLogs = ref<any[]>([])
const loadingAudit = ref(false)
const exportingPdf = ref(false)

const globalModules = ref<Record<string, boolean>>({})
const loadingModules = ref(false)
const savingModule = ref<string | null>(null)

const modal = reactive({
  open: false,
  mode: 'create' as 'create' | 'edit',
  editingId: '' as string,
  saving: false,
  error: '' as string
})

const statsModal = reactive({
  open: false,
  loading: false,
  org: null as OrganizationAdmin | null,
  data: null as OrgStats | null,
  error: ''
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

// Cuenta regresiva de trial visible de un vistazo en la tarjeta, sin abrir el
// modal de estadísticas — es la señal que más le importa a control/ventas.
function trialBadge(org: OrganizationAdmin) {
  if (org.plan !== 'free_trial' || !org.trialExpiresAt) return null
  const days = Math.ceil((new Date(org.trialExpiresAt).getTime() - Date.now()) / 86400000)
  if (days < 0) return { text: `Trial vencido hace ${Math.abs(days)}d`, class: 'bg-rose-100 dark:bg-rose-500/15 text-rose-700 dark:text-rose-300' }
  if (days <= 3) return { text: `Trial: ${days}d restantes`, class: 'bg-rose-100 dark:bg-rose-500/15 text-rose-700 dark:text-rose-300' }
  if (days <= 7) return { text: `Trial: ${days}d restantes`, class: 'bg-amber-100 dark:bg-amber-500/15 text-amber-700 dark:text-amber-300' }
  return { text: `Trial: ${days}d restantes`, class: 'bg-sky-100 dark:bg-sky-500/15 text-sky-700 dark:text-sky-300' }
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

async function loadGlobalModules() {
  if (Object.keys(globalModules.value).length > 0) return
  loadingModules.value = true
  try {
    globalModules.value = await adminService.getGlobalModuleToggles()
  } catch (err: any) {
    showError(err.response?.data?.message || 'No se pudieron cargar los módulos globales')
  } finally {
    loadingModules.value = false
  }
}

async function toggleGlobalModule(key: string) {
  const next = globalModules.value[key] === false
  savingModule.value = key
  try {
    globalModules.value = await adminService.updateGlobalModuleToggles({ [key]: next })
  } catch (err: any) {
    showError(err.response?.data?.message || 'No se pudo guardar el cambio — intenta de nuevo')
  } finally {
    savingModule.value = null
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

async function openStats(org: OrganizationAdmin) {
  statsModal.open = true
  statsModal.org = org
  statsModal.data = null
  statsModal.error = ''
  statsModal.loading = true
  try {
    statsModal.data = await adminService.getStats(org._id)
  } catch (err: any) {
    statsModal.error = err.response?.data?.message || err.message || 'No se pudieron cargar las estadísticas'
  } finally {
    statsModal.loading = false
  }
}

function closeStats() {
  statsModal.open = false
}

const savingOverride = ref(false)

function orgOverrideState(key: string): 'inherit' | 'on' | 'off' {
  const v = statsModal.org?.moduleOverrides?.[key]
  if (v === undefined || v === null) return 'inherit'
  return v ? 'on' : 'off'
}

async function setOrgModuleOverride(key: string, opt: 'inherit' | 'on' | 'off') {
  if (!statsModal.org) return
  savingOverride.value = true
  try {
    const next = { ...(statsModal.org.moduleOverrides || {}) }
    if (opt === 'inherit') delete next[key]
    else next[key] = opt === 'on'

    const updated = await adminService.updateOrganization(statsModal.org._id, { moduleOverrides: next })
    statsModal.org.moduleOverrides = updated.moduleOverrides
    const idx = orgs.value.findIndex(o => o._id === statsModal.org!._id)
    if (idx !== -1) orgs.value[idx] = { ...orgs.value[idx], moduleOverrides: updated.moduleOverrides }
  } catch (err: any) {
    showError(err.response?.data?.message || 'No se pudo guardar la excepción de esta organización')
  } finally {
    savingOverride.value = false
  }
}

// Salud de uso: ¿esta organización sigue activa de verdad, o quedó abandonada?
// Es la señal que más le importa a alguien vendiendo/dando soporte al producto —
// un plan activo con 0 actividad hace 40 días es una señal de alerta comercial.
const health = computed(() => {
  const last = statsModal.data?.lastActivityAt
  if (!last) return { label: 'Sin actividad registrada', dot: 'bg-slate-300', text: 'text-slate-400' }
  const days = Math.floor((Date.now() - new Date(last).getTime()) / 86400000)
  if (days <= 7) return { label: `Activa · hace ${days === 0 ? 'menos de 1 día' : days + 'd'}`, dot: 'bg-emerald-400', text: 'text-emerald-600 dark:text-emerald-400' }
  if (days <= 30) return { label: `Actividad baja · hace ${days}d`, dot: 'bg-amber-400', text: 'text-amber-600 dark:text-amber-400' }
  return { label: `Inactiva · hace ${days}d`, dot: 'bg-rose-400', text: 'text-rose-600 dark:text-rose-400' }
})

const trialInfo = computed(() => {
  const d = statsModal.data
  if (!d || d.plan !== 'free_trial' || d.trialDaysRemaining === null) return null
  const days = d.trialDaysRemaining
  if (days < 0) return { label: `Trial vencido hace ${Math.abs(days)} días`, class: 'text-rose-600 dark:text-rose-400' }
  return { label: `${days} días restantes de trial`, class: days <= 3 ? 'text-rose-600 dark:text-rose-400' : 'text-amber-600 dark:text-amber-400' }
})

const statsKpis = computed(() => {
  const d = statsModal.data
  if (!d) return []
  return [
    { label: 'Miembros activos', value: d.members, icon: 'fa-users' },
    { label: 'Clientes', value: d.client, icon: 'fa-building-user' },
    { label: 'Actividades', value: d.activity, icon: 'fa-list-check' },
    { label: 'Casos / Proyectos', value: d.case, icon: 'fa-briefcase' },
    { label: 'Tickets', value: d.ticket, sub: `${d.ticketsOpen} abiertos`, icon: 'fa-headset' },
    { label: 'Tareas', value: d.task, icon: 'fa-clipboard-check' },
    { label: 'Artículos Wiki', value: d.wiki, icon: 'fa-book' },
    { label: 'Prospectos', value: d.prospectconversation, icon: 'fa-comments' },
  ]
})

const chartSeries = computed(() => {
  const d = statsModal.data
  if (!d) return []
  return [d.client, d.activity, d.case, d.ticket, d.task, d.wiki, d.prospectconversation]
})
const chartLabels = ['Clientes', 'Actividades', 'Casos', 'Tickets', 'Tareas', 'Wiki', 'Prospectos']
const chartOptions = computed(() => ({
  chart: { fontFamily: 'Inter, sans-serif' },
  labels: chartLabels,
  colors: ['#8b5cf6', '#3b82f6', '#f59e0b', '#ef4444', '#10b981', '#06b6d4', '#ec4899'],
  legend: { position: 'bottom', fontSize: '11px', fontWeight: 700, labels: { colors: '#94a3b8' } },
  dataLabels: { enabled: false },
  stroke: { width: 2 },
  tooltip: { theme: 'light' },
  plotOptions: { pie: { donut: { size: '62%', labels: { show: true, total: { show: true, label: 'Total', fontSize: '11px', color: '#94a3b8' } } } } }
}))
const hasAnyData = computed(() => chartSeries.value.some(n => n > 0))

function membersByRoleList(data: OrgStats) {
  return Object.entries(data.membersByRole || {}).sort((a, b) => b[1] - a[1])
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
