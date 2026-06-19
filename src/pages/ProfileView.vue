<template>
  <div class="flex gap-3" style="height: calc(100vh - 84px)">

    <!-- ── LEFT: identity card ─────────────────────────────────── -->
    <div class="w-52 shrink-0 flex flex-col gap-2.5">

      <!-- Photo + name -->
      <div class="bg-white dark:bg-[#1e293b] rounded-xl shadow-sm p-4 flex flex-col items-center text-center">
        <div class="relative group cursor-pointer mb-3" @click="togglePhotoUploader" title="Cambiar foto">
          <UserAvatar
            :name="profileData.name || 'U'"
            :photo="profileData.photo || undefined"
            :avatar="profileData.avatar || undefined"
            size="xl"
            class="w-20 h-20 rounded-full ring-4 ring-primary-100/50 dark:ring-primary-500/20"
          />
          <div class="absolute inset-0 rounded-full bg-slate-900/55 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <i class="fas fa-camera text-white text-sm"></i>
          </div>
        </div>

        <h2 class="text-[14px] font-black text-slate-800 dark:text-slate-100 leading-tight mb-1.5">{{ profileData.name || '...' }}</h2>

        <span class="px-2.5 py-0.5 bg-primary-50 dark:bg-primary-500/20 text-primary-600 dark:text-primary-300 rounded-full text-[8px] font-black uppercase tracking-widest mb-2.5">
          {{ getRoleDisplayName(profileData.role) }}
        </span>

        <p class="text-[10px] text-slate-400 font-medium truncate max-w-full mb-3">{{ profileData.email }}</p>

        <div class="flex items-center gap-1.5 mb-1">
          <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0"></span>
          <span class="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">Activo</span>
        </div>
        <p class="text-[9px] text-slate-400 font-medium">Desde {{ formatDate(profileData.createdAt) }}</p>
      </div>

      <!-- Edit toggle -->
      <button
        @click="toggleEditMode"
        class="h-9 rounded-xl font-black text-[11px] uppercase tracking-widest transition-all duration-200 active:scale-95"
        :class="isEditing
          ? 'bg-rose-50 dark:bg-rose-500/10 text-rose-500 border border-rose-200 dark:border-rose-500/30'
          : 'bg-primary-500 text-white shadow-lg shadow-primary-500/25 hover:bg-primary-600'"
      >
        <i :class="isEditing ? 'fas fa-times' : 'fas fa-pen-nib'" class="mr-1.5 text-[10px]"></i>
        {{ isEditing ? 'Cancelar' : 'Editar perfil' }}
      </button>

      <!-- Vertical tab nav -->
      <div class="bg-white dark:bg-[#1e293b] rounded-xl shadow-sm p-1.5 flex flex-col gap-0.5 flex-1">
        <button
          v-for="tab in TABS" :key="tab.id"
          @click="activeTab = tab.id"
          class="flex items-center gap-2.5 px-3 py-2 rounded-lg text-[11px] font-bold transition-all text-left w-full"
          :class="activeTab === tab.id
            ? 'bg-primary-50 dark:bg-primary-500/15 text-primary-600 dark:text-primary-300'
            : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/30 hover:text-slate-700 dark:hover:text-slate-200'"
        >
          <i :class="['fas', tab.icon, 'text-[10px] w-3.5 text-center']"></i>
          {{ tab.label }}
        </button>
      </div>
    </div>

    <!-- ── RIGHT: tab content ──────────────────────────────────── -->
    <div class="flex-1 bg-white dark:bg-[#1e293b] rounded-xl shadow-sm flex flex-col overflow-hidden min-w-0">

      <!-- Tab header -->
      <div class="px-5 py-3 border-b border-slate-100 dark:border-[#334155] shrink-0 flex items-center justify-between">
        <div class="flex items-center gap-2">
          <i :class="['fas', TABS.find(t => t.id === activeTab)?.icon, 'text-[10px] text-slate-400']"></i>
          <h2 class="text-[13px] font-black text-slate-800 dark:text-slate-100">{{ TABS.find(t => t.id === activeTab)?.label }}</h2>
        </div>
        <!-- Save button for datos tab when editing -->
        <button v-if="activeTab === 'datos' && isEditing"
          @click="updateProfile" :disabled="loading"
          class="h-8 px-4 bg-primary-500 hover:bg-primary-600 text-white rounded-lg text-[11px] font-black transition-all disabled:opacity-50 shadow-sm">
          <i class="fas fa-save mr-1.5 text-[10px]"></i>{{ loading ? 'Guardando...' : 'Guardar' }}
        </button>
      </div>

      <!-- Scrollable content -->
      <div class="flex-1 overflow-y-auto custom-scrollbar p-5">

        <!-- ── DATOS PERSONALES ── -->
        <div v-if="activeTab === 'datos'" class="grid grid-cols-2 gap-4">

          <div v-for="field in dataFields" :key="field.key" :class="field.full ? 'col-span-2' : ''">
            <label class="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1.5 ml-0.5">{{ field.label }}</label>
            <div v-if="isEditing && field.key !== 'department'" class="relative">
              <i :class="['fas', field.icon, 'absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300 dark:text-slate-600 text-[11px]']"></i>
              <input
                v-model="(editForm as any)[field.key]"
                :type="field.type || 'text'"
                :placeholder="field.placeholder"
                class="w-full pl-9 pr-4 py-2.5 bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-[#334155] rounded-xl text-[12px] text-slate-700 dark:text-slate-200 font-medium focus:ring-2 focus:ring-primary-300 focus:border-primary-400 transition-all outline-none"
              />
            </div>
            <!-- Department field when editing -->
            <div v-else-if="isEditing && field.key === 'department'">
              <div v-if="profileAddingDept" class="flex gap-2">
                <input v-model="profileNewDept" @keydown.enter.prevent="confirmProfileDept" @keydown.escape="profileAddingDept = false" autofocus placeholder="Nuevo departamento..."
                  class="flex-1 px-3.5 py-2.5 bg-slate-50 dark:bg-[#0f172a] border border-primary-200 dark:border-primary-500/40 rounded-xl text-[12px] text-slate-700 dark:text-slate-200 font-medium focus:ring-2 focus:ring-primary-300 transition-all outline-none" />
                <button @click="confirmProfileDept" :disabled="!profileNewDept.trim()" class="px-3 bg-primary-500 text-white rounded-xl text-[11px] disabled:opacity-40 transition-all"><i class="fas fa-check"></i></button>
                <button @click="profileAddingDept = false" class="px-3 bg-slate-100 dark:bg-[#334155] text-slate-500 rounded-xl text-[11px] transition-all"><i class="fas fa-times"></i></button>
              </div>
              <div v-else class="flex gap-2">
                <select v-model="editForm.department"
                  class="flex-1 px-3.5 py-2.5 bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-[#334155] rounded-xl text-[12px] text-slate-700 dark:text-slate-200 font-medium focus:ring-2 focus:ring-primary-300 transition-all outline-none appearance-none">
                  <option value="">Sin departamento</option>
                  <option v-for="d in allProfileDepartments" :key="d" :value="d">{{ d }}</option>
                </select>
                <button @click="profileAddingDept = true" class="px-3 bg-primary-50 dark:bg-primary-500/10 text-primary-500 rounded-xl text-[11px] transition-all hover:bg-primary-100"><i class="fas fa-plus"></i></button>
              </div>
            </div>
            <!-- Read-only value -->
            <div v-else class="px-3.5 py-2.5 bg-slate-50 dark:bg-[#0f172a] rounded-xl">
              <p class="text-[12px] text-slate-700 dark:text-slate-200 font-medium">
                {{ field.key === 'timezone' ? timezoneLabel : (profileData as any)[field.key] || '—' }}
              </p>
            </div>
          </div>

          <!-- Timezone (editing) -->
          <div v-if="isEditing" class="col-span-2">
            <label class="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1.5 ml-0.5">Zona horaria</label>
            <select v-model="editForm.timezone"
              class="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-[#334155] rounded-xl text-[12px] text-slate-700 dark:text-slate-200 font-medium focus:ring-2 focus:ring-primary-300 transition-all outline-none appearance-none">
              <option v-for="tz in TIMEZONES" :key="tz.value" :value="tz.value">{{ tz.label }}</option>
            </select>
          </div>

          <!-- Metadata -->
          <div class="col-span-2 pt-3 border-t border-slate-100 dark:border-[#334155] flex gap-6">
            <div class="flex items-center gap-2.5">
              <div class="w-7 h-7 rounded-lg bg-slate-50 dark:bg-[#0f172a] flex items-center justify-center shrink-0">
                <i class="fas fa-calendar-plus text-slate-400 text-[10px]"></i>
              </div>
              <div>
                <p class="text-[9px] font-black text-slate-400 uppercase tracking-wider">Registrado</p>
                <p class="text-[11px] font-bold text-slate-700 dark:text-slate-200">{{ formatDate(profileData.createdAt) }}</p>
              </div>
            </div>
            <div class="flex items-center gap-2.5">
              <div class="w-7 h-7 rounded-lg bg-slate-50 dark:bg-[#0f172a] flex items-center justify-center shrink-0">
                <i class="fas fa-history text-slate-400 text-[10px]"></i>
              </div>
              <div>
                <p class="text-[9px] font-black text-slate-400 uppercase tracking-wider">Última edición</p>
                <p class="text-[11px] font-bold text-slate-700 dark:text-slate-200">{{ formatDate(profileData.updatedAt) }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- ── CONTRASEÑA ── -->
        <div v-else-if="activeTab === 'seguridad'" class="max-w-sm space-y-4">
          <form @submit.prevent="updatePassword" class="space-y-4">
            <div v-for="pwField in pwFields" :key="pwField.key">
              <label class="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1.5 ml-0.5">{{ pwField.label }}</label>
              <div class="relative">
                <input
                  v-model="(passwordForm as any)[pwField.key]"
                  :type="(showPwd as any)[pwField.show] ? 'text' : 'password'"
                  class="w-full pl-4 pr-10 py-2.5 bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-[#334155] rounded-xl text-[12px] text-slate-700 dark:text-slate-200 font-medium focus:ring-2 focus:ring-primary-300 focus:border-primary-400 transition-all outline-none"
                  placeholder="••••••••" required
                />
                <button type="button" @click="(showPwd as any)[pwField.show] = !(showPwd as any)[pwField.show]"
                  class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors text-[11px]">
                  <i :class="(showPwd as any)[pwField.show] ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                </button>
              </div>
              <p v-if="pwField.key === 'confirmPassword' && passwordForm.confirmPassword && passwordForm.newPassword !== passwordForm.confirmPassword"
                class="text-[10px] font-bold text-rose-500 mt-1 ml-0.5">
                <i class="fas fa-circle-exclamation mr-1"></i>Las contraseñas no coinciden
              </p>
            </div>
            <button type="submit"
              :disabled="loading || !passwordForm.currentPassword || !passwordForm.newPassword || passwordForm.newPassword !== passwordForm.confirmPassword"
              class="w-full h-9 bg-primary-500 hover:bg-primary-600 text-white rounded-xl font-black text-[11px] uppercase tracking-widest transition-all shadow-md shadow-primary-500/20 disabled:opacity-50">
              <i class="fas fa-key mr-2 text-[10px]"></i>{{ loading ? 'Actualizando...' : 'Actualizar contraseña' }}
            </button>
          </form>
        </div>

        <!-- ── 2FA ── -->
        <div v-else-if="activeTab === '2fa'" class="max-w-sm">
          <!-- Not enabled, no setup -->
          <div v-if="!profileData.isTwoFactorEnabled && !setup2FAData" class="space-y-4">
            <div class="flex items-center gap-3 p-3.5 bg-slate-50 dark:bg-[#0f172a] rounded-xl">
              <div class="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center shrink-0">
                <i class="fas fa-mobile-screen-button text-indigo-500 text-sm"></i>
              </div>
              <p class="text-[11px] text-slate-600 dark:text-slate-300 font-medium leading-snug">Agrega una capa extra de seguridad con Google Authenticator o Authy.</p>
            </div>
            <button @click="init2FASetup" :disabled="loading"
              class="w-full h-9 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl font-black text-[11px] uppercase tracking-widest transition-all shadow-lg disabled:opacity-50">
              <i class="fas fa-shield-halved mr-2 text-[10px]"></i>Configurar 2FA
            </button>
          </div>

          <!-- Setup flow -->
          <div v-if="setup2FAData && !profileData.isTwoFactorEnabled" class="space-y-4">
            <div class="bg-slate-50 dark:bg-[#0f172a] rounded-xl p-4 text-center">
              <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3">1. Escanea el código QR</p>
              <img :src="setup2FAData.qrCode" alt="QR" class="mx-auto rounded-xl bg-white p-2 shadow-sm mb-3 w-36" />
              <p class="text-[9px] text-slate-400 break-all">O clave manual:<br/><span class="font-mono text-indigo-500 text-[10px]">{{ setup2FAData.secret }}</span></p>
            </div>
            <div>
              <label class="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1.5 ml-0.5">2. Código de 6 dígitos</label>
              <input v-model="twoFactorCode" type="text" maxlength="6" placeholder="000000"
                class="w-full px-4 py-2.5 bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-[#334155] rounded-xl text-center text-xl font-mono tracking-[0.5em] text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-all outline-none" />
            </div>
            <div class="flex gap-2">
              <button @click="setup2FAData = null; twoFactorCode = ''"
                class="flex-1 h-9 bg-slate-100 dark:bg-[#334155] hover:bg-slate-200 text-slate-600 dark:text-slate-300 rounded-xl font-black text-[11px] transition-all">Cancelar</button>
              <button @click="confirm2FA" :disabled="loading || twoFactorCode.length !== 6"
                class="flex-1 h-9 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl font-black text-[11px] transition-all disabled:opacity-50">Activar</button>
            </div>
          </div>

          <!-- Enabled -->
          <div v-if="profileData.isTwoFactorEnabled" class="space-y-4">
            <div class="flex items-center gap-3 p-3.5 bg-emerald-50 dark:bg-emerald-500/10 rounded-xl border border-emerald-100 dark:border-emerald-500/20">
              <i class="fas fa-shield-check text-emerald-500 text-lg"></i>
              <div>
                <p class="text-[12px] font-black text-emerald-800 dark:text-emerald-300">2FA Activado</p>
                <p class="text-[10px] text-emerald-600 dark:text-emerald-400">Tu cuenta está protegida.</p>
              </div>
            </div>
            <button v-if="!showDisable2FAForm" @click="showDisable2FAForm = true"
              class="w-full h-9 bg-rose-50 dark:bg-rose-500/10 text-rose-500 hover:bg-rose-100 rounded-xl font-black text-[11px] uppercase tracking-widest transition-all">
              Desactivar 2FA
            </button>
            <div v-if="showDisable2FAForm" class="space-y-3 pt-3 border-t border-slate-100 dark:border-[#334155]">
              <label class="text-[9px] font-black text-rose-400 uppercase tracking-widest block mb-1.5">Ingresa tu contraseña</label>
              <input v-model="disable2FAPassword" type="password" placeholder="••••••••"
                class="w-full px-4 py-2.5 bg-rose-50/30 dark:bg-[#0f172a] border border-rose-200 dark:border-rose-500/30 rounded-xl text-[12px] text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-rose-100 transition-all outline-none" />
              <div class="flex gap-2">
                <button @click="showDisable2FAForm = false; disable2FAPassword = ''"
                  class="flex-1 h-9 bg-slate-100 dark:bg-[#334155] text-slate-600 dark:text-slate-300 rounded-xl font-black text-[11px] transition-all">Cancelar</button>
                <button @click="disable2FA" :disabled="loading || !disable2FAPassword"
                  class="flex-1 h-9 bg-rose-500 hover:bg-rose-600 text-white rounded-xl font-black text-[11px] transition-all disabled:opacity-50">Confirmar</button>
              </div>
            </div>
          </div>
        </div>

        <!-- ── PREFERENCIAS ── -->
        <div v-else-if="activeTab === 'preferencias'" class="max-w-sm space-y-1">
          <div class="flex items-center justify-between py-3 border-b border-slate-100 dark:border-[#334155]">
            <div>
              <p class="text-[12px] font-black text-slate-700 dark:text-slate-200">Modo oscuro</p>
              <p class="text-[10px] text-slate-400 mt-0.5">Tema oscuro de la interfaz</p>
            </div>
            <button type="button" @click="toggleDarkMode"
              class="relative w-10 h-5 rounded-full transition-colors duration-200 shrink-0"
              :class="themeStore.config.darkMode ? 'bg-primary-500' : 'bg-slate-200'">
              <span class="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200"
                :class="themeStore.config.darkMode ? 'translate-x-5' : 'translate-x-0'"></span>
            </button>
          </div>

          <div class="flex items-center justify-between py-3 border-b border-slate-100 dark:border-[#334155]">
            <div>
              <p class="text-[12px] font-black text-slate-700 dark:text-slate-200">Idioma</p>
              <p class="text-[10px] text-slate-400 mt-0.5">Idioma de la interfaz</p>
            </div>
            <div class="flex bg-slate-100 dark:bg-[#0f172a] rounded-lg p-0.5">
              <button type="button" @click="prefs.language = 'es'"
                class="px-3 h-6 rounded-md text-[11px] font-bold transition-all"
                :class="prefs.language === 'es' ? 'bg-white dark:bg-[#1e293b] text-primary-600 dark:text-primary-300 shadow-sm' : 'text-slate-500'">ES</button>
              <button type="button" @click="prefs.language = 'en'"
                class="px-3 h-6 rounded-md text-[11px] font-bold transition-all"
                :class="prefs.language === 'en' ? 'bg-white dark:bg-[#1e293b] text-primary-600 dark:text-primary-300 shadow-sm' : 'text-slate-500'">EN</button>
            </div>
          </div>

          <div class="flex items-center justify-between py-3 border-b border-slate-100 dark:border-[#334155]">
            <div>
              <p class="text-[12px] font-black text-slate-700 dark:text-slate-200">Notificaciones push</p>
              <p class="text-[10px] text-slate-400 mt-0.5">Avisos de actividad y menciones</p>
            </div>
            <button type="button" @click="prefs.pushNotifications = !prefs.pushNotifications; handlePushToggle()"
              class="relative w-10 h-5 rounded-full transition-colors duration-200 shrink-0"
              :class="prefs.pushNotifications ? 'bg-primary-500' : 'bg-slate-200'">
              <span class="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200"
                :class="prefs.pushNotifications ? 'translate-x-5' : 'translate-x-0'"></span>
            </button>
          </div>

          <button @click="savePreferences" :disabled="savingPrefs"
            class="w-full h-9 mt-3 bg-primary-500 hover:bg-primary-600 text-white rounded-xl font-black text-[11px] uppercase tracking-widest transition-all shadow-md shadow-primary-500/20 disabled:opacity-50">
            <i class="fas mr-2 text-[10px]" :class="savingPrefs ? 'fa-circle-notch fa-spin' : 'fa-check'"></i>
            {{ savingPrefs ? 'Guardando...' : 'Guardar preferencias' }}
          </button>
        </div>

        <!-- ── ACTIVIDAD ── -->
        <div v-else-if="activeTab === 'actividad'">
          <div v-if="profileData.loginHistory?.length" class="space-y-1.5">
            <div v-for="(entry, idx) in profileData.loginHistory" :key="idx"
              class="flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#0f172a]">
              <div class="w-7 h-7 rounded-lg bg-white dark:bg-[#1e293b] flex items-center justify-center text-slate-400 shrink-0">
                <i class="fas fa-right-to-bracket text-[10px]"></i>
              </div>
              <div class="min-w-0 flex-1">
                <p class="text-[11px] font-black text-slate-700 dark:text-slate-200 truncate">{{ formatLoginEntry(entry.userAgent) }}</p>
                <p class="text-[9px] font-bold text-slate-400 uppercase tracking-wider">{{ formatLoginTime(entry.at) }}<span v-if="entry.ip"> · {{ entry.ip }}</span></p>
              </div>
              <span v-if="idx === 0" class="text-[8px] font-black text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-1.5 py-0.5 rounded shrink-0 uppercase tracking-widest">Actual</span>
            </div>
          </div>
          <div v-else class="flex flex-col items-center justify-center py-12 gap-2">
            <i class="fas fa-clock-rotate-left text-slate-200 dark:text-slate-700 text-2xl"></i>
            <p class="text-[11px] text-slate-400 font-medium text-center">Sin accesos registrados aún.</p>
          </div>
        </div>

      </div>
    </div>

    <!-- ── Modal foto ── -->
    <div v-if="showPhotoUploader" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50" @click.self="showPhotoUploader = false">
      <div class="bg-white dark:bg-[#1e293b] rounded-xl shadow-2xl w-full max-w-sm overflow-hidden">
        <div class="px-5 py-3.5 border-b border-slate-100 dark:border-[#334155] flex items-center justify-between">
          <h3 class="text-[13px] font-black text-slate-800 dark:text-slate-100">Foto de perfil</h3>
          <button class="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-[#273449] transition-colors" @click="showPhotoUploader = false">
            <i class="fas fa-times text-[11px]"></i>
          </button>
        </div>
        <div class="p-5">
          <ProfilePhotoUploader :current-photo="profileData.photo" @update="handlePhotoUpdate" />
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useThemeStore } from '@/stores/theme'
import { useLocaleStore } from '@/stores/localeStore'
import { usePushNotifications } from '@/composables/usePushNotifications'
import { userService } from '@/services/userService'
import { AvatarService } from '@/services/avatarService'
import { useNotifications } from '@/composables/useNotifications'
import ProfilePhotoUploader from '@/components/ProfilePhotoUploader.vue'
import UserAvatar from '@/components/ui/UserAvatar.vue'
import { getDefaultAvatar } from '@/utils/avatarConfig'
import { API_CONFIG } from '@/config/api'

