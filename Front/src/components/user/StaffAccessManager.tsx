"use client"

import React, { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { KeyRound, ShieldCheck, QrCode, Copy, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { api } from "@/lib/api"

export function StaffAccessManager() {
  const [events, setEvents] = useState<any[]>([])
  const [selectedEventId, setSelectedEventId] = useState<string>("")
  const [staffEmail, setStaffEmail] = useState("")
  const [staffPin, setStaffPin] = useState("123456")
  const [staffList, setStaffList] = useState<any[]>([])
  const [copied, setCopied] = useState(false)
  const [message, setMessage] = useState("")

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
      }
    }
    loadEvents()
  }, [])

  const handleAuthorize = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!staffEmail || !selectedEventId) return
    try {
      const res = await api.post(`/events/${selectedEventId}/staff`, {
        email: staffEmail,
        passCode: staffPin,
      })
      setMessage(res?.message || "Staff receptionist authorized successfully!")
      setStaffList([...staffList, { email: staffEmail, passCode: staffPin }])
      setStaffEmail("")
    } catch (err: any) {
      setMessage(err?.message || "Failed to authorize staff")
    }
  }

  const copyPin = () => {
    navigator.clipboard.writeText(staffPin)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Staff Event Access & Check-in PINs</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Issue 6-digit access codes to receptionists at the door so they can scan guest QR passes and look up banquet tables.
        </p>
      </div>

      {events.length > 1 && (
        <div className="flex items-center gap-3">
          <Label className="text-sm font-semibold">Event:</Label>
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Authorize Form */}
        <div className="bg-card p-6 rounded-2xl border shadow-sm space-y-4">
          <h2 className="text-base font-bold flex items-center gap-2">
            <KeyRound className="w-4 h-4 text-amber-500" /> Authorize Receptionist
          </h2>
          <form onSubmit={handleAuthorize} className="space-y-4">
            <div>
              <Label htmlFor="sEmail">Staff Member Email</Label>
              <Input
                id="sEmail"
                type="email"
                placeholder="receptionist@example.com"
                value={staffEmail}
                onChange={(e) => setStaffEmail(e.target.value)}
                className="mt-1.5"
                required
              />
            </div>

            <div>
              <Label htmlFor="sPin">6-Digit Check-in PIN</Label>
              <div className="flex items-center gap-2 mt-1.5">
                <Input
                  id="sPin"
                  maxLength={6}
                  value={staffPin}
                  onChange={(e) => setStaffPin(e.target.value)}
                  className="font-mono tracking-widest text-center text-lg font-bold"
                  required
                />
                <Button type="button" variant="outline" onClick={copyPin} className="px-3" title="Copy PIN">
                  {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
            </div>

            {message && <div className="text-xs font-medium text-amber-600 bg-amber-500/10 p-2.5 rounded-lg">{message}</div>}

            <Button type="submit" className="w-full rounded-xl bg-amber-500 hover:bg-amber-600 text-white">
              Authorize Receptionist
            </Button>
          </form>
        </div>

        {/* Instructions */}
        <div className="bg-card p-6 rounded-2xl border shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold flex items-center gap-2 mb-2">
              <QrCode className="w-4 h-4 text-amber-500" /> How Door Reception Works
            </h2>
            <ul className="space-y-3 text-xs text-muted-foreground leading-relaxed">
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold shrink-0">1</span>
                <span>Send the reception staff member to log in with their email.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold shrink-0">2</span>
                <span>Staff opens <strong>/staff/scanner</strong> on their phone camera.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold shrink-0">3</span>
                <span>Scanning the guest's digital pass instantly marks them as <strong>CHECKED_IN</strong> and displays their assigned VIP table number!</span>
              </li>
            </ul>
          </div>

          <div className="p-3 bg-muted rounded-xl text-xs text-muted-foreground">
            Staff users have zero access to event deletion, billing, or private template settings.
          </div>
        </div>
      </div>
    </div>
  )
}
