"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { motion } from "framer-motion"
import { Eye, EyeOff, ArrowRight } from "lucide-react"
import { useLanguage } from "@/components/language-provider"
import { useAuth } from "@/components/auth-provider"
import { api } from "@/lib/api"

export function LoginForm() {
  const router = useRouter()
  const { login } = useAuth()
  const { t } = useLanguage()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPw, setShowPw] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const res = await api.post("/auth/login", { email, password })
      if (res?.data?.token && res?.data?.user) {
        login(res.data.token, res.data.user)
        const userRole = res.data.user.role

        if (userRole === "ADMIN") {
          router.push("/admin/dashboard")
        } else if (userRole === "STAFF") {
          router.push("/staff/scanner")
        } else {
          router.push("/user/dashboard")
        }
      } else {
        setError(res?.message || "Invalid credentials")
      }
    } catch (err: any) {
      setError(err?.message || "Login failed. Please check your email and password.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-card p-6 md:p-8 rounded-2xl border shadow-sm w-full max-w-md mx-auto"
    >
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          {t("auth.login.title") || "Welcome back"}
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          {t("auth.login.subtitle") || "Enter your email to sign in to your Mongkol account"}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="email">{t("auth.login.email") || "Email"}</Label>
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
          <Label htmlFor="password">{t("auth.login.password") || "Password"}</Label>
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
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {error && (
          <div className="px-4 py-2.5 rounded-lg bg-destructive/10 text-destructive text-sm border border-destructive/20 font-medium">
            {error}
          </div>
        )}

        <Button type="submit" className="w-full h-11 rounded-xl shadow-sm" disabled={loading}>
          {loading ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              Signing in...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              {t("auth.login.submit") || "Sign In"} <ArrowRight className="w-4 h-4" />
            </span>
          )}
        </Button>
      </form>

      <p className="text-sm text-center text-muted-foreground mt-6">
        {t("auth.login.noAccount") || "Don't have an account?"}{" "}
        <Link href="/register" className="text-primary font-medium hover:underline">
          {t("auth.login.createFree") || "Register for free"}
        </Link>
      </p>
    </motion.div>
  )
}
