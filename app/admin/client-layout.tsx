"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSession } from "next-auth/react"
import { motion, AnimatePresence } from "framer-motion"
import { ThemeToggle } from "@/components/shared/theme-toggle"
import {
  LayoutDashboard, Users, LayoutGrid, BarChart3, 
  Settings, LogOut, Menu, X, ChevronRight, Bell, ShieldCheck, Music
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { signOut } from "next-auth/react"

const adminNavItems = [
  { href: "/admin",            icon: LayoutDashboard, label: "Overview", exact: true },
  { href: "/admin/users",      icon: Users,           label: "All Users"     },
  { href: "/admin/events",     icon: BarChart3,       label: "Platform Events"},
  { href: "/admin/templates",  icon: LayoutGrid,      label: "Templates"     },
  { href: "/admin/songs",      icon: Music,           label: "Manage Songs"  },
  { href: "/admin/settings",   icon: Settings,        label: "Settings"      },
]

interface SidebarProps {
  open: boolean
  onClose: () => void
}

function AdminSidebar({ open, onClose }: SidebarProps) {
  const pathname = usePathname()
  const { data: session } = useSession()
  const userName = session?.user?.name ?? "Admin"
  const userEmail = session?.user?.email ?? ""
  const initial = userName[0]?.toUpperCase() ?? "A"

  const content = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-5 py-6 flex items-center justify-between border-b border-border/50">
        <Link href="/" className="flex items-center gap-2 text-lg font-bold tracking-tight">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <ShieldCheck className="w-4 h-4 text-primary-foreground" />
          </div>
          Mongkol Admin
        </Link>
        <button onClick={onClose} className="md:hidden text-muted-foreground hover:text-foreground">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <p className="px-3 py-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
          Platform Management
        </p>
        {adminNavItems.map(({ href, icon: Icon, label, exact }) => {
          const active = exact ? pathname === href : (pathname === href || (href !== "/admin" && pathname.startsWith(href)))
          return (
            <Link key={href} href={href} onClick={onClose}>
              <div className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                active
                  ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}>
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span className="flex-1">{label}</span>
                {active && <ChevronRight className="w-3.5 h-3.5 opacity-70" />}
              </div>
            </Link>
          )
        })}
      </nav>

      {/* Bottom */}
      <div className="px-3 pb-4 space-y-1 border-t border-border/50 pt-4">
        {/* Admin User */}
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-muted transition-colors cursor-pointer">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            {initial}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{userName}</p>
            <p className="text-[11px] text-muted-foreground truncate">{userEmail}</p>
          </div>
        </div>

        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-64 border-r bg-card h-screen sticky top-0 flex-shrink-0">
        {content}
      </aside>

      {/* Mobile overlay */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden"
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", damping: 28, stiffness: 250 }}
              className="fixed left-0 top-0 bottom-0 z-50 w-64 bg-card border-r shadow-xl md:hidden flex flex-col"
            >
              {content}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = React.useState(false)
  const pathname = usePathname()

  React.useEffect(() => {
    setSidebarOpen(false)
  }, [pathname])

  const currentPage = adminNavItems.find(({ href }) =>
    href === pathname || (href !== "/admin" && pathname.startsWith(href))
  )?.label ?? "Overview"

  return (
    <div className="flex min-h-screen bg-muted/20">
      <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0">
        {/* ── Top bar ── */}
        <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b px-4 md:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden text-muted-foreground hover:text-foreground"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h2 className="text-sm font-semibold">{currentPage}</h2>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-primary" />
            </Button>
            <ThemeToggle />
          </div>
        </header>

        {/* ── Page content ── */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
