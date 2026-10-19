"use client"

import * as React from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Plus, CalendarDays, Users, Eye, QrCode,
  TrendingUp, Heart, LayoutGrid, ArrowRight, Sparkles, Pencil, MessageSquare
} from "lucide-react"

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.45, delay, ease: "easeOut" as const },
})

const quickStart = [
  { emoji: "💍", label: "Khmer Wedding",  href: "/dashboard/create?template=khmer-traditional" },
  { emoji: "📸", label: "Pre-Wedding",    href: "/dashboard/create?template=pre-wedding"        },
  { emoji: "🎂", label: "Birthday",       href: "/dashboard/create?template=birthday"           },
  { emoji: "💒", label: "Engagement",     href: "/dashboard/create?template=engagement"         },
]

export default function DashboardClient({ events, stats }: { events: any[], stats: any[] }) {
  return (
    <div className="min-h-screen bg-muted/20 py-8">
      <div className="container px-6 md:px-10 mx-auto max-w-6xl space-y-8">

        {/* ── Header ── */}
        <motion.div {...fadeUp(0)} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground text-sm mt-1">Manage your events and invitations</p>
          </div>
          <Link href="/dashboard/create">
            <Button className="rounded-xl gap-2">
              <Plus className="w-4 h-4" /> Create New Event
            </Button>
          </Link>
        </motion.div>

        {/* ── Stats ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map(({ label, value, color, bg, iconName }, i) => {
            const Icon = iconName === "CalendarDays" ? CalendarDays :
                         iconName === "Users" ? Users :
                         iconName === "MessageSquare" ? MessageSquare :
                         TrendingUp;

            return (
              <motion.div key={label} {...fadeUp(i * 0.07)}
                className="bg-card rounded-2xl border p-5 flex items-center gap-4">
                <div className={`w-11 h-11 rounded-xl ${bg} flex items-center justify-center flex-shrink-0`}>
                  <Icon className={`w-5 h-5 ${color}`} />
                </div>
                <div>
                  <p className="text-2xl font-bold">{value}</p>
                  <p className="text-xs text-muted-foreground">{label}</p>
                </div>
              </motion.div>
            )
          })}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">

          {/* ── Recent Events ── */}
          <motion.div {...fadeUp(0.1)} className="lg:col-span-2 bg-card rounded-2xl border p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-semibold text-lg">Recent Events</h2>
              <Link href="/dashboard/events">
                <Button variant="ghost" size="sm" className="gap-1 text-xs">
                  View all <ArrowRight className="w-3 h-3" />
                </Button>
              </Link>
            </div>

            <div className="space-y-3">
              {events.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <p className="text-4xl mb-3">📋</p>
                  <p className="font-medium mb-1">No events yet</p>
                  <p className="text-sm">Create your first event to get started.</p>
                  <Link href="/dashboard/create">
                    <Button size="sm" className="mt-4 rounded-xl gap-1"><Plus className="w-3 h-3" /> Create Event</Button>
                  </Link>
                </div>
              ) : events.map((ev: any) => (
                <div key={ev.id} className="flex items-center gap-4 p-4 rounded-xl bg-muted/40 hover:bg-muted/70 transition-colors group">
                  <div className="w-10 h-10 rounded-xl bg-background border flex items-center justify-center text-lg flex-shrink-0">
                    {ev.emoji ?? "🎉"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{ev.title}</p>
                    <p className="text-xs text-muted-foreground">{ev.type?.replace("_", " ")} · {ev.date ?? (ev.createdAt ? new Date(ev.createdAt).toLocaleDateString() : "")}</p>
                  </div>
                  <div className="hidden sm:flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Users className="w-3 h-3" />{ev._count?.guests ?? ev.guests ?? 0} Guests</span>
                    <span className="flex items-center gap-1"><MessageSquare className="w-3 h-3" />{ev._count?.messages ?? 0} Messages</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                      ev.isPublished || ev.status === "upcoming"
                        ? "bg-emerald-500/10 text-emerald-600"
                        : "bg-amber-500/10 text-amber-600"
                    }`}>
                      {ev.isPublished ? "Live" : ev.status === "upcoming" ? "Upcoming" : "Draft"}
                    </span>
                    {ev._count !== undefined && (
                      <Link href={`/dashboard/builder/${ev.id}`}>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-lg">
                          <Pencil className="w-3.5 h-3.5" />
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* ── Quick Create ── */}
          <motion.div {...fadeUp(0.15)} className="bg-card rounded-2xl border p-6">
            <h2 className="font-semibold text-lg mb-5">Quick Create</h2>
            <div className="grid grid-cols-2 gap-3">
              {quickStart.map(({ emoji, label, href }) => (
                <Link key={label} href={href}>
                  <div className="flex flex-col items-center gap-2 p-4 rounded-xl border bg-muted/30 hover:bg-primary/5 hover:border-primary/40 transition-all cursor-pointer text-center group">
                    <span className="text-2xl group-hover:scale-110 transition-transform">{emoji}</span>
                    <span className="text-xs font-medium leading-tight">{label}</span>
                  </div>
                </Link>
              ))}
            </div>

            {/* Upgrade CTA */}
            <div className="mt-5 p-4 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-sm font-semibold">Go Premium</span>
              </div>
              <p className="text-xs text-muted-foreground mb-3">
                Unlock all templates, unlimited guests &amp; custom domains.
              </p>
              <Link href="/pricing">
                <Button size="sm" className="w-full rounded-lg text-xs">Upgrade Now</Button>
              </Link>
            </div>
          </motion.div>
        </div>

        {/* ── Activity / Tips ── */}
        <motion.div {...fadeUp(0.2)} className="bg-card rounded-2xl border p-6">
          <h2 className="font-semibold text-lg mb-5">Getting Started Tips</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { icon: Heart,      title: "Personalize",  desc: "Add your story, photos, and custom message to your invitation." },
              { icon: QrCode,     title: "Share QR",     desc: "Download your QR code and add it to physical invitations." },
              { icon: LayoutGrid, title: "Track RSVPs",  desc: "See who's coming in real-time and send follow-up reminders." },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex gap-4 p-4 rounded-xl bg-muted/30">
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-sm mb-1">{title}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

      </div>
    </div>
  )
}
