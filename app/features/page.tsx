"use client"

import Link from "next/link"
import Image from "next/image"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card } from "@/components/ui/card"
import { Sprout, Cloud, BarChart3, ShieldCheck, Zap, Globe, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/lib/i18n/context"

export default function FeaturesPage() {
  const { t } = useLanguage()

  return (
    <main className="flex flex-col min-h-screen bg-[#050A08] text-white selection:bg-green-500/30">
      <Header />

      {/* Hero */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image src="/features-bg.png" alt="Background" fill className="object-cover opacity-60" priority />
          <div className="absolute inset-0 bg-gradient-to-b from-[#050A08]/90 via-[#050A08]/60 to-[#050A08]" />
        </div>
        <div className="relative z-10 max-w-5xl mx-auto text-center space-y-6">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-green-100 to-green-200">
            {t("features.title1")} <br />
            <span className="text-green-500">{t("features.title2")}</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">{t("features.subtitle")}</p>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pb-32">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

          <div className="group relative bg-[#0F1C15]/50 border border-green-900/20 rounded-3xl p-8 hover:bg-green-900/20 transition-all duration-300 hover:-translate-y-2 overflow-hidden backdrop-blur-sm">
            <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-bl-full -mr-8 -mt-8 transition-all group-hover:bg-green-500/20" />
            <div className="w-14 h-14 bg-green-500/20 rounded-2xl flex items-center justify-center mb-6 text-green-400 group-hover:scale-110 transition-transform">
              <Sprout className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold mb-4 text-green-50">{t("features.soilAnalysis")}</h3>
            <p className="text-gray-400 leading-relaxed">{t("features.soilAnalysisDesc")}</p>
          </div>

          <div className="group relative bg-[#0F1C15]/50 border border-blue-900/20 rounded-3xl p-8 hover:bg-blue-900/20 transition-all duration-300 hover:-translate-y-2 overflow-hidden backdrop-blur-sm">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-bl-full -mr-8 -mt-8 transition-all group-hover:bg-blue-500/20" />
            <div className="w-14 h-14 bg-blue-500/20 rounded-2xl flex items-center justify-center mb-6 text-blue-400 group-hover:scale-110 transition-transform">
              <Cloud className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold mb-4 text-blue-50">{t("features.climate")}</h3>
            <p className="text-gray-400 leading-relaxed">{t("features.climateDesc")}</p>
          </div>

          <div className="group relative bg-[#0F1C15]/50 border border-amber-900/20 rounded-3xl p-8 hover:bg-amber-900/20 transition-all duration-300 hover:-translate-y-2 overflow-hidden backdrop-blur-sm">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-bl-full -mr-8 -mt-8 transition-all group-hover:bg-amber-500/20" />
            <div className="w-14 h-14 bg-amber-500/20 rounded-2xl flex items-center justify-center mb-6 text-amber-400 group-hover:scale-110 transition-transform">
              <BarChart3 className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold mb-4 text-amber-50">{t("features.yieldAI")}</h3>
            <p className="text-gray-400 leading-relaxed">{t("features.yieldAIDesc")}</p>
          </div>

          <div className="group relative bg-[#0F1C15]/50 border border-purple-900/20 rounded-3xl p-8 hover:bg-purple-900/20 transition-all duration-300 hover:-translate-y-2 overflow-hidden backdrop-blur-sm">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-bl-full -mr-8 -mt-8 transition-all group-hover:bg-purple-500/20" />
            <div className="w-14 h-14 bg-purple-500/20 rounded-2xl flex items-center justify-center mb-6 text-purple-400 group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold mb-4 text-purple-50">{t("features.risk")}</h3>
            <p className="text-gray-400 leading-relaxed">{t("features.riskDesc")}</p>
          </div>

          <div className="group relative bg-[#0F1C15]/50 border border-teal-900/20 rounded-3xl p-8 hover:bg-teal-900/20 transition-all duration-300 hover:-translate-y-2 overflow-hidden backdrop-blur-sm">
            <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/10 rounded-bl-full -mr-8 -mt-8 transition-all group-hover:bg-teal-500/20" />
            <div className="w-14 h-14 bg-teal-500/20 rounded-2xl flex items-center justify-center mb-6 text-teal-400 group-hover:scale-110 transition-transform">
              <Globe className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold mb-4 text-teal-50">{t("features.sustainable")}</h3>
            <p className="text-gray-400 leading-relaxed">{t("features.sustainableDesc")}</p>
          </div>

          <div className="relative bg-gradient-to-br from-green-900/80 to-green-800/60 border border-green-500/30 rounded-3xl p-8 flex flex-col justify-center items-start overflow-hidden shadow-2xl">
            <h3 className="text-3xl font-bold mb-4 text-white relative z-10">{t("features.readyTitle")}</h3>
            <p className="text-green-100 mb-8 relative z-10">{t("features.readyDesc")}</p>
            <Link href="/recommend" className="relative z-10 w-full">
              <Button className="w-full h-12 bg-white text-green-900 font-bold rounded-xl hover:bg-gray-100 transition-all">
                {t("features.getRecommendation")} <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>

        </div>
      </section>

      <Footer />
    </main>
  )
}
