<template>
  <div class="min-h-screen flex items-center justify-center font-['Inter',sans-serif] overflow-hidden relative py-4 px-4" style="background: #04060d;">

    <!-- Nebula layers -->
    <div class="absolute inset-0 pointer-events-none overflow-hidden">
      <div class="absolute inset-0" style="background: radial-gradient(ellipse 80% 60% at 15% 35%, rgba(245,158,11,0.14) 0%, transparent 60%);"></div>
      <div class="absolute inset-0" style="background: radial-gradient(ellipse 60% 70% at 85% 70%, rgba(139,92,246,0.10) 0%, transparent 60%);"></div>
      <div class="absolute inset-0" style="background: radial-gradient(ellipse 50% 50% at 55% 95%, rgba(245,158,11,0.07) 0%, transparent 55%);"></div>
      <div class="absolute inset-0" style="background: radial-gradient(ellipse 40% 40% at 70% 10%, rgba(239,68,68,0.05) 0%, transparent 55%);"></div>
    </div>

    <!-- Grid overlay -->
    <div class="absolute inset-0 pointer-events-none" style="background-image: linear-gradient(rgba(245,158,11,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(245,158,11,0.025) 1px, transparent 1px); background-size: 48px 48px;"></div>

    <!-- Scanlines -->
    <div class="absolute inset-0 pointer-events-none scanlines"></div>

    <!-- Star field -->
    <div
      v-for="star in stars" :key="star.id"
      class="absolute rounded-full bg-white animate-twinkle pointer-events-none"
      :style="{ left: star.x+'%', top: star.y+'%', width: star.size+'px', height: star.size+'px', opacity: star.opacity, animationDuration: star.dur+'s', animationDelay: star.delay+'s' }"
    ></div>

    <!-- Floating gems -->
    <div
      v-for="gem in floatingGems" :key="'g'+gem.id"
      class="absolute animate-float pointer-events-none"
      :style="{ left: gem.x+'%', top: gem.y+'%', fontSize: gem.size+'px', opacity: gem.opacity, animationDuration: gem.dur+'s', animationDelay: gem.delay+'s', color: gem.amber ? '#f59e0b' : '#8b5cf6' }"
    >
      <i class="fas fa-gem"></i>
    </div>

    <!-- Content -->
    <div class="relative z-10 w-full max-w-[500px] animate-fade-in">

      <!-- Logo -->
      <div class="flex flex-col items-center mb-3">
        <div class="relative mb-2">
          <div class="pulse-ring" style="width:46px;height:46px;"></div>
          <div class="pulse-ring" style="width:46px;height:46px;animation-delay:1.3s;"></div>
          <div class="absolute inset-0 blur-xl opacity-60 scale-110" style="background: radial-gradient(circle, rgba(245,158,11,0.9) 0%, transparent 70%);"></div>
          <img src="/gems-logo.png" alt="GEMS Hub" class="relative h-10 w-auto drop-shadow-2xl" />
        </div>
        <h1 class="neon-title text-white text-xl font-black tracking-tight leading-none mb-0.5" style="background: linear-gradient(135deg, #f59e0b, rgba(245,158,11,0.6)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">
          GEMS HUB
        </h1>
        <p class="text-white/30 text-[10px] font-black uppercase tracking-[0.4em]">Tu plataforma de gestión empresarial</p>
      </div>

      <!-- Glass card -->
      <div class="card-glow-wrapper">
        <div class="trial-card rounded-[2rem] overflow-hidden relative">

          <!-- Inner glow -->
          <div class="absolute -top-20 -right-16 w-48 h-48 rounded-full pointer-events-none" style="background: radial-gradient(circle, rgba(245,158,11,0.10) 0%, transparent 70%);"></div>
          <div class="absolute -bottom-16 -left-12 w-36 h-36 rounded-full pointer-events-none" style="background: radial-gradient(circle, rgba(139,92,246,0.07) 0%, transparent 70%);"></div>

          <!-- Header -->
          <div class="px-6 pt-5 pb-4 border-b border-white/[0.06] relative z-10">
            <div class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider mb-2" style="background: rgba(245,158,11,0.12); border: 1px solid rgba(245,158,11,0.22); color: #fbbf24;">
              <i class="fas fa-hourglass-end text-[9px]"></i>
              Período de prueba finalizado
            </div>
            <h2 class="text-white/90 text-[17px] font-bold mb-0.5 leading-tight">
              Tu prueba gratuita ha expirado
            </h2>
            <p class="text-white/40 text-[12px]">
              <span v-if="orgName" class="text-white/60 font-semibold">{{ orgName }}</span>
              <span v-if="daysExpired > 0"> · venció hace <span class="text-amber-400 font-semibold">{{ daysExpired }} {{ daysExpired === 1 ? 'día' : 'días' }}</span></span>
            </p>
          </div>

          <!-- Body -->
          <div class="px-6 py-4 relative z-10">

            <p class="text-white/40 text-[12px] mb-3 leading-relaxed">
              Tus datos están guardados. Activa un plan para continuar — nada se borra.
            </p>

            <!-- Promo urgency badge -->
            <div class="flex items-center gap-2 mb-2.5 px-3 py-1.5 rounded-xl" style="background: rgba(239,68,68,0.08); border: 1px solid rgba(239,68,68,0.2);">
              <span class="inline-block w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
              <span class="text-[10px] font-bold text-red-400 uppercase tracking-wide">Precio especial por tiempo limitado</span>
            </div>

            <!-- Plan único -->
            <div class="plan-card-pro rounded-xl p-4 mb-3">
              <div class="flex items-center justify-between mb-1">
                <div class="text-[10px] font-bold uppercase tracking-wider" style="color: #fbbf24;">Plan Básico</div>
                <div class="text-right">
                  <div class="text-white/25 text-[11px] line-through leading-none mb-0.5">$99.99 USD/mes</div>
                  <div class="text-white/90 text-[20px] font-bold leading-none">
                    $59.99<span class="text-[11px] font-normal text-white/30"> USD/mes</span>
                  </div>
                </div>
              </div>
              <p class="text-amber-400/70 text-[10px] mb-3">Ahorra $480 al año · La promo se acaba pronto</p>
              <div class="grid grid-cols-2 gap-x-4 gap-y-1.5">
                <div v-for="f in planFeatures" :key="f" class="flex items-center gap-1.5 text-[11px] text-white/50">
                  <i class="fas fa-check text-[8px] text-amber-400"></i>{{ f }}
                </div>
              </div>
            </div>

            <!-- CTA -->
            <a
              href="mailto:info@gemsinnovations.com?subject=Activar%20plan%20GEMS%20Hub"
              class="cta-btn flex items-center justify-center gap-2 w-full h-10 rounded-xl font-bold text-[13px] transition-all mb-2 text-[#04060d]"
            >
              <i class="fas fa-envelope text-[13px]"></i>
              Contactar para activar mi plan
            </a>

            <button
              @click="logout"
              class="w-full h-8 text-[11px] font-medium text-white/25 hover:text-white/50 transition-colors"
            >
              Cerrar sesión
            </button>

          </div>

          <!-- Footer dentro de la card -->
          <div class="px-6 pb-4 text-center relative z-10">
            <p class="text-[10px] text-white/20">
              ¿Problemas? <a href="mailto:info@gemsinnovations.com" class="text-white/40 hover:text-white/60 underline underline-offset-2 transition-colors">info@gemsinnovations.com</a>
            </p>
          </div>

        </div>
      </div>

    </div>
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
  const trialExpiresAt = authStore.organization?.trialExpiresAt
  const forceDays = Number(route.query.days)
  if (forceDays) return forceDays
  if (!trialExpiresAt) return 0
  return Math.max(0, Math.floor((Date.now() - new Date(trialExpiresAt).getTime()) / 86400000))
})

