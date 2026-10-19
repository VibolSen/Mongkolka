"use client"

import React, { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { BarChart3, TrendingUp, Users, Heart, Calendar } from "lucide-react"
import { api } from "@/lib/api"

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, delay },
})

export function AnalyticsView() {
  const [events, setEvents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        const res = await api.get("/events")
        setEvents(res?.data || res?.events || [])
      } catch (err) {
        console.error("Failed to load events for analytics", err)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const totalEvents = events.length
  const totalGuests = events.reduce((acc, ev) => acc + (ev.guests?.length || 0), 0)
  const attendingGuests = events.reduce(
    (acc, ev) =>
      acc + (ev.guests?.filter((g: any) => g.status === "ATTENDING" || g.status === "CHECKED_IN")?.length || 0),
    0
  )
  const checkedInGuests = events.reduce(
    (acc, ev) => acc + (ev.guests?.filter((g: any) => g.status === "CHECKED_IN")?.length || 0),
    0
  )

  const rsvpRate = totalGuests > 0 ? Math.round((attendingGuests / totalGuests) * 100) : 0

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <motion.div {...fadeUp(0)}>
        <h1 className="text-2xl font-bold tracking-tight">RSVP & Event Analytics</h1>
        <p className="text-muted-foreground text-sm mt-0.5">Live attendance metrics across your wedding invitations</p>
      </motion.div>

      {/* Dynamic KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Active Events", val: totalEvents, icon: Calendar, color: "text-amber-600", bg: "bg-amber-500/10" },
          { label: "Total Invited", val: totalGuests, icon: Users, color: "text-blue-600", bg: "bg-blue-500/10" },
          { label: "Confirmed Attending", val: attendingGuests, icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-500/10" },
          { label: "Door Checked-In", val: checkedInGuests, icon: Heart, color: "text-rose-600", bg: "bg-rose-500/10" },
        ].map((s, i) => {
          const Icon = s.icon
          return (
            <motion.div key={s.label} {...fadeUp(i * 0.05)} className="bg-card rounded-2xl border p-5 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-muted-foreground font-medium">{s.label}</span>
                <div className={`w-8 h-8 rounded-lg ${s.bg} flex items-center justify-center`}>
                  <Icon className={`w-4 h-4 ${s.color}`} />
                </div>
              </div>
              <p className="text-2xl font-bold">{loading ? "..." : s.val}</p>
            </motion.div>
          )
        })}
      </div>

      {/* Attendance Ratio Bar */}
      <motion.div {...fadeUp(0.2)} className="bg-card rounded-2xl border shadow-sm p-6">
        <h2 className="text-base font-bold mb-1">Overall RSVP Confirmation Rate</h2>
        <p className="text-xs text-muted-foreground mb-4">Percentage of guests confirming their attendance</p>

        <div className="w-full h-4 bg-muted rounded-full overflow-hidden flex">
          <div
            className="h-full bg-emerald-500 transition-all duration-500"
            style={{ width: `${rsvpRate}%` }}
          />
        </div>
        <div className="flex justify-between items-center text-xs font-semibold text-muted-foreground mt-2">
          <span>{rsvpRate}% Confirmed</span>
          <span>{totalGuests - attendingGuests} Pending or Declined</span>
        </div>
      </motion.div>
    </div>
  )
}
