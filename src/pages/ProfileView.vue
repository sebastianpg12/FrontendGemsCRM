<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="bg-white dark:bg-[#1e293b] rounded-xl p-4 sm:p-8 dark:border-[#334155] shadow-sm transition-all duration-300">
      <div class="flex flex-col md:flex-row items-center gap-4 sm:gap-8">
        <!-- Profile Avatar -->
        <div class="relative group cursor-pointer shrink-0" @click="togglePhotoUploader" title="Cambiar foto de perfil">
          <UserAvatar
            :name="profileData?.name || 'U'"
            :photo="profileData?.photo || undefined"
            :avatar="profileData?.avatar || undefined"
            size="2xl"
            class="w-28 h-28 sm:w-44 sm:h-44 !rounded-full border-4 border-white dark:border-[#1e293b] shadow-xl ring-4 ring-primary-100/50 dark:ring-primary-500/20"
          />
          <!-- Overlay de cámara -->
          <div class="absolute inset-0 rounded-full bg-slate-900/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <i class="fas fa-camera text-white text-xl mb-1"></i>
            <span class="text-white text-[9px] font-black uppercase tracking-widest">Cambiar</span>
          </div>
        </div>
        
        <!-- Basic Info -->
        <div class="text-center md:text-left flex-1">
          <div class="flex flex-col md:flex-row md:items-center gap-2 mb-2">
            <h1 class="text-xl sm:text-3xl font-black text-slate-800 dark:text-slate-100 tracking-tight">{{ profileData?.name || 'Cargando...' }}</h1>
            <span class="inline-flex items-center px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-xs font-black uppercase tracking-widest border border-primary-100/50">
              {{ getRoleDisplayName(profileData?.role || '') }}
            </span>
          </div>
          <p class="text-slate-500 font-medium mb-4">{{ profileData?.email || '' }}</p>
          
          <div class="flex flex-wrap gap-3 justify-center md:justify-start">
            <span class="inline-flex items-center px-4 py-1.5 bg-emerald-50 text-emerald-700 rounded-xl text-xs font-bold border border-emerald-100">
              <i class="fas fa-check-circle mr-2"></i>
              Activo
            </span>
            <span class="inline-flex items-center px-4 py-1.5 bg-slate-50 text-slate-600 rounded-xl text-xs font-bold">
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
              'h-9 px-5 rounded-xl font-black text-xs uppercase tracking-widest transition-all duration-300 shadow-sm',
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
        <div class="bg-white dark:bg-[#1e293b] rounded-xl p-4 sm:p-8 dark:border-[#334155] shadow-sm h-full">
          <div class="flex items-center justify-between mb-4 sm:mb-8">
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
                  class="w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-[#334155] rounded-xl text-slate-700 dark:text-slate-200 font-bold focus:ring-4 focus:ring-primary-100 focus:border-primary-400 transition-all outline-none"
                  placeholder="Tu nombre completo"
                />
              </div>
              <div v-else class="px-5 py-4 bg-slate-50 dark:bg-[#0f172a] rounded-xl">
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
                  class="w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-[#334155] rounded-xl text-slate-700 dark:text-slate-200 font-bold focus:ring-4 focus:ring-primary-100 focus:border-primary-400 transition-all outline-none"
                  placeholder="tu@email.com"
                />
              </div>
              <div v-else class="px-5 py-4 bg-slate-50 dark:bg-[#0f172a] rounded-xl">
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
                  class="w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-[#334155] rounded-xl text-slate-700 dark:text-slate-200 font-bold focus:ring-4 focus:ring-primary-100 focus:border-primary-400 transition-all outline-none"
                  placeholder="+57 300 000 0000"
                />
              </div>
              <div v-else class="px-5 py-4 bg-slate-50 dark:bg-[#0f172a] rounded-xl">
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
                    class="flex-1 pl-4 pr-4 py-3.5 bg-slate-50 dark:bg-[#0f172a] border border-primary-200 dark:border-primary-500/40 rounded-xl text-slate-700 dark:text-slate-200 font-bold focus:ring-4 focus:ring-primary-100 transition-all outline-none"
                  />
                  <button type="button" @click="confirmProfileDept" :disabled="!profileNewDept.trim()"
                    class="px-4 bg-primary-500 hover:bg-primary-600 disabled:opacity-40 text-white rounded-xl text-xs font-black transition-all">
                    <i class="fas fa-check"></i>
                  </button>
                  <button type="button" @click="profileAddingDept = false; profileNewDept = ''"
                    class="px-4 bg-slate-100 dark:bg-[#334155] hover:bg-slate-200 text-slate-500 rounded-xl text-xs font-black transition-all">
                    <i class="fas fa-xmark"></i>
                  </button>
                </div>
                <!-- Normal select -->
                <div v-else class="relative group">
                  <i class="fas fa-building absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors z-10 pointer-events-none"></i>
                  <select
                    v-model="editForm.department"
                    class="w-full pl-12 pr-10 py-3.5 bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-[#334155] rounded-xl text-slate-700 dark:text-slate-200 font-bold focus:ring-4 focus:ring-primary-100 focus:border-primary-400 transition-all outline-none appearance-none"
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
              <div v-else class="px-5 py-4 bg-slate-50 dark:bg-[#0f172a] rounded-xl">
                <p class="text-slate-700 dark:text-slate-200 font-bold">{{ profileData?.department || 'No especificado' }}</p>
              </div>
            </div>

            <!-- Timezone -->
            <div class="space-y-2">
              <label class="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">
                Zona Horaria
              </label>
              <div v-if="isEditing" class="relative group">
                <i class="fas fa-globe absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors z-10 pointer-events-none"></i>
                <select
                  v-model="editForm.timezone"
                  class="w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-[#334155] rounded-xl text-slate-700 dark:text-slate-200 font-bold focus:ring-4 focus:ring-primary-100 focus:border-primary-400 transition-all outline-none appearance-none"
                >
                  <option v-for="tz in TIMEZONES" :key="tz.value" :value="tz.value">{{ tz.label }}</option>
                </select>
              </div>
              <div v-else class="px-5 py-4 bg-slate-50 dark:bg-[#0f172a] rounded-xl">
                <p class="text-slate-700 dark:text-slate-200 font-bold">{{ timezoneLabel }}</p>
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
              class="px-8 py-3.5 bg-primary-500 hover:bg-primary-600 text-white rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-primary-200 disabled:opacity-50"
            >
              <i class="fas fa-save mr-2"></i>
              {{ loading ? 'Guardando...' : 'Guardar Cambios' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Security / Password (Right Column) -->
      <div class="space-y-6">
        <div class="bg-white dark:bg-[#1e293b] rounded-xl p-8 dark:border-[#334155] shadow-sm">
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
              <div class="relative">
                <input
                  v-model="passwordForm.currentPassword"
                  :type="showPwd.current ? 'text' : 'password'"
                  class="w-full pl-4 pr-12 py-3.5 bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-[#334155] rounded-xl text-slate-700 dark:text-slate-200 font-bold focus:ring-4 focus:ring-primary-100 focus:border-primary-400 transition-all outline-none"
                  placeholder="••••••••"
                  required
                />
                <button type="button" @click="showPwd.current = !showPwd.current" class="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors" :title="showPwd.current ? 'Ocultar' : 'Mostrar'">
                  <i :class="showPwd.current ? 'fas fa-eye-slash' : 'fas fa-eye'" class="text-sm"></i>
                </button>
              </div>
            </div>

            <div class="space-y-2">
              <label class="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">
                Nueva Contraseña
              </label>
              <div class="relative">
                <input
                  v-model="passwordForm.newPassword"
                  :type="showPwd.new ? 'text' : 'password'"
                  class="w-full pl-4 pr-12 py-3.5 bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-[#334155] rounded-xl text-slate-700 dark:text-slate-200 font-bold focus:ring-4 focus:ring-primary-100 focus:border-primary-400 transition-all outline-none"
                  placeholder="••••••••"
                  required
                />
                <button type="button" @click="showPwd.new = !showPwd.new" class="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors" :title="showPwd.new ? 'Ocultar' : 'Mostrar'">
                  <i :class="showPwd.new ? 'fas fa-eye-slash' : 'fas fa-eye'" class="text-sm"></i>
                </button>
              </div>
            </div>

            <div class="space-y-2">
              <label class="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">
                Confirmar Nueva Contraseña
              </label>
              <div class="relative">
                <input
                  v-model="passwordForm.confirmPassword"
                  :type="showPwd.confirm ? 'text' : 'password'"
                  class="w-full pl-4 pr-12 py-3.5 bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-[#334155] rounded-xl text-slate-700 dark:text-slate-200 font-bold focus:ring-4 focus:ring-primary-100 focus:border-primary-400 transition-all outline-none"
                  placeholder="••••••••"
                  required
                />
                <button type="button" @click="showPwd.confirm = !showPwd.confirm" class="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors" :title="showPwd.confirm ? 'Ocultar' : 'Mostrar'">
                  <i :class="showPwd.confirm ? 'fas fa-eye-slash' : 'fas fa-eye'" class="text-sm"></i>
                </button>
              </div>
              <p v-if="passwordForm.confirmPassword && passwordForm.newPassword !== passwordForm.confirmPassword" class="text-[10px] font-bold text-rose-500 ml-1">
                <i class="fas fa-circle-exclamation mr-1"></i>Las contraseñas no coinciden
              </p>
            </div>
            
            <button
              type="submit"
              :disabled="loading || !passwordForm.currentPassword || !passwordForm.newPassword || passwordForm.newPassword !== passwordForm.confirmPassword"
              class="w-full mt-4 px-6 py-4 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-lg disabled:opacity-50"
            >
              <i class="fas fa-key mr-2"></i>
              {{ loading ? 'Actualizando...' : 'Actualizar Contraseña' }}
            </button>
          </form>
        </div>

        <!-- 2FA Section -->
        <div class="bg-white dark:bg-[#1e293b] rounded-xl p-8 dark:border-[#334155] shadow-sm">
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
              class="w-full px-6 py-4 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-lg disabled:opacity-50"
            >
              <i class="fas fa-shield-halved mr-2"></i>
              Configurar 2FA
            </button>
          </div>

          <div v-if="setup2FAData && !profileData.isTwoFactorEnabled" class="space-y-6">
            <div class="bg-slate-50 dark:bg-[#0f172a] rounded-xl p-4 text-center">
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
                class="w-full px-4 py-3.5 bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-[#334155] rounded-xl text-center text-2xl font-mono tracking-[0.5em] text-slate-700 dark:text-slate-200 focus:ring-4 focus:ring-indigo-100 focus:border-indigo-400 transition-all outline-none"
              />
            </div>
            
            <div class="flex gap-3">
              <button
                @click="setup2FAData = null; twoFactorCode = ''"
                class="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl font-black text-xs uppercase tracking-widest transition-all"
              >
                Cancelar
              </button>
              <button
                @click="confirm2FA"
                :disabled="loading || twoFactorCode.length !== 6"
                class="flex-1 py-3 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-lg disabled:opacity-50"
              >
                Activar
              </button>
            </div>
          </div>

          <div v-if="profileData.isTwoFactorEnabled" class="space-y-4">
            <div class="flex items-center gap-3 p-4 bg-emerald-50 rounded-xl border border-emerald-100">
              <i class="fas fa-shield-check text-emerald-500 text-xl"></i>
              <div>
                <p class="text-sm font-bold text-emerald-800">2FA Activado</p>
                <p class="text-xs text-emerald-600">Tu cuenta está protegida.</p>
              </div>
            </div>
            
            <div v-if="!showDisable2FAForm" class="pt-2">
               <button
                 @click="showDisable2FAForm = true"
                 class="w-full px-6 py-3.5 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all"
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
                  class="w-full px-4 py-3.5 bg-rose-50/30 border border-rose-200 rounded-xl text-slate-700 focus:ring-4 focus:ring-rose-100 transition-all outline-none"
                />
              </div>
              <div class="flex gap-3">
                <button
                  @click="showDisable2FAForm = false; disable2FAPassword = ''"
                  class="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all"
                >
                  Cancelar
                </button>
                <button
                  @click="disable2FA"
                  :disabled="loading || !disable2FAPassword"
                  class="flex-1 py-3 bg-rose-500 hover:bg-rose-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest transition-all disabled:opacity-50"
                >
                  Confirmar Desactivación
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Preferencias -->
        <div class="bg-white dark:bg-[#1e293b] rounded-xl p-8 dark:border-[#334155] shadow-sm">
          <h2 class="text-xl font-black text-slate-800 dark:text-slate-100 mb-6 flex items-center">
            <div class="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center mr-4">
              <i class="fas fa-sliders text-primary-500"></i>
            </div>
            Preferencias
          </h2>

          <div class="space-y-4">
            <!-- Tema -->
            <div class="flex items-center justify-between gap-3">
              <div>
                <p class="text-[13px] font-black text-slate-700 dark:text-slate-200">Modo oscuro</p>
                <p class="text-[10px] font-medium text-slate-400 mt-0.5">Tema oscuro de la interfaz</p>
              </div>
              <button type="button" @click="toggleDarkMode"
                class="relative w-11 h-6 rounded-full transition-colors duration-200 shrink-0"
                :class="themeStore.config.darkMode ? 'bg-primary-600' : 'bg-slate-200'">
                <span class="absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200"
                  :class="themeStore.config.darkMode ? 'translate-x-5' : 'translate-x-0'"></span>
              </button>
            </div>

            <!-- Idioma -->
            <div class="flex items-center justify-between gap-3 pt-4 border-t border-slate-100 dark:border-[#334155]">
              <div>
                <p class="text-[13px] font-black text-slate-700 dark:text-slate-200">Idioma</p>
                <p class="text-[10px] font-medium text-slate-400 mt-0.5">Idioma de la interfaz</p>
              </div>
              <div class="flex bg-slate-100 dark:bg-[#0f172a] rounded-lg p-0.5">
                <button type="button" @click="prefs.language = 'es'"
                  class="px-3 h-7 rounded-md text-[11px] font-bold transition-all"
                  :class="prefs.language === 'es' ? 'bg-white dark:bg-[#1e293b] text-primary-600 dark:text-primary-300 shadow-sm' : 'text-slate-500'">ES</button>
                <button type="button" @click="prefs.language = 'en'"
                  class="px-3 h-7 rounded-md text-[11px] font-bold transition-all"
                  :class="prefs.language === 'en' ? 'bg-white dark:bg-[#1e293b] text-primary-600 dark:text-primary-300 shadow-sm' : 'text-slate-500'">EN</button>
              </div>
            </div>

            <!-- Notificaciones push -->
            <div class="flex items-center justify-between gap-3 pt-4 border-t border-slate-100 dark:border-[#334155]">
              <div>
                <p class="text-[13px] font-black text-slate-700 dark:text-slate-200">Notificaciones push</p>
                <p class="text-[10px] font-medium text-slate-400 mt-0.5">Avisos de actividad y menciones</p>
              </div>
              <button type="button" @click="prefs.pushNotifications = !prefs.pushNotifications; handlePushToggle()"
                class="relative w-11 h-6 rounded-full transition-colors duration-200 shrink-0"
                :class="prefs.pushNotifications ? 'bg-primary-600' : 'bg-slate-200'">
                <span class="absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200"
                  :class="prefs.pushNotifications ? 'translate-x-5' : 'translate-x-0'"></span>
              </button>
            </div>

            <button
              @click="savePreferences"
              :disabled="savingPrefs"
              class="w-full mt-2 px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-primary-200 disabled:opacity-50"
            >
              <i class="fas mr-2" :class="savingPrefs ? 'fa-circle-notch fa-spin' : 'fa-check'"></i>
              {{ savingPrefs ? 'Guardando...' : 'Guardar preferencias' }}
            </button>
          </div>
        </div>

        <!-- Mi actividad -->
        <div class="bg-white dark:bg-[#1e293b] rounded-xl p-8 dark:border-[#334155] shadow-sm">
          <h2 class="text-xl font-black text-slate-800 dark:text-slate-100 mb-6 flex items-center">
            <div class="w-10 h-10 bg-slate-50 dark:bg-[#0f172a] rounded-xl flex items-center justify-center mr-4">
              <i class="fas fa-clock-rotate-left text-slate-500"></i>
            </div>
            Mi actividad
          </h2>
          <div v-if="profileData.loginHistory?.length" class="space-y-2">
            <div
              v-for="(entry, idx) in profileData.loginHistory"
              :key="idx"
              class="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-[#0f172a]"
            >
              <div class="w-8 h-8 rounded-lg bg-white dark:bg-[#1e293b] flex items-center justify-center text-slate-400 shrink-0">
                <i class="fas fa-right-to-bracket text-[11px]"></i>
              </div>
              <div class="min-w-0 flex-1">
                <p class="text-[11px] font-black text-slate-700 dark:text-slate-200 truncate">{{ formatLoginEntry(entry.userAgent) }}</p>
                <p class="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{{ formatLoginTime(entry.at) }}<span v-if="entry.ip"> · {{ entry.ip }}</span></p>
              </div>
              <span v-if="idx === 0" class="text-[8px] font-black text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 px-1.5 py-0.5 rounded uppercase tracking-widest shrink-0">Actual</span>
            </div>
          </div>
          <p v-else class="text-[11px] font-medium text-slate-400 text-center py-4">
            Aún no hay accesos registrados. Aparecerán la próxima vez que inicies sesión.
          </p>
        </div>
      </div>
    </div>

    <!-- Modal de foto de perfil (sin blur) -->
    <div v-if="showPhotoUploader" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50" @click.self="showPhotoUploader = false">
      <div class="bg-white dark:bg-[#1e293b] rounded-xl shadow-2xl w-full max-w-sm max-h-[90vh] overflow-y-auto">
        <div class="px-5 py-4 border-b border-slate-100 dark:border-[#334155] flex items-center justify-between">
          <h3 class="text-[15px] font-black text-slate-800 dark:text-slate-100 tracking-tight">Foto de perfil</h3>
          <button class="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-[#273449] transition-colors" @click="showPhotoUploader = false">
            <i class="fas fa-times text-[12px]"></i>
          </button>
        </div>
        <div class="p-5">
          <ProfilePhotoUploader
            :current-photo="profileData.photo"
            @update="handlePhotoUpdate"
          />
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
import AvatarSelector from '@/components/AvatarSelector.vue'
import ProfilePhotoUploader from '@/components/ProfilePhotoUploader.vue'
import { getAvatarById, getDefaultAvatar } from '@/utils/avatarConfig'
import { API_CONFIG } from '@/config/api'

const authStore = useAuthStore()
const themeStore = useThemeStore()
const localeStore = useLocaleStore()
const { showSuccess, showError } = useNotifications()
const { isSupported: pushSupported, permission: pushPermission, requestPermission, notify } = usePushNotifications()

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
  timezone: 'America/Bogota',
  avatar: null as string | null,
  photo: null as string | null,
  createdAt: '',
  updatedAt: '',
  loginHistory: [] as Array<{ at: string; ip?: string; userAgent?: string }>
})