const authStore = useAuthStore()
const themeStore = useThemeStore()
const localeStore = useLocaleStore()
const { showSuccess, showError } = useNotifications()
const { isSupported: pushSupported, permission: pushPermission, requestPermission, notify } = usePushNotifications()

// ── Tabs ──────────────────────────────────────────────────────────
const TABS = [
  { id: 'datos',        label: 'Datos personales', icon: 'fa-id-card' },
  { id: 'seguridad',    label: 'Contraseña',        icon: 'fa-shield-alt' },
  { id: '2fa',          label: 'Autenticación 2FA', icon: 'fa-mobile-screen-button' },
  { id: 'preferencias', label: 'Preferencias',      icon: 'fa-sliders' },
  { id: 'actividad',    label: 'Mi actividad',       icon: 'fa-clock-rotate-left' },
] as const
type TabId = typeof TABS[number]['id']
const activeTab = ref<TabId>('datos')

// ── Data fields config ────────────────────────────────────────────
const dataFields = [
  { key: 'name',       label: 'Nombre completo',    icon: 'fa-user',        type: 'text',  placeholder: 'Tu nombre' },
  { key: 'email',      label: 'Correo electrónico', icon: 'fa-envelope',    type: 'email', placeholder: 'tu@email.com' },
  { key: 'phone',      label: 'Teléfono',           icon: 'fa-phone',       type: 'tel',   placeholder: '+57 300 000 0000' },
  { key: 'department', label: 'Departamento',       icon: 'fa-building',    type: 'text',  placeholder: '' },
]
const pwFields = [
  { key: 'currentPassword', label: 'Contraseña actual',        show: 'current' },
  { key: 'newPassword',     label: 'Nueva contraseña',         show: 'new' },
  { key: 'confirmPassword', label: 'Confirmar nueva contraseña', show: 'confirm' },
]

