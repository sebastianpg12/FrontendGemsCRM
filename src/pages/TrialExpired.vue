<template>
  <div class="min-h-screen bg-slate-50 dark:bg-[#0f172a] flex flex-col items-center justify-center px-4 py-12">

    <!-- Card principal -->
    <div class="w-full max-w-lg bg-white dark:bg-[#0f1117] rounded-xl shadow-sm border border-slate-100 dark:border-white/[0.07] overflow-hidden">

      <!-- Header rojo -->
      <div class="bg-gradient-to-r from-red-500 to-rose-600 px-8 py-7 text-white text-center">
        <div class="flex items-center justify-center gap-2.5 mb-4">
          <img src="/gems-logo.png" alt="GEMS Hub" class="h-8 w-8 object-contain brightness-0 invert" />
          <span class="text-[17px] font-bold tracking-tight">GEMS Hub</span>
        </div>
        <div class="inline-flex items-center gap-1.5 bg-white/20 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider mb-4">
          <i class="fas fa-clock-rotate-left text-[10px]"></i>
          Período de prueba finalizado
        </div>
        <h1 class="text-[22px] font-bold leading-tight mb-1">
          Tu prueba gratuita ha expirado
        </h1>
        <p class="text-[13px] text-white/80">
          <span v-if="orgName" class="font-semibold text-white">{{ orgName }}</span>
          <span v-if="daysExpired > 0"> · venció hace {{ daysExpired }} {{ daysExpired === 1 ? 'día' : 'días' }}</span>
        </p>
      </div>

      <!-- Cuerpo -->
      <div class="px-8 py-7">
        <p class="text-[14px] text-slate-600 dark:text-slate-400 mb-6 text-center leading-relaxed">
          Para seguir usando GEMS Hub con tu equipo elige un plan. Tus datos están guardados y seguros — nada se borra al activar.
        </p>

        <!-- Planes -->
        <div class="grid grid-cols-2 gap-3 mb-6">
          <!-- Básico -->
          <div class="border border-slate-200 dark:border-white/10 rounded-xl p-4">
            <div class="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Básico</div>
            <div class="text-[22px] font-bold text-slate-800 dark:text-slate-100 mb-3">
              ${{ planPrices.basic.cop }}<span class="text-[12px] font-normal text-slate-400">/mes</span>
            </div>
            <ul class="space-y-1.5">
              <li v-for="f in planFeatures.basic" :key="f" class="flex items-start gap-1.5 text-[11px] text-slate-600 dark:text-slate-400">
                <i class="fas fa-check text-green-500 mt-[2px] text-[9px]"></i>{{ f }}
              </li>
            </ul>
          </div>

          <!-- Pro -->
          <div class="border-2 border-primary-500 rounded-xl p-4 relative">
            <div class="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-primary-500 text-white text-[9px] font-bold uppercase tracking-wider px-3 py-0.5 rounded-full">
              Recomendado
            </div>
            <div class="text-[11px] font-bold text-primary-500 uppercase tracking-wider mb-1">Pro</div>
            <div class="text-[22px] font-bold text-slate-800 dark:text-slate-100 mb-3">
              ${{ planPrices.pro.cop }}<span class="text-[12px] font-normal text-slate-400">/mes</span>
            </div>
            <ul class="space-y-1.5">
              <li v-for="f in planFeatures.pro" :key="f" class="flex items-start gap-1.5 text-[11px] text-slate-600 dark:text-slate-400">
                <i class="fas fa-check text-primary-500 mt-[2px] text-[9px]"></i>{{ f }}
              </li>
            </ul>
          </div>
        </div>

        <!-- CTA principal -->
        <a
          :href="whatsappLink"
          target="_blank"
          class="flex items-center justify-center gap-2.5 w-full h-11 bg-green-500 hover:bg-green-600 text-white rounded-xl font-semibold text-[14px] transition-colors mb-3"
        >
          <i class="fab fa-whatsapp text-[18px]"></i>
          Contactar para activar mi plan
        </a>

        <button
          @click="logout"
          class="w-full h-9 text-[13px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
        >
          Cerrar sesión
        </button>
      </div>
    </div>

    <!-- Footer -->
    <p class="mt-6 text-[11px] text-slate-400 text-center">
      ¿Problemas? Escríbenos a
      <a href="mailto:info@gemsinnovations.com" class="underline hover:text-slate-600">info@gemsinnovations.com</a>
    </p>

  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useRoute } from 'vue-router'

const authStore = useAuthStore()
const route = useRoute()

const orgName = computed(() =>
  authStore.organization?.branding?.displayName || authStore.organization?.name || ''
)

const daysExpired = computed(() => {
  const trialEndsAt = (authStore.organization as any)?.trialEndsAt
  // En demo mode puede venir como query param
  const forceDays = Number(route.query.days)
  if (forceDays) return forceDays
  if (!trialEndsAt) return 0
  const diff = Date.now() - new Date(trialEndsAt).getTime()
  return Math.max(0, Math.floor(diff / 86400000))
})

const planPrices = {
  basic: { cop: '290.000' },
  pro:   { cop: '490.000' },
}

const planFeatures = {
  basic: ['Hasta 5 usuarios', 'Clientes y actividades', 'Tickets y casos', 'Chat interno'],
  pro:   ['Usuarios ilimitados', 'Todo lo de Básico', 'Prospectos IA', 'Reportes y Wiki'],
}

const whatsappLink = computed(() => {
  const msg = encodeURIComponent(
    `Hola, quiero activar mi plan de GEMS Hub para ${orgName.value || 'mi organización'}.`
  )
  return `https://wa.me/573000000000?text=${msg}`
})

function logout() {
  authStore.logout()
}
</script>
