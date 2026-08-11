<template>
  <div class="relative flex gap-2" ref="rootEl">
    <!-- Selector de país (combobox buscable) -->
    <div class="relative shrink-0" style="width: 108px;">
      <button
        type="button"
        @click="toggleOpen"
        class="phone-select w-full h-full flex items-center gap-1.5 rounded-xl py-3.5 px-3 text-sm font-medium text-white outline-none transition-all duration-300"
      >
        <span>{{ selected.flag }}</span>
        <span class="truncate">{{ selected.dial }}</span>
        <i class="fas fa-chevron-down text-[9px] text-white/30 ml-auto"></i>
      </button>
    </div>

    <!-- Dropdown: se abre hacia abajo o arriba según el espacio libre dentro del
         contenedor que recorta (la card), para no quedar nunca cortado. -->
    <div
      v-if="open"
      class="absolute z-30 left-0 right-0 rounded-xl overflow-hidden phone-dropdown"
      :style="dropdownStyle"
    >
      <div class="p-2 border-b border-white/[0.06]">
        <div class="relative">
          <i class="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-white/25 text-[11px]"></i>
          <input
            ref="searchInputEl"
            v-model="query"
            type="text"
            placeholder="Buscar país o prefijo…"
            class="phone-search w-full pl-8 pr-3 py-2 rounded-lg text-[13px] text-white placeholder-white/25 outline-none"
            @keydown.escape="close"
          />
        </div>
      </div>
      <div class="overflow-y-auto phone-list-scroll" :style="{ maxHeight: listMaxHeight + 'px' }">
        <button
          v-for="c in filtered"
          :key="c.iso"
          type="button"
          @click="select(c)"
          class="phone-option w-full flex items-center gap-2.5 px-3 py-2 text-left transition-colors"
          :class="{ 'phone-option-active': c.dial === modelDial }"
        >
          <span class="text-base leading-none">{{ c.flag }}</span>
          <span class="flex-1 text-[13px] text-white/80 truncate">{{ c.name }}</span>
          <span class="text-[12px] text-white/40 font-medium">{{ c.dial }}</span>
        </button>
        <p v-if="!filtered.length" class="text-white/30 text-[12px] text-center py-4">Sin resultados</p>
      </div>
    </div>

    <!-- Número -->
    <div class="relative group flex-1">
      <div class="absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300 text-white/25 group-focus-within:text-primary-400">
        <i class="fas fa-phone text-sm"></i>
      </div>
      <input
        :value="modelNumber"
        @input="modelNumber = ($event.target as HTMLInputElement).value"
        type="tel"
        required
        :placeholder="placeholder"
        class="login-input w-full rounded-xl py-3.5 pl-11 pr-5 text-sm font-medium text-white placeholder:text-white/25 outline-none transition-all duration-300 bg-black/20 focus:bg-black/40 border border-white/5 focus:border-primary-500/50"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, onMounted, onBeforeUnmount } from 'vue'
import { COUNTRY_CODES, DEFAULT_COUNTRY_DIAL, type CountryCode } from '../../utils/countryCodes'

withDefaults(defineProps<{ placeholder?: string }>(), {
  placeholder: '8888-8888'
})

const modelDial = defineModel<string>('dial', { default: DEFAULT_COUNTRY_DIAL })
const modelNumber = defineModel<string>('number', { default: '' })

const open = ref(false)
const query = ref('')
const rootEl = ref<HTMLElement | null>(null)
const searchInputEl = ref<HTMLInputElement | null>(null)

// Se abre hacia abajo o hacia arriba, y su lista se acota a la altura disponible
// dentro del contenedor real que recorta (el ancestro con overflow:hidden/auto más
// cercano — normalmente la card del formulario) para nunca quedar cortado.
const placement = ref<'below' | 'above'>('below')
const listMaxHeight = ref(224)
const BOUNDARY_MARGIN = 8
const GAP = 6
const SEARCH_BAR_HEIGHT = 52 // p-2 + input, aprox
const IDEAL_LIST_HEIGHT = 224

