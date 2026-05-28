import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import { settingsService, type BrandConfig } from '@/services/settingsService'

export type { BrandConfig as ThemeConfig }

const STORAGE_KEY = 'gems-theme-config'

const DEFAULT: BrandConfig = {
  logo: null,
  accentColor: '#8b5cf6',
  brandName: 'GEMS Hub',
  darkMode: false,
}

// ─── Color palette generator ──────────────────────────────────────
// Converts a hex color to a Tailwind-like 10-shade palette.
// Returns each shade as "R G B" (space-separated) for Tailwind opacity modifiers.

function hexToHsl(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16) / 255
  const g = parseInt(hex.slice(3, 5), 16) / 255
  const b = parseInt(hex.slice(5, 7), 16) / 255
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h = 0, s = 0
  const l = (max + min) / 2
  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break
      case g: h = ((b - r) / d + 2) / 6; break
      case b: h = ((r - g) / d + 4) / 6; break
    }
  }
  return [h * 360, s * 100, l * 100]
}

function hslToRgbStr(h: number, s: number, l: number): string {
  h /= 360; s /= 100; l /= 100
  let r: number, g: number, b: number
  if (s === 0) {
    r = g = b = l
  } else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s
    const p = 2 * l - q
    const hue = (p: number, q: number, t: number) => {
      if (t < 0) t += 1
      if (t > 1) t -= 1
      if (t < 1 / 6) return p + (q - p) * 6 * t
      if (t < 1 / 2) return q
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
      return p
    }
    r = hue(p, q, h + 1 / 3)
    g = hue(p, q, h)
    b = hue(p, q, h - 1 / 3)
  }
  return `${Math.round(r * 255)} ${Math.round(g * 255)} ${Math.round(b * 255)}`
}

function generatePalette(hex: string): Record<string, string> {
  // Validate hex
  if (!/^#[0-9a-f]{6}$/i.test(hex)) hex = '#8b5cf6'

  const [h, s, baseLightness] = hexToHsl(hex)

  // Shade definitions: [lightness, saturation multiplier]
  // 500 = base color; lighter shades reduce sat; darker keep sat
  const shades: Array<[string, number, number]> = [
    ['50',  96, 0.15],
    ['100', 93, 0.30],
    ['200', 87, 0.50],
    ['300', 77, 0.70],
    ['400', 66, 0.85],
    ['500', baseLightness, 1],
    ['600', Math.max(baseLightness - 10, 18), 1],
    ['700', Math.max(baseLightness - 20, 14), 1],
    ['800', Math.max(baseLightness - 30, 10), 1],
    ['900', Math.max(baseLightness - 40,  7), 1],
  ]

  const palette: Record<string, string> = {}
  for (const [shade, lightness, satMult] of shades) {
    palette[shade] = hslToRgbStr(h, s * satMult, lightness)
  }
  return palette
}

// ─── Store ────────────────────────────────────────────────────────

export const useThemeStore = defineStore('theme', () => {
  const config = ref<BrandConfig>({ ...DEFAULT })
  const loading = ref(false)

  /** Apply accent palette + dark mode to DOM */
  function apply() {
    const root = document.documentElement
    const palette = generatePalette(config.value.accentColor)
    for (const [shade, rgb] of Object.entries(palette)) {
      root.style.setProperty(`--p-${shade}`, rgb)
    }
    // Legacy helpers used in scoped CSS / inline styles
    root.style.setProperty('--brand-accent', config.value.accentColor)
    root.style.setProperty('--brand-accent-light', hexToRgba(config.value.accentColor, 0.12))
    // Raw comma-separated RGB for rgba() usage: rgba(var(--brand-accent-rgb), 0.5)
    const parts = (palette['500'] ?? '139 92 246').split(' ')
    root.style.setProperty('--brand-accent-rgb', parts.join(', '))
    root.classList.toggle('dark', config.value.darkMode)
  }

  /** Load from API first, fallback to localStorage */
  async function load() {
    loading.value = true
    try {
      const remote = await settingsService.getBrand()
      if (remote) {
        Object.assign(config.value, remote)
      } else {
        // Fallback: localStorage
        const saved = localStorage.getItem(STORAGE_KEY)
        if (saved) Object.assign(config.value, JSON.parse(saved))
      }
    } catch {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) try { Object.assign(config.value, JSON.parse(saved)) } catch {}
    } finally {
      loading.value = false
      apply()
    }
  }

  /** Update + persist to API and localStorage */
  async function update(patch: Partial<BrandConfig>) {
    Object.assign(config.value, patch)
    apply()
    // Persist locally immediately
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config.value))
    // Persist to DB (non-blocking)
    try {
      await settingsService.saveBrand({ ...config.value })
    } catch (err) {
      console.warn('[ThemeStore] Could not save to API, kept in localStorage', err)
    }
  }

  /** Reset to defaults */
  async function reset() {
    config.value = { ...DEFAULT }
    localStorage.removeItem(STORAGE_KEY)
    apply()
    try {
      await settingsService.saveBrand({ ...DEFAULT })
    } catch {}
  }

  /** Reset visualmente al brand GEMS (sin tocar BD). Útil en /login y /select-org
   *  cuando aún no hay org activa. */
  function resetToGems() {
    config.value = { ...DEFAULT }
    apply()
  }

  // Live preview: apply as soon as color/dark changes
  watch(() => config.value.accentColor, apply)
  watch(() => config.value.darkMode, apply)

  return { config, loading, load, apply, update, reset, resetToGems }
})

function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r},${g},${b},${alpha})`
}
