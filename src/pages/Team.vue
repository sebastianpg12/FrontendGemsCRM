<template>
  <div class="min-h-screen bg-[#F8FAFC] dark:bg-[#0f172a] p-8 pb-24 font-['Inter',sans-serif]">
    <!-- Top Controls & Departments (Minimalist) -->
    <div class="flex flex-col gap-6 mb-8">
      <!-- Departments Mini-Overview -->
      <div class="flex flex-wrap items-center gap-3">
        <div
          v-for="dept in allDepartments"
          :key="dept"
          class="bg-white dark:bg-[#1e293b] border border-slate-100 dark:border-[#334155] rounded-2xl px-4 py-2.5 flex items-center gap-3 shadow-sm hover:shadow-md transition-all group"
        >
          <div
            class="w-8 h-8 rounded-lg flex items-center justify-center text-xs"
            :style="getDeptStyle(dept)"
          >
            <i :class="getDeptIcon(dept)"></i>
          </div>
          <div class="flex flex-col">
            <span class="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{{ dept }}</span>
            <div class="flex items-center gap-2">
              <span class="text-xs font-bold text-slate-700 dark:text-slate-200 leading-none">
                {{ teamStore.members.filter(m => m.department === dept).length }}
              </span>
              <div class="flex -space-x-2 ml-1">
                <div
                  v-for="leader in teamStore.members.filter(m => m.department === dept && m.departmentRole === 'leader').slice(0, 3)"
                  :key="leader._id"
                  class="w-4 h-4 rounded-full bg-amber-400 border-2 border-white dark:border-[#1e293b] flex items-center justify-center text-[6px] font-black text-white shadow-sm"
                  :title="leader.name"
                >
                  {{ leader.name?.charAt(0) }}
                </div>
              </div>
            </div>
          </div>
          <!-- Delete custom dept -->
          <button
            v-if="customDepartments.includes(dept)"
            @click.stop="removeCustomDepartment(dept)"
            class="ml-1 opacity-0 group-hover:opacity-100 text-slate-300 hover:text-rose-400 transition-all text-[9px]"
            title="Eliminar departamento"
          >
            <i class="fas fa-xmark"></i>
          </button>
        </div>

        <!-- Add & Stats (Floating right on desktop) -->
        <div class="md:ml-auto flex items-center gap-2">
           <div class="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-[#1e293b] border border-slate-100 dark:border-[#334155] rounded-xl shadow-sm">
             <div class="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
             <span class="text-[9px] font-black text-slate-400 uppercase tracking-widest">{{ activeMembers }} Activos</span>
           </div>
           <PermissionGuard :permissions="['create-team']" :fallback="false">
            <button 
              @click="showCreateModal = true"
              class="w-9 h-9 bg-primary-600 hover:bg-primary-700 text-white rounded-xl shadow-lg shadow-primary-500/20 transition-all active:scale-95 flex items-center justify-center"
            >
              <i class="fas fa-plus text-xs"></i>
            </button>
          </PermissionGuard>
        </div>
      </div>

      <!-- Filters & Search (Ultra-Compact) -->
      <div class="bg-white dark:bg-[#1e293b] border border-slate-100 dark:border-[#334155] rounded-2xl p-2 shadow-sm flex flex-col md:flex-row items-center gap-3">
         <div class="flex-1 relative group w-full">
            <i class="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-[10px] group-focus-within:text-primary-500 transition-colors"></i>
            <input 
              v-model="searchQuery" 
              placeholder="Buscar colaborador..."
              class="w-full pl-9 pr-4 py-2 bg-slate-50 border-none rounded-xl text-[11px] font-medium focus:ring-4 focus:ring-primary-500/5 transition-all outline-none"
            >
         </div>
         
         <div class="flex items-center gap-2 w-full md:w-auto">
            <select v-model="selectedDepartment" class="px-4 py-2 bg-slate-50 dark:bg-[#0f172a] dark:text-slate-300 border-none rounded-xl text-[9px] font-black uppercase tracking-widest text-slate-500 outline-none focus:ring-4 focus:ring-primary-500/5 transition-all cursor-pointer">
               <option value="">Departamentos</option>
               <option v-for="dept in allDepartments" :key="dept" :value="dept">{{ dept }}</option>
            </select>

            <select v-model="selectedRole" class="px-4 py-2 bg-slate-50 border-none rounded-xl text-[9px] font-black uppercase tracking-widest text-slate-500 outline-none focus:ring-4 focus:ring-primary-500/5 transition-all cursor-pointer">
               <option value="">Roles</option>
               <option v-for="role in allAvailableRoles" :key="role._id || role.name" :value="role.name">
                  {{ getRoleDisplayName(role.name) }}
               </option>
            </select>

            <select v-model="selectedStatus" class="px-4 py-2 bg-slate-50 border-none rounded-xl text-[9px] font-black uppercase tracking-widest text-slate-500 outline-none focus:ring-4 focus:ring-primary-500/5 transition-all cursor-pointer">
               <option value="">Estado</option>
               <option value="true">Activos</option>
               <option value="false">Inactivos</option>
            </select>
         </div>
      </div>
    </div>

    <!-- Team List View (Compact & Efficient) -->
    <div class="space-y-2 pb-20">
      <!-- Header de Tabla Compacta (solo desktop) -->
      <div class="hidden md:flex px-8 py-3 items-center gap-6 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 dark:border-[#334155] mb-2">
        <div class="min-w-[280px]">Colaborador</div>
        <div class="w-24 text-center">Rol</div>
        <div class="flex-1">Departamento</div>
        <div class="hidden xl:block w-32">Último Acceso</div>
        <div class="w-32 text-right">Acciones</div>
      </div>

      <div
        v-for="member in filteredMembers"
        :key="member._id"
        class="group bg-white dark:bg-[#1a2438] border border-slate-100 dark:border-[#334155] rounded-2xl p-4 md:p-2 md:px-6 shadow-sm hover:shadow-md hover:border-primary-200 dark:hover:border-primary-500/40 transition-all duration-200 flex flex-col md:flex-row md:items-center md:justify-between md:gap-6"
      >
        <!-- Top row: avatar + name + mobile actions -->
        <div class="flex items-center gap-4 md:min-w-[280px]">
           <div class="relative shrink-0">
              <UserAvatar :name="member.name" :photo="member.photo" size="sm" class="w-10 h-10 rounded-xl shadow-inner" />
            <div v-if="member.departmentRole === 'leader'" class="absolute -top-1 -right-1 w-5 h-5 bg-amber-400 border-2 border-white rounded-full flex items-center justify-center shadow-sm">
              <i class="fas fa-crown text-white" style="font-size: 6px"></i>
            </div>
           </div>
           <div class="min-w-0 flex-1">
              <h3 class="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">{{ member.name }}</h3>
              <p class="text-[10px] font-medium text-slate-400 truncate">{{ member.email }}</p>
           </div>
           <!-- Acciones visibles solo en mobile -->
           <div class="flex md:hidden items-center gap-1 shrink-0">
             <button @click="editMember(member)" title="Editar" class="w-8 h-8 bg-slate-50 hover:bg-primary-100 text-slate-400 hover:text-primary-600 rounded-lg flex items-center justify-center transition-all">
               <i class="fas fa-edit text-[10px]"></i>
             </button>
             <button @click="toggleMemberStatus(member)" :title="member.isActive ? 'Deshabilitar' : 'Habilitar'" :class="member.isActive ? 'hover:bg-rose-100 text-slate-400 hover:text-rose-600' : 'hover:bg-emerald-100 text-slate-400 hover:text-emerald-600'" class="w-8 h-8 bg-slate-50 rounded-lg flex items-center justify-center transition-all">
               <i :class="member.isActive ? 'fas fa-user-slash' : 'fas fa-user-check'" class="text-[10px]"></i>
             </button>
           </div>
        </div>

        <!-- Center: Role & Department -->
        <div class="flex items-center gap-4 md:gap-8 flex-1 mt-2 md:mt-0 pl-14 md:pl-0">
           <div class="md:w-24">
              <span :class="getRoleBadgeClass(member.role)" class="px-2 py-0.5 rounded-lg text-[7px] font-black uppercase tracking-widest inline-block md:block text-center">
                {{ getRoleDisplayName(member.role) }}
              </span>
           </div>

           <div class="flex-1">
              <p class="text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase truncate">{{ member.department || 'General' }}</p>
           </div>

           <div class="hidden xl:block w-32">
              <p class="text-[10px] font-bold text-slate-500">{{ formatDate(member.lastLogin) }}</p>
           </div>
        </div>

        <!-- Right: Actions (solo desktop) -->
        <div class="hidden md:flex items-center justify-end gap-1 w-32">
           <button
             @click="editMember(member)"
             title="Editar"
             class="w-8 h-8 bg-slate-50 hover:bg-primary-100 text-slate-400 hover:text-primary-600 rounded-lg flex items-center justify-center transition-all"
           >
             <i class="fas fa-edit text-[10px]"></i>
           </button>
           <button
             @click="toggleMemberStatus(member)"
             :title="member.isActive ? 'Deshabilitar' : 'Habilitar'"
             :class="member.isActive ? 'hover:bg-rose-100 text-slate-400 hover:text-rose-600' : 'hover:bg-emerald-100 text-slate-400 hover:text-emerald-600'"
             class="w-8 h-8 bg-slate-50 rounded-lg flex items-center justify-center transition-all"
           >
             <i :class="member.isActive ? 'fas fa-user-slash' : 'fas fa-user-check'" class="text-[10px]"></i>
           </button>
           <button
             v-if="authStore.user?.role === 'admin'"
             @click="permanentDeleteMember(member)"
             title="Eliminar"
             class="w-8 h-8 bg-slate-50 hover:bg-red-600 text-slate-400 hover:text-white rounded-lg flex items-center justify-center transition-all"
           >
             <i class="fas fa-trash-alt text-[10px]"></i>
           </button>
        </div>
      </div>
    </div>
      <!-- Empty State -->
      <div v-if="filteredMembers.length === 0" class="py-20 text-center bg-white border border-slate-100 rounded-3xl">
        <i class="fas fa-users text-4xl text-slate-100 mb-4"></i>
        <p class="text-sm font-bold text-slate-400">No se encontraron miembros</p>
      </div>
    
    <!-- Pagination Controls (Premium) -->
    <div v-if="pagination.pages > 1" class="mt-12 flex items-center justify-center gap-2">
       <button 
         @click="changePage(pagination.page - 1)"
         :disabled="pagination.page === 1"
         class="w-12 h-12 bg-white border border-slate-100 rounded-2xl flex items-center justify-center text-slate-400 hover:text-primary-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
       >
         <i class="fas fa-chevron-left"></i>
       </button>
       
       <div class="flex items-center gap-2 bg-white border border-slate-100 p-1.5 rounded-2xl shadow-sm">
          <button 
            v-for="p in pagination.pages" 
            :key="p"
            @click="changePage(p)"
            :class="p === pagination.page ? 'bg-primary-600 text-white' : 'text-slate-400 hover:bg-slate-50'"
            class="w-9 h-9 rounded-xl text-xs font-black transition-all"
          >
            {{ p }}
          </button>
       </div>

       <button 
         @click="changePage(pagination.page + 1)"
         :disabled="pagination.page === pagination.pages"
         class="w-12 h-12 bg-white border border-slate-100 rounded-2xl flex items-center justify-center text-slate-400 hover:text-primary-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
       >
         <i class="fas fa-chevron-right"></i>
       </button>
    </div>

    <!-- Create/Edit Modal (Premium) -->
    <div v-if="showCreateModal || showEditModal" class="fixed inset-0 z-[100] flex items-center justify-center p-6 animate-fade-in">
       <div class="absolute inset-0 bg-slate-900/60" @click="closeModal"></div>
       <div class="relative bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-[3rem] shadow-2xl p-10 space-y-10 animate-scale-up">
          <!-- Modal Decoration -->
          <div class="absolute top-0 right-0 w-32 h-32 bg-primary-500/5 rounded-bl-[5rem] -mr-10 -mt-10"></div>
          
          <div class="relative">
            <h3 class="text-2xl font-black text-slate-900 tracking-tight">{{ showCreateModal ? 'Nuevo Miembro del Equipo' : 'Editar Información' }}</h3>
            <p class="text-sm text-slate-400 font-medium">Define los accesos y perfil del colaborador.</p>
          </div>
          
          <form @submit.prevent="submitForm" class="space-y-6">
             <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Inputs Section -->
                <div class="space-y-6">
                   <div class="space-y-2">
                      <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Nombre Completo</label>
                      <input v-model="formData.name" required class="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:ring-4 focus:ring-primary-500/5 outline-none transition-all">
                   </div>
                   <div class="space-y-2">
                      <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Correo Electrónico</label>
                      <input v-model="formData.email" type="email" required class="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:ring-4 focus:ring-primary-500/5 outline-none transition-all">
                   </div>
                   <div v-if="showCreateModal || (showEditModal && authStore.user?.role === 'admin')" class="space-y-2">
                      <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">
                        {{ showCreateModal ? 'Contraseña Temporal' : 'Cambiar Contraseña (Opcional)' }}
                      </label>
                      <div class="relative">
                        <input v-model="formData.password" :type="showPassword ? 'text' : 'password'" :required="showCreateModal" class="w-full p-4 pr-12 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:ring-4 focus:ring-primary-500/5 outline-none transition-all">
                        <button type="button" @click="showPassword = !showPassword" class="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors rounded-lg">
                          <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'" class="text-[13px]"></i>
                        </button>
                      </div>
                   </div>
                </div>

                <div class="space-y-6">
                   <div class="space-y-2">
                      <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Rol Operativo</label>
                      <div class="relative">
                        <i class="fas fa-shield-halved absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-[12px] pointer-events-none"></i>
                        <select v-model="formData.role" required class="w-full p-4 pl-10 pr-10 bg-slate-50 border border-slate-100 rounded-2xl text-sm outline-none focus:ring-4 focus:ring-primary-500/5 appearance-none">
                          <option value="" disabled>Selecciona un rol</option>
                          <option v-for="role in allAvailableRoles" :key="role._id || role.name" :value="role.name">
                            {{ getRoleDisplayName(role.name) }}
                          </option>
                        </select>
                        <i class="fas fa-chevron-down absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-[10px] pointer-events-none"></i>
                      </div>
                   </div>
                   <div class="space-y-2">
                       <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Departamento</label>

                       <!-- Si está añadiendo uno nuevo -->
                       <div v-if="isAddingCustomDept" class="flex gap-2">
                         <input
                           v-model="newDeptName"
                           @keydown.enter.prevent="confirmAddDept"
                           @keydown.escape="isAddingCustomDept = false; newDeptName = ''"
                           autofocus
                           placeholder="Nombre del departamento..."
                           class="flex-1 p-4 bg-slate-50 dark:bg-[#0f172a] border border-primary-200 dark:border-primary-500/40 rounded-2xl text-sm outline-none focus:ring-4 focus:ring-primary-500/10 transition-all"
                         />
                         <button
                           type="button"
                           @click="confirmAddDept"
                           :disabled="!newDeptName.trim()"
                           class="px-4 bg-primary-600 hover:bg-primary-700 disabled:opacity-40 text-white rounded-2xl text-xs font-black transition-all"
                         >
                           <i class="fas fa-check"></i>
                         </button>
                         <button
                           type="button"
                           @click="isAddingCustomDept = false; newDeptName = ''"
                           class="px-4 bg-slate-100 dark:bg-[#334155] hover:bg-slate-200 text-slate-500 rounded-2xl text-xs font-black transition-all"
                         >
                           <i class="fas fa-xmark"></i>
                         </button>
                       </div>

                       <!-- Select normal con opción de agregar -->
                       <div v-else class="relative">
                         <i class="fas fa-building absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-[12px] pointer-events-none z-10"></i>
                         <select
                           v-model="formData.department"
                           class="w-full p-4 pl-10 bg-slate-50 dark:bg-[#0f172a] dark:text-slate-200 border border-slate-100 dark:border-[#334155] rounded-2xl text-sm outline-none focus:ring-4 focus:ring-primary-500/5 appearance-none pr-10"
                         >
                           <option value="">Sin departamento</option>
                           <option v-for="dept in allDepartments" :key="dept" :value="dept">{{ dept }}</option>
                         </select>
                         <button
                           type="button"
                           @click="isAddingCustomDept = true"
                           class="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-lg bg-primary-100 dark:bg-primary-500/20 text-primary-500 hover:bg-primary-200 dark:hover:bg-primary-500/30 transition-all flex items-center justify-center text-[9px]"
                           title="Crear departamento personalizado"
                         >
                           <i class="fas fa-plus"></i>
                         </button>
                       </div>
                    </div>
                    <!-- Rol dentro del departamento -->
                    <div class="space-y-2">
                       <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Rol en Departamento</label>
                       <div class="grid grid-cols-2 gap-3">
                         <button
                           type="button"
                           @click="formData.departmentRole = 'member'"
                           :class="formData.departmentRole !== 'leader' ? 'bg-slate-900 text-white border-slate-900' : 'bg-slate-50 text-slate-500 border-slate-200'"
                           class="p-3 rounded-2xl border text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2"
                         >
                           <i class="fas fa-user"></i> Miembro
                         </button>
                         <button
                           type="button"
                           @click="formData.departmentRole = 'leader'"
                           :class="formData.departmentRole === 'leader' ? 'bg-amber-500 text-white border-amber-500 shadow-lg shadow-amber-500/20' : 'bg-slate-50 text-slate-500 border-slate-200'"
                           class="p-3 rounded-2xl border text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2"
                         >
                           <i class="fas fa-crown"></i> Líder
                         </button>
                       </div>
                    </div>
                   <div class="space-y-2">
                      <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Teléfono Corporativo</label>
                      <input v-model="formData.phone" class="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm outline-none focus:ring-4 focus:ring-primary-500/5">
                   </div>
                </div>
             </div>

             <div class="flex gap-4 pt-10">
                <button type="button" @click="closeModal" class="flex-1 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest hover:bg-slate-50 rounded-2xl transition-all">Cancelar</button>
                <button type="submit" :disabled="isSubmitting" class="flex-[2] py-4 bg-primary-600 text-[11px] font-black text-white uppercase tracking-widest rounded-2xl shadow-lg shadow-primary-500/20 hover:bg-primary-700 transition-all">
                   {{ isSubmitting ? 'Guardando...' : (showCreateModal ? 'Crear Colaborador' : 'Actualizar Información') }}
                </button>
             </div>
          </form>
       </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, reactive } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useTeamStore } from '../stores'
