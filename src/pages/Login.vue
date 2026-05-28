<template>
  <div class="min-h-screen flex items-center justify-center font-['Inter',sans-serif] overflow-hidden relative" style="background: #04060d;">

    <!-- ── Background: Nebula layers (accent-reactive) ── -->
    <div class="absolute inset-0 pointer-events-none overflow-hidden">
      <div class="absolute inset-0" :style="`background: radial-gradient(ellipse 80% 60% at 15% 35%, rgba(${accentRgb},0.22) 0%, transparent 60%);`"></div>
      <div class="absolute inset-0" :style="`background: radial-gradient(ellipse 60% 70% at 85% 70%, rgba(${accentRgb},0.13) 0%, transparent 60%);`"></div>
      <div class="absolute inset-0" :style="`background: radial-gradient(ellipse 50% 50% at 55% 95%, rgba(${accentRgb},0.10) 0%, transparent 55%);`"></div>
      <div class="absolute inset-0" style="background: radial-gradient(ellipse 40% 40% at 70% 10%, rgba(245,158,11,0.06) 0%, transparent 55%);"></div>
      <div class="absolute inset-0" style="background: radial-gradient(ellipse 30% 30% at 30% 80%, rgba(59,130,246,0.08) 0%, transparent 55%);"></div>
    </div>

    <!-- ── Subtle grid overlay ── -->
    <div class="absolute inset-0 pointer-events-none" :style="`background-image: linear-gradient(rgba(${accentRgb},0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(${accentRgb},0.03) 1px, transparent 1px); background-size: 48px 48px;`"></div>

    <!-- ── Star field ── -->
    <div
      v-for="star in stars"
      :key="'s' + star.id"
      class="absolute rounded-full bg-white animate-twinkle pointer-events-none"
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

    <!-- ── Floating gem particles ── -->
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

    <!-- ── Main card ── -->
    <div class="relative z-10 w-full max-w-[420px] mx-4 animate-fade-in">

      <!-- Logo + brand header (above card) -->
      <div class="flex flex-col items-center mb-8">
        <div class="relative mb-4">
          <div class="absolute inset-0 blur-2xl opacity-60 scale-110"
            :style="`background: radial-gradient(circle, rgba(${accentRgb},0.9) 0%, transparent 70%);`"></div>
          <img :src="themeLogo" :alt="brandName" class="relative h-16 w-auto drop-shadow-2xl" />
        </div>
        <h1 class="text-white text-2xl font-black tracking-tight leading-none mb-1"
          :style="`background: linear-gradient(135deg, var(--brand-accent), rgba(${accentRgb},0.65)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;`">
          {{ brandName }}
        </h1>
        <p class="text-white/30 text-[9px] font-black uppercase tracking-[0.45em]">Galactic Intelligence Suite</p>
      </div>

      <!-- Glass card -->
      <div class="login-card rounded-[2rem] p-8 sm:p-10 relative overflow-hidden">

        <!-- Card inner glow top -->
        <div class="absolute -top-24 -right-16 w-48 h-48 rounded-full pointer-events-none"
          :style="`background: radial-gradient(circle, rgba(${accentRgb},0.12) 0%, transparent 70%);`"></div>
        <div class="absolute -bottom-20 -left-16 w-40 h-40 rounded-full pointer-events-none"
          :style="`background: radial-gradient(circle, rgba(${accentRgb},0.08) 0%, transparent 70%);`"></div>

        <!-- Card header -->
        <div class="mb-7 relative z-10">
          <h2 class="text-white/90 text-lg font-bold mb-0.5">Bienvenido de vuelta</h2>
          <p class="text-white/35 text-[11px] font-medium">Ingresa tus credenciales para continuar</p>
        </div>

        <!-- Error message -->
        <div v-if="error" class="mb-5 p-3.5 rounded-xl flex items-start gap-2.5 relative z-10 animate-shake" style="background: rgba(239,68,68,0.12); border: 1px solid rgba(239,68,68,0.2);">
          <i class="fas fa-circle-exclamation text-rose-400 shrink-0 mt-0.5 text-sm"></i>
          <p class="text-[11px] font-bold text-rose-300 leading-tight">{{ error }}</p>
        </div>

        <!-- Form -->
        <form @submit.prevent="handleLogin" class="space-y-3.5 relative z-10">

          <!-- Email -->
          <div class="relative group">
            <div class="absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300"
                 :class="credentials.email ? 'text-primary-400' : 'text-white/25 group-focus-within:text-primary-400'">
              <i class="far fa-envelope text-sm"></i>
            </div>
            <input
              v-model="credentials.email"
              type="email"
              required
              placeholder="usuario@email.com"
              class="login-input w-full rounded-xl py-3.5 pl-11 pr-5 text-sm font-medium text-white placeholder:text-white/25 outline-none transition-all duration-300"
            />
          </div>

          <!-- Password -->
          <div class="relative group">
            <div class="absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300"
                 :class="credentials.password ? 'text-primary-400' : 'text-white/25 group-focus-within:text-primary-400'">
              <i class="far fa-lock text-sm"></i>
            </div>
            <input
              v-model="credentials.password"
              :type="showPassword ? 'text' : 'password'"
              required
              placeholder="••••••••••"
              class="login-input w-full rounded-xl py-3.5 pl-11 pr-12 text-sm font-medium text-white placeholder:text-white/25 outline-none transition-all duration-300"
            />
            <button
              type="button"
              @click="showPassword = !showPassword"
              class="absolute right-4 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/60 transition-colors p-1"
              tabindex="-1"
            >
              <i :class="showPassword ? 'far fa-eye-slash' : 'far fa-eye'" class="text-sm"></i>
            </button>
          </div>

          <!-- Options row -->
          <div class="flex items-center justify-between px-0.5 pt-0.5">
            <label class="flex items-center cursor-pointer group select-none gap-2">
              <div class="relative flex-shrink-0">
                <input
                  type="checkbox"
                  v-model="rememberMe"
                  class="peer appearance-none w-4 h-4 rounded-md cursor-pointer transition-all"
                  :style="rememberMe
                    ? `background: var(--brand-accent); border: 1.5px solid var(--brand-accent);`
                    : `border: 1.5px solid rgba(255,255,255,0.2); background: rgba(255,255,255,0.06);`"
                />
                <i class="fas fa-check absolute inset-0 flex items-center justify-center text-[7px] text-white pointer-events-none transition-opacity"
                   :class="rememberMe ? 'opacity-100' : 'opacity-0'"></i>
              </div>
              <span class="text-[11px] font-semibold text-white/35 group-hover:text-white/55 transition-colors">Recordarme</span>
            </label>
            <button
              type="button"
              @click="showForgotPassword = true"
              class="text-[11px] font-semibold text-primary-400/70 hover:text-primary-300 transition-colors"
            >
              ¿Olvidaste tu contraseña?
            </button>
          </div>

          <!-- Lockout warning -->
          <div v-if="loginLocked" class="flex items-center gap-2.5 rounded-xl px-4 py-3" style="background: rgba(239,68,68,0.10); border: 1px solid rgba(239,68,68,0.18);">
            <i class="fas fa-lock text-rose-400 text-sm flex-shrink-0"></i>
            <p class="text-[11px] font-bold text-rose-300">
              Demasiados intentos. Espera {{ Math.floor(lockoutSecondsLeft / 60) }}:{{ String(lockoutSecondsLeft % 60).padStart(2, '0') }} min
            </p>
          </div>

          <!-- Submit button -->
          <button
            type="submit"
            :disabled="isLoading || loginLocked"
            class="login-btn w-full py-3.5 text-white font-black rounded-xl transition-all duration-300 flex items-center justify-center gap-2.5 disabled:opacity-50 disabled:pointer-events-none mt-1 text-[11px] uppercase tracking-widest"
          >
            <i v-if="isLoading" class="fas fa-circle-notch fa-spin text-sm"></i>
            <template v-else>
              <i class="fas fa-gem text-xs opacity-75"></i>
              Acceder al Sistema
            </template>
          </button>

        </form>

        <!-- Card footer -->
        <div class="mt-7 pt-5 flex items-center justify-center gap-2 relative z-10" style="border-top: 1px solid rgba(255,255,255,0.06);">
          <i class="fas fa-gem text-primary-500/30 text-[7px]"></i>
          <p class="text-[9px] font-black text-white/20 uppercase tracking-[0.3em]">GEMS Hub · © {{ currentYear }}</p>
          <i class="fas fa-gem text-primary-500/30 text-[7px]"></i>
        </div>
      </div>
    </div>

    <!-- ── Modal: Forgot Password ── -->
    <div v-if="showForgotPassword" class="fixed inset-0 z-50 flex items-center justify-center" style="background: rgba(0,0,0,0.7); backdrop-filter: blur(8px);">
      <div class="login-card rounded-[2rem] max-w-md w-full mx-4 p-8 animate-fade-in">
        <div class="flex items-center justify-between mb-6">
          <div>
            <h3 class="text-white/90 text-lg font-bold mb-0.5">Restablecer Contraseña</h3>
            <p class="text-white/30 text-xs">Te enviaremos las instrucciones por correo</p>
          </div>
          <button
            @click="showForgotPassword = false"
            class="text-white/30 hover:text-white/60 transition-colors w-8 h-8 flex items-center justify-center rounded-lg"
            style="background: rgba(255,255,255,0.06);"
          >
            <i class="fas fa-times text-sm"></i>
          </button>
        </div>
        <form @submit.prevent="handleForgotPassword" class="space-y-4">
          <div class="relative">
            <div class="absolute left-4 top-1/2 -translate-y-1/2 text-white/25">
              <i class="far fa-envelope text-sm"></i>
            </div>
            <input
              v-model="forgotPasswordEmail"
              type="email"
              required
              class="login-input w-full rounded-xl py-3.5 pl-11 pr-5 text-sm font-medium text-white placeholder:text-white/25 outline-none transition-all duration-300"
              placeholder="tu@email.com"
            />
          </div>
          <div class="flex gap-3 pt-1">
            <button
              type="button"
              @click="showForgotPassword = false"
              class="flex-1 py-3 px-4 text-white/50 font-bold rounded-xl hover:text-white/70 transition-colors text-sm"
              style="background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.08);"
            >
              Cancelar
            </button>
            <button
              type="submit"
              :disabled="forgotPasswordLoading"
              class="login-btn flex-1 py-3 px-4 text-white font-bold rounded-xl disabled:opacity-50 transition-all text-sm"
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
import { ref, computed, onMounted, watch } from 'vue'
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

