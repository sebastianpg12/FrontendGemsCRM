<template>
  <div class="min-h-screen flex items-center justify-center font-['Inter',sans-serif] relative overflow-hidden" style="background:#04060d;">
    <div class="absolute inset-0 pointer-events-none">
      <div class="absolute inset-0" style="background: radial-gradient(ellipse 70% 60% at 20% 30%, rgba(139,92,246,0.18) 0%, transparent 60%);"></div>
      <div class="absolute inset-0" style="background: radial-gradient(ellipse 60% 70% at 85% 70%, rgba(139,92,246,0.10) 0%, transparent 60%);"></div>
    </div>

    <div class="relative z-10 w-full max-w-md mx-4 animate-fade-in">
      <div class="flex flex-col items-center mb-8">
        <img src="/gems-logo.png" alt="GEMS Hub" class="h-14 w-auto mb-3 drop-shadow-2xl" />
        <h1 class="text-white/95 text-xl font-bold">Selecciona tu organización</h1>
        <p v-if="!authStore.isSuperAdmin" class="text-white/40 text-xs mt-1">Tienes acceso a varias workspaces</p>
        <div v-else class="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-bold uppercase tracking-widest text-amber-300" style="background:rgba(245,158,11,0.12); border:1px solid rgba(245,158,11,0.25);">
          <i class="fas fa-crown text-[11px]"></i> Sesión super-admin · Acceso total
        </div>
      </div>

      <div class="space-y-3">
        <button
          v-for="m in memberships"
          :key="m.organizationId"
          @click="select(m.organizationId)"
          :disabled="loading"
          class="org-card w-full flex items-center gap-4 p-4 rounded-2xl text-left transition-all"
        >
          <div
            class="w-12 h-12 rounded-xl flex items-center justify-center text-white font-black text-lg shrink-0"
            :style="{ background: m.branding?.accentColor || '#8b5cf6' }"
          >
            <img
              v-if="m.branding?.logo && !failedLogos.has(m.branding.logo)"
              :src="m.branding.logo"
              alt=""
              class="w-full h-full object-contain rounded-xl"
              @error="failedLogos.add(m.branding.logo)"
            />
            <span v-else>{{ initials(m.organizationName) }}</span>
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-white font-bold text-sm truncate">{{ m.organizationName }}</p>
            <p class="text-white/40 text-[13px] uppercase tracking-wide">{{ m.role }}<span v-if="m.isOwner"> · Owner</span></p>
          </div>
          <i class="fas fa-arrow-right text-white/30 text-sm"></i>
        </button>
      </div>

      <button
        v-if="authStore.isSuperAdmin"
        @click="goToAdmin"
        class="mt-4 w-full p-4 rounded-2xl flex items-center justify-center gap-2 text-amber-300 text-sm font-bold transition-all"
        style="background:rgba(245,158,11,0.06); border:1px dashed rgba(245,158,11,0.3);"
      >
        <i class="fas fa-plus text-xs"></i> Gestionar organizaciones
      </button>

      <div v-if="error" class="mt-4 p-3 rounded-xl text-rose-300 text-xs" style="background:rgba(239,68,68,0.12);">{{ error }}</div>

      <div class="mt-8 flex justify-center">
        <button @click="goLogout" class="text-white/40 text-xs hover:text-white/70 transition">Salir de la sesión</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useThemeStore } from '../stores/theme'
import { authService } from '../services/authService'

const router = useRouter()
const authStore = useAuthStore()
const themeStore = useThemeStore()

const loading = ref(false)
const error = ref<string | null>(null)
const memberships = computed(() => authStore.memberships)
// Logos que fallaron al cargar — muestra iniciales en su lugar
const failedLogos = reactive(new Set<string>())

function initials(name: string) {
  return name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
}

async function select(orgId: string) {
  loading.value = true
  error.value = null
  const result = await authStore.selectOrganization(orgId)
  if (result.success) {
    try { await themeStore.load() } catch {}
    const redirect = authStore.user?.role === 'client' ? '/support' : '/'
    await router.push(redirect)
  } else {
    error.value = result.message || 'Error al seleccionar organización'
  }
  loading.value = false
}

async function goLogout() {
  await authStore.logout()
}

function goToAdmin() {
  // El admin panel necesita una org seleccionada para que el wall lo deje pasar.
  // Si super-admin tiene >=1 org, auto-elegimos la primera para entrar al panel.
  if (memberships.value.length > 0) {
    select(memberships.value[0].organizationId).then(() => router.push('/admin/organizations'))
  } else {
    router.push('/admin/organizations')
  }
}

onMounted(async () => {
  themeStore.resetToGems()
  // Si no hay memberships en el store (por reload), pedirlos al backend
  if (!memberships.value.length) {
    const list = await authService.getMemberships()
    authStore.memberships = list as any
  }
  // Super-admin: nunca auto-seleccionar — siempre que pueda elegir entre todos los tenants.
  if (!authStore.isSuperAdmin && memberships.value.length === 1) {
    await select(memberships.value[0].organizationId)
  }
})
</script>

<style scoped>
.org-card {
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.08);
  backdrop-filter: blur(20px);
}
.org-card:hover:not(:disabled) {
  background: rgba(255,255,255,0.07);
  border-color: rgba(139,92,246,0.4);
  transform: translateY(-1px);
}
.animate-fade-in {
  animation: fadeIn 0.45s cubic-bezier(0.22, 0.68, 0, 1.2) forwards;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
