"use client"

import * as React from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { Crown, Heart, Sparkles, Star, Cake, Baby, Home, GraduationCap, Briefcase, ArrowRight, Check, Loader2 } from "lucide-react"
import Link from "next/link"

const templates = [
  { id: "pre-wedding",       type: "PRE_WEDDING",    name: "Pre-Wedding",        nameKm: "មុនពិធីមង្គល",         icon: Heart,          gradient: "from-rose-400 to-pink-600",     emoji: "📸" },
  { id: "khmer-traditional", type: "WEDDING_KHMER",  name: "Khmer Traditional",  nameKm: "ពិធីអាពាហ៍ពិពាហ៍ខ្មែរ", icon: Crown,          gradient: "from-amber-400 to-yellow-600",  emoji: "💍", popular: true },
  { id: "modern-wedding",    type: "WEDDING_MODERN", name: "Modern Wedding",     nameKm: "ពិធីអាពាហ៍ពិពាហ៍ទំនើប", icon: Sparkles,       gradient: "from-slate-500 to-gray-700",    emoji: "💒" },
]

function slugify(text: string) {
  return text.toLowerCase().trim().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")
}

export default function CreateEventPage() {
  return (
    <div className="min-h-screen bg-muted/20 py-12 px-6">
      <div className="max-w-5xl mx-auto">
        <React.Suspense fallback={
          <div className="flex items-center justify-center h-[50vh]">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        }>
          <CreateEventForm />
        </React.Suspense>
      </div>
    </div>
  )
}

function CreateEventForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const preSelected = searchParams.get("template")

  const [step, setStep] = React.useState<1 | 2>(preSelected ? 2 : 1)
  const [selected, setSelected] = React.useState(
    preSelected ? templates.find(t => t.id === preSelected) ?? null : null
  )
  const [title, setTitle] = React.useState("")
  const [slug, setSlug] = React.useState("")
  const [slugEdited, setSlugEdited] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState("")

  // Auto-generate slug from title
  React.useEffect(() => {
    if (!slugEdited && title) setSlug(slugify(title))
  }, [title, slugEdited])

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selected) return
    setLoading(true)
    setError("")

    try {
      const res = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, type: selected.type, slug, templateId: null }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      router.push(`/dashboard/builder/${data.event.id}`)
    } catch (err: any) {
      setError(err.message ?? "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* Header */}
      <div className="mb-10 text-center">
        <Link href="/dashboard" className="text-sm text-muted-foreground hover:text-foreground mb-4 inline-block">
          ← Back to Dashboard
        </Link>
        <h1 className="text-4xl font-bold">Create New Event</h1>
        <p className="text-muted-foreground mt-2">Choose a template and personalize your digital invitation.</p>

        {/* Progress */}
        <div className="flex items-center justify-center gap-3 mt-6">
          {[{ n: 1, label: "Choose Template" }, { n: 2, label: "Event Details" }].map(({ n, label }) => (
            <React.Fragment key={n}>
              <div className={`flex items-center gap-2 text-sm font-medium transition-colors ${step >= n ? "text-foreground" : "text-muted-foreground"}`}>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                  step > n ? "bg-primary text-primary-foreground" : step === n ? "bg-primary text-primary-foreground" : "bg-muted"
                }`}>
                  {step > n ? <Check className="w-4 h-4" /> : n}
                </div>
                {label}
              </div>
              {n < 2 && <div className="w-12 h-px bg-muted-foreground/30" />}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Step 1: Pick Template */}
      {step === 1 && (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {templates.map((tpl) => {
              const Icon = tpl.icon
              const isSelected = selected?.id === tpl.id
              return (
                <button
                  key={tpl.id}
                  onClick={() => { setSelected(tpl); setStep(2) }}
                  className={`group relative rounded-2xl overflow-hidden border-2 transition-all text-left ${
                    isSelected ? "border-primary shadow-lg scale-[1.02]" : "border-transparent hover:border-primary/40 hover:shadow-md"
                  }`}
                >
                  {tpl.popular && (
                    <div className="absolute top-2 right-2 z-10 px-2 py-0.5 rounded-full bg-white/20 backdrop-blur text-white text-[10px] font-bold">
                      Popular
                    </div>
                  )}
                  <div className={`h-28 bg-gradient-to-br ${tpl.gradient} flex flex-col items-center justify-center text-white`}>
                    <span className="text-3xl mb-1">{tpl.emoji}</span>
                    <Icon className="w-5 h-5 opacity-80" />
                  </div>
                  <div className="p-3 bg-card">
                    <p className="font-semibold text-sm">{tpl.name}</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5" style={{ fontFamily: "Khmer OS Siemreap, serif" }}>
                      {tpl.nameKm}
                    </p>
                  </div>
                  {isSelected && (
                    <div className="absolute top-2 left-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        </motion.div>
      )}

      {/* Step 2: Event Details */}
      {step === 2 && selected && (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="max-w-lg mx-auto">
          {/* Selected template badge */}
          <div className={`flex items-center gap-3 p-4 rounded-2xl mb-8 bg-gradient-to-r ${selected.gradient} text-white`}>
            <span className="text-3xl">{selected.emoji}</span>
            <div>
              <p className="font-semibold">{selected.name}</p>
              <p className="text-xs opacity-80">Template selected</p>
            </div>
            <button onClick={() => setStep(1)} className="ml-auto text-xs underline opacity-80 hover:opacity-100">Change</button>
          </div>

          <form onSubmit={handleCreate} className="bg-card rounded-3xl border p-8 space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Event Title *</label>
              <input
                type="text"
                required
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder={selected.type === "WEDDING_KHMER" ? "ស្រីរ័ត្ន & ចន្ទ្រា Wedding" : "My Special Event"}
                className="w-full px-4 py-3 rounded-xl border bg-muted/30 focus:outline-none focus:ring-2 focus:ring-primary text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Public URL</label>
              <div className="flex items-center rounded-xl border bg-muted/30 overflow-hidden">
                <span className="px-3 py-3 text-sm text-muted-foreground border-r bg-muted/50 whitespace-nowrap">mongkol.com/e/</span>
                <input
                  type="text"
                  required
                  value={slug}
                  onChange={e => { setSlug(slugify(e.target.value)); setSlugEdited(true) }}
                  placeholder="your-event"
                  className="flex-1 px-3 py-3 bg-transparent focus:outline-none text-sm"
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1.5">This is the link you'll share with guests.</p>
            </div>

            {error && <p className="text-destructive text-sm">{error}</p>}

            <button
              type="submit"
              disabled={loading || !title || !slug}
              className="w-full py-4 rounded-xl text-white font-semibold flex items-center justify-center gap-2 transition-transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60"
              style={{ background: "linear-gradient(135deg, #e11d48, #f59e0b)" }}
            >
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Creating...</> : <>Open Builder <ArrowRight className="w-4 h-4" /></>}
            </button>
          </form>
        </motion.div>
      )}
    </>
  )
}
