import { useLanguage } from './languageContext'
import { t } from './uiStrings'

export function useUiT() {
  const lang = useLanguage()
  return (key) => t(lang, key)
}