const editForm = ref({
  name: '',
  email: '',
  phone: '',
  department: '',
  timezone: 'America/Bogota'
})

const TIMEZONES = [
  { value: 'America/Bogota', label: 'Bogotá / Lima / Quito (GMT-5)' },
  { value: 'America/Mexico_City', label: 'Ciudad de México (GMT-6)' },
  { value: 'America/Argentina/Buenos_Aires', label: 'Buenos Aires (GMT-3)' },
  { value: 'America/Santiago', label: 'Santiago (GMT-3/-4)' },
  { value: 'America/Caracas', label: 'Caracas (GMT-4)' },
  { value: 'America/New_York', label: 'Nueva York (GMT-5/-4)' },
  { value: 'Europe/Madrid', label: 'Madrid (GMT+1/+2)' },
  { value: 'UTC', label: 'UTC' }
]

// Preferencias (tema vive en el theme store; idioma y push se guardan en el usuario)
const prefs = ref({ language: 'es' as 'es' | 'en', pushNotifications: true })
const savingPrefs = ref(false)

const passwordForm = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const showPwd = ref({ current: false, new: false, confirm: false })

// 2FA state
const setup2FAData = ref<{ secret: string; qrCode: string } | null>(null)
const twoFactorCode = ref('')
const showDisable2FAForm = ref(false)
const disable2FAPassword = ref('')

