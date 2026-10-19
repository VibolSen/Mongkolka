"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { useSession } from "next-auth/react"
import { User, Bell, Shield, Loader2, Check } from "lucide-react"

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, delay },
})

function Section({ title, icon: Icon, children }: { title: string; icon: any; children: React.ReactNode }) {
  return (
    <div className="bg-card rounded-2xl border p-6 space-y-5">
      <div className="flex items-center gap-2 font-semibold">
        <Icon className="w-4 h-4 text-primary" /> {title}
      </div>
      {children}
    </div>
  )
}

function Row({ label, description, children }: { label: string; description?: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 py-1">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium">{label}</p>
        {description && <p className="text-xs text-muted-foreground mt-0.5">{description}</p>}
      </div>
      <div className="flex-shrink-0">{children}</div>
    </div>
  )
}

function Toggle({ defaultOn = false }: { defaultOn?: boolean }) {
  const [on, setOn] = React.useState(defaultOn)
  return (
    <button onClick={() => setOn(v => !v)}
      className={`w-10 h-6 rounded-full transition-colors relative ${on ? "bg-primary" : "bg-muted-foreground/30"}`}>
      <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${on ? "translate-x-4" : "translate-x-0.5"}`} />
    </button>
  )
}

export default function SettingsPage() {
  const { data: session, update } = useSession()
  const [name, setName] = React.useState("")
  const [saved, setSaved] = React.useState(false)
  const [saving, setSaving] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  // Load real name from API once session is ready
  React.useEffect(() => {
    if (!session?.user?.email) return
    fetch("/api/user")
      .then(r => r.json())
      .then(d => { if (d.user?.name) setName(d.user.name) })
  }, [session?.user?.email])

  const handleSave = async () => {
    if (!name.trim()) return
    setSaving(true)
    setError(null)
    try {
      const res = await fetch("/api/user", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim() })
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || "Failed to save")
        return
      }
      // Update the session so the sidebar name refreshes
      await update({ name: data.user.name })
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    } catch {
      setError("Network error. Please try again.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="py-8 px-6 max-w-3xl mx-auto space-y-6">
      <motion.div {...fadeUp(0)}>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground text-sm mt-0.5">Manage your account and preferences</p>
      </motion.div>

      {/* Profile */}
      <motion.div {...fadeUp(0.05)}>
        <Section title="Profile" icon={User}>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-xl font-bold">
              {name[0]?.toUpperCase() ?? "U"}
            </div>
            <div>
              <p className="font-semibold">{name || "Your Name"}</p>
              <p className="text-sm text-muted-foreground">{session?.user?.email ?? ""}</p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label className="text-xs uppercase tracking-wider text-muted-foreground block mb-1.5">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border bg-muted/30 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="text-xs uppercase tracking-wider text-muted-foreground block mb-1.5">Email</label>
              <input
                type="email"
                value={session?.user?.email ?? ""}
                disabled
                className="w-full px-4 py-2.5 rounded-xl border bg-muted/50 text-sm opacity-60 cursor-not-allowed"
              />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <button
              onClick={handleSave}
              disabled={saving || !name.trim()}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-transform hover:scale-[1.02] disabled:opacity-60 disabled:cursor-not-allowed"
              style={{ background: "linear-gradient(135deg, #e11d48, #f59e0b)" }}
            >
              {saved ? <><Check className="w-4 h-4" /> Saved!</> :
               saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</> :
               "Save Changes"}
            </button>
          </div>
        </Section>
      </motion.div>

      {/* Notifications */}
      <motion.div {...fadeUp(0.1)}>
        <Section title="Notifications" icon={Bell}>
          <div className="divide-y">
            <Row label="New RSVP" description="Get notified when someone RSVPs to your event">
              <Toggle defaultOn />
            </Row>
            <Row label="Guest Messages" description="Receive wishes from your guests">
              <Toggle defaultOn />
            </Row>
            <Row label="Product Updates" description="News and announcements from Mongkol">
              <Toggle />
            </Row>
          </div>
        </Section>
      </motion.div>

      {/* Privacy */}
      <motion.div {...fadeUp(0.15)}>
        <Section title="Privacy" icon={Shield}>
          <div className="divide-y">
            <Row label="Public Events" description="Anyone with the link can view your event page">
              <Toggle defaultOn />
            </Row>
            <Row label="Show Guest List" description="Display attendee names on your event page">
              <Toggle />
            </Row>
          </div>
        </Section>
      </motion.div>

      {/* Danger zone */}
      <motion.div {...fadeUp(0.2)}>
        <div className="bg-destructive/5 border border-destructive/20 rounded-2xl p-6">
          <h3 className="font-semibold text-destructive mb-1">Danger Zone</h3>
          <p className="text-sm text-muted-foreground mb-4">Permanently delete your account and all associated data.</p>
          <button className="px-4 py-2 text-sm font-medium text-destructive border border-destructive/30 rounded-xl hover:bg-destructive/10 transition-colors">
            Delete Account
          </button>
        </div>
      </motion.div>
    </div>
  )
}