const dropdownStyle = computed(() => (
  placement.value === 'below' ? { top: 'calc(100% + 6px)' } : { bottom: 'calc(100% + 6px)' }
))

function findClippingBoundary(el: HTMLElement): { top: number; bottom: number } {
  let node: HTMLElement | null = el.parentElement
  while (node && node !== document.body) {
    const cs = getComputedStyle(node)
    if (/(hidden|auto|scroll)/.test(cs.overflowY) || /(hidden|auto|scroll)/.test(cs.overflow)) {
      const r = node.getBoundingClientRect()
      return { top: r.top, bottom: r.bottom }
    }
    node = node.parentElement
  }
  return { top: 0, bottom: window.innerHeight }
}

function updatePosition() {
  if (!rootEl.value) return
  const rect = rootEl.value.getBoundingClientRect()
  const boundary = findClippingBoundary(rootEl.value)

  const spaceBelow = boundary.bottom - rect.bottom - GAP - BOUNDARY_MARGIN
  const spaceAbove = rect.top - boundary.top - GAP - BOUNDARY_MARGIN

  const fitsBelow = spaceBelow - SEARCH_BAR_HEIGHT >= 80
  placement.value = (fitsBelow || spaceBelow >= spaceAbove) ? 'below' : 'above'

  const available = placement.value === 'below' ? spaceBelow : spaceAbove
  listMaxHeight.value = Math.max(40, Math.min(IDEAL_LIST_HEIGHT, available - SEARCH_BAR_HEIGHT))
}

const selected = computed<CountryCode>(() =>
  COUNTRY_CODES.find(c => c.dial === modelDial.value) || COUNTRY_CODES[0]
)

const filtered = computed(() => {
  const q = query.value.trim().toLowerCase()
  if (!q) return COUNTRY_CODES
  return COUNTRY_CODES.filter(c =>
    c.name.toLowerCase().includes(q) || c.dial.includes(q) || c.iso.toLowerCase() === q
  )
})

function toggleOpen() {
  open.value = !open.value
  if (open.value) {
    query.value = ''
    updatePosition()
    nextTick(() => searchInputEl.value?.focus())
  }
}
function close() {
  open.value = false
}
function select(c: CountryCode) {
  modelDial.value = c.dial
  close()
}
function onClickOutside(e: MouseEvent) {
  if (rootEl.value && !rootEl.value.contains(e.target as Node)) close()
}
function onReposition() {
  if (open.value) updatePosition()
}
onMounted(() => {
  document.addEventListener('mousedown', onClickOutside)
  window.addEventListener('resize', onReposition)
  window.addEventListener('scroll', onReposition, true)
})
onBeforeUnmount(() => {
  document.removeEventListener('mousedown', onClickOutside)
  window.removeEventListener('resize', onReposition)
  window.removeEventListener('scroll', onReposition, true)
})
</script>

<style scoped>
.phone-select {
  background: rgba(0,0,0,0.2);
  border: 1px solid rgba(255,255,255,0.05);
}
.phone-select:hover {
  background: rgba(0,0,0,0.3);
}
.phone-dropdown {
  background: #0b0e18;
  border: 1px solid rgba(255,255,255,0.1);
  box-shadow: 0 16px 40px -8px rgba(0,0,0,0.6);
}
.phone-search {
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.08);
}
.phone-search:focus {
  border-color: rgba(139,92,246,0.4);
}
.phone-option:hover {
  background: rgba(255,255,255,0.05);
}
.phone-option-active {
  background: rgba(139,92,246,0.12);
}
.phone-list-scroll {
  scrollbar-width: thin;
  scrollbar-color: rgba(139,92,246,0.35) transparent;
}
.phone-list-scroll::-webkit-scrollbar { width: 6px; }
.phone-list-scroll::-webkit-scrollbar-track { background: transparent; }
.phone-list-scroll::-webkit-scrollbar-thumb {
  background: rgba(139,92,246,0.35);
  border-radius: 999px;
}
</style>
