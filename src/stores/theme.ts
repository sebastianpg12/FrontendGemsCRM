import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import { settingsService, type BrandConfig } from '@/services/settingsService'

export type { BrandConfig as ThemeConfig }

const STORAGE_KEY = 'gems-theme-config'

// El acento por defecto debe cumplir WCAG AA (>= 4.5:1 sobre texto blanco)
const DEFAULT: BrandConfig = {
  logo: null,
  accentColor: '#7c3aed',
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

// ─── Accesibilidad: contraste WCAG ────────────────────────────────
// El color de acento se usa como fondo de botones con texto blanco.
// Si el usuario elige un tono demasiado claro, lo oscurecemos hasta
// cumplir AA (4.5:1) manteniendo el matiz. Así ninguna org puede
// romper la legibilidad de la interfaz.

function hexToRgb(hex: string): [number, number, number] {
  return [
    parseInt(hex.slice(1, 3), 16),
    parseInt(hex.slice(3, 5), 16),
    parseInt(hex.slice(5, 7), 16),
  ]
}

function relativeLuminance(hex: string): number {
  const [r, g, b] = hexToRgb(hex).map(c => {
    const s = c / 255
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4)
  })
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

export function contrastRatio(hex1: string, hex2: string): number {
  const l1 = relativeLuminance(hex1)
  const l2 = relativeLuminance(hex2)
  const [hi, lo] = l1 >= l2 ? [l1, l2] : [l2, l1]
  return (hi + 0.05) / (lo + 0.05)
}

function hslToHex(h: number, s: number, l: number): string {
  const rgb = hslToRgbStr(h, s, l).split(' ').map(Number)
  return '#' + rgb.map(c => c.toString(16).padStart(2, '0')).join('')
}

/**
 * Devuelve un acento garantizado legible: contraste >= 4.5:1 contra
 * texto blanco. Conserva el matiz y la saturación; solo baja la
 * luminosidad lo necesario. Si el hex es inválido, cae al default.
 */
export function ensureAccessibleAccent(hex: string): string {
  if (!/^#[0-9a-f]{6}$/i.test(hex || '')) return DEFAULT.accentColor
  const normalized = hex.toLowerCase()
  if (contrastRatio(normalized, '#ffffff') >= 4.5) return normalized

  const [h, s, l] = hexToHsl(normalized)
  let lightness = Math.min(l, 60)
  let candidate = hslToHex(h, s, lightness)
  while (contrastRatio(candidate, '#ffffff') < 4.5 && lightness > 5) {
    lightness -= 2
    candidate = hslToHex(h, s, lightness)
  }
  return candidate
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
    // Guardia de contraste: aunque la BD traiga un color ilegible,
    // la interfaz nunca renderiza un acento que falle WCAG AA.
    const safeAccent = ensureAccessibleAccent(config.value.accentColor)
    const palette = generatePalette(safeAccent)
    for (const [shade, rgb] of Object.entries(palette)) {
      root.style.setProperty(`--p-${shade}`, rgb)
    }
    // Legacy helpers used in scoped CSS / inline styles
    root.style.setProperty('--brand-accent', safeAccent)
    root.style.setProperty('--brand-accent-light', hexToRgba(safeAccent, 0.12))
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
