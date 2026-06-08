"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { DiseaseDetection } from "@/components/disease-detection"
import { Microscope } from "lucide-react"
import { useLanguage } from "@/lib/i18n/context"

export default function DiseasePage() {
  const { t } = useLanguage()

  return (
    <main className="flex flex-col min-h-screen bg-[#060e08] text-white">
      <Header />

      {/* Page Header */}
      <section className="pt-28 pb-8 px-6 text-center">
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500/20 rounded-2xl mb-2">
            <Microscope className="w-8 h-8 text-green-400" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-green-100 to-green-200">
            {t("disease.pageTitle")}
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
            {t("disease.pageSubtitle")}
          </p>
        </div>
      </section>

      {/* Supported crops pills */}
      <section className="px-6 pb-8">
        <div className="max-w-3xl mx-auto flex flex-wrap justify-center gap-2">
          {(["tomato", "potato", "corn", "rice", "cotton", "wheat"] as const).map((crop) => (
            <span
              key={crop}
              className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-xs text-gray-300 capitalize"
            >
              {t(`disease.crops.${crop}`)}
            </span>
          ))}
        </div>
      </section>

      {/* Main Detection UI */}
      <section className="flex-1 px-6 pb-16">
        <div className="max-w-3xl mx-auto">
          <DiseaseDetection />
        </div>
      </section>

      <Footer />
    </main>
  )
}
