"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { motion, AnimatePresence } from "framer-motion"
import {
  LayoutDashboard,
  Users,
  LayoutGrid,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight,
  ShieldCheck,
  Music,
} from "lucide-react"

const adminNavItems = [
  { href: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/admin/users", icon: Users, label: "All Users" },
  { href: "/admin/events", icon: BarChart3, label: "Platform Events" },
  { href: "/admin/templates", icon: LayoutGrid, label: "Templates" },
  { href: "/admin/songs", icon: Music, label: "Manage Songs" },
  { href: "/admin/settings", icon: Settings, label: "Settings" },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, role, isLoading, logout } = useAuth()
  const pathname = usePathname()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push("/login")
      } else if (role !== "ADMIN") {
        router.push("/user/dashboard")
      } else if (pathname === "/admin") {
        router.replace("/admin/dashboard")
      }
    }
  }, [user, role, isLoading, pathname, router])

  useEffect(() => {
    setSidebarOpen(false)
  }, [pathname])

  if (isLoading || !user || role !== "ADMIN") {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-muted-foreground font-medium">Verifying Admin Access...</p>
        </div>
      </div>
    )
  }

  const initial = user?.name?.[0]?.toUpperCase() || "A"

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Brand */}
      <div className="px-5 py-5 flex items-center justify-between border-b">
        <Link href="/admin/dashboard" className="flex items-center gap-2.5 text-base font-bold tracking-tight">
          <div className="w-8 h-8 rounded-lg bg-rose-500 flex items-center justify-center text-white shadow-sm">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <span className="text-foreground">Admin Portal</span>
        </Link>
        <button
          onClick={() => setSidebarOpen(false)}
          className="md:hidden text-muted-foreground hover:text-foreground p-1"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <p className="px-3 py-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
          Platform Controls
        </p>
        {adminNavItems.map(({ href, icon: Icon, label }) => {
          const active = pathname === href || (href !== "/admin/dashboard" && pathname.startsWith(href))
          return (
            <Link key={href} href={href}>
              <div
                className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  active
                    ? "bg-rose-500 text-white shadow-sm shadow-rose-500/20"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span className="flex-1">{label}</span>
                {active && <ChevronRight className="w-3.5 h-3.5 opacity-70" />}
              </div>
            </Link>
          )
        })}
      </nav>

      {/* Footer Profile */}
      <div className="p-3 border-t space-y-1">
        <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-muted/50">
          <div className="w-8 h-8 rounded-full bg-rose-500/20 text-rose-600 flex items-center justify-center text-xs font-bold flex-shrink-0">
            {initial}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate text-foreground">{user.name || "Administrator"}</p>
            <p className="text-[11px] text-muted-foreground truncate">{user.email}</p>
          </div>
        </div>

        <button
          onClick={logout}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  )

  return (
    <div className="flex min-h-[calc(100vh-4rem)] bg-muted/20">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-64 border-r bg-card flex-shrink-0 sticky top-16 h-[calc(100vh-4rem)]">
        {sidebarContent}
      </aside>

      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden"
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", damping: 28, stiffness: 250 }}
              className="fixed left-0 top-0 bottom-0 z-50 w-64 bg-card border-r shadow-xl md:hidden flex flex-col"
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <div className="flex-1 flex flex-col min-w-0">
        <div className="md:hidden flex items-center px-4 py-2 border-b bg-background">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-muted-foreground hover:text-foreground p-1"
          >
            <Menu className="w-5 h-5" />
          </button>
          <span className="ml-3 text-sm font-semibold">Admin Menu</span>
        </div>
        <div className="flex-1 p-6 md:p-8 overflow-y-auto">{children}</div>
      </div>
    </div>
  )
}