const planFeatures = [
  'Clientes y prospectos IA',
  'Actividades y tableros',
  'Casos y tickets',
  'Reportes y contabilidad',
  'Wiki y Daily Scrum',
  'Gestión de equipo',
]

const stars = Array.from({ length: 120 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 1.8 + 0.3,
  opacity: Math.random() * 0.5 + 0.1,
  dur: Math.random() * 4 + 2,
  delay: Math.random() * 6,
}))

const floatingGems = Array.from({ length: 10 }, (_, i) => ({
  id: i,
  x: Math.random() * 90 + 5,
  y: Math.random() * 90 + 5,
  size: Math.random() * 12 + 6,
  opacity: Math.random() * 0.08 + 0.02,
  dur: Math.random() * 6 + 8,
  delay: Math.random() * 5,
  amber: i % 2 === 0,
}))

function logout() {
  authStore.logout()
}
</script>

<style scoped>
.scanlines {
  background-image: repeating-linear-gradient(
    0deg, transparent 0px, transparent 3px,
    rgba(0,0,0,0.08) 3px, rgba(0,0,0,0.08) 4px
  );
}

.trial-card {
  background: rgba(4, 6, 13, 0.93);
  border: 1px solid rgba(255, 255, 255, 0.07);
  backdrop-filter: blur(28px);
  -webkit-backdrop-filter: blur(28px);
  animation: cardPulse 4s ease-in-out infinite;
}

