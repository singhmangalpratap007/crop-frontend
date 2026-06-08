"use client"

import { useLanguage, type Language } from "@/lib/i18n/context"
import { Globe } from "lucide-react"

const LANGUAGE_LABELS: Record<Language, string> = {
  en: "EN",
  hi: "हि",
}

const LANGUAGE_NAMES: Record<Language, string> = {
  en: "English",
  hi: "हिंदी",
}

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage()

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "hi" : "en")
  }

  return (
    <button
      onClick={toggleLanguage}
      title={`Switch to ${language === "en" ? LANGUAGE_NAMES.hi : LANGUAGE_NAMES.en}`}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/20 bg-white/10 hover:bg-white/20 text-white text-sm font-medium transition-all duration-200 backdrop-blur-sm"
    >
      <Globe className="w-3.5 h-3.5 text-green-400" />
      <span className="min-w-[20px] text-center">{LANGUAGE_LABELS[language]}</span>
    </button>
  )
}