import { useNotifications } from '../composables/useNotifications'
import PermissionGuard from '../components/PermissionGuard.vue'
import UserAvatar from '../components/ui/UserAvatar.vue'
import type { TeamMember } from '../types'

const authStore = useAuthStore()
const teamStore = useTeamStore()
const { confirmDelete, showSuccess, showError, showPlanLimitModal } = useNotifications()

// ── Departments ──────────────────────────────────────────────────────
const DEFAULT_DEPARTMENTS = ['TI', 'Comercial', 'Marketing', 'Customer Success']
const DEPT_STORAGE_KEY = 'gems-custom-departments'

const customDepartments = ref<string[]>(
  JSON.parse(localStorage.getItem(DEPT_STORAGE_KEY) || '[]')
)

const allDepartments = computed(() => {
  const fromMembers = teamStore.members
    .map(m => m.department)
    .filter((d): d is string => !!d)
  return [...new Set([...DEFAULT_DEPARTMENTS, ...customDepartments.value, ...fromMembers])]
})

const isAddingCustomDept = ref(false)
const newDeptName = ref('')

const confirmAddDept = () => {
  const name = newDeptName.value.trim()
  if (!name) return
  if (!customDepartments.value.includes(name) && !DEFAULT_DEPARTMENTS.includes(name)) {
    customDepartments.value.push(name)
    localStorage.setItem(DEPT_STORAGE_KEY, JSON.stringify(customDepartments.value))
  }
  formData.department = name
  isAddingCustomDept.value = false
  newDeptName.value = ''
}

