"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Leaf, Lock, User, ArrowRight, Sprout, Tractor, AlertCircle } from "lucide-react"
import { LanguageSwitcher } from "@/components/language-switcher"
import { useLanguage } from "@/lib/i18n/context"

export default function LoginPage() {
  const router = useRouter()
  const { t } = useLanguage()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = (e?: React.FormEvent | React.MouseEvent | React.KeyboardEvent) => {
    if (e && e.preventDefault) e.preventDefault()
    setError("")
    setIsLoading(true)

    setTimeout(() => {
      if (username === "admin" && password === "admin") {
        router.push("/dashboard")
      } else {
        setError(t("login.invalidCredentials"))
        setIsLoading(false)
      }
    }, 1000)
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden bg-black">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <Image src="/login-bg.png" alt="Agricultural Background" fill className="object-cover blur-[2px] opacity-80" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
      </div>

      {/* Language switcher top-right */}
      <div className="absolute top-4 right-4 z-20">
        <LanguageSwitcher />
      </div>

      {/* Floating badges */}
      <div className="absolute top-10 left-10 md:left-20 animate-pulse delay-700 hidden md:block">
        <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/20 text-white shadow-lg">
          <Sprout className="h-6 w-6 text-green-400" />
          <div className="text-sm font-medium">
            <div className="text-xs text-green-200">{t("login.cropHealth")}</div>
            <div>{t("login.cropHealthValue")}</div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-20 right-10 md:right-20 animate-bounce duration-[3000ms] hidden md:block">
        <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/20 text-white shadow-lg">
          <Tractor className="h-6 w-6 text-yellow-400" />
          <div className="text-sm font-medium">
            <div className="text-xs text-yellow-200">{t("login.fieldStatus")}</div>
            <div>{t("login.fieldStatusValue")}</div>
          </div>
        </div>
      </div>

      {/* Login Card */}
      <Card className="w-full max-w-md relative z-10 border-white/10 bg-black/40 backdrop-blur-xl shadow-2xl ring-1 ring-white/10">
        <CardHeader className="space-y-2 text-center text-white pb-8">
          <div className="flex justify-center mb-2">
            <div className="p-4 bg-gradient-to-br from-green-500/30 to-emerald-600/30 rounded-full border border-green-400/30 ring-4 ring-green-900/20 shadow-[0_0_30px_-5px_rgba(16,185,129,0.3)]">
              <Leaf className="w-8 h-8 text-green-400" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-green-100 to-green-200">
            {t("login.title")}
          </CardTitle>
          <CardDescription className="text-gray-300 text-base">{t("login.subtitle")}</CardDescription>
        </CardHeader>

        <div onKeyDown={(e) => { if (e.key === "Enter") handleLogin(e) }}>
          <CardContent className="space-y-6">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 flex items-center gap-2 text-red-200 text-sm animate-in fade-in slide-in-from-top-2">
                <AlertCircle className="h-4 w-4" />
                {error}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="username" className="text-gray-200 font-medium ml-1">{t("login.username")}</Label>
              <div className="relative group">
                <User className="absolute left-3 top-2.5 h-5 w-5 text-gray-400 group-focus-within:text-green-400 transition-colors" />
                <Input
                  id="username"
                  placeholder="admin"
                  className="pl-10 h-11 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus-visible:ring-green-500/50 focus-visible:border-green-500/50 hover:bg-white/10 transition-all rounded-lg"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={isLoading}
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="password" className="text-gray-200 font-medium ml-1">{t("login.password")}</Label>
                <Link href="#" className="text-xs text-green-400 hover:text-green-300 transition-colors">
                  {t("login.forgotPassword")}
                </Link>
              </div>
              <div className="relative group">
                <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400 group-focus-within:text-green-400 transition-colors" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="pl-10 h-11 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus-visible:ring-green-500/50 focus-visible:border-green-500/50 hover:bg-white/10 transition-all rounded-lg"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4 pt-4">
            <Button
              type="button"
              onClick={handleLogin}
              className="w-full h-11 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-semibold shadow-lg shadow-green-900/20 transition-all duration-300 transform hover:scale-[1.01] border border-green-500/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              disabled={isLoading}
            >
              {isLoading ? t("login.signingIn") : t("login.signIn")}
              {!isLoading && <ArrowRight className="ml-2 h-4 w-4" />}
            </Button>
            <div className="text-center text-sm text-gray-400">
              {t("login.noAccount")}{" "}
              <Link href="#" className="text-green-400 hover:text-green-300 font-medium hover:underline transition-all">
                {t("login.signUp")}
              </Link>
            </div>
          </CardFooter>
        </div>
      </Card>

      <div className="absolute bottom-6 text-center w-full z-10 text-xs text-gray-500/60 mix-blend-plus-lighter">
        &copy; 2026 Smart Crop Advisory System. {t("login.footer")}.
      </div>
    </div>
  )
}
