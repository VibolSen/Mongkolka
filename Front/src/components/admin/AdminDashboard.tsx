"use client"

import React, { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Users, BarChart3, LayoutGrid, CalendarDays, Music, ArrowRight } from "lucide-react"
import { api } from "@/lib/api"
import Link from "next/link"

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, delay, ease: "easeOut" as const },
})

export function AdminDashboard() {
  const [data, setData] = useState<{
    totalUsers: number
    totalEvents: number
    totalTemplates: number
    totalSongs: number
    recentUsers: Array<{ id: string; name: string | null; email: string; createdAt?: string }>
  }>({
    totalUsers: 0,
    totalEvents: 0,
    totalTemplates: 0,
    totalSongs: 0,
    recentUsers: [],
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadStats() {
      try {
        const res = await api.get("/admin/stats")
        if (res?.data) {
          setData(res.data)
        }
      } catch (err) {
        console.error("Failed to load admin stats", err)
      } finally {
        setLoading(false)
      }
    }
    loadStats()
  }, [])

  const statCards = [
    {
      icon: Users,
      label: "Total Registered Users",
      value: data.totalUsers,
      color: "from-blue-500/10 to-indigo-500/10 text-blue-600",
      href: "/admin/users",
    },
    {
      icon: CalendarDays,
      label: "Platform Events",
      value: data.totalEvents,
      color: "from-rose-500/10 to-pink-500/10 text-rose-600",
      href: "/admin/events",
    },
    {
      icon: LayoutGrid,
      label: "Wedding Templates",
      value: data.totalTemplates,
      color: "from-amber-500/10 to-yellow-500/10 text-amber-600",
      href: "/admin/templates",
    },
    {
      icon: Music,
      label: "Audio Library",
      value: data.totalSongs,
      color: "from-emerald-500/10 to-green-500/10 text-emerald-600",
      href: "/admin/songs",
    },
  ]

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <motion.div {...fadeUp(0)}>
        <h1 className="text-3xl font-bold tracking-tight">Platform Overview</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Real-time metrics, platform usage, and user growth.
        </p>
      </motion.div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, idx) => {
          const Icon = card.icon
          return (
            <motion.div
              key={card.label}
              {...fadeUp(0.05 * (idx + 1))}
              className="bg-card p-5 rounded-2xl border shadow-sm flex flex-col justify-between hover:border-primary/40 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  {card.label}
                </span>
                <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>

              <div className="mt-4 flex items-baseline justify-between">
                <span className="text-3xl font-black tracking-tight">
                  {loading ? (
                    <span className="inline-block w-8 h-7 bg-muted animate-pulse rounded" />
                  ) : (
                    card.value
                  )}
                </span>
                <Link
                  href={card.href}
                  className="text-xs font-medium text-primary hover:underline flex items-center gap-1"
                >
                  Manage <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Recent Users Table */}
      <motion.div {...fadeUp(0.25)} className="bg-card rounded-2xl border shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold">Recent Registered Users</h2>
            <p className="text-xs text-muted-foreground">Latest couples and platform accounts</p>
          </div>
          <Link href="/admin/users" className="text-xs font-semibold text-primary hover:underline">
            View All Users
          </Link>
        </div>

        {loading ? (
          <div className="py-8 text-center text-sm text-muted-foreground">Loading recent users...</div>
        ) : data.recentUsers.length === 0 ? (
          <div className="py-8 text-center text-sm text-muted-foreground">No registered users found yet.</div>
        ) : (
          <div className="divide-y">
            {data.recentUsers.map((u) => (
              <div key={u.id} className="py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                    {u.name?.[0]?.toUpperCase() || "U"}
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{u.name || "Unnamed Host"}</p>
                    <p className="text-xs text-muted-foreground">{u.email}</p>
                  </div>
                </div>
                <span className="text-xs text-muted-foreground">
                  {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "Recently"}
                </span>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  )
}
