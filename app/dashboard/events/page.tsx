"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { Plus, Pencil, Trash2, Search, Calendar, ExternalLink, Loader2, Users, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, delay },
})

export default function EventsPage() {
  const [events, setEvents] = React.useState<any[]>([])
  const [loading, setLoading] = React.useState(true)
  const [search, setSearch] = React.useState("")
  const [deletingId, setDeletingId] = React.useState<string | null>(null)
  
  // Modal state
  const [eventToDelete, setEventToDelete] = React.useState<{id: string, title: string} | null>(null)

  const fetchEvents = React.useCallback(async () => {
    try {
      const res = await fetch("/api/events")
      const data = await res.json()
      if (data.events) {
        setEvents(data.events)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [])

  React.useEffect(() => {
    fetchEvents()
  }, [fetchEvents])

  const confirmDelete = async () => {
    if (!eventToDelete) return
    
    setDeletingId(eventToDelete.id)
    try {
      await fetch(`/api/events/${eventToDelete.id}`, { method: "DELETE" })
      setEvents(prev => prev.filter(e => e.id !== eventToDelete.id))
      setEventToDelete(null)
    } catch (err) {
      console.error("Failed to delete event:", err)
    } finally {
      setDeletingId(null)
    }
  }

  const filteredEvents = events.filter(e => e.title.toLowerCase().includes(search.toLowerCase()))

  if (loading) {
    return (
      <div className="flex-1 min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="flex-1 min-h-screen pb-12 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <motion.div {...fadeUp(0)} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">My Events</h1>
            <p className="text-sm text-muted-foreground mt-1">Manage and edit your digital invitations.</p>
          </div>
          <Link href="/dashboard/create">
            <Button className="gap-2 rounded-xl">
              <Plus className="w-4 h-4" /> Create New Event
            </Button>
          </Link>
        </motion.div>

        {/* Search */}
        {events.length > 0 && (
          <motion.div {...fadeUp(0.1)} className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search events..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </motion.div>
        )}

        {/* Empty State */}
        {events.length === 0 ? (
          <motion.div {...fadeUp(0.2)} className="bg-card rounded-2xl border p-12 text-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No events found</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              You haven't created any events yet. Get started by creating your first beautiful digital invitation!
            </p>
            <Link href="/dashboard/create">
              <Button size="lg" className="rounded-xl gap-2">
                <Plus className="w-4 h-4" /> Create Your First Event
              </Button>
            </Link>
          </motion.div>
        ) : (
          <div className="flex flex-col gap-4">
            {filteredEvents.map((ev, i) => (
              <motion.div
                key={ev.id}
                {...fadeUp(0.1 + i * 0.05)}
                className="bg-card rounded-2xl border p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center gap-6 hover:shadow-md transition-all group"
              >
                {/* Status Indicator */}
                <div className="hidden sm:flex self-stretch items-center">
                  <div className={`w-1.5 h-full rounded-full ${ev.isPublished ? "bg-emerald-500" : "bg-amber-500"}`} />
                </div>

                {/* Main Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-lg font-bold truncate">{ev.title}</h3>
                    <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                      ev.isPublished ? "bg-emerald-500/10 text-emerald-600" : "bg-amber-500/10 text-amber-600"
                    }`}>
                      {ev.isPublished ? "Live" : "Draft"}
                    </span>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground mt-2">
                    <span className="capitalize px-2 py-0.5 rounded-md bg-muted/50 text-xs">
                      {ev.type.replace("_", " ").toLowerCase()}
                    </span>
                    
                    <div className="flex items-center gap-1.5">
                      <ExternalLink className="w-3.5 h-3.5" />
                      <a href={`/e/${ev.slug}`} target="_blank" rel="noreferrer" className="hover:text-primary hover:underline">
                        mongkol.com/e/{ev.slug}
                      </a>
                    </div>

                    {ev.date && (
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{new Date(ev.date).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-6 sm:border-x sm:px-6">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1.5 text-muted-foreground mb-0.5">
                      <Users className="w-3.5 h-3.5" />
                      <span className="text-xs">Guests</span>
                    </div>
                    <p className="font-semibold">{ev._count?.guests ?? 0}</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1.5 text-muted-foreground mb-0.5">
                      <span className="text-xs">💌</span>
                      <span className="text-xs">Notes</span>
                    </div>
                    <p className="font-semibold">{ev._count?.messages ?? 0}</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 sm:ml-auto">
                  <Link href={`/dashboard/builder/${ev.id}`}>
                    <Button variant="outline" className="gap-2 rounded-xl">
                      <Pencil className="w-4 h-4" /> <span className="hidden sm:inline">Edit</span>
                    </Button>
                  </Link>
                  <Button
                    onClick={() => setEventToDelete({ id: ev.id, title: ev.title })}
                    variant="ghost"
                    className="rounded-xl px-3 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {eventToDelete && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !deletingId && setEventToDelete(null)}
              className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md bg-card border rounded-3xl shadow-2xl p-6"
            >
              <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
                <AlertTriangle className="w-6 h-6 text-destructive" />
              </div>
              <h2 className="text-xl font-bold mb-2">Delete Event?</h2>
              <p className="text-muted-foreground mb-6">
                Are you sure you want to delete <span className="font-semibold text-foreground">{eventToDelete.title}</span>? 
                This will permanently erase all guest lists, RSVP data, and messages associated with this event. This action cannot be undone.
              </p>
              <div className="flex items-center justify-end gap-3">
                <Button 
                  variant="outline" 
                  onClick={() => setEventToDelete(null)}
                  disabled={deletingId !== null}
                  className="rounded-xl"
                >
                  Cancel
                </Button>
                <Button 
                  variant="destructive" 
                  onClick={confirmDelete}
                  disabled={deletingId !== null}
                  className="rounded-xl gap-2"
                >
                  {deletingId ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                  Delete Permanently
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