@keyframes cardPulse {
  0%, 100% {
    box-shadow: 0 28px 56px -14px rgba(0,0,0,0.82), 0 0 18px -6px rgba(245,158,11,0.06), inset 0 1px 0 rgba(255,255,255,0.05);
    border-color: rgba(255,255,255,0.07);
  }
  50% {
    box-shadow: 0 28px 56px -14px rgba(0,0,0,0.72), 0 0 64px -6px rgba(245,158,11,0.22), inset 0 1px 0 rgba(255,255,255,0.10);
    border-color: rgba(245,158,11,0.20);
  }
}

.neon-title {
  animation: neonPulse 3s ease-in-out infinite alternate;
}
@keyframes neonPulse {
  from { filter: drop-shadow(0 0 6px  rgba(245,158,11,0.5)); }
  to   { filter: drop-shadow(0 0 20px rgba(245,158,11,1)) drop-shadow(0 0 40px rgba(245,158,11,0.4)); }
}

.pulse-ring {
  position: absolute;
  top: 50%; left: 50%;
  border-radius: 50%;
  border: 1px solid rgba(245,158,11,0.45);
  animation: pulseRingOut 2.6s ease-out infinite;
  transform-origin: center;
}
@keyframes pulseRingOut {
  0%   { transform: translate(-50%, -50%) scale(0.6); opacity: 0.9; }
  100% { transform: translate(-50%, -50%) scale(1.5); opacity: 0; }
}

.plan-card {
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.07);
}

.plan-card-pro {
  background: rgba(245,158,11,0.05);
  border: 1px solid rgba(245,158,11,0.22);
}

.cta-btn {
  background: linear-gradient(135deg, #f59e0b, #d97706);
  box-shadow: 0 4px 24px rgba(245,158,11,0.35);
  transition: box-shadow 0.2s, transform 0.15s;
}
.cta-btn:hover {
  box-shadow: 0 6px 32px rgba(245,158,11,0.55);
  transform: translateY(-1px);
}

.animate-fade-in { animation: fadeIn 0.5s ease-out; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }

.animate-float { animation: floatGem 8s ease-in-out infinite; }
@keyframes floatGem {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50%       { transform: translateY(-18px) rotate(12deg); }
}

.animate-twinkle { animation: twinkle 3s ease-in-out infinite alternate; }
@keyframes twinkle {
  from { opacity: 0.1; } to { opacity: 0.7; }
}
</style>
