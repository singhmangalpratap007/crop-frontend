"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Leaf, Menu, X, Microscope } from "lucide-react"
import { useState } from "react"
import { LanguageSwitcher } from "./language-switcher"
import { useLanguage } from "@/lib/i18n/context"

export function Header() {
  const { t } = useLanguage()
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  const navLinks = [
    { href: "/dashboard", label: t("nav.home") },
    { href: "/recommend", label: t("nav.recommend") },
    { href: "/features", label: t("nav.features") },
    { href: "/disease", label: t("nav.disease"), icon: Microscope },
  ]

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-md border-b border-white/10 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Brand */}
        <Link href="/dashboard" className="flex items-center gap-2 text-white font-bold text-xl tracking-tight">
          <Leaf className="w-6 h-6 text-green-400" />
          <span className="hidden sm:inline">{t("nav.brand")}</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex gap-6 items-center">
          {navLinks.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-1 text-sm font-medium transition-colors ${
                pathname === href ? "text-green-400" : "text-gray-200 hover:text-green-400"
              }`}
            >
              {Icon && <Icon className="w-4 h-4" />}
              {label}
            </Link>
          ))}

          <LanguageSwitcher />

          <Link
            href="/"
            className="px-5 py-2 bg-green-600/90 text-white rounded-full text-sm font-medium hover:bg-green-500 transition-all shadow-lg shadow-green-900/20"
          >
            {t("nav.logout")}
          </Link>
        </nav>

        {/* Mobile: language + hamburger */}
        <div className="flex md:hidden items-center gap-3">
          <LanguageSwitcher />
          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="text-white p-1"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {mobileOpen && (
        <div className="md:hidden bg-black/80 backdrop-blur-xl border-t border-white/10 px-6 py-4 space-y-3 animate-in slide-in-from-top-2 duration-200">
          {navLinks.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-2 text-sm font-medium py-2 transition-colors ${
                pathname === href ? "text-green-400" : "text-gray-200"
              }`}
            >
              {Icon && <Icon className="w-4 h-4" />}
              {label}
            </Link>
          ))}
          <Link
            href="/"
            onClick={() => setMobileOpen(false)}
            className="block w-full text-center px-5 py-2 bg-green-600/90 text-white rounded-full text-sm font-medium mt-2"
          >
            {t("nav.logout")}
          </Link>
        </div>
      )}
    </header>
  )
}
