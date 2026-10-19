"use client"

import React, { useEffect, useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Plus,
  CalendarDays,
  Users,
  Eye,
  TrendingUp,
  Heart,
  ArrowRight,
  Sparkles,
  Pencil,
  MessageSquare,
  QrCode,
  Armchair,
} from "lucide-react"
import { api } from "@/lib/api"

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, delay, ease: "easeOut" as const },
})

const quickStart = [
  { emoji: "💍", label: "Khmer Wedding", href: "/user/create?type=WEDDING_KHMER" },
  { emoji: "📸", label: "Pre-Wedding", href: "/user/create?type=PRE_WEDDING" },
  { emoji: "💒", label: "Engagement", href: "/user/create?type=ENGAGEMENT" },
  { emoji: "🎂", label: "Birthday", href: "/user/create?type=BIRTHDAY" },
]

export function UserDashboard() {
  const [events, setEvents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadEvents() {
      try {
        const res = await api.get("/events")
        if (res?.data) {
          setEvents(res.data)
        }
      } catch (err) {
        console.error("Failed to load user events", err)
      } finally {
        setLoading(false)
      }
    }
    loadEvents()
  }, [])

  const totalEvents = events.length
  const totalGuests = events.reduce((acc, ev) => acc + (ev.guests?.length || 0), 0)
  const totalAttending = events.reduce(
    (acc, ev) =>
      acc + (ev.guests?.filter((g: any) => g.status === "ATTENDING" || g.status === "CHECKED_IN")?.length || 0),
    0
  )
  const totalWishes = events.reduce((acc, ev) => acc + (ev.messages?.length || 0), 0)

  const stats = [
    {
      label: "My Events",
      value: totalEvents,
      icon: CalendarDays,
      color: "text-amber-600 dark:text-amber-400",
      bg: "bg-amber-500/10",
    },
    {
      label: "Invited Guests",
      value: totalGuests,
      icon: Users,
      color: "text-rose-600 dark:text-rose-400",
      bg: "bg-rose-500/10",
    },
    {
      label: "Confirmed RSVPs",
      value: totalAttending,
      icon: TrendingUp,
      color: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-500/10",
    },
    {
      label: "Guestbook Wishes",
      value: totalWishes,
      icon: MessageSquare,
      color: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-500/10",
    },
  ]

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* ── Header ── */}
      <motion.div {...fadeUp(0)} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Host Dashboard</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Manage your wedding events, invitations, and guest lists
          </p>
        </div>
        <Link href="/user/create">
          <Button className="rounded-xl gap-2 shadow-sm bg-amber-500 hover:bg-amber-600 text-white">
            <Plus className="w-4 h-4" /> Create New Event
          </Button>
        </Link>
      </motion.div>

      {/* ── Stats ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value, color, bg, icon: Icon }, i) => (
          <motion.div
            key={label}
            {...fadeUp(i * 0.05)}
            className="bg-card rounded-2xl border p-5 flex items-center gap-4 shadow-sm"
          >
            <div className={`w-11 h-11 rounded-xl ${bg} flex items-center justify-center flex-shrink-0`}>
              <Icon className={`w-5 h-5 ${color}`} />
            </div>
            <div>
              <p className="text-2xl font-bold tracking-tight">
                {loading ? <span className="inline-block w-6 h-6 bg-muted animate-pulse rounded" /> : value}
              </p>
              <p className="text-xs text-muted-foreground">{label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* ── Quick Start ── */}
      <motion.div {...fadeUp(0.2)}>
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3">
          Quick Start Invitation
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {quickStart.map(({ emoji, label, href }) => (
            <Link key={label} href={href}>
              <div className="bg-card hover:bg-muted/50 border rounded-2xl p-4 flex items-center gap-3 transition-colors cursor-pointer group shadow-sm">
                <span className="text-2xl group-hover:scale-110 transition-transform">{emoji}</span>
                <span className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                  {label}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </motion.div>

      {/* ── Event List ── */}
      <motion.div {...fadeUp(0.25)} className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold">Your Events</h2>
          <Link href="/user/events" className="text-xs font-semibold text-primary hover:underline">
            View All ({events.length})
          </Link>
        </div>

        {loading ? (
          <div className="py-12 text-center text-sm text-muted-foreground">Loading your events...</div>
        ) : events.length === 0 ? (
          <div className="bg-card rounded-2xl border p-12 text-center shadow-sm">
            <Heart className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
            <h3 className="font-bold text-base mb-1">No events created yet</h3>
            <p className="text-sm text-muted-foreground mb-6 max-w-sm mx-auto">
              Choose a Khmer wedding or modern romance template to start designing your custom invitation!
            </p>
            <Link href="/user/create">
              <Button className="rounded-xl gap-2 bg-amber-500 hover:bg-amber-600 text-white">
                <Sparkles className="w-4 h-4" /> Design Your First Invitation
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {events.map((ev) => (
              <div
                key={ev.id}
                className="bg-card rounded-2xl border p-5 shadow-sm hover:border-amber-500/40 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h3 className="font-bold text-base line-clamp-1">{ev.title}</h3>
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                        ev.isPublished
                          ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {ev.isPublished ? "Published" : "Draft"}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-4">
                    {ev.date ? new Date(ev.date).toLocaleDateString() : "Date not set"} •{" "}
                    {ev.location || "Venue TBD"}
                  </p>
                </div>

                <div className="flex items-center gap-2 pt-3 border-t">
                  <Link href={`/user/builder/${ev.id}`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full rounded-xl gap-1.5 text-xs">
                      <Pencil className="w-3.5 h-3.5" /> Edit Builder
                    </Button>
                  </Link>
                  <Link href={`/user/guests?eventId=${ev.id}`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full rounded-xl gap-1.5 text-xs">
                      <Users className="w-3.5 h-3.5" /> Guests
                    </Button>
                  </Link>
                  {ev.isPublished && (
                    <Link href={`/e/${ev.slug}`} target="_blank">
                      <Button variant="ghost" size="sm" className="rounded-xl px-2.5" title="View Invitation">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  )
}