const removeCustomDepartment = (dept: string) => {
  customDepartments.value = customDepartments.value.filter(d => d !== dept)
  localStorage.setItem(DEPT_STORAGE_KEY, JSON.stringify(customDepartments.value))
}

// Dept display helpers
const DEPT_PALETTE = [
  { bg: 'rgba(99,102,241,0.12)', color: '#6366f1', icon: 'fas fa-laptop-code' },
  { bg: 'rgba(16,185,129,0.12)', color: '#10b981', icon: 'fas fa-handshake' },
  { bg: 'rgba(249,115,22,0.12)', color: '#f97316', icon: 'fas fa-bullhorn' },
  { bg: 'var(--brand-accent-light)', color: 'var(--brand-accent)', icon: 'fas fa-headset' },
  { bg: 'rgba(59,130,246,0.12)', color: '#3b82f6', icon: 'fas fa-users' },
  { bg: 'rgba(236,72,153,0.12)', color: '#ec4899', icon: 'fas fa-star' },
  { bg: 'rgba(234,179,8,0.12)',  color: '#eab308', icon: 'fas fa-briefcase' },
  { bg: 'rgba(20,184,166,0.12)', color: '#14b8a6', icon: 'fas fa-chart-line' },
]

const getDeptIndex = (dept: string) => {
  const map: Record<string, number> = {
    'TI': 0, 'Comercial': 1, 'Marketing': 2, 'Customer Success': 3
  }
  if (map[dept] !== undefined) return map[dept]
  // Hash the name for consistent color across sessions
  let hash = 0
  for (let i = 0; i < dept.length; i++) hash = (hash * 31 + dept.charCodeAt(i)) % DEPT_PALETTE.length
  return hash
}

