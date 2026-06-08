"use client"

import { Leaf } from "lucide-react"
import { useLanguage } from "@/lib/i18n/context"

export function Footer() {
  const { t } = useLanguage()

  return (
    <footer className="bg-primary text-primary-foreground py-8 mt-20">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center gap-2 mb-4">
          <Leaf className="w-5 h-5" />
          <span className="font-semibold">{t("footer.brand")}</span>
        </div>
        <p className="text-primary-foreground/80 text-sm">{t("footer.tagline")}</p>
        <p className="text-primary-foreground/60 text-xs mt-4">{t("footer.copyright")}</p>
      </div>
    </footer>
  )
}
