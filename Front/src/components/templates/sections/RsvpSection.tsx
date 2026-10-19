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
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      const res = await fetch(`/api/events/${eventId}/rsvp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error("Failed")
      setSubmitted(true)
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <section id="rsvp" className="py-24 px-6" style={{ backgroundColor: `${theme.primaryColor}08` }}>
        <div className="max-w-md mx-auto text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
            style={{ backgroundColor: theme.primaryColor }}
          >
            <Check className="w-10 h-10 text-white" />
          </motion.div>
          <h2 className="text-3xl font-bold mb-3">សូមអរគុណ! 🙏</h2>
          <p className="opacity-70">Your RSVP has been received. We can't wait to celebrate with you!</p>
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
