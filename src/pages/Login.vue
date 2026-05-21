<template>
  <div class="min-h-screen flex bg-white font-['Inter',sans-serif] overflow-hidden">

    <!-- Left Side: Galactic GEMS Branding -->
    <div class="hidden lg:flex w-[58%] relative overflow-hidden" style="background: #06090f;">

      <!-- Nebula glow layers -->
      <div class="absolute inset-0 pointer-events-none">
        <div class="absolute inset-0" style="background: radial-gradient(ellipse 70% 50% at 20% 40%, rgba(139,92,246,0.18) 0%, transparent 65%)"></div>
        <div class="absolute inset-0" style="background: radial-gradient(ellipse 55% 65% at 80% 65%, rgba(99,102,241,0.14) 0%, transparent 65%)"></div>
        <div class="absolute inset-0" style="background: radial-gradient(ellipse 45% 55% at 55% 90%, rgba(168,85,247,0.09) 0%, transparent 60%)"></div>
        <div class="absolute inset-0" style="background: radial-gradient(ellipse 35% 35% at 65% 15%, rgba(245,158,11,0.06) 0%, transparent 55%)"></div>
      </div>

      <!-- Star field -->
      <div
        v-for="star in stars"
        :key="'s' + star.id"
        class="absolute rounded-full bg-white animate-twinkle"
        :style="{
          left: star.x + '%',
          top: star.y + '%',
          width: star.size + 'px',
          height: star.size + 'px',
          opacity: star.opacity,
          animationDuration: star.dur + 's',
          animationDelay: star.delay + 's'
        }"
      ></div>

      <!-- Floating gem particles -->
      <div
        v-for="gem in floatingGems"
        :key="'g' + gem.id"
        class="absolute text-primary-400 animate-float pointer-events-none"
        :style="{
          left: gem.x + '%',
          top: gem.y + '%',
          fontSize: gem.size + 'px',
          opacity: gem.opacity,
          animationDuration: gem.dur + 's',
          animationDelay: gem.delay + 's'
        }"
      >
        <i class="fas fa-gem"></i>
      </div>

      <!-- Center content -->
      <div class="relative z-10 flex flex-col items-center justify-center w-full h-full px-16 text-center">
        <!-- Logo -->
        <div class="mb-6 relative">
          <div class="absolute inset-0 blur-3xl opacity-40" style="background: radial-gradient(circle, rgba(139,92,246,0.8) 0%, transparent 70%);"></div>
          <img src="/gems-logo.png" alt="GEMS CRM" class="relative h-24 w-auto drop-shadow-2xl" />
        </div>

        <!-- Title -->
        <h1 class="text-white text-5xl font-black leading-none tracking-tight mb-3">
          GEMS <span class="text-primary-400">CRM</span>
        </h1>
        <p class="text-white/40 text-[10px] font-black uppercase tracking-[0.4em] mb-14">
          Galactic Intelligence Suite
        </p>

        <!-- Feature list -->
        <div class="flex flex-col gap-2.5 w-full max-w-[280px]">
          <div
            v-for="feat in features"
            :key="feat.label"
            class="flex items-center gap-3.5 rounded-2xl px-5 py-3 border border-white/8 backdrop-blur-sm"
            style="background: rgba(255,255,255,0.04);"
          >
            <i :class="feat.icon" class="text-primary-400 text-xs w-4 text-center"></i>
            <span class="text-white/65 text-xs font-semibold">{{ feat.label }}</span>
          </div>
        </div>
      </div>

      <!-- Bottom copyright -->
      <div class="absolute bottom-7 left-0 right-0 text-center text-white/20 text-[9px] font-medium uppercase tracking-[0.2em]">
        © {{ currentYear }} GEMS Innovations · crm.gemsinnovations.com
      </div>
    </div>

    <!-- Right Side: Login Form -->
    <div class="w-full lg:w-[42%] flex items-center justify-center p-4 sm:p-6 lg:p-10 relative bg-white overflow-y-auto">
      <div class="w-full max-w-[460px] animate-fade-in py-4 flex flex-col justify-center min-h-full">

        <!-- Login Card -->
        <div class="bg-white p-8 sm:p-10 lg:p-12 rounded-[2.5rem] border border-slate-100 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.09)] relative overflow-hidden my-auto">

          <!-- Subtle top glow -->
          <div class="absolute -top-20 -right-20 w-48 h-48 rounded-full pointer-events-none" style="background: radial-gradient(circle, rgba(139,92,246,0.07) 0%, transparent 70%);"></div>

          <!-- Logo & Header -->
          <div class="flex flex-col items-center mb-8 relative z-10">
            <div class="flex items-center justify-center h-16 overflow-hidden mb-3">
              <img :src="themeLogo" alt="GEMS CRM" class="h-20 w-auto object-contain" />
            </div>
            <div class="flex items-center gap-3">
              <div class="h-px w-6 bg-slate-100"></div>
              <p class="text-slate-400 text-[9px] font-black uppercase tracking-[0.35em]">Portal de Acceso</p>
              <div class="h-px w-6 bg-slate-100"></div>
            </div>
          </div>

          <!-- Error message -->
          <div v-if="error" class="mb-6 p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-start gap-3 animate-shake relative z-10">
            <i class="fas fa-circle-exclamation text-rose-500 shrink-0 mt-0.5 text-sm"></i>
            <p class="text-[11px] font-bold text-rose-600 leading-tight">{{ error }}</p>
          </div>

          <!-- Form -->
          <form @submit.prevent="handleLogin" class="space-y-4 relative z-10">
            <!-- Email -->
            <div class="relative group">
              <div class="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary-500 transition-colors duration-300">
                <i class="far fa-envelope text-sm"></i>
              </div>
              <input
                v-model="credentials.email"
                type="email"
                required
                placeholder="usuario@email.com"
                class="w-full bg-slate-50/60 border border-slate-100 rounded-2xl py-4 pl-14 pr-6 text-sm font-semibold focus:ring-4 focus:ring-primary-500/8 focus:border-primary-400 focus:bg-white outline-none transition-all duration-300 text-slate-800 placeholder:text-slate-300 placeholder:font-medium"
              />
            </div>

            <!-- Password -->
            <div class="relative group">
              <div class="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary-500 transition-colors duration-300">
                <i class="far fa-lock text-sm"></i>
              </div>
              <input
                v-model="credentials.password"
                :type="showPassword ? 'text' : 'password'"
                required
                placeholder="••••••••••"
                class="w-full bg-slate-50/60 border border-slate-100 rounded-2xl py-4 pl-14 pr-14 text-sm font-semibold focus:ring-4 focus:ring-primary-500/8 focus:border-primary-400 focus:bg-white outline-none transition-all duration-300 text-slate-800 placeholder:text-slate-300 placeholder:font-medium"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500 transition-colors p-1"
              >
                <i :class="showPassword ? 'far fa-eye-slash' : 'far fa-eye'" class="text-sm"></i>
              </button>
            </div>

            <!-- Options row -->
            <div class="flex items-center justify-between px-1">
              <label class="flex items-center cursor-pointer group select-none gap-2">
                <div class="relative">
                  <input
                    type="checkbox"
                    v-model="rememberMe"
                    class="peer appearance-none w-4 h-4 rounded-md border-2 border-slate-200 checked:bg-primary-500 checked:border-primary-500 transition-all cursor-pointer"
                  />
                  <i class="fas fa-check absolute inset-0 flex items-center justify-center text-[8px] text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none"></i>
                </div>
                <span class="text-[11px] font-bold text-slate-400 group-hover:text-slate-600 transition-colors">Recordarme</span>
              </label>
              <button
                type="button"
                @click="showForgotPassword = true"
                class="text-[11px] font-bold text-slate-400 hover:text-primary-500 transition-colors"
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>

            <!-- Submit -->
            <button
              type="submit"
              :disabled="isLoading"
              class="w-full py-4 bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 text-white font-black rounded-2xl transition-all duration-300 shadow-[0_12px_24px_-8px_rgba(139,92,246,0.45)] hover:shadow-[0_16px_32px_-8px_rgba(139,92,246,0.55)] active:scale-[0.97] flex items-center justify-center gap-3 disabled:opacity-60 disabled:pointer-events-none mt-3 text-xs uppercase tracking-widest"
            >
              <i v-if="isLoading" class="fas fa-circle-notch fa-spin text-base"></i>
              <template v-else>
                <i class="fas fa-gem text-xs opacity-80"></i>
                Acceder al Sistema
              </template>
            </button>

            <!-- Footer -->
            <div class="pt-5 flex items-center justify-center gap-2 border-t border-slate-50 mt-1">
              <i class="fas fa-gem text-primary-400/40 text-[8px]"></i>
              <p class="text-[9px] font-black text-slate-300 uppercase tracking-[0.25em]">GEMS CRM · Galactic Intelligence</p>
              <i class="fas fa-gem text-primary-400/40 text-[8px]"></i>
            </div>
          </form>
        </div>

        <!-- Mobile footer -->
        <div class="lg:hidden mt-8 text-center text-slate-400 text-[10px] font-black uppercase tracking-[0.3em]">
          © {{ currentYear }} GEMS CRM
        </div>
      </div>
    </div>

    <!-- Modal: Forgot Password -->
    <div v-if="showForgotPassword" class="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
      <div class="bg-white rounded-[2rem] shadow-2xl border border-slate-100 max-w-md w-full mx-4 p-8 animate-fade-in">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-xl font-bold text-slate-800">Restablecer Contraseña</h3>
          <button @click="showForgotPassword = false" class="text-slate-400 hover:text-slate-600 transition-colors">
            <i class="fas fa-times text-lg"></i>
          </button>
        </div>
        <form @submit.prevent="handleForgotPassword" class="space-y-6">
          <div>
            <label class="block text-sm font-medium text-slate-600 mb-2">Correo Electrónico</label>
            <input
              v-model="forgotPasswordEmail"
              type="email"
              required
              class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all outline-none"
              placeholder="tu@email.com"
            />
          </div>
          <div class="flex gap-3">
            <button
              type="button"
              @click="showForgotPassword = false"
              class="flex-1 py-3 px-4 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              :disabled="forgotPasswordLoading"
              class="flex-1 py-3 px-4 bg-primary-500 text-white font-bold rounded-xl hover:bg-primary-400 disabled:opacity-50 transition-all shadow-md shadow-primary-500/20"
            >
              {{ forgotPasswordLoading ? 'Enviando...' : 'Enviar' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useThemeStore } from '../stores/theme'
import { useNotifications } from '@/composables/useNotifications'

const router = useRouter()
const authStore = useAuthStore()
const themeStore = useThemeStore()
const { showSuccess } = useNotifications()

const credentials = ref({ email: '', password: '' })
const showPassword = ref(false)
const rememberMe = ref(false)
const emailError = ref('')
const passwordError = ref('')
const showForgotPassword = ref(false)
const forgotPasswordEmail = ref('')
const forgotPasswordLoading = ref(false)
const currentYear = new Date().getFullYear()

const themeLogo = computed(() => themeStore.config.logo || '/gems-logo.png')

const { isLoading, error } = authStore

// Galactic star field
const stars = Array.from({ length: 110 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 2 + 0.4,
  opacity: Math.random() * 0.65 + 0.15,
  dur: Math.random() * 4 + 2,
  delay: Math.random() * 5
}))

