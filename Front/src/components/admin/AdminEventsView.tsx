"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  CalendarDays,
  Search,
  ExternalLink,
  Eye,
  EyeOff,
  Trash2,
  Users,
  MessageSquare,
  Sparkles,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Filter,
  Heart,
} from "lucide-react"
import Link from "next/link"
import { api } from "@/lib/api"

interface PlatformEvent {
  id: string
  slug: string
  title: string
  type: string
  date: string | null
  location: string | null
  isPublished: boolean
  createdAt: string
  user: {
    id?: string
    name: string | null
    email: string
  }
  _count: {
    guests: number
    messages: number
    tables?: number
  }
}

export function AdminEventsView() {
  const [events, setEvents] = React.useState<PlatformEvent[]>([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const [search, setSearch] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState<string>("ALL")
  const [actionId, setActionId] = React.useState<string | null>(null)
  const [feedback, setFeedback] = React.useState<{ text: string; type: "success" | "error" } | null>(null)

  const fetchEvents = React.useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const res = await api.get<{ success: boolean; data: PlatformEvent[] }>("/admin/events")
      if (res.success && Array.isArray(res.data)) {
        setEvents(res.data)
      }
    } catch (err: any) {
      setError(err.message || "Failed to load platform events")
    } finally {
      setLoading(false)
    }
  }, [])

  React.useEffect(() => {
    fetchEvents()
  }, [fetchEvents])

  const handleTogglePublish = async (eventId: string, currentStatus: boolean) => {
    try {
      setActionId(eventId)
      const res = await api.patch<{ success: boolean; data: PlatformEvent; message: string }>(
        `/admin/events/${eventId}/publish`
      )
      if (res.success) {
        setEvents((prev) =>
          prev.map((ev) => (ev.id === eventId ? { ...ev, isPublished: !currentStatus } : ev))
        )
        setFeedback({
          text: `Event ${!currentStatus ? "published" : "unpublished"} successfully`,
          type: "success",
        })
      }
    } catch (err: any) {
      setFeedback({ text: err.message || "Failed to update publish state", type: "error" })
    } finally {
      setActionId(null)
      setTimeout(() => setFeedback(null), 3000)
    }
  }

  const handleDeleteEvent = async (eventId: string, title: string) => {
    if (!confirm(`Are you sure you want to permanently delete event "${title}"? All associated guests, tables, and messages will be removed.`)) {
      return
    }

    try {
      setActionId(eventId)
      const res = await api.delete<{ success: boolean; message: string }>(`/admin/events/${eventId}`)
      if (res.success) {
        setEvents((prev) => prev.filter((ev) => ev.id !== eventId))
        setFeedback({ text: "Event deleted successfully", type: "success" })
      }
    } catch (err: any) {
      setFeedback({ text: err.message || "Failed to delete event", type: "error" })
    } finally {
      setActionId(null)
      setTimeout(() => setFeedback(null), 3000)
    }
  }

  const filteredEvents = events.filter((ev) => {
    const matchesSearch =
      ev.title.toLowerCase().includes(search.toLowerCase()) ||
      ev.slug.toLowerCase().includes(search.toLowerCase()) ||
      (ev.user?.name && ev.user.name.toLowerCase().includes(search.toLowerCase())) ||
      (ev.user?.email && ev.user.email.toLowerCase().includes(search.toLowerCase()))

    const matchesStatus =
      statusFilter === "ALL" ||
      (statusFilter === "PUBLISHED" && ev.isPublished) ||
      (statusFilter === "DRAFT" && !ev.isPublished)

    return matchesSearch && matchesStatus
  })

  return (
    <div className="py-8">
      <div className="container px-6 md:px-10 mx-auto max-w-6xl space-y-8">
        {/* Header section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 text-xs font-semibold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              Platform Moderation
            </div>
            <h1 className="text-3xl font-bold tracking-tight">Platform Events</h1>
            <p className="text-muted-foreground text-sm mt-1">
              Oversee, inspect public invitations, moderate status, and manage all events created by users.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm font-medium px-3.5 py-1.5 rounded-xl bg-card border shadow-sm">
              Total Events: <strong className="text-primary">{events.length}</strong>
            </span>
          </div>
        </div>

        {/* Feedback alert */}
        <AnimatePresence>
          {feedback && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`p-4 rounded-xl border flex items-center gap-3 text-sm ${
                feedback.type === "success"
                  ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                  : "bg-destructive/10 border-destructive/20 text-destructive"
              }`}
            >
              {feedback.type === "success" ? (
                <CheckCircle2 className="w-5 h-5 shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 shrink-0" />
              )}
              <span>{feedback.text}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Search & filter toolbar */}
        <div className="flex flex-col sm:flex-row items-center gap-4 bg-card p-4 rounded-2xl border shadow-sm">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by event title, slug, or host email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm bg-muted/40 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="w-4 h-4 text-muted-foreground shrink-0" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              aria-label="Filter events by status"
              className="px-3.5 py-2 text-sm bg-muted/40 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all cursor-pointer font-medium"
            >
              <option value="ALL">All Statuses</option>
              <option value="PUBLISHED">Published Only</option>
              <option value="DRAFT">Draft Only</option>
            </select>
          </div>
        </div>

        {/* Events table */}
        {loading ? (
          <div className="bg-card rounded-2xl border p-12 flex flex-col items-center justify-center gap-3 text-muted-foreground">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="text-sm">Loading platform events...</p>
          </div>
        ) : error ? (
          <div className="bg-destructive/10 rounded-2xl border border-destructive/20 p-8 text-center text-destructive space-y-3">
            <AlertCircle className="w-8 h-8 mx-auto" />
            <p className="font-semibold">{error}</p>
            <button
              onClick={fetchEvents}
              className="px-4 py-2 bg-background text-foreground text-xs font-semibold rounded-lg border shadow-sm hover:bg-muted"
            >
              Retry
            </button>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="bg-card rounded-2xl border p-12 text-center text-muted-foreground">
            <Heart className="w-10 h-10 mx-auto mb-3 opacity-30 text-rose-500" />
            <p className="font-semibold text-foreground">No events found</p>
            <p className="text-xs mt-1">No platform events match your search query or filters.</p>
          </div>
        ) : (
          <div className="bg-card rounded-2xl border shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b bg-muted/30 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    <th className="py-4 px-6">Event Details</th>
                    <th className="py-4 px-6">Host / Owner</th>
                    <th className="py-4 px-6">Status</th>
                    <th className="py-4 px-6">Guests & Wishes</th>
                    <th className="py-4 px-6">Event Date</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredEvents.map((ev) => {
                    const isBusy = actionId === ev.id
                    return (
                      <tr key={ev.id} className="hover:bg-muted/20 transition-colors">
                        <td className="py-4 px-6">
                          <div className="font-semibold text-foreground">{ev.title}</div>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs font-mono text-muted-foreground">
                              /e/{ev.slug}
                            </span>
                            <Link
                              href={`/e/${ev.slug}`}
                              target="_blank"
                              className="text-primary hover:underline inline-flex items-center gap-1 text-xs"
                            >
                              <ExternalLink className="w-3 h-3" />
                              Preview
                            </Link>
                          </div>
                        </td>

                        <td className="py-4 px-6">
                          <div className="font-medium text-foreground text-xs">
                            {ev.user?.name || "Host"}
                          </div>
                          <div className="text-xs text-muted-foreground font-mono">
                            {ev.user?.email}
                          </div>
                        </td>

                        <td className="py-4 px-6">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${
                              ev.isPublished
                                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                                : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                ev.isPublished ? "bg-emerald-500" : "bg-amber-500"
                              }`}
                            />
                            {ev.isPublished ? "Published" : "Draft"}
                          </span>
                        </td>

                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Users className="w-3.5 h-3.5 text-primary" />
                              <strong className="text-foreground">{ev._count?.guests || 0}</strong>
                            </span>
                            <span className="flex items-center gap-1">
                              <MessageSquare className="w-3.5 h-3.5 text-blue-500" />
                              <strong className="text-foreground">{ev._count?.messages || 0}</strong>
                            </span>
                          </div>
                        </td>

                        <td className="py-4 px-6 text-xs text-muted-foreground whitespace-nowrap">
                          {ev.date ? (
                            new Date(ev.date).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })
                          ) : (
                            <span className="italic">Not set</span>
                          )}
                        </td>

                        <td className="py-4 px-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {/* Toggle Publish button */}
                            <button
                              disabled={isBusy}
                              onClick={() => handleTogglePublish(ev.id, ev.isPublished)}
                              title={ev.isPublished ? "Unpublish event" : "Publish event"}
                              className={`p-2 rounded-lg border text-xs font-medium transition-colors ${
                                ev.isPublished
                                  ? "bg-amber-500/10 text-amber-600 hover:bg-amber-500/20 border-amber-500/20"
                                  : "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 border-emerald-500/20"
                              }`}
                            >
                              {isBusy ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              ) : ev.isPublished ? (
                                <span className="flex items-center gap-1">
                                  <EyeOff className="w-3.5 h-3.5" />
                                  Unpublish
                                </span>
                              ) : (
                                <span className="flex items-center gap-1">
                                  <Eye className="w-3.5 h-3.5" />
                                  Publish
                                </span>
                              )}
                            </button>

                            {/* Delete event button */}
                            <button
                              disabled={isBusy}
                              onClick={() => handleDeleteEvent(ev.id, ev.title)}
                              title="Delete event"
                              className="p-2 rounded-lg border border-destructive/20 text-destructive bg-destructive/5 hover:bg-destructive/10 transition-colors disabled:opacity-50"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
