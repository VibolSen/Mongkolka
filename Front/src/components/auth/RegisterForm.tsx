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

export function RegisterForm() {
  const router = useRouter()
  const { login } = useAuth()
  const { t } = useLanguage()
  const [name, setName] = useState("")
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
      const res = await api.post("/auth/register", { name, email, password })
      if (res?.data?.token && res?.data?.user) {
        login(res.data.token, res.data.user)
        router.push("/user/dashboard")
      } else {
        setError(res?.message || "Registration failed")
      }
    } catch (err: any) {
      setError(err?.message || "Failed to create account. Please try again.")
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
          {t("auth.register.title") || "Create an account"}
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          {t("auth.register.subtitle") || "Start creating your personalized digital wedding invitation"}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="name">{t("auth.register.name") || "Full Name"}</Label>
          <Input
            id="name"
            type="text"
            placeholder="Sokha & Bopha"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="h-11"
            required
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="email">{t("auth.register.email") || "Email Address"}</Label>
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
          <Label htmlFor="password">{t("auth.register.password") || "Password"}</Label>
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
              Creating account...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              {t("auth.register.submit") || "Create Account"} <ArrowRight className="w-4 h-4" />
            </span>
          )}
        </Button>
      </form>

      <p className="text-sm text-center text-muted-foreground mt-6">
        {t("auth.register.hasAccount") || "Already have an account?"}{" "}
        <Link href="/login" className="text-primary font-medium hover:underline">
          {t("auth.register.signIn") || "Sign In"}
        </Link>
      </p>
    </motion.div>
  )
}