// ── Department picker ─────────────────────────────────────────────
const DEPT_STORAGE_KEY = 'gems-custom-departments'
const DEFAULT_DEPARTMENTS = ['TI', 'Comercial', 'Marketing', 'Customer Success']
const customDepartments = ref<string[]>(JSON.parse(localStorage.getItem(DEPT_STORAGE_KEY) || '[]'))
const allProfileDepartments = computed(() => [...new Set([...DEFAULT_DEPARTMENTS, ...customDepartments.value])])
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

// ── State ─────────────────────────────────────────────────────────
const loading = ref(false)
const isEditing = ref(false)
const showPhotoUploader = ref(false)
const photoErrored = ref(false)

const profileData = ref({
  name: '', email: '', role: '', phone: '', department: '',
  timezone: 'America/Bogota', avatar: null as string | null, photo: null as string | null,
  createdAt: '', updatedAt: '',
  isTwoFactorEnabled: false,
  loginHistory: [] as Array<{ at: string; ip?: string; userAgent?: string }>
})

const editForm = ref({ name: '', email: '', phone: '', department: '', timezone: 'America/Bogota' })

const TIMEZONES = [
  { value: 'America/Bogota',                   label: 'Bogotá / Lima / Quito (GMT-5)' },
  { value: 'America/Mexico_City',              label: 'Ciudad de México (GMT-6)' },
  { value: 'America/Argentina/Buenos_Aires',   label: 'Buenos Aires (GMT-3)' },
  { value: 'America/Santiago',                 label: 'Santiago (GMT-3/-4)' },
  { value: 'America/Caracas',                  label: 'Caracas (GMT-4)' },
  { value: 'America/New_York',                 label: 'Nueva York (GMT-5/-4)' },
  { value: 'Europe/Madrid',                    label: 'Madrid (GMT+1/+2)' },
  { value: 'UTC',                              label: 'UTC' },
]

