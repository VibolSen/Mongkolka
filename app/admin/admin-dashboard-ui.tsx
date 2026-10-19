"use client"

import { motion } from "framer-motion"
import { Users, BarChart3, LayoutGrid, CalendarDays, ArrowRight, Music } from "lucide-react"

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.45, delay, ease: "easeOut" as const },
})

interface AdminDashboardUIProps {
  totalUsers: number;
  totalEvents: number;
  premiumTemplates: number;
  totalSongs: number;
  recentUsers: Array<{
    id: string;
    name: string | null;
    email: string | null;
  }>;
}

function timeAgo(date: Date) {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000)
  let interval = seconds / 31536000
  if (interval > 1) return Math.floor(interval) + " years ago"
  interval = seconds / 2592000
  if (interval > 1) return Math.floor(interval) + " months ago"
  interval = seconds / 86400
  if (interval > 1) return Math.floor(interval) + " days ago"
  interval = seconds / 3600
  if (interval > 1) return Math.floor(interval) + " hours ago"
  interval = seconds / 60
  if (interval > 1) return Math.floor(interval) + " mins ago"
  return Math.floor(seconds) + " seconds ago"
}

export function AdminDashboardUI({
  totalUsers,
  totalEvents,
  premiumTemplates,
  totalSongs,
  recentUsers
}: AdminDashboardUIProps) {
  const stats = [
    { icon: Users,        label: "Total Users",      value: totalUsers.toString(),  trend: "" },
    { icon: CalendarDays, label: "Active Events",    value: totalEvents.toString(), trend: ""  },
    { icon: LayoutGrid,   label: "Premium Templates",value: premiumTemplates.toString(), trend: ""   },
    { icon: Music,        label: "Total Songs",      value: totalSongs.toString(), trend: "" },
  ]

  return (
    <div className="py-8">
      <div className="container px-6 md:px-10 mx-auto max-w-6xl space-y-8">

        {/* Header */}
        <motion.div {...fadeUp(0)}>
          <h1 className="text-3xl font-bold">Platform Overview</h1>
          <p className="text-muted-foreground text-sm mt-1">High-level statistics and recent platform activity</p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map(({ icon: Icon, label, value, trend }, i) => (
            <motion.div key={label} {...fadeUp(i * 0.07)}
              className="bg-card rounded-2xl border p-5 flex flex-col gap-4">
              <div className="flex items-start justify-between">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                {trend && (
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                    trend.startsWith("+") ? "bg-emerald-500/10 text-emerald-600" : "bg-muted text-muted-foreground"
                  }`}>
                    {trend}
                  </span>
                )}
              </div>
              <div>
                <p className="text-2xl font-bold">{value}</p>
                <p className="text-xs text-muted-foreground">{label}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Main Content Area */}
        <div className="grid lg:grid-cols-3 gap-6">
          
          <motion.div {...fadeUp(0.2)} className="lg:col-span-2 bg-card rounded-2xl border p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-semibold text-lg">Recent Users</h2>
              <button className="text-xs text-primary hover:text-primary/80 font-medium flex items-center gap-1">
                View All <ArrowRight className="w-3 h-3" />
              </button>
            </div>
            <div className="space-y-4">
              {recentUsers.map((user, i) => {
                const name = user.name || "Unknown User"
                const initial = name[0]?.toUpperCase() ?? "?"
                const timestamp = new Date(parseInt(user.id.substring(0, 8), 16) * 1000)

                return (
                  <div key={user.id} className="flex items-center justify-between p-3 rounded-xl bg-muted/40 hover:bg-muted/60 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                        {initial}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{name}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-xs">
                      <span className="px-2 py-1 rounded-md font-medium bg-muted text-muted-foreground">
                        Free
                      </span>
                      <span className="text-muted-foreground hidden sm:block">
                        {timeAgo(timestamp)}
                      </span>
                    </div>
                  </div>
                )
              })}
              
              {recentUsers.length === 0 && (
                <div className="p-4 text-center text-sm text-muted-foreground">
                  No users found.
                </div>
              )}
            </div>
          </motion.div>

          <motion.div {...fadeUp(0.3)} className="bg-card rounded-2xl border p-6">
            <h2 className="font-semibold text-lg mb-5">System Status</h2>
            <div className="space-y-4">
              <div className="p-4 rounded-xl border bg-emerald-500/5 border-emerald-500/20 flex gap-3">
                <div className="w-2 h-2 mt-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400">All Systems Operational</p>
                  <p className="text-xs text-emerald-600/70 dark:text-emerald-500 mt-1">Database, Auth, and Storage are running smoothly.</p>
                </div>
              </div>
              
              <div className="pt-4 border-t space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Server Load</span>
                  <span className="font-medium">24%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">DB Connections</span>
                  <span className="font-medium">Stable</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Storage Used</span>
                  <span className="font-medium">Normal</span>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  )
}
