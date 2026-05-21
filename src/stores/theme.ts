import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export interface ThemeConfig {
  logo: string | null
  accentColor: string
  brandName: string
  darkMode: boolean
}

const STORAGE_KEY = 'gems-theme-config'

const DEFAULT: ThemeConfig = {
  logo: null,
  accentColor: '#8b5cf6',
  brandName: 'GEMS CRM',
  darkMode: false
}

export const useThemeStore = defineStore('theme', () => {
  const config = ref<ThemeConfig>({ ...DEFAULT })

  function load() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) Object.assign(config.value, JSON.parse(saved))
    } catch {}
    apply()
  }

  function apply() {
    const root = document.documentElement
    root.style.setProperty('--brand-accent', config.value.accentColor)
    root.style.setProperty('--brand-accent-light', hexToRgba(config.value.accentColor, 0.12))
    root.classList.toggle('dark', config.value.darkMode)
  }

  function update(patch: Partial<ThemeConfig>) {
    Object.assign(config.value, patch)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config.value))
    apply()
  }

  function reset() {
    config.value = { ...DEFAULT }
    localStorage.removeItem(STORAGE_KEY)
    apply()
  }

  // Aplica acento inmediatamente cuando cambia en el store (live preview)
  watch(() => config.value.accentColor, apply)
  watch(() => config.value.darkMode, apply)

  return { config, load, apply, update, reset }
})

function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r},${g},${b},${alpha})`
}
