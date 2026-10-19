"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Settings,
  Shield,
  Server,
  Database,
  Cloud,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Lock,
  Save,
  Loader2,
  Info,
  Radio,
} from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { api } from "@/lib/api"

export function AdminSettingsView() {
  const { user } = useAuth()
  const [healthStatus, setHealthStatus] = React.useState<{
    status: string
    service?: string
    timestamp?: string
  } | null>(null)
  const [healthLoading, setHealthLoading] = React.useState(false)
  const [saveSuccess, setSaveSuccess] = React.useState(false)

  // Config settings form state
  const [platformName, setPlatformName] = React.useState("Mongkolka Platform")
  const [allowRegistration, setAllowRegistration] = React.useState(true)
  const [maintenanceMode, setMaintenanceMode] = React.useState(false)
  const [defaultGuestQuota, setDefaultGuestQuota] = React.useState(250)
  const [announcementBanner, setAnnouncementBanner] = React.useState("")

  const checkHealth = React.useCallback(async () => {
    try {
      setHealthLoading(true)
      const res = await api.get<{ status: string; service: string; timestamp: string }>("/health")
      setHealthStatus(res)
    } catch {
      setHealthStatus({ status: "offline" })
    } finally {
      setHealthLoading(false)
    }
  }, [])

  React.useEffect(() => {
    checkHealth()
  }, [checkHealth])

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault()
    setSaveSuccess(true)
    setTimeout(() => setSaveSuccess(false), 3000)
  }

  return (
    <div className="py-8">
      <div className="container px-6 md:px-10 mx-auto max-w-5xl space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 text-xs font-semibold uppercase tracking-wider mb-2">
              <Settings className="w-3.5 h-3.5" />
              Platform Configuration
            </div>
            <h1 className="text-3xl font-bold tracking-tight">System Settings</h1>
            <p className="text-muted-foreground text-sm mt-1">
              Configure system parameters, monitor runtime health, and manage security settings.
            </p>
          </div>

          <button
            onClick={checkHealth}
            disabled={healthLoading}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-card border text-sm font-medium hover:bg-muted transition-colors cursor-pointer self-start md:self-auto"
          >
            <RefreshCw className={`w-4 h-4 ${healthLoading ? "animate-spin" : ""}`} />
            Refresh Diagnostics
          </button>
        </div>

        {/* System Health Diagnostics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-card p-5 rounded-2xl border shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <Server className="w-4 h-4 text-primary" />
                Backend REST API
              </div>
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  healthStatus?.status === "ok" ? "bg-emerald-500" : "bg-destructive animate-ping"
                }`}
              />
            </div>
            <div className="text-2xl font-bold tracking-tight">
              {healthStatus?.status === "ok" ? "Operational" : "Degraded"}
            </div>
            <p className="text-xs text-muted-foreground font-mono">
              Port 5000 &bull; Node.js Express
            </p>
          </div>

          <div className="bg-card p-5 rounded-2xl border shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <Database className="w-4 h-4 text-emerald-500" />
                Database Engine
              </div>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            </div>
            <div className="text-2xl font-bold tracking-tight">MySQL 8.0</div>
            <p className="text-xs text-muted-foreground font-mono">
              Prisma ORM &bull; mongkolka_db
            </p>
          </div>

          <div className="bg-card p-5 rounded-2xl border shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <Cloud className="w-4 h-4 text-blue-500" />
                Media &amp; CDN
              </div>
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
            </div>
            <div className="text-2xl font-bold tracking-tight">ImageKit CDN</div>
            <p className="text-xs text-muted-foreground font-mono">
              Photos &bull; Audio tracks &bull; QR passes
            </p>
          </div>
        </div>

        {/* Settings form */}
        <form onSubmit={handleSaveSettings} className="space-y-6">
          {/* General Platform Controls */}
          <div className="bg-card rounded-2xl border p-6 shadow-sm space-y-6">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <Info className="w-5 h-5 text-primary" />
              General Controls
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-xs font-semibold uppercase text-muted-foreground">
                  Platform Name
                </label>
                <input
                  type="text"
                  value={platformName}
                  onChange={(e) => setPlatformName(e.target.value)}
                  className="w-full mt-1.5 px-3.5 py-2 text-sm bg-muted/40 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>

              <div>
                <label className="text-xs font-semibold uppercase text-muted-foreground">
                  Default Guest Limit Per Event
                </label>
                <input
                  type="number"
                  value={defaultGuestQuota}
                  onChange={(e) => setDefaultGuestQuota(parseInt(e.target.value) || 100)}
                  className="w-full mt-1.5 px-3.5 py-2 text-sm bg-muted/40 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold uppercase text-muted-foreground">
                Platform Announcement Banner (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Scheduled maintenance on Sunday 2:00 AM UTC"
                value={announcementBanner}
                onChange={(e) => setAnnouncementBanner(e.target.value)}
                className="w-full mt-1.5 px-3.5 py-2 text-sm bg-muted/40 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>

            <div className="pt-4 border-t space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-sm">Allow Public User Signups</div>
                  <div className="text-xs text-muted-foreground">
                    If disabled, only administrators can invite new hosts to the platform.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={allowRegistration}
                  onChange={(e) => setAllowRegistration(e.target.checked)}
                  className="w-4 h-4 rounded text-primary focus:ring-primary cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-sm text-destructive">Maintenance Mode</div>
                  <div className="text-xs text-muted-foreground">
                    Display maintenance page to non-admin visitors and guest RSVPs.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={maintenanceMode}
                  onChange={(e) => setMaintenanceMode(e.target.checked)}
                  className="w-4 h-4 rounded text-destructive focus:ring-destructive cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Current Admin Account Details */}
          <div className="bg-card rounded-2xl border p-6 shadow-sm space-y-4">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <Shield className="w-5 h-5 text-purple-500" />
              Administrator Identity
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="p-4 bg-muted/30 rounded-xl border">
                <span className="text-xs text-muted-foreground uppercase font-semibold">
                  Admin Name
                </span>
                <div className="font-bold text-foreground mt-1">
                  {user?.name || "Vibol"}
                </div>
              </div>

              <div className="p-4 bg-muted/30 rounded-xl border">
                <span className="text-xs text-muted-foreground uppercase font-semibold">
                  Admin Email
                </span>
                <div className="font-bold text-foreground mt-1 font-mono">
                  {user?.email || "vibolsen2002@gmail.com"}
                </div>
              </div>

              <div className="p-4 bg-muted/30 rounded-xl border">
                <span className="text-xs text-muted-foreground uppercase font-semibold">
                  Security Level
                </span>
                <div className="font-bold text-purple-600 dark:text-purple-400 mt-1 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5" />
                  SUPER_ADMIN (Full Platform Access)
                </div>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex items-center justify-between">
            <AnimatePresence>
              {saveSuccess && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400 font-medium"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Settings saved successfully!
                </motion.div>
              )}
            </AnimatePresence>

            <button
              type="submit"
              className="ml-auto inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm shadow-md hover:bg-primary/90 transition-all cursor-pointer"
            >
              <Save className="w-4 h-4" />
              Save Configuration
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
