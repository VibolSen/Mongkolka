"use client"

import React, { useState } from "react"
import { Search, Armchair, Users, CheckCircle2, UserCheck } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { api } from "@/lib/api"

export function StaffGuestLookup() {
  const [query, setQuery] = useState("")
  const [guests, setGuests] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [checkingInId, setCheckingInId] = useState<string | null>(null)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return

    setLoading(true)
    try {
      const res = await api.get(`/staff/lookup?name=${encodeURIComponent(query.trim())}`)
      setGuests(res?.data || [])
    } catch (err) {
      console.error("Lookup failed", err)
    } finally {
      setLoading(false)
    }
  }

  const handleManualCheckIn = async (guest: any) => {
    setCheckingInId(guest.id)
    try {
      await api.post("/staff/scan", { checkInToken: guest.checkInToken })
      setGuests((prev) =>
        prev.map((g) => (g.id === guest.id ? { ...g, status: "CHECKED_IN" } : g))
      )
    } catch (err) {
      console.error("Check-in failed", err)
    } finally {
      setCheckingInId(null)
    }
  }

  return (
    <div className="space-y-4">
      {/* Search Header */}
      <div className="bg-card rounded-2xl border p-4 shadow-sm">
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
            <Input
              placeholder="Search guest name..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-9 h-11 text-sm rounded-xl"
            />
          </div>
          <Button type="submit" className="h-11 px-5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white">
            Search
          </Button>
        </form>
      </div>

      {/* Results */}
      {loading ? (
        <div className="py-12 text-center text-sm text-muted-foreground">Searching guest list...</div>
      ) : guests.length === 0 && query ? (
        <div className="bg-card rounded-2xl border p-8 text-center text-muted-foreground text-sm">
          No guests found matching "{query}".
        </div>
      ) : (
        <div className="space-y-3">
          {guests.map((g) => {
            const isCheckedIn = g.status === "CHECKED_IN"
            return (
              <div
                key={g.id}
                className="bg-card rounded-2xl border p-4 shadow-sm flex items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-sm text-foreground">{g.name}</h3>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                        isCheckedIn
                          ? "bg-emerald-500/10 text-emerald-600"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {isCheckedIn ? "Checked In" : g.status}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                    <span className="flex items-center gap-1 font-medium text-amber-600">
                      <Armchair className="w-3.5 h-3.5" />
                      {g.table?.name || "No table assigned"}
                    </span>
                    <span>{g.pax || 1} Pax</span>
                  </div>
                </div>

                <div>
                  {!isCheckedIn ? (
                    <Button
                      size="sm"
                      onClick={() => handleManualCheckIn(g)}
                      disabled={checkingInId === g.id}
                      className="rounded-xl text-xs gap-1.5 bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      <UserCheck className="w-3.5 h-3.5" />
                      Check In
                    </Button>
                  ) : (
                    <div className="flex items-center gap-1 text-emerald-600 text-xs font-semibold px-2 py-1">
                      <CheckCircle2 className="w-4 h-4" /> Ready
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
