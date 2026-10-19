"use client"

import * as React from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { Users, Search, Phone, Check, X, Clock, Download } from "lucide-react"

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, delay },
})

export default function GuestsClient({ events, initialGuests }: { events: any[], initialGuests: any[] }) {
  const [selectedEvent, setSelectedEvent] = React.useState<string>("all")
  const [search, setSearch] = React.useState("")

  const filtered = initialGuests.filter(g => {
    const matchEvent = selectedEvent === "all" || g.eventId === selectedEvent
    const matchSearch = !search || g.name.toLowerCase().includes(search.toLowerCase()) || g.phone?.includes(search)
    return matchEvent && matchSearch
  })

  const stats = {
    total: initialGuests.length,
    attending: initialGuests.filter(g => g.status === "ATTENDING").length,
    declined: initialGuests.filter(g => g.status === "DECLINED").length,
    pending: initialGuests.filter(g => g.status === "PENDING").length,
  }

  return (
    <div className="py-8 px-6 max-w-6xl mx-auto space-y-6">
      <motion.div {...fadeUp(0)} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Guests</h1>
          <p className="text-muted-foreground text-sm mt-0.5">Manage all your RSVPs in one place</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-xl border text-sm hover:bg-muted transition-colors">
          <Download className="w-4 h-4" /> Export CSV
        </button>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total RSVPs", value: stats.total, color: "text-primary", bg: "bg-primary/10" },
          { label: "Attending", value: stats.attending, color: "text-emerald-600", bg: "bg-emerald-500/10" },
          { label: "Declined", value: stats.declined, color: "text-red-500", bg: "bg-red-500/10" },
          { label: "Pending", value: stats.pending, color: "text-amber-600", bg: "bg-amber-500/10" },
        ].map(({ label, value, color, bg }, i) => (
          <motion.div key={label} {...fadeUp(i * 0.07)} className="bg-card rounded-2xl border p-5">
            <p className={`text-2xl font-bold ${color}`}>{value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
          </motion.div>
        ))}
      </div>

      {/* Filter + Search */}
      <motion.div {...fadeUp(0.15)} className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by name or phone..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <select
          value={selectedEvent}
          onChange={e => setSelectedEvent(e.target.value)}
          className="px-4 py-2.5 rounded-xl border bg-card text-sm focus:outline-none"
        >
          <option value="all">All Events</option>
          {events.map(ev => <option key={ev.id} value={ev.id}>{ev.title}</option>)}
        </select>
      </motion.div>

      {/* Guest table */}
      <motion.div {...fadeUp(0.2)} className="bg-card rounded-2xl border overflow-hidden">
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <Users className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="font-medium">No guests yet</p>
            <p className="text-sm mt-1">Guests will appear here after they RSVP.</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="border-b bg-muted/30">
              <tr>
                <th className="text-left px-5 py-3 font-medium text-muted-foreground">Name</th>
                <th className="text-left px-5 py-3 font-medium text-muted-foreground hidden sm:table-cell">Phone</th>
                <th className="text-left px-5 py-3 font-medium text-muted-foreground hidden md:table-cell">Event</th>
                <th className="text-left px-5 py-3 font-medium text-muted-foreground">Guests</th>
                <th className="text-left px-5 py-3 font-medium text-muted-foreground">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filtered.map(g => (
                <tr key={g.id} className="hover:bg-muted/20 transition-colors">
                  <td className="px-5 py-3.5 font-medium">{g.name}</td>
                  <td className="px-5 py-3.5 text-muted-foreground hidden sm:table-cell">{g.phone || "-"}</td>
                  <td className="px-5 py-3.5 text-muted-foreground hidden md:table-cell truncate max-w-[160px]">{g.eventTitle}</td>
                  <td className="px-5 py-3.5">{g.pax}</td>
                  <td className="px-5 py-3.5">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                      g.status === "ATTENDING" ? "bg-emerald-500/10 text-emerald-600" :
                      g.status === "DECLINED" ? "bg-red-500/10 text-red-500" :
                      "bg-amber-500/10 text-amber-600"
                    }`}>
                      {g.status === "ATTENDING" ? <Check className="w-3 h-3" /> :
                       g.status === "DECLINED" ? <X className="w-3 h-3" /> :
                       <Clock className="w-3 h-3" />}
                      {g.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </motion.div>
    </div>
  )
}