const getDeptStyle = (dept: string) => {
  const p = DEPT_PALETTE[getDeptIndex(dept)]
  return { background: p.bg, color: p.color }
}

const getDeptIcon = (dept: string) => DEPT_PALETTE[getDeptIndex(dept)].icon

// ── State ─────────────────────────────────────────────────────────────
const searchQuery = ref('')
const selectedRole = ref('')
const selectedStatus = ref('')
const selectedDepartment = ref('')
const showCreateModal = ref(false)
const showEditModal = ref(false)
const isSubmitting = ref(false)
const showPassword = ref(false)
const allAvailableRoles = [
  { name: 'Administrador' },
  { name: 'Supervisor' },
  { name: 'Colaborador' },
  { name: 'Soporte' },
  { name: 'Consultor' },
  { name: 'Cliente' },
]

const editingMember = ref<TeamMember | null>(null)
const pagination = reactive({
  page: 1,
  limit: 500,
  total: 0,
  pages: 0
})

// Form data
const formData = reactive({
  name: '',
  email: '',
  password: '',
  role: '' as TeamMember['role'],
  department: '',
  position: '',
  phone: '',
  supervisor: '',
  departmentRole: 'member' as 'member' | 'leader'
})

// Computed
const activeMembers = computed(() => teamStore.members.filter(m => m.isActive).length)

