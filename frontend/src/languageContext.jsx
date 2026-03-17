import { createContext, useContext } from 'react'

const LanguageContext = createContext('en')

export function LanguageProvider({ value, children }) {
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  return useContext(LanguageContext)
}

