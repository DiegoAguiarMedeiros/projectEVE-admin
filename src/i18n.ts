import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

import ptBR from 'src/locales/pt-BR/translation.json'
import en from 'src/locales/en/translation.json'
import es from 'src/locales/es/translation.json'

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      'pt-BR': { translation: ptBR },
      pt: { translation: ptBR },
      en: { translation: en },
      es: { translation: es },
    },
    fallbackLng: 'pt-BR',
    interpolation: { escapeValue: false },
  })

export default i18n
