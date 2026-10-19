"use client"

import React, { useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { QrCode, Search, LogOut } from "lucide-react"

export default function StaffLayout({ children }: { children: React.ReactNode }) {
  const { user, role, isLoading, logout } = useAuth()
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push("/login")
      } else if (role !== "STAFF" && role !== "ADMIN") {
        router.push("/user/dashboard")
      } else if (pathname === "/staff") {
        router.replace("/staff/scanner")
      }
    }
  }, [user, role, isLoading, pathname, router])

  if (isLoading || !user || (role !== "STAFF" && role !== "ADMIN")) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-muted-foreground font-medium">Verifying Staff Authorization...</p>
        </div>
      </div>
    )
  }

  const isScanner = pathname === "/staff/scanner"
  const isGuests = pathname === "/staff/guests"

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)] bg-muted/10">
      {/* Top Mobile Bar */}
      <div className="bg-background border-b px-4 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center text-white">
            <QrCode className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-foreground">Reception Check-in</h1>
            <p className="text-[11px] text-muted-foreground">{user.name || user.email}</p>
          </div>
        </div>

        <button
          onClick={logout}
          className="text-xs font-medium text-muted-foreground hover:text-destructive flex items-center gap-1 px-2.5 py-1.5 rounded-lg hover:bg-muted"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Exit</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="container max-w-lg mx-auto px-4 pt-4">
        <div className="grid grid-cols-2 p-1 bg-muted rounded-xl">
          <Link
            href="/staff/scanner"
            className={`flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all ${
              isScanner
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <QrCode className="w-4 h-4" />
            <span>QR Scanner</span>
          </Link>

          <Link
            href="/staff/guests"
            className={`flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all ${
              isGuests
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Search className="w-4 h-4" />
            <span>Guest Lookup</span>
          </Link>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 container max-w-lg mx-auto p-4 flex flex-col">{children}</main>
    </div>
  )
}