// Computed
const timezoneLabel = computed(() =>
  TIMEZONES.find(t => t.value === profileData.value.timezone)?.label || profileData.value.timezone || 'No especificada'
)

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

  // Propaga al store → navbar, sidebar, chat y equipo se actualizan sin recargar
  authStore.updateUserProfile({ photo: data.photo, avatar: data.avatar } as any)

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
  
  editForm.value = {
    name: profileData.value.name || '',
    email: profileData.value.email || '',
    phone: profileData.value.phone || '',
    department: profileData.value.department || '',
    timezone: profileData.value.timezone || 'America/Bogota'
  }
  isEditing.value = !isEditing.value
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
    } else {
      showError(result.message || 'Error al actualizar el perfil')
    }
  } catch (error) {
    showError('Error al actualizar el perfil')
  } finally {
    loading.value = false
  }
}

const handlePushToggle = async () => {
  if (!prefs.value.pushNotifications) return
  if (!pushSupported.value) {
    prefs.value.pushNotifications = false
    showError('Notificaciones no soportadas', 'Tu navegador no soporta notificaciones push.')
    return
  }
  const result = await requestPermission()
  if (result === 'granted') {
    notify('GEMS Hub', { body: 'Notificaciones activadas correctamente.' })
  } else {
    prefs.value.pushNotifications = false
    showError('Permiso denegado', 'Debes permitir notificaciones en la configuración del navegador.')
  }
}