const filteredMembers = computed(() => {
  let filtered = teamStore.members

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(member => 
      member.name.toLowerCase().includes(query) ||
      member.email.toLowerCase().includes(query) ||
      member.department?.toLowerCase().includes(query)
    )
  }

  if (selectedRole.value) {
    filtered = filtered.filter(member => member.role === selectedRole.value)
  }

  if (selectedStatus.value) {
    const isActive = selectedStatus.value === 'true'
    filtered = filtered.filter(member => member.isActive === isActive)
  }

  if (selectedDepartment.value) {
    filtered = filtered.filter(member => member.department === selectedDepartment.value)
  }

  return filtered.sort((a,b) => (a.isActive === b.isActive) ? 0 : a.isActive ? -1 : 1)
})

// Methods
const formatDate = (dateString?: string) => {
  if (!dateString) return 'Nunca'
  return new Date(dateString).toLocaleDateString('es-ES', {
    day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit'
  })
}

const getRoleDisplayName = (role: string) => {
  const roleNames: Record<string, string> = {
    admin: 'Administrador',
    supervisor: 'Supervisor',
    collaborator: 'Colaborador',
    support: 'Soporte',
    viewer: 'Consultor',
    client: 'Cliente'
  }
  return roleNames[role] || role
}

const getRoleBadgeClass = (role: string) => {
  const classes: Record<string, string> = {
    admin: 'bg-rose-500 text-white',
    supervisor: 'bg-orange-500 text-white',
    collaborator: 'bg-emerald-500 text-white',
    support: 'bg-primary-600 text-white',
    viewer: 'bg-slate-200 text-slate-600',
    client: 'bg-slate-100 text-slate-500'
  }
  return classes[role] || classes.viewer
}

