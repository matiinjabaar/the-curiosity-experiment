import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from './locales/en.json'
import ar from './locales/ar.json'
import ckb from './locales/ckb.json'

const resources = {
  en: { translation: en },
  ar: { translation: ar },
  ckb: { translation: ckb }
}
const saved = typeof window !== 'undefined' ? localStorage.getItem('curiosity-language') : null

void i18n.use(initReactI18next).init({
  resources,
  lng: saved && ['en', 'ar', 'ckb'].includes(saved) ? saved : 'en',
  supportedLngs: ['en', 'ar', 'ckb'],
  fallbackLng: false,
  load: 'currentOnly',
  interpolation: { escapeValue: false },
  returnNull: false,
  returnEmptyString: false,
  react: { useSuspense: false }
})
i18n.on('languageChanged', lng => {
  document.documentElement.lang = lng
  document.documentElement.dir = lng === 'en' ? 'ltr' : 'rtl'
  localStorage.setItem('curiosity-language', lng)
})
export default i18n