const prefs = ref({ language: 'es' as 'es' | 'en', pushNotifications: true })
const savingPrefs = ref(false)
const passwordForm = ref({ currentPassword: '', newPassword: '', confirmPassword: '' })
const showPwd = ref({ current: false, new: false, confirm: false })
const setup2FAData = ref<{ secret: string; qrCode: string } | null>(null)
const twoFactorCode = ref('')
const showDisable2FAForm = ref(false)
const disable2FAPassword = ref('')

// ── Computed ──────────────────────────────────────────────────────
const timezoneLabel = computed(() =>
  TIMEZONES.find(t => t.value === profileData.value.timezone)?.label || profileData.value.timezone || 'No especificada'
)

// ── Methods ───────────────────────────────────────────────────────
const getRoleDisplayName = (role: string) => ({
  admin: 'Administrador', supervisor: 'Supervisor', collaborator: 'Colaborador',
  support: 'Soporte', viewer: 'Consultor', client: 'Cliente'
}[role] || role || 'Miembro')

const togglePhotoUploader = () => { showPhotoUploader.value = !showPhotoUploader.value }

const handlePhotoUpdate = (data: { photo: string | null, avatar: string | null }) => {
  profileData.value.photo = data.photo
  profileData.value.avatar = data.avatar
  authStore.updateUserProfile({ photo: data.photo, avatar: data.avatar } as any)
  showPhotoUploader.value = false
  photoErrored.value = false
  showSuccess('Foto actualizada correctamente')
}