const closeModal = () => {
  showCreateModal.value = false
  showEditModal.value = false
  showPassword.value = false
  editingMember.value = null
  Object.assign(formData, { name: '', email: '', password: '', role: '', department: '', position: '', phone: '', supervisor: '', departmentRole: 'member' })
}

const editMember = (member: TeamMember) => {
  editingMember.value = member
  Object.assign(formData, {
    name: member.name,
    email: member.email,
    password: '',
    role: member.role,
    department: member.department || '',
    position: member.position || '',
    phone: member.phone || '',
    supervisor: member.supervisor || '',
    departmentRole: member.departmentRole || 'member'
  })
  showEditModal.value = true
}

const submitForm = async () => {
  try {
    isSubmitting.value = true
    if (showCreateModal.value) {
      // Validaciones extra
      if (formData.password.length < 6) {
        showError('Validación', 'La contraseña debe tener al menos 6 caracteres')
        isSubmitting.value = false
        return
      }
      await teamStore.createMember(formData)
    } else if (editingMember.value) {
      const { password, ...updateData } = formData
      await teamStore.updateMember(editingMember.value._id!, updateData)
      
      // Si se proporcionó una contraseña y el usuario es admin, actualizarla
      if (password && authStore.user?.role === 'admin') {
        if (password.length < 12) {
          showError('Validación', 'La contraseña debe tener al menos 12 caracteres')
          isSubmitting.value = false
          return
        }
        await teamStore.updateMemberPassword(editingMember.value._id!, password)
        showSuccess('Contraseña', 'La contraseña ha sido actualizada correctamente')
      }
    }
    closeModal()
  } catch (error: any) {
    const data = error.response?.data
    if (data?.code === 'LIMIT_USERS') {
      showPlanLimitModal({
        message: data.message,
        limit: data.limit,
        current: data.current,
        type: 'users',
      })
    } else {
      showError('Error al guardar', data?.message || error.message || 'Error al guardar los datos')
    }
  } finally {
    isSubmitting.value = false
  }
}

