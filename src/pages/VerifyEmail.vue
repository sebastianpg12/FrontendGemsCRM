<template>
  <div class="min-h-screen flex items-center justify-center font-['Inter',sans-serif] overflow-hidden relative" style="background: #04060d;">
    <!-- ── Background: Nebula layers ── -->
    <div class="absolute inset-0 pointer-events-none overflow-hidden">
      <div class="absolute inset-0" style="background: radial-gradient(ellipse 80% 60% at 15% 35%, rgba(139,92,246,0.22) 0%, transparent 60%);"></div>
      <div class="absolute inset-0" style="background: radial-gradient(ellipse 60% 70% at 85% 70%, rgba(139,92,246,0.13) 0%, transparent 60%);"></div>
    </div>
    
    <div class="relative z-10 w-full max-w-[400px] mx-4 text-center animate-fade-in">
      
      <div class="login-card rounded-[2rem] p-8 sm:p-10 relative overflow-hidden" style="background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); backdrop-filter: blur(20px);">
        
        <div v-if="isLoading" class="flex flex-col items-center">
          <i class="fas fa-circle-notch fa-spin text-4xl text-primary-400 mb-4"></i>
          <h2 class="text-white text-xl font-bold mb-2">Verificando tu cuenta...</h2>
          <p class="text-white/50 text-sm">Por favor espera un momento.</p>
        </div>

        <div v-else-if="success" class="flex flex-col items-center">
          <div class="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mb-6">
            <i class="fas fa-check text-2xl text-emerald-400"></i>
          </div>
          <h2 class="text-white text-xl font-bold mb-2">¡Cuenta verificada!</h2>
          <p class="text-white/50 text-sm mb-8">Tu cuenta de GEMS Hub ha sido activada correctamente. Ahora puedes iniciar sesión y disfrutar de tus 14 días de prueba gratis.</p>
          <router-link to="/login" class="w-full py-3.5 text-white font-black rounded-xl transition-all duration-300 flex items-center justify-center gap-2.5 text-[13px] uppercase tracking-widest hover:scale-[1.02]" style="background: var(--brand-accent); box-shadow: 0 4px 20px rgba(139, 92, 246, 0.4);">
            Iniciar Sesión
          </router-link>
        </div>

        <div v-else class="flex flex-col items-center">
          <div class="w-16 h-16 rounded-full bg-rose-500/20 flex items-center justify-center mb-6">
            <i class="fas fa-times text-2xl text-rose-400"></i>
          </div>
          <h2 class="text-white text-xl font-bold mb-2">Error de verificación</h2>
          <p class="text-white/50 text-sm mb-8">{{ error }}</p>
          <router-link to="/login" class="w-full py-3.5 text-white font-black rounded-xl transition-all duration-300 flex items-center justify-center gap-2.5 text-[13px] uppercase tracking-widest" style="background: rgba(255,255,255,0.1);">
            Volver al Inicio
          </router-link>
        </div>
        
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const route = useRoute()
const authStore = useAuthStore()

const isLoading = ref(true)
const success = ref(false)
const error = ref('')

onMounted(async () => {
  const token = route.query.token as string
  
  if (!token) {
    isLoading.value = false
    error.value = 'El enlace de verificación no es válido o está incompleto.'
    return
  }

  const result = await authStore.verifyEmail(token)
  isLoading.value = false
  
  if (result.success) {
    success.value = true
  } else {
    error.value = result.message || 'El enlace ha expirado o ya fue utilizado.'
  }
})
</script>
