"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Sparkles, Calendar as CalendarIcon, MapPin, Users, Type, Heart, ArrowRight } from "lucide-react"

const eventTypes = [
  { id: "wedding",    label: "Khmer Wedding",  emoji: "💍" },
  { id: "prewedding", label: "Pre-Wedding",    emoji: "📸" },
  { id: "engagement", label: "Engagement",     emoji: "💒" },
  { id: "birthday",   label: "Birthday",       emoji: "🎂" },
  { id: "anniversary",label: "Anniversary",    emoji: "💝" },
  { id: "other",      label: "Other Event",    emoji: "✨" },
]

export default function CreateEventPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [selectedType, setSelectedType] = useState("wedding")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    // Simulate API call to create event
    setTimeout(() => {
      setLoading(false)
      // For now, push to dashboard
      router.push("/dashboard")
      router.refresh()
    }, 1500)
  }

  return (
    <div className="py-8">
      <div className="container px-6 md:px-10 mx-auto max-w-4xl space-y-8">
        
        {/* ── Header ── */}
        <div className="flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="outline" size="icon" className="rounded-xl h-10 w-10 shrink-0">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Create New Event</h1>
            <p className="text-sm text-muted-foreground mt-0.5">Tell us about your special occasion</p>
          </div>
        </div>

        <motion.form 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          onSubmit={handleSubmit}
          className="space-y-8"
        >
          {/* ── Section 1: Event Type ── */}
          <div className="bg-card border rounded-2xl p-6 md:p-8">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Heart className="w-4 h-4 text-primary" />
              </div>
              <h2 className="text-lg font-semibold">What are you celebrating?</h2>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {eventTypes.map((type) => (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => setSelectedType(type.id)}
                  className={`flex items-center gap-3 p-4 rounded-xl border text-left transition-all ${
                    selectedType === type.id 
                      ? "border-primary bg-primary/5 ring-1 ring-primary/20" 
                      : "hover:border-primary/40 hover:bg-muted"
                  }`}
                >
                  <span className="text-2xl">{type.emoji}</span>
                  <span className="font-medium text-sm">{type.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* ── Section 2: Details ── */}
          <div className="bg-card border rounded-2xl p-6 md:p-8">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Type className="w-4 h-4 text-primary" />
              </div>
              <h2 className="text-lg font-semibold">Event Details</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="title">Event Title</Label>
                <div className="relative">
                  <Input id="title" placeholder="e.g. Sokha & Dara's Wedding" className="h-12 pl-10" required />
                  <Type className="w-4 h-4 text-muted-foreground absolute left-4 top-1/2 -translate-y-1/2" />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <div className="relative">
                  <Input id="date" type="date" className="h-12 pl-10" required />
                  <CalendarIcon className="w-4 h-4 text-muted-foreground absolute left-4 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="venue">Venue Location</Label>
                <div className="relative">
                  <Input id="venue" placeholder="e.g. Sokha Hotel, Phnom Penh" className="h-12 pl-10" required />
                  <MapPin className="w-4 h-4 text-muted-foreground absolute left-4 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="guests">Estimated Guest Count</Label>
                <div className="relative">
                  <Input id="guests" type="number" placeholder="e.g. 500" className="h-12 pl-10" />
                  <Users className="w-4 h-4 text-muted-foreground absolute left-4 top-1/2 -translate-y-1/2" />
                </div>
              </div>
            </div>
          </div>

          {/* ── Action Buttons ── */}
          <div className="flex items-center gap-4 justify-end pt-4">
            <Link href="/dashboard">
              <Button type="button" variant="ghost" className="h-12 px-8 rounded-xl">Cancel</Button>
            </Link>
            <Button type="submit" disabled={loading} className="h-12 px-8 rounded-xl shadow-lg shadow-primary/20">
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Creating...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Continue to Templates <ArrowRight className="w-4 h-4" />
                </span>
              )}
            </Button>
          </div>
        </motion.form>

      </div>
    </div>
  )
}