const toggleMemberStatus = async (member: TeamMember) => {
  try {
    if (member.isActive) {
      await teamStore.deleteMember(member._id!)
    } else {
      await teamStore.activateMember(member._id!)
    }
  } catch (error: any) {
    console.error('Error toggling status:', error)
  }
}

const permanentDeleteMember = async (member: TeamMember) => {
  const confirmed = await confirmDelete(
    `¿Estás seguro de eliminar permanentemente a ${member.name}?`,
    "Esta acción borrará todos sus datos de la base de datos de forma irreversible."
  )
  
  if (confirmed) {
    try {
      await teamStore.hardDeleteMember(member._id!)
      showSuccess("Usuario eliminado permanentemente")
    } catch (error: any) {
      showError(error.message || "Error al eliminar usuario")
    }
  }
}

const changePage = (page: number) => {
  if (page < 1 || page > pagination.pages) return
  teamStore.fetchTeam(page, pagination.limit).then(res => {
    if (res) Object.assign(pagination, res)
  })
}

onMounted(async () => {
  if (authStore.canViewTeam) {
    const res = await teamStore.fetchTeam(pagination.page, pagination.limit)
    if (res) Object.assign(pagination, res)
  }
})
</script>

<style scoped>
@keyframes fade-in {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in { animation: fade-in 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }

@keyframes scale-up {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}
.animate-scale-up { animation: scale-up 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
</style>
