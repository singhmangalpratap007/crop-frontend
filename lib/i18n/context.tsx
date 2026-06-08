"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import en, { type Translations } from "./translations/en"
import hi from "./translations/hi"

export type Language = "en" | "hi"

const translations: Record<Language, Translations> = { en, hi }

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | null>(null)

function getNestedValue(obj: Record<string, unknown>, keys: string[]): string {
  let current: unknown = obj
  for (const key of keys) {
    if (typeof current !== "object" || current === null) return ""
    current = (current as Record<string, unknown>)[key]
  }
  return typeof current === "string" ? current : ""
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const stored = localStorage.getItem("crop-language") as Language | null
    if (stored && translations[stored]) {
      setLanguageState(stored)
      return
    }
    // Auto-detect browser language on first visit
    const browserLang = navigator.language.split("-")[0] as Language
    if (translations[browserLang]) {
      setLanguageState(browserLang)
      localStorage.setItem("crop-language", browserLang)
    }
  }, [])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    localStorage.setItem("crop-language", lang)
  }

  const t = (key: string): string => {
    const keys = key.split(".")
    const translated = getNestedValue(translations[language] as unknown as Record<string, unknown>, keys)
    if (!translated) {
      return getNestedValue(translations.en as unknown as Record<string, unknown>, keys) || key
    }
    return translated
  }

  if (!mounted) {
    // Return English during SSR to avoid hydration mismatch
    const tEn = (key: string): string => {
      const keys = key.split(".")
      return getNestedValue(translations.en as unknown as Record<string, unknown>, keys) || key
    }
    return <LanguageContext.Provider value={{ language: "en", setLanguage: () => {}, t: tEn }}>{children}</LanguageContext.Provider>
  }

  return <LanguageContext.Provider value={{ language, setLanguage, t }}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider")
  return ctx
}