const savePreferences = async () => {
  savingPrefs.value = true
  try {
    await authStore.updateProfile({
      name: profileData.value.name,
      email: profileData.value.email,
      preferences: { language: prefs.value.language, pushNotifications: prefs.value.pushNotifications }
    } as any)
    authStore.updateUserProfile({ preferences: { ...prefs.value } } as any)
    localeStore.setLocale(prefs.value.language)
    showSuccess('Preferencias guardadas')
  } catch {
    showError('No se pudieron guardar las preferencias')
  } finally {
    savingPrefs.value = false
  }
}

const toggleDarkMode = () => {
  themeStore.config.darkMode = !themeStore.config.darkMode
  themeStore.update({ darkMode: themeStore.config.darkMode })
}

const formatLoginEntry = (ua?: string) => {
  if (!ua) return 'Dispositivo desconocido'
  let device = 'Escritorio'
  if (/mobile|android|iphone/i.test(ua)) device = 'Móvil'
  else if (/ipad|tablet/i.test(ua)) device = 'Tablet'
  let browser = 'Navegador'
  if (/edg/i.test(ua)) browser = 'Edge'
  else if (/chrome/i.test(ua)) browser = 'Chrome'
  else if (/firefox/i.test(ua)) browser = 'Firefox'
  else if (/safari/i.test(ua)) browser = 'Safari'
  return `${device} · ${browser}`
}

const formatLoginTime = (at: string) => {
  try {
    return new Date(at).toLocaleString('es-CO', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
  } catch { return '' }
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
        timezone: profile.timezone || 'America/Bogota',
        avatar: profile.avatar || null,
        photo: profile.photo || null,
        createdAt: profile.createdAt || '',
        updatedAt: profile.updatedAt || '',
        isTwoFactorEnabled: profile.isTwoFactorEnabled || false,
        loginHistory: profile.loginHistory || []
      }
      if (profile.preferences) {
        prefs.value = {
          language: profile.preferences.language || 'es',
          pushNotifications: profile.preferences.pushNotifications !== false
        }
        localeStore.setLocale(prefs.value.language)
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
