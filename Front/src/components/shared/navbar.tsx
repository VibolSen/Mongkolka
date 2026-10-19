"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/shared/theme-toggle"
import { LanguageToggle } from "@/components/shared/language-toggle"
import { useLanguage } from "@/components/language-provider"

export function Navbar() {
  const pathname = usePathname()
  const { t } = useLanguage()

  if (pathname.startsWith("/dashboard") || pathname.startsWith("/admin")) return null;

  return (
    <header className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b">
      <div className="container mx-auto px-6 md:px-10 h-16 flex items-center justify-between relative">
        <Link href="/" className="text-xl font-bold font-sans tracking-tight flex items-center gap-2">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 via-red-500 to-amber-500">Mongkol</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1 text-sm font-medium absolute left-1/2 -translate-x-1/2">
          <Link href="#features" className="px-3 py-1.5 rounded-md hover:bg-muted hover:text-primary transition-colors">{t("nav.features")}</Link>
          <Link href="#templates" className="px-3 py-1.5 rounded-md hover:bg-muted hover:text-primary transition-colors">{t("nav.templates")}</Link>
          <Link href="#pricing" className="px-3 py-1.5 rounded-md hover:bg-muted hover:text-primary transition-colors">{t("nav.pricing")}</Link>
        </nav>

        <div className="flex items-center gap-2 md:gap-4">
          <div className="flex items-center gap-1 mr-2 border-r pr-4">
            <LanguageToggle />
            <ThemeToggle />
          </div>
          
          <div className="hidden sm:flex items-center gap-2">
            <Link href="/login">
              <Button variant="ghost" className="rounded-full px-6">{t("nav.login")}</Button>
            </Link>
            <Link href="/register">
              <Button className="rounded-full px-6 shadow-sm shadow-primary/20">{t("nav.getStarted")}</Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