// El login es genérico — siempre branding GEMS Hub, sin theme de tenant.
const themeLogo = computed(() => '/gems-logo.png')
const brandName = computed(() => 'GEMS Hub')

// Comma-separated RGB for rgba() inline styles — reactive to accent changes
const accentRgb = ref('139, 92, 246')
const refreshAccentRgb = () => {
  const v = getComputedStyle(document.documentElement)
    .getPropertyValue('--brand-accent-rgb').trim()
  if (v) accentRgb.value = v
}
watch(() => themeStore.config.accentColor, refreshAccentRgb)

const { isLoading, error } = authStore

// ── Star field ──
const stars = Array.from({ length: 140 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 2 + 0.3,
  opacity: Math.random() * 0.6 + 0.1,
  dur: Math.random() * 4 + 2,
  delay: Math.random() * 6
}))

// ── Floating gem decorations ──
const floatingGems = Array.from({ length: 9 }, (_, i) => ({
  id: i,
  x: Math.random() * 90 + 5,
  y: Math.random() * 90 + 5,
  size: Math.random() * 12 + 6,
  opacity: Math.random() * 0.1 + 0.03,
  dur: Math.random() * 6 + 8,
  delay: Math.random() * 5
}))

const isFormValid = computed(() =>
  credentials.value.email && credentials.value.password && !emailError.value
)