const formatDate = (dateString: string) => {
  if (!dateString) return '...'
  try { return new Date(dateString).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' }) }
  catch { return '---' }
}

const toggleEditMode = () => {
  if (!profileData.value) return
  editForm.value = { name: profileData.value.name, email: profileData.value.email, phone: profileData.value.phone, department: profileData.value.department, timezone: profileData.value.timezone || 'America/Bogota' }
  isEditing.value = !isEditing.value
  if (isEditing.value) activeTab.value = 'datos'
}

const updateProfile = async () => {
  try {
    loading.value = true
    const result = await authStore.updateProfile(editForm.value)
    if (result.success) {
      Object.assign(profileData.value, editForm.value)
      authStore.updateUserProfile({ ...editForm.value } as any)
      isEditing.value = false
      showSuccess('Perfil actualizado correctamente')
    } else { showError(result.message || 'Error al actualizar el perfil') }
  } catch { showError('Error al actualizar el perfil') }
  finally { loading.value = false }
}

const handlePushToggle = async () => {
  if (!prefs.value.pushNotifications) return
  if (!pushSupported.value) { prefs.value.pushNotifications = false; showError('Notificaciones no soportadas', 'Tu navegador no las soporta.'); return }
  const result = await requestPermission()
  if (result === 'granted') { notify('GEMS Hub', { body: 'Notificaciones activadas.' }) }
  else { prefs.value.pushNotifications = false; showError('Permiso denegado', 'Actívalas en la configuración del navegador.') }
}

const savePreferences = async () => {
  savingPrefs.value = true
  try {
    await authStore.updateProfile({ name: profileData.value.name, email: profileData.value.email, preferences: { language: prefs.value.language, pushNotifications: prefs.value.pushNotifications } } as any)
    authStore.updateUserProfile({ preferences: { ...prefs.value } } as any)
    localeStore.setLocale(prefs.value.language)
    showSuccess('Preferencias guardadas')
  } catch { showError('No se pudieron guardar las preferencias') }
  finally { savingPrefs.value = false }
}

const toggleDarkMode = () => {
  themeStore.config.darkMode = !themeStore.config.darkMode
  themeStore.update({ darkMode: themeStore.config.darkMode })
}

const formatLoginEntry = (ua?: string) => {
  if (!ua) return 'Dispositivo desconocido'
  let device = /mobile|android|iphone/i.test(ua) ? 'Móvil' : /ipad|tablet/i.test(ua) ? 'Tablet' : 'Escritorio'
  let browser = /edg/i.test(ua) ? 'Edge' : /chrome/i.test(ua) ? 'Chrome' : /firefox/i.test(ua) ? 'Firefox' : /safari/i.test(ua) ? 'Safari' : 'Navegador'
  return `${device} · ${browser}`
}

const formatLoginTime = (at: string) => {
  try { return new Date(at).toLocaleString('es-CO', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) }
  catch { return '' }
}

const updatePassword = async () => {
  if (passwordForm.value.newPassword.length < 12) { showError('Mínimo 12 caracteres'); return }
  if (!/[A-Z]/.test(passwordForm.value.newPassword) || !/[0-9]/.test(passwordForm.value.newPassword)) { showError('Debe incluir mayúscula y número'); return }
  try {
    loading.value = true
    await userService.updatePassword({ currentPassword: passwordForm.value.currentPassword, newPassword: passwordForm.value.newPassword })
    passwordForm.value = { currentPassword: '', newPassword: '', confirmPassword: '' }
    showSuccess('Contraseña actualizada')
  } catch { showError('Error al cambiar la contraseña') }
  finally { loading.value = false }
}

const init2FASetup = async () => {
  try { loading.value = true; setup2FAData.value = await userService.setup2FA() }
  catch (e: any) { showError(e.message || 'Error iniciando 2FA') }
  finally { loading.value = false }
}

const confirm2FA = async () => {
  try {
    loading.value = true
    await userService.enable2FA(twoFactorCode.value)
    profileData.value.isTwoFactorEnabled = true
    setup2FAData.value = null; twoFactorCode.value = ''
    showSuccess('2FA activado')
  } catch (e: any) { showError(e.message || 'Código incorrecto') }
  finally { loading.value = false }
}

const disable2FA = async () => {
  try {
    loading.value = true
    await userService.disable2FA(disable2FAPassword.value)
    profileData.value.isTwoFactorEnabled = false
    showDisable2FAForm.value = false; disable2FAPassword.value = ''
    showSuccess('2FA desactivado')
  } catch (e: any) { showError(e.message || 'Error desactivando 2FA') }
  finally { loading.value = false }
}

const loadProfile = async () => {
  try {
    loading.value = true
    if (authStore.user) {
      profileData.value = {
        name: authStore.user.name || '', email: authStore.user.email || '', role: authStore.user.role || '',
        phone: (authStore.user as any).phone || '', department: authStore.user.department || '',
        avatar: (authStore.user as any).avatar || null, photo: (authStore.user as any).photo || null,
        createdAt: (authStore.user as any).createdAt || '', updatedAt: (authStore.user as any).updatedAt || '',
        isTwoFactorEnabled: (authStore.user as any).isTwoFactorEnabled || false, loginHistory: []
      }
    }
    try {
      const profile = await userService.getProfile()
      Object.assign(profileData.value, {
        name: profile.name || '', email: profile.email || '', role: profile.role || '',
        phone: profile.phone || '', department: profile.department || '', timezone: profile.timezone || 'America/Bogota',
        avatar: profile.avatar || null, photo: profile.photo || null,
        createdAt: profile.createdAt || '', updatedAt: profile.updatedAt || '',
        isTwoFactorEnabled: profile.isTwoFactorEnabled || false, loginHistory: profile.loginHistory || []
      })
      if (profile.preferences) { prefs.value = { language: profile.preferences.language || 'es', pushNotifications: profile.preferences.pushNotifications !== false }; localeStore.setLocale(prefs.value.language) }
      photoErrored.value = false
    } catch {}
    try {
      const avatarInfo = await AvatarService.getUserAvatar()
      if (avatarInfo) {
        profileData.value.avatar = avatarInfo.avatar
        profileData.value.photo = avatarInfo.photo
        if (authStore.user) { (authStore.user as any).avatar = avatarInfo.avatar; (authStore.user as any).photo = avatarInfo.photo; localStorage.setItem('user', JSON.stringify(authStore.user)) }
      }
    } catch {}
  } catch { showError('Error al cargar el perfil') }
  finally { loading.value = false }
}

onMounted(() => { loadProfile() })
</script>
