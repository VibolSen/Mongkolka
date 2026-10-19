"use client"

import React, { createContext, useContext, useEffect, useState } from "react"
import { dictionaries, Locale } from "@/lib/i18n"

type LanguageContextType = {
  lang: Locale
  setLang: (lang: Locale) => void
  t: (keyPath: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Locale>("EN")

  useEffect(() => {
    // Load from local storage if available
    const saved = localStorage.getItem("mongkol-lang") as Locale
    if (saved === "EN" || saved === "KM") {
      setLangState(saved)
    }
  }, [])

  const setLang = (newLang: Locale) => {
    setLangState(newLang)
    localStorage.setItem("mongkol-lang", newLang)
  }

  // A simple function to retrieve nested translation keys like "hero.title"
  const t = (keyPath: string): string => {
    const keys = keyPath.split('.')
    let current: any = dictionaries[lang]
    
    for (const key of keys) {
      if (current[key] === undefined) {
        console.warn(`Translation key not found: ${keyPath}`)
        return keyPath
      }
      current = current[key]
    }
    
    return current as string
  }

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