// ── Rate limiting ──────────────────────────────────────────────────
const LOGIN_ATTEMPTS_KEY = 'gems_login_attempts'
const MAX_ATTEMPTS = 5
const LOCKOUT_MINUTES = 15

const loginLocked = ref(false)
const lockoutSecondsLeft = ref(0)
let lockoutTimer: ReturnType<typeof setInterval> | null = null

const getAttemptData = () => {
  try { return JSON.parse(localStorage.getItem(LOGIN_ATTEMPTS_KEY) || '{}') } catch { return {} }
}

const checkLockout = () => {
  const data = getAttemptData()
  if (!data.lockedUntil) return false
  const remaining = Math.ceil((data.lockedUntil - Date.now()) / 1000)
  if (remaining > 0) {
    loginLocked.value = true
    lockoutSecondsLeft.value = remaining
    if (!lockoutTimer) {
      lockoutTimer = setInterval(() => {
        lockoutSecondsLeft.value--
        if (lockoutSecondsLeft.value <= 0) {
          loginLocked.value = false
          clearInterval(lockoutTimer!)
          lockoutTimer = null
          localStorage.removeItem(LOGIN_ATTEMPTS_KEY)
        }
      }, 1000)
    }
    return true
  }
  return false
}

const recordFailedAttempt = () => {
  const data = getAttemptData()
  const attempts = (data.attempts || 0) + 1
  if (attempts >= MAX_ATTEMPTS) {
    localStorage.setItem(LOGIN_ATTEMPTS_KEY, JSON.stringify({
      attempts,
      lockedUntil: Date.now() + LOCKOUT_MINUTES * 60 * 1000
    }))
    checkLockout()
  } else {
    localStorage.setItem(LOGIN_ATTEMPTS_KEY, JSON.stringify({ attempts }))
  }
}

