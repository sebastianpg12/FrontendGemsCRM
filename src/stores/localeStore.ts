import { defineStore } from 'pinia'
import { ref } from 'vue'
import { translations, type Locale } from '../i18n/translations'

export const useLocaleStore = defineStore('locale', () => {
  const locale = ref<Locale>('es')

  function t(key: string, fallback?: string): string {
    return translations[locale.value][key]
      ?? translations['es'][key]
      ?? fallback
      ?? key
  }

  function setLocale(l: Locale) {
    locale.value = l
    document.documentElement.lang = l
  }

  return { locale, t, setLocale }
})
