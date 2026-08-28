<template>
  <div v-if="phase !== 'hidden'" class="fixed inset-0 z-[200] pointer-events-none">
    <!-- Dim de fondo, solo mientras está centrado -->
    <div
      class="absolute inset-0 transition-opacity duration-700 ease-out"
      :style="{ background: 'rgba(2,3,8,0.9)', backdropFilter: 'blur(6px)', opacity: phase === 'center' ? 1 : 0 }"
    ></div>

    <!-- Frame del video: se encoge y se mueve a la esquina, luego se desvanece -->
    <div
      class="intro-video-frame absolute rounded-2xl overflow-hidden transition-all ease-[cubic-bezier(.22,.68,0,1)]"
      :style="frameStyle"
    >
      <video
        ref="videoEl"
        src="/mantis-intro.mp4"
        muted
        playsinline
        preload="auto"
        class="w-full h-full object-cover"
        @ended="onEnded"
      ></video>
    </div>

    <!-- Label, solo visible mientras está centrado -->
    <div
      class="absolute left-1/2 -translate-x-1/2 flex items-center gap-2 text-white/40 text-[11px] font-black uppercase tracking-[0.3em] transition-opacity duration-500"
      :style="{ top: labelTop + 'px', opacity: phase === 'center' ? 1 : 0 }"
    >
      <i class="fas fa-circle-notch fa-spin text-[10px]"></i>
      Preparando tu espacio de trabajo
    </div>
  </div>
</template>

<script setup lang="ts">
// Intro cinemática (experimento): montada una sola vez en App.vue para sobrevivir
// la navegación entre páginas (Login/OrgSelector → dashboard). Se dispara vía
// `triggerIntroVideo()` desde cualquier página. Arranca centrada, se encoge a una
// esquina tipo picture-in-picture SOBRE el dashboard y deja ver/usar la app,
// y reproduce el video completo (se desvanece cuando el video termina, no antes).
import { ref, nextTick, computed, watch } from 'vue'
import { introTrigger } from '../composables/useIntroVideo'

type Phase = 'hidden' | 'center' | 'corner' | 'fading'
const phase = ref<Phase>('hidden')
const videoEl = ref<HTMLVideoElement | null>(null)
const frame = ref({ top: 0, left: 0, width: 0, height: 0 })
const labelTop = ref(0)
let cornerTimer: ReturnType<typeof setTimeout> | null = null
let hideTimer: ReturnType<typeof setTimeout> | null = null

function computeFrame(target: 'center' | 'corner') {
  const vw = window.innerWidth
  const vh = window.innerHeight
  if (target === 'center') {
    const height = vh * 0.4
    const width = height * 9 / 16
    return { top: (vh - height) / 2, left: (vw - width) / 2, width, height }
  }
  const height = 150
  const width = height * 9 / 16
  return { top: vh - height - 24, left: vw - width - 24, width, height }
}

const frameStyle = computed(() => ({
  top: frame.value.top + 'px',
  left: frame.value.left + 'px',
  width: frame.value.width + 'px',
  height: frame.value.height + 'px',
  transitionDuration: phase.value === 'fading' ? '600ms' : '900ms',
  opacity: phase.value === 'fading' ? 0 : 1,
  boxShadow: phase.value === 'center'
    ? '0 0 0 1px rgba(139,92,246,0.25), 0 40px 90px -20px rgba(0,0,0,0.8), 0 0 60px -10px rgba(139,92,246,0.35)'
    : '0 0 0 1px rgba(139,92,246,0.3), 0 16px 40px -10px rgba(0,0,0,0.6)',
}))

function onEnded() {
  if (cornerTimer) clearTimeout(cornerTimer)
  phase.value = 'fading'
  if (hideTimer) clearTimeout(hideTimer)
  hideTimer = setTimeout(() => { phase.value = 'hidden' }, 650)
}

function play() {
  const c = computeFrame('center')
  frame.value = c
  labelTop.value = c.top + c.height + 16
  phase.value = 'center'

  nextTick(() => {
    const el = videoEl.value
    if (!el) return
    el.currentTime = 0
    el.play().catch(() => {})
  })

  // Se encoge a la esquina rápido para dejar usar el dashboard,
  // pero el video sigue sonando/reproduciéndose hasta el final (evento 'ended').
  if (cornerTimer) clearTimeout(cornerTimer)
  cornerTimer = setTimeout(() => {
    frame.value = computeFrame('corner')
    phase.value = 'corner'
  }, 1400)
}

watch(introTrigger, () => play())
</script>