// Floating gem decorations
const floatingGems = Array.from({ length: 7 }, (_, i) => ({
  id: i,
  x: Math.random() * 85 + 5,
  y: Math.random() * 85 + 5,
  size: Math.random() * 14 + 7,
  opacity: Math.random() * 0.12 + 0.05,
  dur: Math.random() * 5 + 7,
  delay: Math.random() * 4
}))

const features = [
  { icon: 'fas fa-users', label: 'Gestión de clientes y contactos' },
  { icon: 'fas fa-tasks', label: 'Kanban y seguimiento de tareas' },
  { icon: 'fas fa-chart-line', label: 'Reportes y analíticas avanzadas' },
  { icon: 'fas fa-comments', label: 'Chat y colaboración en equipo' }
]

const isFormValid = computed(() =>
  credentials.value.email && credentials.value.password && !emailError.value
)

const handleLogin = async () => {
  if (!isFormValid.value) return
  const result = await authStore.login(credentials.value)
  if (result.success) {
    const redirectPath = authStore.user?.role === 'client' ? '/support' : '/'
    await router.push(redirectPath)
  }
}

const handleForgotPassword = async () => {
  if (!forgotPasswordEmail.value) return
  forgotPasswordLoading.value = true
  setTimeout(() => {
    forgotPasswordLoading.value = false
    showForgotPassword.value = false
    showSuccess('Se ha enviado un correo con las instrucciones.')
  }, 1500)
}

onMounted(async () => {
  themeStore.load()
  const isAuthenticated = await authStore.checkAuth()
  if (isAuthenticated) await router.push('/')
})
</script>
