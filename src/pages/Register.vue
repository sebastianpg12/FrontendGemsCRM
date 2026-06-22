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

    <!-- ── Main card ── -->
    <div class="relative z-10 w-full max-w-[460px] mx-4 my-8 animate-fade-in">

      <!-- Logo + brand header -->
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
        <p class="text-white/30 text-[11px] font-black uppercase tracking-[0.45em]">Pruébalo gratis por 14 días</p>
      </div>

      <!-- Glass card -->
      <div class="login-card rounded-[2rem] p-8 sm:p-10 relative overflow-hidden" style="background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); backdrop-filter: blur(20px);">

        <!-- Card header -->
        <div class="mb-7 relative z-10">
          <h2 class="text-white/90 text-lg font-bold mb-0.5">Crea tu cuenta</h2>
          <p class="text-white/35 text-[13px] font-medium">Configura tu organización y empieza ahora mismo.</p>
        </div>

        <!-- Success Message -->
        <div v-if="success" class="mb-5 p-4 rounded-xl flex items-start gap-3 relative z-10" style="background: rgba(16,185,129,0.12); border: 1px solid rgba(16,185,129,0.2);">
          <i class="fas fa-check-circle text-emerald-400 shrink-0 mt-0.5 text-lg"></i>
          <div>
            <h3 class="text-emerald-300 font-bold mb-1 text-sm">¡Registro exitoso!</h3>
            <p class="text-[14px] text-emerald-400/80 leading-snug">Hemos enviado un correo de verificación a <strong>{{ formData.email }}</strong>. Por favor revisa tu bandeja de entrada o spam para activar tu cuenta.</p>
          </div>
        </div>

        <!-- Error message -->
        <div v-if="error" class="mb-5 p-3.5 rounded-xl flex items-start gap-2.5 relative z-10 animate-shake" style="background: rgba(239,68,68,0.12); border: 1px solid rgba(239,68,68,0.2);">
          <i class="fas fa-circle-exclamation text-rose-400 shrink-0 mt-0.5 text-sm"></i>
          <p class="text-[13px] font-bold text-rose-300 leading-tight">{{ error }}</p>
        </div>

        <!-- Form -->
        <form v-if="!success" @submit.prevent="handleRegister" class="space-y-4 relative z-10">
          
          <!-- Org Name -->
          <div class="relative group">
            <div class="absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300 text-white/25 group-focus-within:text-primary-400">
              <i class="far fa-building text-sm"></i>
            </div>
            <input
              v-model="formData.orgName"
              type="text"
              required
              placeholder="Nombre de tu empresa"
              class="login-input w-full rounded-xl py-3.5 pl-11 pr-5 text-sm font-medium text-white placeholder:text-white/25 outline-none transition-all duration-300 bg-black/20 focus:bg-black/40 border border-white/5 focus:border-primary-500/50"
            />
          </div>

          <!-- User Name -->
          <div class="relative group">
            <div class="absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300 text-white/25 group-focus-within:text-primary-400">
              <i class="far fa-user text-sm"></i>
            </div>
            <input
              v-model="formData.userName"
              type="text"
              required
              placeholder="Tu nombre completo"
              class="login-input w-full rounded-xl py-3.5 pl-11 pr-5 text-sm font-medium text-white placeholder:text-white/25 outline-none transition-all duration-300 bg-black/20 focus:bg-black/40 border border-white/5 focus:border-primary-500/50"
            />
          </div>

          <!-- Email -->
          <div class="relative group">
            <div class="absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300 text-white/25 group-focus-within:text-primary-400">
              <i class="far fa-envelope text-sm"></i>
            </div>
            <input
              v-model="formData.email"
              type="email"
              required
              placeholder="tu@email.com"
              class="login-input w-full rounded-xl py-3.5 pl-11 pr-5 text-sm font-medium text-white placeholder:text-white/25 outline-none transition-all duration-300 bg-black/20 focus:bg-black/40 border border-white/5 focus:border-primary-500/50"
            />
          </div>

          <!-- Password -->
          <div class="relative group">
            <div class="absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300 text-white/25 group-focus-within:text-primary-400">
              <i class="far fa-lock text-sm"></i>
            </div>
            <input
              v-model="formData.password"
              :type="showPassword ? 'text' : 'password'"
              required
              minlength="8"
              placeholder="Contraseña (mínimo 8 caracteres)"
              class="login-input w-full rounded-xl py-3.5 pl-11 pr-12 text-sm font-medium text-white placeholder:text-white/25 outline-none transition-all duration-300 bg-black/20 focus:bg-black/40 border border-white/5 focus:border-primary-500/50"
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

          <!-- Submit button -->
          <button
            type="submit"
            :disabled="isLoading"
            class="w-full py-3.5 text-white font-black rounded-xl transition-all duration-300 flex items-center justify-center gap-2.5 disabled:opacity-50 mt-4 text-[13px] uppercase tracking-widest hover:scale-[1.02]"
            style="background: var(--brand-accent); box-shadow: 0 4px 20px rgba(139, 92, 246, 0.4);"
          >
            <i v-if="isLoading" class="fas fa-circle-notch fa-spin text-sm"></i>
            <template v-else>
              <i class="fas fa-rocket text-xs opacity-75"></i>
              Comenzar prueba gratis
            </template>
          </button>
          
          <div class="text-center mt-4">
            <router-link to="/login" class="text-[13px] text-white/50 hover:text-white transition-colors underline-offset-4 hover:underline">
              ¿Ya tienes una cuenta? Iniciar Sesión
            </router-link>
          </div>

        </form>

        <div v-if="success" class="mt-6 text-center">
          <router-link to="/login" class="w-full py-3.5 text-white font-black rounded-xl transition-all duration-300 flex items-center justify-center gap-2.5 text-[13px] uppercase tracking-widest" style="background: rgba(255,255,255,0.1);">
            Ir al inicio de sesión
          </router-link>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useThemeStore } from '../stores/theme'

const authStore = useAuthStore()
const themeStore = useThemeStore()

const formData = ref({
  orgName: '',
  userName: '',
  email: '',
  password: ''
})

const showPassword = ref(false)
const isLoading = ref(false)
const error = ref('')
const success = ref(false)

const themeLogo = computed(() => '/gems-logo.png')
const brandName = computed(() => 'GEMS Hub')

const accentRgb = ref('139, 92, 246')
const refreshAccentRgb = () => {
  const v = getComputedStyle(document.documentElement).getPropertyValue('--brand-accent-rgb').trim()
  if (v) accentRgb.value = v
}
watch(() => themeStore.config.accentColor, refreshAccentRgb)

const stars = Array.from({ length: 80 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 2 + 0.3,
  opacity: Math.random() * 0.6 + 0.1,
  dur: Math.random() * 4 + 2,
  delay: Math.random() * 6
}))

const handleRegister = async () => {
  isLoading.value = true
  error.value = ''
  
  const result = await authStore.registerOrg(formData.value)
  
  isLoading.value = false
  if (result.success) {
    success.value = true
  } else {
    error.value = result.message || 'Error al crear la cuenta. Inténtalo de nuevo.'
  }
}
</script>

<style scoped>
/* Scoped styles borrowed from Login if needed */
.login-input:-webkit-autofill {
  -webkit-box-shadow: 0 0 0 30px rgba(0,0,0,0.8) inset !important;
  -webkit-text-fill-color: white !important;
}
</style>
