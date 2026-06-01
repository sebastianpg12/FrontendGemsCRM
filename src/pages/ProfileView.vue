<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="bg-white dark:bg-[#1e293b] rounded-3xl p-8 border border-slate-200/60 dark:border-[#334155] shadow-sm transition-all duration-300">
      <div class="flex flex-col md:flex-row items-center gap-8">
        <!-- Profile Avatar -->
        <div class="relative">
          <UserAvatar
            :name="profileData?.name || 'U'"
            size="2xl"
            class="w-36 h-36 !rounded-full border-4 border-white shadow-xl ring-4 ring-primary-100/50"
          />
        </div>
        
        <!-- Basic Info -->
        <div class="text-center md:text-left flex-1">
          <div class="flex flex-col md:flex-row md:items-center gap-2 mb-2">
            <h1 class="text-3xl font-black text-slate-800 dark:text-slate-100 tracking-tight">{{ profileData?.name || 'Cargando...' }}</h1>
            <span class="inline-flex items-center px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-xs font-black uppercase tracking-widest border border-primary-100/50">
              {{ getRoleDisplayName(profileData?.role || '') }}
            </span>
          </div>
          <p class="text-slate-500 font-medium mb-4">{{ profileData?.email || '' }}</p>
          
          <div class="flex flex-wrap gap-3 justify-center md:justify-start">
            <span class="inline-flex items-center px-4 py-1.5 bg-emerald-50 text-emerald-700 rounded-2xl text-xs font-bold border border-emerald-100">
              <i class="fas fa-check-circle mr-2"></i>
              Activo
            </span>
            <span class="inline-flex items-center px-4 py-1.5 bg-slate-50 text-slate-600 rounded-2xl text-xs font-bold border border-slate-100">
              <i class="fas fa-calendar-alt mr-2"></i>
              Miembro desde {{ formatDate(profileData?.createdAt || '') }}
            </span>
          </div>
        </div>

        <!-- Edit Button -->
        <div class="flex gap-3">
          <button
            @click="toggleEditMode"
            :class="[
              'px-8 py-3.5 rounded-2xl font-black text-sm uppercase tracking-widest transition-all duration-300 shadow-sm',
              isEditing 
                ? 'bg-rose-50 text-rose-600 border border-rose-100 hover:bg-rose-100' 
                : 'bg-primary-500 text-white hover:bg-primary-600 shadow-primary-200 shadow-lg hover:-translate-y-0.5'
            ]"
          >
            <i :class="isEditing ? 'fas fa-times' : 'fas fa-pen-nib'" class="mr-2"></i>
            {{ isEditing ? 'Cancelar' : 'Editar Perfil' }}
          </button>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Personal Information (Left Column) -->
      <div class="lg:col-span-2 space-y-6">
        <div class="bg-white dark:bg-[#1e293b] rounded-3xl p-8 border border-slate-200/60 dark:border-[#334155] shadow-sm h-full">
          <div class="flex items-center justify-between mb-8">
            <h2 class="text-xl font-black text-slate-800 dark:text-slate-100 flex items-center">
              <div class="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center mr-4">
                <i class="fas fa-id-card text-primary-500"></i>
              </div>
              Información Personal
            </h2>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            <!-- Name -->
            <div class="space-y-2">
              <label class="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">
                Nombre Completo
              </label>
              <div v-if="isEditing" class="relative group">
                <i class="fas fa-user absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors"></i>
                <input
                  v-model="editForm.name"
                  type="text"
                  class="w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-[#334155] rounded-2xl text-slate-700 dark:text-slate-200 font-bold focus:ring-4 focus:ring-primary-100 focus:border-primary-400 transition-all outline-none"
                  placeholder="Tu nombre completo"
                />
              </div>
              <div v-else class="px-5 py-4 bg-slate-50 dark:bg-[#0f172a] border border-slate-100 dark:border-[#334155] rounded-2xl">
                <p class="text-slate-700 dark:text-slate-200 font-bold">{{ profileData?.name || 'No especificado' }}</p>
              </div>
            </div>

            <!-- Email -->
            <div class="space-y-2">
              <label class="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">
                Correo Electrónico
              </label>
              <div v-if="isEditing" class="relative group">
                <i class="fas fa-envelope absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors"></i>
                <input
                  v-model="editForm.email"
                  type="email"
                  class="w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-[#334155] rounded-2xl text-slate-700 dark:text-slate-200 font-bold focus:ring-4 focus:ring-primary-100 focus:border-primary-400 transition-all outline-none"
                  placeholder="tu@email.com"
                />
              </div>
              <div v-else class="px-5 py-4 bg-slate-50 dark:bg-[#0f172a] border border-slate-100 dark:border-[#334155] rounded-2xl">
                <p class="text-slate-700 dark:text-slate-200 font-bold">{{ profileData?.email || 'No especificado' }}</p>
              </div>
            </div>

            <!-- Phone -->
            <div class="space-y-2">
              <label class="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">
                Teléfono
              </label>
              <div v-if="isEditing" class="relative group">
                <i class="fas fa-phone absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors"></i>
                <input
                  v-model="editForm.phone"
                  type="tel"
                  class="w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-[#334155] rounded-2xl text-slate-700 dark:text-slate-200 font-bold focus:ring-4 focus:ring-primary-100 focus:border-primary-400 transition-all outline-none"
                  placeholder="+57 300 000 0000"
                />
              </div>
              <div v-else class="px-5 py-4 bg-slate-50 dark:bg-[#0f172a] border border-slate-100 dark:border-[#334155] rounded-2xl">
                <p class="text-slate-700 dark:text-slate-200 font-bold">{{ profileData?.phone || 'No especificado' }}</p>
              </div>
            </div>

            <!-- Department -->
            <div class="space-y-2">
              <label class="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">
                Departamento
              </label>
              <div v-if="isEditing">
                <!-- Adding new custom dept -->
                <div v-if="profileAddingDept" class="flex gap-2">
                  <input
                    v-model="profileNewDept"
                    @keydown.enter.prevent="confirmProfileDept"
                    @keydown.escape="profileAddingDept = false; profileNewDept = ''"
                    autofocus
                    placeholder="Nombre del departamento..."
                    class="flex-1 pl-4 pr-4 py-3.5 bg-slate-50 dark:bg-[#0f172a] border border-primary-200 dark:border-primary-500/40 rounded-2xl text-slate-700 dark:text-slate-200 font-bold focus:ring-4 focus:ring-primary-100 transition-all outline-none"
                  />
                  <button type="button" @click="confirmProfileDept" :disabled="!profileNewDept.trim()"
                    class="px-4 bg-primary-500 hover:bg-primary-600 disabled:opacity-40 text-white rounded-2xl text-xs font-black transition-all">
                    <i class="fas fa-check"></i>
                  </button>
                  <button type="button" @click="profileAddingDept = false; profileNewDept = ''"
                    class="px-4 bg-slate-100 dark:bg-[#334155] hover:bg-slate-200 text-slate-500 rounded-2xl text-xs font-black transition-all">
                    <i class="fas fa-xmark"></i>
                  </button>
                </div>
                <!-- Normal select -->
                <div v-else class="relative group">
                  <i class="fas fa-building absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors z-10 pointer-events-none"></i>
                  <select
                    v-model="editForm.department"
                    class="w-full pl-12 pr-10 py-3.5 bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-[#334155] rounded-2xl text-slate-700 dark:text-slate-200 font-bold focus:ring-4 focus:ring-primary-100 focus:border-primary-400 transition-all outline-none appearance-none"
                  >
                    <option value="">Sin departamento</option>
                    <option v-for="dept in allProfileDepartments" :key="dept" :value="dept">{{ dept }}</option>
                  </select>
                  <button type="button" @click="profileAddingDept = true"
                    class="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-lg bg-primary-100 dark:bg-primary-500/20 text-primary-500 hover:bg-primary-200 dark:hover:bg-primary-500/30 transition-all flex items-center justify-center text-[9px]"
                    title="Crear departamento personalizado"
                  >
                    <i class="fas fa-plus"></i>
                  </button>
                </div>
              </div>
              <div v-else class="px-5 py-4 bg-slate-50 dark:bg-[#0f172a] border border-slate-100 dark:border-[#334155] rounded-2xl">
                <p class="text-slate-700 dark:text-slate-200 font-bold">{{ profileData?.department || 'No especificado' }}</p>
              </div>
            </div>

            <!-- Metadata (Read Only) -->
            <div class="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100 mt-2">
              <div class="flex items-center gap-4">
                <div class="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400">
                  <i class="fas fa-calendar-plus"></i>
                </div>
                <div>
                  <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Registrado el</p>
                  <p class="text-slate-700 font-bold text-sm">{{ formatDate(profileData?.createdAt || '') }}</p>
                </div>
              </div>
              <div class="flex items-center gap-4">
                <div class="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400">
                  <i class="fas fa-history"></i>
                </div>
                <div>
                  <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Última actualización</p>
                  <p class="text-slate-700 font-bold text-sm">{{ formatDate(profileData?.updatedAt || '') }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Edit Action Buttons -->
          <div v-if="isEditing" class="flex gap-4 mt-10 justify-end pt-6 border-t border-slate-100">
            <button
              @click="toggleEditMode"
              class="px-6 py-3 text-slate-500 hover:text-slate-700 font-black text-xs uppercase tracking-widest transition-all"
            >
              Cancelar
            </button>
            <button
              @click="updateProfile"
              :disabled="loading"
              class="px-8 py-3.5 bg-primary-500 hover:bg-primary-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-primary-200 disabled:opacity-50"
            >
              <i class="fas fa-save mr-2"></i>
              {{ loading ? 'Guardando...' : 'Guardar Cambios' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Security / Password (Right Column) -->
      <div class="space-y-6">
        <div class="bg-white dark:bg-[#1e293b] rounded-3xl p-8 border border-slate-200/60 dark:border-[#334155] shadow-sm">
          <h2 class="text-xl font-black text-slate-800 dark:text-slate-100 mb-8 flex items-center">
            <div class="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center mr-4">
              <i class="fas fa-shield-alt text-amber-500"></i>
            </div>
            Seguridad
          </h2>
          
          <form @submit.prevent="updatePassword" class="space-y-5">
            <div class="space-y-2">
              <label class="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">
                Contraseña Actual
              </label>
              <input
                v-model="passwordForm.currentPassword"
                type="password"
                class="w-full px-4 py-3.5 bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-[#334155] rounded-2xl text-slate-700 dark:text-slate-200 font-bold focus:ring-4 focus:ring-primary-100 focus:border-primary-400 transition-all outline-none"
                placeholder="••••••••"
                required
              />
            </div>
            
            <div class="space-y-2">
              <label class="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">
                Nueva Contraseña
              </label>
              <input
                v-model="passwordForm.newPassword"
                type="password"
                class="w-full px-4 py-3.5 bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-[#334155] rounded-2xl text-slate-700 dark:text-slate-200 font-bold focus:ring-4 focus:ring-primary-100 focus:border-primary-400 transition-all outline-none"
                placeholder="••••••••"
                required
              />
            </div>
            
            <div class="space-y-2">
              <label class="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">
                Confirmar Nueva Contraseña
              </label>
              <input
                v-model="passwordForm.confirmPassword"
                type="password"
                class="w-full px-4 py-3.5 bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-[#334155] rounded-2xl text-slate-700 dark:text-slate-200 font-bold focus:ring-4 focus:ring-primary-100 focus:border-primary-400 transition-all outline-none"
                placeholder="••••••••"
                required
              />
            </div>
            
            <button
              type="submit"
              :disabled="loading || !passwordForm.currentPassword || !passwordForm.newPassword || passwordForm.newPassword !== passwordForm.confirmPassword"
              class="w-full mt-4 px-6 py-4 bg-slate-800 hover:bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-lg disabled:opacity-50"
            >
              <i class="fas fa-key mr-2"></i>
              {{ loading ? 'Actualizando...' : 'Actualizar Contraseña' }}
            </button>
          </form>
        </div>

        <!-- 2FA Section -->
        <div class="bg-white dark:bg-[#1e293b] rounded-3xl p-8 border border-slate-200/60 dark:border-[#334155] shadow-sm">
          <h2 class="text-xl font-black text-slate-800 dark:text-slate-100 mb-6 flex items-center">
            <div class="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center mr-4">
              <i class="fas fa-mobile-screen-button text-indigo-500"></i>
            </div>
            Autenticación de 2 Factores
          </h2>
          
          <div v-if="!profileData.isTwoFactorEnabled && !setup2FAData" class="space-y-4">
            <p class="text-sm text-slate-600 dark:text-slate-300 font-medium">
              Protege tu cuenta agregando una capa adicional de seguridad con una aplicación autenticadora (Google Authenticator, Authy, etc).
            </p>
            <button
              @click="init2FASetup"
              :disabled="loading"
              class="w-full px-6 py-4 bg-indigo-500 hover:bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-lg disabled:opacity-50"
            >
              <i class="fas fa-shield-halved mr-2"></i>
              Configurar 2FA
            </button>
          </div>

          <div v-if="setup2FAData && !profileData.isTwoFactorEnabled" class="space-y-6">
            <div class="bg-slate-50 dark:bg-[#0f172a] rounded-2xl p-4 border border-slate-100 dark:border-[#334155] text-center">
              <p class="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-4">1. Escanea este código QR</p>
              <img :src="setup2FAData.qrCode" alt="2FA QR Code" class="mx-auto rounded-xl shadow-sm bg-white p-2 mb-4" />
              <p class="text-[10px] text-slate-500 font-bold break-all">O ingresa esta clave manual:<br/><span class="font-mono text-indigo-500">{{ setup2FAData.secret }}</span></p>
            </div>
            
            <div class="space-y-2">
              <label class="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">
                2. Ingresa el código de 6 dígitos
              </label>
              <input
                v-model="twoFactorCode"
                type="text"
                maxlength="6"
                placeholder="000000"
                class="w-full px-4 py-3.5 bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-[#334155] rounded-2xl text-center text-2xl font-mono tracking-[0.5em] text-slate-700 dark:text-slate-200 focus:ring-4 focus:ring-indigo-100 focus:border-indigo-400 transition-all outline-none"
              />
            </div>
            
            <div class="flex gap-3">
              <button
                @click="setup2FAData = null; twoFactorCode = ''"
                class="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-2xl font-black text-xs uppercase tracking-widest transition-all"
              >
                Cancelar
              </button>
              <button
                @click="confirm2FA"
                :disabled="loading || twoFactorCode.length !== 6"
                class="flex-1 py-3 bg-indigo-500 hover:bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-lg disabled:opacity-50"
              >
                Activar
              </button>
            </div>
          </div>

          <div v-if="profileData.isTwoFactorEnabled" class="space-y-4">
            <div class="flex items-center gap-3 p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
              <i class="fas fa-shield-check text-emerald-500 text-xl"></i>
              <div>
                <p class="text-sm font-bold text-emerald-800">2FA Activado</p>
                <p class="text-xs text-emerald-600">Tu cuenta está protegida.</p>
              </div>
            </div>
            
            <div v-if="!showDisable2FAForm" class="pt-2">
               <button
                 @click="showDisable2FAForm = true"
                 class="w-full px-6 py-3.5 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all"
               >
                 Desactivar 2FA
               </button>
            </div>
            
            <div v-if="showDisable2FAForm" class="space-y-4 pt-4 border-t border-slate-100">
              <div class="space-y-2">
                <label class="text-[11px] font-black text-rose-400 uppercase tracking-widest ml-1">
                  Ingresa tu contraseña actual
                </label>
                <input
                  v-model="disable2FAPassword"
                  type="password"
                  placeholder="••••••••"
                  class="w-full px-4 py-3.5 bg-rose-50/30 border border-rose-200 rounded-2xl text-slate-700 focus:ring-4 focus:ring-rose-100 transition-all outline-none"
                />
              </div>
              <div class="flex gap-3">
                <button
                  @click="showDisable2FAForm = false; disable2FAPassword = ''"
                  class="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all"
                >
                  Cancelar
                </button>
                <button
                  @click="disable2FA"
                  :disabled="loading || !disable2FAPassword"
                  class="flex-1 py-3 bg-rose-500 hover:bg-rose-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all disabled:opacity-50"
                >
                  Confirmar Desactivación
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Help Box -->
        <div class="bg-primary-50 rounded-3xl p-6 border border-primary-100">
          <div class="flex items-start gap-4">
            <div class="w-10 h-10 bg-white rounded-xl flex items-center justify-center shrink-0">
              <i class="fas fa-lightbulb text-primary-500"></i>
            </div>
            <div>
              <h4 class="font-black text-primary-900 text-sm uppercase tracking-tight mb-1">Dato curioso</h4>
              <p class="text-primary-700/80 text-xs leading-relaxed font-medium">
                Tu avatar representa tu identidad en GEMS Hub. Puedes cambiarlo en cualquier momento para reflejar tu enfoque de trabajo.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Photo/Avatar Modals removed by user request -->
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { userService } from '@/services/userService'
import { AvatarService } from '@/services/avatarService'
import { useNotifications } from '@/composables/useNotifications'
import AvatarSelector from '@/components/AvatarSelector.vue'
import ProfilePhotoUploader from '@/components/ProfilePhotoUploader.vue'
import { getAvatarById, getDefaultAvatar } from '@/utils/avatarConfig'
import { API_CONFIG } from '@/config/api'

const authStore = useAuthStore()
const { showSuccess, showError } = useNotifications()

// ── Department picker ─────────────────────────────────────────────
const DEPT_STORAGE_KEY = 'gems-custom-departments'
const DEFAULT_DEPARTMENTS = ['TI', 'Comercial', 'Marketing', 'Customer Success']

const customDepartments = ref<string[]>(
  JSON.parse(localStorage.getItem(DEPT_STORAGE_KEY) || '[]')
)

const allProfileDepartments = computed(() => {
  return [...new Set([...DEFAULT_DEPARTMENTS, ...customDepartments.value])]
})

const profileAddingDept = ref(false)
const profileNewDept = ref('')

const confirmProfileDept = () => {
  const name = profileNewDept.value.trim()
  if (!name) return
  if (!customDepartments.value.includes(name) && !DEFAULT_DEPARTMENTS.includes(name)) {
    customDepartments.value.push(name)
    localStorage.setItem(DEPT_STORAGE_KEY, JSON.stringify(customDepartments.value))
  }
  editForm.value.department = name
  profileAddingDept.value = false
  profileNewDept.value = ''
}

// State
const loading = ref(false)
const isEditing = ref(false)
const showAvatarSelector = ref(false)
const showPhotoUploader = ref(false)
const tempSelectedAvatar = ref<string>('')
const photoErrored = ref(false)

const profileData = ref({
  name: '',
  email: '',
  role: '',
  phone: '',
  department: '',
  avatar: null as string | null,
  photo: null as string | null,
  createdAt: '',
  updatedAt: ''
})

const editForm = ref({
  name: '',
  email: '',
  phone: '',
  department: ''
})

const passwordForm = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

// 2FA state
const setup2FAData = ref<{ secret: string; qrCode: string } | null>(null)
const twoFactorCode = ref('')
const showDisable2FAForm = ref(false)
const disable2FAPassword = ref('')

// Computed
const selectedAvatarData = computed(() => {
  const avatarId = profileData.value?.avatar
  return avatarId ? getAvatarById(avatarId) : null
})

const resolvedPhotoUrl = computed(() => {
  const url = profileData.value.photo
  if (!url || photoErrored.value) return ''
  if (/^https?:\/\//i.test(url)) return url
  const origin = String(API_CONFIG.BASE_URL).replace(/\/?api\/?$/i, '')
  return `${origin.replace(/\/$/, '')}/${url.replace(/^\//, '')}`
})

// Methods
const getInitials = (name: string) => {
  if (!name) return 'U'
  return name.split(' ').map(n => n.charAt(0)).join('').toUpperCase().substring(0, 2)
}

const getRoleDisplayName = (role: string) => {
  const roles: { [key: string]: string } = {
    'admin': 'Administrador',
    'supervisor': 'Supervisor',
    'collaborator': 'Colaborador',
    'support': 'Soporte',
    'viewer': 'Consultor',
    'client': 'Cliente'
  }
  return roles[role] || role || 'Miembro'
}

const onPhotoError = () => {
  photoErrored.value = true
}

const togglePhotoUploader = () => {
  showPhotoUploader.value = !showPhotoUploader.value
  if (showPhotoUploader.value) showAvatarSelector.value = false
}

const handlePhotoUpdate = (data: { photo: string | null, avatar: string | null }) => {
  profileData.value.photo = data.photo
  profileData.value.avatar = data.avatar
  
  if (authStore.user) {
    authStore.user.photo = data.photo
    authStore.user.avatar = data.avatar
    localStorage.setItem('user', JSON.stringify(authStore.user))
  }
  
  showPhotoUploader.value = false
  photoErrored.value = false
  showSuccess('Foto actualizada correctamente')
}

const formatDate = (dateString: string) => {
  if (!dateString) return '...'
  try {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  } catch {
    return '---'
  }
}

const selectAvatar = (avatarId: string) => {
  tempSelectedAvatar.value = avatarId
}

const openAvatarSelector = () => {
  tempSelectedAvatar.value = profileData.value.avatar || getDefaultAvatar().id
  showAvatarSelector.value = true
}

const confirmAvatarSelection = async () => {
  if (!tempSelectedAvatar.value) return

  try {
    loading.value = true
    const result = await AvatarService.updateUserAvatar(tempSelectedAvatar.value)

    if (result.success) {
      profileData.value.avatar = tempSelectedAvatar.value
      profileData.value.photo = null

      if (authStore.user) {
        (authStore.user as any).avatar = tempSelectedAvatar.value
        (authStore.user as any).photo = null
        localStorage.setItem('user', JSON.stringify(authStore.user))
      }

      showAvatarSelector.value = false
      tempSelectedAvatar.value = ''
      showSuccess('Avatar actualizado correctamente')
    } else {
      showError(result.message || 'Error al actualizar el avatar')
    }
  } catch (error) {
    showError('Error al actualizar el avatar')
  } finally {
    loading.value = false
  }
}

const toggleEditMode = () => {
  if (!profileData.value) return
  
  if (isEditing.value) {
    editForm.value = {
      name: profileData.value.name || '',
      email: profileData.value.email || '',
      phone: profileData.value.phone || '',
      department: profileData.value.department || ''
    }
  } else {
    editForm.value = {
      name: profileData.value.name || '',
      email: profileData.value.email || '',
      phone: profileData.value.phone || '',
      department: profileData.value.department || ''
    }
  }
  isEditing.value = !isEditing.value
}

const updateProfile = async () => {
  try {
    loading.value = true
    const result = await authStore.updateProfile(editForm.value)
    
    if (result.success) {
      Object.assign(profileData.value, editForm.value)
      isEditing.value = false
      showSuccess('Perfil actualizado correctamente')
    } else {
      showError(result.message || 'Error al actualizar el perfil')
    }
  } catch (error) {
    showError('Error al actualizar el perfil')
  } finally {
    loading.value = false
  }
}

const updatePassword = async () => {
  if (passwordForm.value.newPassword.length < 12) {
    showError('La contraseña debe tener al menos 12 caracteres')
    return
  }
  const hasUppercase = /[A-Z]/.test(passwordForm.value.newPassword)
  const hasNumber = /[0-9]/.test(passwordForm.value.newPassword)
  if (!hasUppercase || !hasNumber) {
    showError('La contraseña debe incluir al menos una mayúscula y un número')
    return
  }
  try {
    loading.value = true
    await userService.updatePassword({
      currentPassword: passwordForm.value.currentPassword,
      newPassword: passwordForm.value.newPassword
    })
    
    passwordForm.value = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }
    showSuccess('Contraseña actualizada correctamente')
  } catch (error) {
    showError('Error al cambiar la contraseña')
  } finally {
    loading.value = false
  }
}

const init2FASetup = async () => {
  try {
    loading.value = true
    const data = await userService.setup2FA()
    setup2FAData.value = data
  } catch (error: any) {
    showError(error.message || 'Error iniciando configuración 2FA')
  } finally {
    loading.value = false
  }
}

const confirm2FA = async () => {
  try {
    loading.value = true
    await userService.enable2FA(twoFactorCode.value)
    profileData.value.isTwoFactorEnabled = true
    setup2FAData.value = null
    twoFactorCode.value = ''
    showSuccess('Autenticación de 2 Factores activada')
  } catch (error: any) {
    showError(error.message || 'Código incorrecto')
  } finally {
    loading.value = false
  }
}

const disable2FA = async () => {
  try {
    loading.value = true
    await userService.disable2FA(disable2FAPassword.value)
    profileData.value.isTwoFactorEnabled = false
    showDisable2FAForm.value = false
    disable2FAPassword.value = ''
    showSuccess('2FA desactivado correctamente')
  } catch (error: any) {
    showError(error.message || 'Error desactivando 2FA')
  } finally {
    loading.value = false
  }
}

const loadProfile = async () => {
  try {
    loading.value = true
    
    if (authStore.user) {
      profileData.value = {
        name: authStore.user.name || '',
        email: authStore.user.email || '',
        role: authStore.user.role || '',
        phone: (authStore.user as any).phone || '',
        department: authStore.user.department || '',
        avatar: (authStore.user as any).avatar || null,
        photo: (authStore.user as any).photo || null,
        createdAt: (authStore.user as any).createdAt || '',
        updatedAt: (authStore.user as any).updatedAt || '',
        isTwoFactorEnabled: (authStore.user as any).isTwoFactorEnabled || false
      }
    }
    
    try {
      const profile = await userService.getProfile()
      profileData.value = {
        name: profile.name || '',
        email: profile.email || '',
        role: profile.role || '',
        phone: profile.phone || '',
        department: profile.department || '',
        avatar: profile.avatar || null,
        photo: profile.photo || null,
        createdAt: profile.createdAt || '',
        updatedAt: profile.updatedAt || '',
        isTwoFactorEnabled: profile.isTwoFactorEnabled || false
      }
      photoErrored.value = false
    } catch (serverError) {
      // Fallback already set from store
    }
    
    try {
      const avatarInfo = await AvatarService.getUserAvatar()
      if (avatarInfo) {
        profileData.value.avatar = avatarInfo.avatar
        profileData.value.photo = avatarInfo.photo
        if (authStore.user) {
          (authStore.user as any).avatar = avatarInfo.avatar
          (authStore.user as any).photo = avatarInfo.photo
          localStorage.setItem('user', JSON.stringify(authStore.user))
        }
      }
    } catch (avatarError) {
      // Silent fail
    }
    
  } catch (error) {
    showError('Error al cargar el perfil')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadProfile()
})
</script>

<style scoped>
.animate__faster {
  --animate-duration: 0.3s;
}
</style>
