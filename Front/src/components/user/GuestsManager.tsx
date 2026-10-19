"use client"

import React, { useEffect, useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { Users, Search, Phone, Check, X, Clock, Download, Plus, QrCode } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { api } from "@/lib/api"

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, delay },
})

export function GuestsManager() {
  const [events, setEvents] = useState<any[]>([])
  const [selectedEventId, setSelectedEventId] = useState<string>("all")
  const [guests, setGuests] = useState<any[]>([])
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        const res = await api.get("/events")
        const eventList = res?.data || res?.events || []
        setEvents(eventList)

        // Flatten all guests across events
        const allGuests: any[] = []
        eventList.forEach((ev: any) => {
          if (ev.guests && Array.isArray(ev.guests)) {
            ev.guests.forEach((g: any) => {
              allGuests.push({ ...g, eventTitle: ev.title })
            })
          }
        })
        setGuests(allGuests)
      } catch (err) {
        console.error("Failed to load guests", err)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const filtered = guests.filter((g) => {
    const matchEvent = selectedEventId === "all" || g.eventId === selectedEventId
    const matchSearch =
      !search ||
      g.name.toLowerCase().includes(search.toLowerCase()) ||
      (g.phone && g.phone.includes(search))
    return matchEvent && matchSearch
  })

  const stats = {
    total: guests.length,
    attending: guests.filter((g) => g.status === "ATTENDING" || g.status === "CHECKED_IN").length,
    declined: guests.filter((g) => g.status === "DECLINED").length,
    pending: guests.filter((g) => g.status === "PENDING").length,
  }

  const exportCsv = () => {
    if (filtered.length === 0) return
    const headers = ["Guest Name", "Phone", "Status", "Pax", "Food Preference", "Table", "Event"]
    const rows = filtered.map((g) => [
      `"${g.name}"`,
      `"${g.phone || ""}"`,
      g.status,
      g.pax || 1,
      `"${g.foodPref || ""}"`,
      `"${g.table?.name || ""}"`,
      `"${g.eventTitle || ""}"`,
    ])
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n")
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", `Mongkol_Guests_${new Date().toISOString().slice(0, 10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <motion.div {...fadeUp(0)} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Guest List & RSVPs</h1>
          <p className="text-sm text-muted-foreground mt-1">Track attendance, table assignments, and dietary notes.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={exportCsv} className="rounded-xl gap-2">
            <Download className="w-4 h-4" /> Export CSV
          </Button>
          <Link href="/user/seating">
            <Button size="sm" className="rounded-xl gap-2 bg-amber-500 hover:bg-amber-600 text-white">
              Table Seating
            </Button>
          </Link>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Guests", val: stats.total, color: "text-foreground", bg: "bg-muted" },
          { label: "Attending", val: stats.attending, color: "text-emerald-600", bg: "bg-emerald-500/10" },
          { label: "Declined", val: stats.declined, color: "text-rose-600", bg: "bg-rose-500/10" },
          { label: "Pending", val: stats.pending, color: "text-amber-600", bg: "bg-amber-500/10" },
        ].map((s, i) => (
          <motion.div key={s.label} {...fadeUp(i * 0.05)} className="bg-card rounded-2xl border p-4 shadow-sm">
            <p className="text-xs text-muted-foreground">{s.label}</p>
            <p className={`text-2xl font-bold mt-1 ${s.color}`}>{s.val}</p>
          </motion.div>
        ))}
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
          <Input
            placeholder="Search by guest name or phone number..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-10 rounded-xl"
          />
        </div>

        {events.length > 0 && (
          <select
            value={selectedEventId}
            onChange={(e) => setSelectedEventId(e.target.value)}
            className="h-10 px-3 rounded-xl border bg-card text-sm font-medium focus:outline-none"
          >
            <option value="all">All Events</option>
            {events.map((ev) => (
              <option key={ev.id} value={ev.id}>
                {ev.title}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Guest Table */}
      <motion.div {...fadeUp(0.2)} className="bg-card rounded-2xl border shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-12 text-center text-sm text-muted-foreground">Loading guests...</div>
        ) : filtered.length === 0 ? (
          <div className="py-12 text-center text-sm text-muted-foreground">
            No guests found matching your criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted/50 border-b text-xs text-muted-foreground uppercase">
                <tr>
                  <th className="px-6 py-3.5">Guest</th>
                  <th className="px-6 py-3.5">Event</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5">Pax</th>
                  <th className="px-6 py-3.5">Assigned Table</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filtered.map((g) => (
                  <tr key={g.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-foreground">{g.name}</div>
                      {g.phone && <div className="text-xs text-muted-foreground">{g.phone}</div>}
                    </td>
                    <td className="px-6 py-4 text-xs text-muted-foreground">{g.eventTitle || "—"}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          g.status === "ATTENDING" || g.status === "CHECKED_IN"
                            ? "bg-emerald-500/10 text-emerald-600"
                            : g.status === "DECLINED"
                            ? "bg-rose-500/10 text-rose-600"
                            : "bg-amber-500/10 text-amber-600"
                        }`}
                      >
                        {g.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium">{g.pax || 1}</td>
                    <td className="px-6 py-4 text-xs font-medium text-foreground">
                      {g.table?.name || <span className="text-muted-foreground italic">Unassigned</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </div>
  )
}
