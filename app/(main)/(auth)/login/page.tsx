"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { motion } from "framer-motion"
import { Sparkles, Eye, EyeOff, ArrowRight } from "lucide-react"
import { useLanguage } from "@/components/language-provider"

export default function LoginPage() {
  const router = useRouter()
  const { t } = useLanguage()
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [showPw, setShowPw] = React.useState(false)
  const [error, setError] = React.useState("")
  const [loading, setLoading] = React.useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    })

    setLoading(false)
    if (res?.error) {
      setError(t("auth.login.error"))
    } else {
      const { getSession } = await import("next-auth/react")
      const session = await getSession()
      if (session?.user?.role === "ADMIN") {
        router.push("/admin")
      } else {
        router.push("/dashboard")
      }
      router.refresh()
    }
  }

  return (
    <div className="min-h-screen grid md:grid-cols-2">

      {/* ── Left: decorative panel ── */}
      <div className="hidden md:flex flex-col justify-between p-12 bg-gradient-to-br from-primary via-primary/90 to-primary/70 text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-60 h-60 rounded-full bg-accent/20 blur-3xl" />
        </div>

        <Link href="/" className="text-2xl font-bold tracking-tight">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70">Mongkol</span>
        </Link>

        <div>
          <div className="text-5xl mb-6">💍</div>
          <h2 className="text-3xl font-bold mb-3 leading-tight">
            {t("auth.login.tagline")}
          </h2>
          <p className="text-primary-foreground/75 leading-relaxed">
            {t("auth.login.taglineSub")}
          </p>
        </div>

        <div className="flex gap-6 text-sm text-primary-foreground/70">
          <div><p className="text-2xl font-bold text-primary-foreground">10K+</p><p>{t("hero.stats.events")}</p></div>
          <div><p className="text-2xl font-bold text-primary-foreground">98%</p><p>{t("hero.stats.couples")}</p></div>
          <div><p className="text-2xl font-bold text-primary-foreground">50+</p><p>{t("hero.stats.templates")}</p></div>
        </div>
      </div>

      {/* ── Right: form ── */}
      <div className="flex flex-col items-center justify-center p-8 md:p-16">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-sm"
        >
          {/* Mobile logo */}
          <Link href="/" className="md:hidden text-xl font-bold tracking-tight flex items-center gap-2 mb-8">
            <Sparkles className="w-5 h-5 text-primary" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 via-red-500 to-amber-500">Mongkol</span>
          </Link>

          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">{t("auth.login.title")}</h1>
            <p className="text-muted-foreground text-sm">{t("auth.login.subtitle")}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <Label htmlFor="email">{t("auth.login.email")}</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-11"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password">{t("auth.login.password")}</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPw ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-11 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="px-4 py-3 rounded-lg bg-destructive/10 text-destructive text-sm border border-destructive/20">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full h-11 rounded-xl shadow-sm shadow-primary/20" disabled={loading}>
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  {t("auth.login.submitting")}
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  {t("auth.login.submit")} <ArrowRight className="w-4 h-4" />
                </span>
              )}
            </Button>
          </form>

          <p className="text-sm text-center text-muted-foreground mt-6">
            {t("auth.login.noAccount")}{" "}
            <Link href="/register" className="text-primary font-medium hover:underline">
              {t("auth.login.createFree")}
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  )
}
