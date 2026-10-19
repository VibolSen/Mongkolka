"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { RSVPData, TemplateTheme } from "@/lib/types/template"
import { Check } from "lucide-react"

interface Props {
  data: RSVPData
  eventId: string
  theme: TemplateTheme
}

export function RsvpSection({ data, eventId, theme }: Props) {
  const [form, setForm] = React.useState({
    name: "",
    phone: "",
    status: "ATTENDING",
    pax: 1,
    foodPref: "",
    message: "",
  })
  const [submitted, setSubmitted] = React.useState(false)
  const [checkInToken, setCheckInToken] = React.useState<string | null>(null)
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"}/public/events/${eventId}/rsvp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || "Failed to submit RSVP")
      if (data?.data?.checkInToken) {
        setCheckInToken(data.data.checkInToken)
      }
      setSubmitted(true)
    } catch (err: any) {
      setError(err?.message || "Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <section id="rsvp" className="py-24 px-6" style={{ backgroundColor: `${theme.primaryColor}08` }}>
        <div className="max-w-md mx-auto text-center space-y-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-16 h-16 rounded-full flex items-center justify-center mx-auto"
            style={{ backgroundColor: theme.primaryColor }}
          >
            <Check className="w-8 h-8 text-white" />
          </motion.div>

          <div>
            <h2 className="text-3xl font-bold mb-2">សូមអរគុណ! 🙏</h2>
            <p className="opacity-75 text-sm">
              Your RSVP has been confirmed. We look forward to celebrating with you!
            </p>
          </div>

          {form.status === "ATTENDING" && checkInToken && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card rounded-2xl p-6 border shadow-lg text-center space-y-3"
            >
              <div className="inline-block p-3 rounded-2xl bg-muted/60 mb-1">
                <div className="w-32 h-32 bg-white rounded-xl p-2 mx-auto flex items-center justify-center border shadow-inner">
                  {/* Clean SVG QR code representation */}
                  <svg className="w-full h-full text-zinc-900" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M2 2h8v8H2V2zm2 2v4h4V4H4zm10-2h8v8h-8V2zm2 2v4h4V4h-4zM2 14h8v8H2v-8zm2 2v4h4v-4H4zm13-2h3v3h-3v-3zm0 5h3v3h-3v-3zm-3-5h2v2h-2v-2zm0 4h2v4h-2v-4zm5 2h2v2h-2v-2z" />
                  </svg>
                </div>
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-primary">
                  Official Guest Digital Pass
                </span>
                <h3 className="text-lg font-bold">{form.name}</h3>
                <p className="text-xs text-muted-foreground">{form.pax} Guest(s)</p>
              </div>

              <div className="p-2.5 rounded-xl bg-muted/50 text-[11px] font-mono text-muted-foreground break-all">
                Pass ID: {checkInToken.slice(0, 18)}...
              </div>

              <p className="text-[11px] text-muted-foreground italic">
                📸 Please screenshot this QR pass for fast check-in at the door.
              </p>
            </motion.div>
          )}
        </div>
      </section>
    )
  }

  return (
    <section id="rsvp" className="py-24 px-6" style={{ backgroundColor: `${theme.primaryColor}08` }}>
      <div className="max-w-xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <p className="text-sm uppercase tracking-[0.3em] mb-3" style={{ color: theme.primaryColor }}>
            Attendance
          </p>
          <h2 className="text-4xl font-bold mb-2">{data.title || "RSVP"}</h2>
          {data.deadline && (
            <p className="text-sm opacity-60">Please respond by {new Date(data.deadline).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</p>
          )}
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          onSubmit={handleSubmit}
          className="bg-white dark:bg-zinc-900 rounded-3xl shadow-xl p-8 space-y-5 border"
          style={{ borderColor: `${theme.primaryColor}20` }}
        >
          {/* Attendance toggle */}
          <div className="grid grid-cols-2 gap-3">
            {["ATTENDING", "DECLINED"].map(s => (
              <button
                key={s}
                type="button"
                onClick={() => setForm(f => ({ ...f, status: s }))}
                className="py-3 rounded-xl text-sm font-semibold border-2 transition-all"
                style={{
                  borderColor: form.status === s ? theme.primaryColor : "transparent",
                  backgroundColor: form.status === s ? `${theme.primaryColor}15` : "transparent",
                  color: form.status === s ? theme.primaryColor : undefined,
                }}
              >
                {s === "ATTENDING" ? "✅ Yes, I'll be there" : "❌ Can't make it"}
              </button>
            ))}
          </div>

          {/* Name */}
          <div>
            <label className="block text-xs uppercase tracking-wider opacity-60 mb-1.5">Full Name *</label>
            <input
              type="text"
              required
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              placeholder="Sokha Chan"
              className="w-full px-4 py-3 rounded-xl border bg-transparent focus:outline-none focus:ring-2 text-sm"
              style={{ borderColor: `${theme.primaryColor}30`, focusRingColor: theme.primaryColor } as any}
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-xs uppercase tracking-wider opacity-60 mb-1.5">Phone Number</label>
            <input
              type="tel"
              value={form.phone}
              onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
              placeholder="012 xxx xxx"
              className="w-full px-4 py-3 rounded-xl border bg-transparent focus:outline-none text-sm"
              style={{ borderColor: `${theme.primaryColor}30` }}
            />
          </div>

          {/* Number of guests */}
          {data.allowPlusOne && (
            <div>
              <label className="block text-xs uppercase tracking-wider opacity-60 mb-1.5">Number of Guests</label>
              <select
                value={form.pax}
                onChange={e => setForm(f => ({ ...f, pax: Number(e.target.value) }))}
                className="w-full px-4 py-3 rounded-xl border bg-transparent focus:outline-none text-sm"
                style={{ borderColor: `${theme.primaryColor}30` }}
              >
                {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n} {n === 1 ? "person" : "people"}</option>)}
              </select>
            </div>
          )}

          {/* Food preference */}
          {data.requireFoodPref && (
            <div>
              <label className="block text-xs uppercase tracking-wider opacity-60 mb-1.5">Food Preference</label>
              <select
                value={form.foodPref}
                onChange={e => setForm(f => ({ ...f, foodPref: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border bg-transparent text-sm"
                style={{ borderColor: `${theme.primaryColor}30` }}
              >
                <option value="">No preference</option>
                <option value="Vegetarian">Vegetarian</option>
                <option value="Halal">Halal</option>
                <option value="Vegan">Vegan</option>
              </select>
            </div>
          )}

          {/* Blessing message */}
          <div>
            <label className="block text-xs uppercase tracking-wider opacity-60 mb-1.5">Blessing / Message (Optional)</label>
            <textarea
              value={form.message}
              onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
              placeholder="Write your wishes here..."
              rows={3}
              className="w-full px-4 py-3 rounded-xl border bg-transparent focus:outline-none text-sm resize-none"
              style={{ borderColor: `${theme.primaryColor}30` }}
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-xl font-semibold text-white text-sm tracking-wide transition-transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60"
            style={{ backgroundColor: theme.primaryColor }}
          >
            {loading ? "Sending..." : "Confirm Attendance 🙏"}
          </button>
        </motion.form>
      </div>
    </section>
  )
}
