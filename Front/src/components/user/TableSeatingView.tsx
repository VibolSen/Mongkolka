"use client"

import React, { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Armchair, Plus, Users, Trash2, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { api } from "@/lib/api"

export function TableSeatingView() {
  const [events, setEvents] = useState<any[]>([])
  const [selectedEventId, setSelectedEventId] = useState<string>("")
  const [tables, setTables] = useState<any[]>([])
  const [guests, setGuests] = useState<any[]>([])
  const [tableName, setTableName] = useState("")
  const [capacity, setCapacity] = useState("10")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadEvents() {
      try {
        const res = await api.get("/events")
        const eventList = res?.data || res?.events || []
        setEvents(eventList)
        if (eventList.length > 0) {
          setSelectedEventId(eventList[0].id)
        }
      } catch (err) {
        console.error("Failed to load events", err)
      } finally {
        setLoading(false)
      }
    }
    loadEvents()
  }, [])

  useEffect(() => {
    if (!selectedEventId) return
    async function loadTablesAndGuests() {
      try {
        const [tablesRes, guestsRes] = await Promise.all([
          api.get(`/events/${selectedEventId}/tables`).catch(() => ({ data: [] })),
          api.get(`/events/${selectedEventId}/guests`).catch(() => ({ data: [] })),
        ])
        setTables(tablesRes?.data || [])
        setGuests(guestsRes?.data || [])
      } catch (err) {
        console.error("Failed to load tables or guests", err)
      }
    }
    loadTablesAndGuests()
  }, [selectedEventId])

  const handleCreateTable = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!tableName || !selectedEventId) return
    try {
      const res = await api.post(`/events/${selectedEventId}/tables`, {
        name: tableName,
        capacity: parseInt(capacity) || 10,
      })
      if (res?.data) {
        setTables([...tables, res.data])
        setTableName("")
      }
    } catch (err) {
      console.error("Failed to create table", err)
    }
  }

  const handleAssignTable = async (guestId: string, tableId: string | null) => {
    try {
      await api.patch(`/events/${selectedEventId}/guests/${guestId}`, {
        tableId: tableId === "none" ? null : tableId,
      })
      setGuests((prev) =>
        prev.map((g) => (g.id === guestId ? { ...g, tableId: tableId === "none" ? null : tableId } : g))
      )
    } catch (err) {
      console.error("Failed to assign table", err)
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Banquet Table & Seating Planner</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Organize VIP, Groom family, and Bride family tables, and assign confirmed guests.
        </p>
      </div>

      {/* Event Selector */}
      {events.length > 1 && (
        <div className="flex items-center gap-3">
          <Label className="text-sm font-semibold">Select Event:</Label>
          <select
            value={selectedEventId}
            onChange={(e) => setSelectedEventId(e.target.value)}
            className="h-10 px-3 rounded-xl border bg-card text-sm font-medium focus:outline-none"
          >
            {events.map((ev) => (
              <option key={ev.id} value={ev.id}>
                {ev.title}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Grid: Create Table + Current Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Create Table Form */}
        <div className="bg-card p-6 rounded-2xl border shadow-sm h-fit">
          <h2 className="text-base font-bold mb-4 flex items-center gap-2">
            <Plus className="w-4 h-4 text-amber-500" /> Add Banquet Table
          </h2>
          <form onSubmit={handleCreateTable} className="space-y-4">
            <div>
              <Label htmlFor="tName">Table Name / Label</Label>
              <Input
                id="tName"
                placeholder="e.g. Table 01 - Groom VIP"
                value={tableName}
                onChange={(e) => setTableName(e.target.value)}
                className="mt-1.5"
                required
              />
            </div>
            <div>
              <Label htmlFor="tCap">Capacity (Seats)</Label>
              <Input
                id="tCap"
                type="number"
                min="1"
                max="20"
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
                className="mt-1.5"
                required
              />
            </div>
            <Button type="submit" className="w-full rounded-xl bg-amber-500 hover:bg-amber-600 text-white">
              Create Table
            </Button>
          </form>
        </div>

        {/* Existing Tables List */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-base font-bold flex items-center gap-2">
            <Armchair className="w-4 h-4 text-amber-500" /> Banquet Floor Tables ({tables.length})
          </h2>

          {tables.length === 0 ? (
            <div className="bg-card rounded-2xl border p-8 text-center text-muted-foreground text-sm">
              No banquet tables created yet. Use the form on the left to add tables.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {tables.map((t) => {
                const assigned = guests.filter((g) => g.tableId === t.id)
                const assignedPax = assigned.reduce((acc, g) => acc + (g.pax || 1), 0)
                return (
                  <div key={t.id} className="bg-card rounded-2xl border p-4 shadow-sm flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-bold text-sm">{t.name}</h3>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-muted font-semibold">
                          {assignedPax} / {t.capacity} Seats
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground line-clamp-2">
                        {assigned.length > 0 ? (
                          assigned.map((g) => g.name).join(", ")
                        ) : (
                          <span className="italic">Empty table</span>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Guest Assignment Table */}
      <div className="bg-card rounded-2xl border shadow-sm p-6 space-y-4">
        <h2 className="text-base font-bold flex items-center gap-2">
          <Users className="w-4 h-4 text-amber-500" /> Assign Confirmed Guests to Tables
        </h2>

        {guests.length === 0 ? (
          <div className="py-6 text-center text-sm text-muted-foreground">No guests to assign yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted/50 border-b text-xs text-muted-foreground uppercase">
                <tr>
                  <th className="px-4 py-3">Guest</th>
                  <th className="px-4 py-3">Pax</th>
                  <th className="px-4 py-3">Assigned Table</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {guests.map((g) => (
                  <tr key={g.id}>
                    <td className="px-4 py-3 font-medium">{g.name}</td>
                    <td className="px-4 py-3 text-xs">{g.pax || 1}</td>
                    <td className="px-4 py-3">
                      <select
                        value={g.tableId || "none"}
                        onChange={(e) => handleAssignTable(g.id, e.target.value)}
                        className="px-2.5 py-1.5 rounded-lg border bg-background text-xs font-medium focus:outline-none"
                      >
                        <option value="none">Unassigned</option>
                        {tables.map((t) => (
                          <option key={t.id} value={t.id}>
                            {t.name} ({t.capacity} max)
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
