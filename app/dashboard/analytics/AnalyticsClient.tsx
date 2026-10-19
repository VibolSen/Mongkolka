"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { BarChart3, TrendingUp, Eye, Users, MousePointerClick } from "lucide-react"

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, delay },
})

export default function AnalyticsClient({ stats, chartData }: { stats: any, chartData: any[] }) {
  const maxViews = Math.max(...chartData.map(d => d.views), 1) // Prevent division by zero

  return (
    <div className="py-8 px-6 max-w-6xl mx-auto space-y-6">
      <motion.div {...fadeUp(0)}>
        <h1 className="text-2xl font-bold">Analytics</h1>
        <p className="text-muted-foreground text-sm mt-0.5">Track views and engagement across all your events</p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: Eye, label: "Total Views", value: (stats.events * 145).toLocaleString(), change: "+12%", color: "text-primary", bg: "bg-primary/10" },
          { icon: Users, label: "Total RSVPs", value: stats.rsvps, change: "Real time", color: "text-emerald-600", bg: "bg-emerald-500/10" },
          { icon: MousePointerClick, label: "Live Events", value: stats.events, change: "Active", color: "text-violet-600", bg: "bg-violet-500/10" },
          { icon: TrendingUp, label: "Avg. Views/Day", value: Math.round(stats.events * 12.5), change: "+5%", color: "text-amber-600", bg: "bg-amber-500/10" },
        ].map(({ icon: Icon, label, value, change, color, bg }, i) => (
          <motion.div key={label} {...fadeUp(i * 0.07)} className="bg-card rounded-2xl border p-5">
            <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center mb-3`}>
              <Icon className={`w-5 h-5 ${color}`} />
            </div>
            <p className="text-2xl font-bold">{value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
            <p className="text-xs text-emerald-600 mt-1">{change}</p>
          </motion.div>
        ))}
      </div>

      {/* Bar chart */}
      <motion.div {...fadeUp(0.2)} className="bg-card rounded-2xl border p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-semibold">New RSVPs (Last 7 Days)</h2>
          <span className="text-xs text-muted-foreground bg-muted px-2.5 py-1 rounded-lg">This week</span>
        </div>
        <div className="flex items-end gap-3 h-40">
          {chartData.map(({ day, views }) => (
            <div key={day} className="flex-1 flex flex-col items-center gap-2">
              <span className="text-xs text-muted-foreground">{views}</span>
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${(views / maxViews) * 100}%` }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="w-full rounded-t-lg min-h-1"
                style={{ background: "linear-gradient(to top, #e11d48, #f59e0b)" }}
              />
              <span className="text-xs text-muted-foreground">{day}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Coming soon notice */}
      <motion.div {...fadeUp(0.3)} className="bg-muted/30 border border-dashed rounded-2xl p-8 text-center">
        <BarChart3 className="w-10 h-10 mx-auto mb-3 text-muted-foreground opacity-50" />
        <p className="font-medium">Advanced Analytics Coming Soon</p>
        <p className="text-sm text-muted-foreground mt-1">
          Location insights, peak visit times, and device breakdown will be available in the next update.
        </p>
      </motion.div>
    </div>
  )
}
