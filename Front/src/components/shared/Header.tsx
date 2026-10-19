"use client"

import React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { useLanguage } from "@/components/language-provider"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/shared/theme-toggle"
import { LanguageToggle } from "@/components/shared/language-toggle"
import { ShieldCheck, QrCode, LogOut, User as UserIcon, LayoutDashboard, Sparkles } from "lucide-react"

export function Header() {
  const pathname = usePathname()
  const { user, role, logout } = useAuth()
  const { t } = useLanguage()

  // Do not render global header on public invitation pages (e/[slug] has its own specialized floating theme bar)
  if (pathname.startsWith("/e/")) {
    return null
  }

  const isAuthPage = pathname.startsWith("/login") || pathname.startsWith("/register")
  const isAdmin = pathname.startsWith("/admin")
  const isUserDashboard = pathname.startsWith("/user")
  const isStaff = pathname.startsWith("/staff")

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md transition-colors">
      <div className="container mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-2xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-rose-500 via-red-500 to-amber-500 group-hover:opacity-90 transition-opacity">
              Mongkol
            </span>
          </Link>

          {/* Role Badges */}
          {isAdmin && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
              <ShieldCheck className="w-3.5 h-3.5" />
              Admin Panel
            </span>
          )}

          {isUserDashboard && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
              <Sparkles className="w-3.5 h-3.5" />
              Host Dashboard
            </span>
          )}

          {isStaff && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
              <QrCode className="w-3.5 h-3.5" />
              Staff Receptionist
            </span>
          )}
        </div>

        {/* Center Nav for Public Pages only */}
        {!isAuthPage && !isAdmin && !isUserDashboard && !isStaff && (
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
            <Link href="/#features" className="hover:text-foreground transition-colors">
              {t("nav.features") || "Features"}
            </Link>
            <Link href="/#templates" className="hover:text-foreground transition-colors">
              {t("nav.templates") || "Templates"}
            </Link>
            <Link href="/#pricing" className="hover:text-foreground transition-colors">
              {t("nav.pricing") || "Pricing"}
            </Link>
          </nav>
        )}

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 border-r pr-3">
            <LanguageToggle />
            <ThemeToggle />
          </div>

          {/* State 1: In Admin / User / Staff Area */}
          {(isAdmin || isUserDashboard || isStaff) && (
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 text-sm">
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center font-medium text-xs">
                  {user?.name?.[0]?.toUpperCase() || <UserIcon className="w-4 h-4" />}
                </div>
                <span className="font-medium text-foreground">{user?.name || user?.email}</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={logout}
                className="text-muted-foreground hover:text-destructive gap-1.5 rounded-full"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          )}

          {/* State 2: Auth Page */}
          {isAuthPage && (
            <Link href="/">
              <Button variant="ghost" size="sm" className="rounded-full">
                Back to Home
              </Button>
            </Link>
          )}

          {/* State 3: Public Landing Page */}
          {!isAuthPage && !isAdmin && !isUserDashboard && !isStaff && (
            <>
              {user ? (
                <Link
                  href={
                    role === "ADMIN"
                      ? "/admin/dashboard"
                      : role === "STAFF"
                      ? "/staff/scanner"
                      : "/user/dashboard"
                  }
                >
                  <Button className="rounded-full gap-2 shadow-sm">
                    <LayoutDashboard className="w-4 h-4" />
                    Go to Dashboard
                  </Button>
                </Link>
              ) : (
                <div className="flex items-center gap-2">
                  <Link href="/login">
                    <Button variant="ghost" className="rounded-full px-5">
                      {t("nav.login") || "Login"}
                    </Button>
                  </Link>
                  <Link href="/register">
                    <Button className="rounded-full px-5 shadow-sm shadow-primary/20">
                      {t("nav.getStarted") || "Get Started"}
                    </Button>
                  </Link>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </header>
  )
}