checkLockout()

const handleLogin = async () => {
  if (!isFormValid.value || loginLocked.value) return
  if (checkLockout()) return
  const result = await authStore.login(credentials.value)
  if (result.success) {
    localStorage.removeItem(LOGIN_ATTEMPTS_KEY)
    if (result.requiresOrgSelection) {
      await router.push('/select-org')
      return
    }
    // Cargar el branding de la org activa antes de entrar a la app
    try { await themeStore.load() } catch {}
    const redirectPath = authStore.user?.role === 'client' ? '/support' : '/'
    await router.push(redirectPath)
  } else {
    recordFailedAttempt()
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
  // En el login NO se carga el theme del tenant — siempre brand GEMS por defecto.
  themeStore.resetToGems()
  refreshAccentRgb()
  const isAuthenticated = await authStore.checkAuth()
  if (isAuthenticated) {
    if (authStore.requiresOrgSelection) {
      await router.push('/select-org')
    } else {
      try { await themeStore.load() } catch {}
      await router.push('/')
    }
  }
})
</script>

<style scoped>
/* ── Glass card ── */
.login-card {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  box-shadow:
    0 0 0 1px rgba(var(--brand-accent-rgb), 0.06),
    0 32px 64px -16px rgba(0, 0, 0, 0.6),
    0 0 80px -20px rgba(var(--brand-accent-rgb), 0.15),
    inset 0 1px 0 rgba(255, 255, 255, 0.07);
}

/* ── Glass inputs ── */
.login-input {
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.09);
}
.login-input:focus {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(var(--brand-accent-rgb), 0.5);
  box-shadow: 0 0 0 3px rgba(var(--brand-accent-rgb), 0.12), 0 0 20px -4px rgba(var(--brand-accent-rgb), 0.2);
}

/* ── Primary button ── */
.login-btn {
  background: var(--brand-accent);
  box-shadow: 0 8px 24px -6px rgba(var(--brand-accent-rgb), 0.55), 0 0 0 1px rgba(var(--brand-accent-rgb), 0.3);
}
.login-btn:not(:disabled):hover {
  filter: brightness(1.1);
  box-shadow: 0 12px 32px -6px rgba(var(--brand-accent-rgb), 0.65), 0 0 0 1px rgba(var(--brand-accent-rgb), 0.4);
  transform: translateY(-1px);
}
.login-btn:not(:disabled):active {
  transform: translateY(0) scale(0.98);
}

/* ── Animations ── */
@keyframes twinkle {
  0%, 100% { opacity: var(--tw-opacity, 0.4); transform: scale(1); }
  50% { opacity: 0.1; transform: scale(0.6); }
}
.animate-twinkle {
  animation: twinkle linear infinite;
}

@keyframes floatGem {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  33% { transform: translateY(-14px) rotate(6deg); }
  66% { transform: translateY(8px) rotate(-4deg); }
}
.animate-float {
  animation: floatGem ease-in-out infinite;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in {
  animation: fadeIn 0.55s cubic-bezier(0.22, 0.68, 0, 1.2) forwards;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  20% { transform: translateX(-5px); }
  40% { transform: translateX(5px); }
  60% { transform: translateX(-3px); }
  80% { transform: translateX(3px); }
}
.animate-shake {
  animation: shake 0.4s ease-out;
}
</style>
