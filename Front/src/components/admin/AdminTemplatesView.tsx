"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Layout,
  Plus,
  Trash2,
  Crown,
  Sparkles,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Eye,
  Calendar,
  Layers,
  Palette,
  X,
} from "lucide-react"
import { api } from "@/lib/api"

interface Template {
  id: string
  name: string
  type: string
  description: string | null
  thumbnail: string | null
  isPremium: boolean
  defaultTheme: {
    primaryColor?: string
    secondaryColor?: string
    backgroundColor?: string
    textColor?: string
  } | null
  _count?: {
    userEvents: number
  }
}

export function AdminTemplatesView() {
  const [templates, setTemplates] = React.useState<Template[]>([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const [feedback, setFeedback] = React.useState<{ text: string; type: "success" | "error" } | null>(null)
  const [actionId, setActionId] = React.useState<string | null>(null)
  const [isCreateOpen, setIsCreateOpen] = React.useState(false)

  // Form state
  const [formData, setFormData] = React.useState({
    name: "",
    type: "WEDDING_KHMER",
    description: "",
    thumbnail: "",
    isPremium: false,
    primaryColor: "#D4AF37",
    secondaryColor: "#C41E3A",
  })
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const fetchTemplates = React.useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const res = await api.get<{ success: boolean; data: Template[] }>("/admin/templates")
      if (res.success && Array.isArray(res.data)) {
        setTemplates(res.data)
      }
    } catch (err: any) {
      setError(err.message || "Failed to load templates")
    } finally {
      setLoading(false)
    }
  }, [])

  React.useEffect(() => {
    fetchTemplates()
  }, [fetchTemplates])

  const handleTogglePremium = async (templateId: string, currentPremium: boolean) => {
    try {
      setActionId(templateId)
      const res = await api.patch<{ success: boolean; data: Template; message: string }>(
        `/admin/templates/${templateId}`,
        { isPremium: !currentPremium }
      )
      if (res.success) {
        setTemplates((prev) =>
          prev.map((t) => (t.id === templateId ? { ...t, isPremium: !currentPremium } : t))
        )
        setFeedback({
          text: `Template set to ${!currentPremium ? "Premium" : "Standard"}`,
          type: "success",
        })
      }
    } catch (err: any) {
      setFeedback({ text: err.message || "Failed to update template", type: "error" })
    } finally {
      setActionId(null)
      setTimeout(() => setFeedback(null), 3000)
    }
  }

  const handleDeleteTemplate = async (templateId: string, name: string) => {
    if (!confirm(`Are you sure you want to delete template "${name}"? Existing events using this template will be unlinked.`)) {
      return
    }

    try {
      setActionId(templateId)
      const res = await api.delete<{ success: boolean; message: string }>(`/admin/templates/${templateId}`)
      if (res.success) {
        setTemplates((prev) => prev.filter((t) => t.id !== templateId))
        setFeedback({ text: "Template deleted successfully", type: "success" })
      }
    } catch (err: any) {
      setFeedback({ text: err.message || "Failed to delete template", type: "error" })
    } finally {
      setActionId(null)
      setTimeout(() => setFeedback(null), 3000)
    }
  }

  const handleCreateTemplate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim()) return

    try {
      setIsSubmitting(true)
      const res = await api.post<{ success: boolean; data: Template; message: string }>(
        "/admin/templates",
        {
          name: formData.name.trim(),
          type: formData.type,
          description: formData.description.trim() || null,
          thumbnail: formData.thumbnail.trim() || null,
          isPremium: formData.isPremium,
          defaultTheme: {
            primaryColor: formData.primaryColor,
            secondaryColor: formData.secondaryColor,
            backgroundColor: "#FAFAF5",
            textColor: "#1A1A1A",
          },
        }
      )

      if (res.success && res.data) {
        setTemplates((prev) => [res.data, ...prev])
        setIsCreateOpen(false)
        setFormData({
          name: "",
          type: "WEDDING_KHMER",
          description: "",
          thumbnail: "",
          isPremium: false,
          primaryColor: "#D4AF37",
          secondaryColor: "#C41E3A",
        })
        setFeedback({ text: "New template published successfully", type: "success" })
      }
    } catch (err: any) {
      setFeedback({ text: err.message || "Failed to create template", type: "error" })
    } finally {
      setIsSubmitting(false)
      setTimeout(() => setFeedback(null), 3000)
    }
  }

  return (
    <div className="py-8">
      <div className="container px-6 md:px-10 mx-auto max-w-6xl space-y-8">
        {/* Header section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 text-xs font-semibold uppercase tracking-wider mb-2">
              <Layout className="w-3.5 h-3.5" />
              Design Engine
            </div>
            <h1 className="text-3xl font-bold tracking-tight">Templates Management</h1>
            <p className="text-muted-foreground text-sm mt-1">
              Add new wedding invitations, set default themes, and manage standard vs premium designs.
            </p>
          </div>

          <button
            onClick={() => setIsCreateOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm shadow-md hover:bg-primary/90 transition-all cursor-pointer self-start md:self-auto"
          >
            <Plus className="w-4 h-4" />
            Add New Template
          </button>
        </div>

        {/* Feedback alert */}
        <AnimatePresence>
          {feedback && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`p-4 rounded-xl border flex items-center gap-3 text-sm ${
                feedback.type === "success"
                  ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                  : "bg-destructive/10 border-destructive/20 text-destructive"
              }`}
            >
              {feedback.type === "success" ? (
                <CheckCircle2 className="w-5 h-5 shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 shrink-0" />
              )}
              <span>{feedback.text}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Templates grid */}
        {loading ? (
          <div className="bg-card rounded-2xl border p-12 flex flex-col items-center justify-center gap-3 text-muted-foreground">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="text-sm">Loading design templates...</p>
          </div>
        ) : error ? (
          <div className="bg-destructive/10 rounded-2xl border border-destructive/20 p-8 text-center text-destructive space-y-3">
            <AlertCircle className="w-8 h-8 mx-auto" />
            <p className="font-semibold">{error}</p>
            <button
              onClick={fetchTemplates}
              className="px-4 py-2 bg-background text-foreground text-xs font-semibold rounded-lg border shadow-sm hover:bg-muted"
            >
              Retry
            </button>
          </div>
        ) : templates.length === 0 ? (
          <div className="bg-card rounded-2xl border p-12 text-center text-muted-foreground">
            <Layers className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="font-semibold text-foreground">No templates available</p>
            <p className="text-xs mt-1">Click &ldquo;Add New Template&rdquo; to publish your first design.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.map((tpl) => {
              const isBusy = actionId === tpl.id
              const primaryColor = tpl.defaultTheme?.primaryColor || "#D4AF37"
              const secondaryColor = tpl.defaultTheme?.secondaryColor || "#C41E3A"

              return (
                <motion.div
                  key={tpl.id}
                  layout
                  className="bg-card rounded-2xl border shadow-sm overflow-hidden flex flex-col group hover:shadow-md transition-shadow"
                >
                  {/* Thumbnail Banner */}
                  <div className="relative h-44 w-full bg-muted overflow-hidden">
                    {tpl.thumbnail ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={tpl.thumbnail}
                        alt={tpl.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5 text-primary">
                        <Sparkles className="w-10 h-10 opacity-30" />
                      </div>
                    )}

                    <div className="absolute top-3 left-3 flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-background/80 backdrop-blur-md border shadow-xs uppercase tracking-wider">
                        {tpl.type.replace("WEDDING_", "")}
                      </span>
                    </div>

                    <div className="absolute top-3 right-3">
                      {tpl.isPremium ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500 text-white shadow-xs">
                          <Crown className="w-3.5 h-3.5" />
                          Premium
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-background/80 backdrop-blur-md text-foreground border shadow-xs">
                          Standard
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors">
                        {tpl.name}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                        {tpl.description || "No description provided for this template."}
                      </p>
                    </div>

                    {/* Colors & Usage */}
                    <div className="pt-3 border-t flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Palette className="w-3.5 h-3.5 text-muted-foreground" />
                        <span className="font-medium text-[11px]">Theme:</span>
                        <div className="flex items-center gap-1.5">
                          <span
                            className="w-3.5 h-3.5 rounded-full border shadow-2xs"
                            style={{ backgroundColor: primaryColor }}
                            title={`Primary: ${primaryColor}`}
                          />
                          <span
                            className="w-3.5 h-3.5 rounded-full border shadow-2xs"
                            style={{ backgroundColor: secondaryColor }}
                            title={`Secondary: ${secondaryColor}`}
                          />
                        </div>
                      </div>

                      <span className="font-medium text-foreground">
                        {tpl._count?.userEvents || 0} events
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="pt-2 flex items-center gap-2">
                      <button
                        disabled={isBusy}
                        onClick={() => handleTogglePremium(tpl.id, tpl.isPremium)}
                        className={`flex-1 py-1.5 px-3 rounded-xl border text-xs font-medium transition-colors text-center ${
                          tpl.isPremium
                            ? "bg-amber-500/10 text-amber-600 hover:bg-amber-500/20 border-amber-500/20"
                            : "bg-muted hover:bg-muted/80 text-foreground"
                        }`}
                      >
                        {isBusy ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin mx-auto" />
                        ) : tpl.isPremium ? (
                          "Make Standard"
                        ) : (
                          "Make Premium"
                        )}
                      </button>

                      <button
                        disabled={isBusy}
                        onClick={() => handleDeleteTemplate(tpl.id, tpl.name)}
                        title="Delete template"
                        className="p-2 rounded-xl border border-destructive/20 text-destructive bg-destructive/5 hover:bg-destructive/10 transition-colors disabled:opacity-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}

        {/* Modal: Add New Template */}
        <AnimatePresence>
          {isCreateOpen && (
            <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-card w-full max-w-lg rounded-2xl border shadow-xl overflow-hidden"
              >
                <div className="flex items-center justify-between p-6 border-b">
                  <div className="flex items-center gap-2">
                    <Layout className="w-5 h-5 text-primary" />
                    <h2 className="text-lg font-bold">Add New Design Template</h2>
                  </div>
                  <button
                    onClick={() => setIsCreateOpen(false)}
                    className="p-1 rounded-lg text-muted-foreground hover:bg-muted"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleCreateTemplate} className="p-6 space-y-4">
                  <div>
                    <label className="text-xs font-semibold uppercase text-muted-foreground">
                      Template Name *
                    </label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. Royal Emerald Elegance"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full mt-1 px-3.5 py-2 text-sm bg-muted/40 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold uppercase text-muted-foreground">
                        Category Type
                      </label>
                      <select
                        value={formData.type}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                        className="w-full mt-1 px-3 py-2 text-sm bg-muted/40 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30"
                      >
                        <option value="WEDDING_KHMER">Khmer Traditional</option>
                        <option value="WEDDING_MODERN">Modern Romance</option>
                        <option value="PRE_WEDDING">Pre-Wedding</option>
                        <option value="BIRTHDAY">Birthday</option>
                        <option value="ANNIVERSARY">Anniversary</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-semibold uppercase text-muted-foreground">
                        Pricing Tier
                      </label>
                      <div className="mt-2 flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="isPremiumCheck"
                          checked={formData.isPremium}
                          onChange={(e) => setFormData({ ...formData, isPremium: e.target.checked })}
                          className="w-4 h-4 rounded text-primary focus:ring-primary"
                        />
                        <label htmlFor="isPremiumCheck" className="text-sm font-medium cursor-pointer">
                          Premium Template
                        </label>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold uppercase text-muted-foreground">
                      Thumbnail Image URL
                    </label>
                    <input
                      type="url"
                      placeholder="https://images.unsplash.com/photo-..."
                      value={formData.thumbnail}
                      onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                      className="w-full mt-1 px-3.5 py-2 text-sm bg-muted/40 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold uppercase text-muted-foreground">
                      Description
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Highlights, motifs, style description..."
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full mt-1 px-3.5 py-2 text-sm bg-muted/40 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold uppercase text-muted-foreground">
                        Primary Color
                      </label>
                      <div className="mt-1 flex items-center gap-2">
                        <input
                          type="color"
                          value={formData.primaryColor}
                          onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                          className="w-9 h-9 rounded-lg border cursor-pointer p-0.5"
                        />
                        <input
                          type="text"
                          value={formData.primaryColor}
                          onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                          className="flex-1 px-2.5 py-1.5 text-xs font-mono uppercase bg-muted/40 border rounded-lg"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-semibold uppercase text-muted-foreground">
                        Secondary Color
                      </label>
                      <div className="mt-1 flex items-center gap-2">
                        <input
                          type="color"
                          value={formData.secondaryColor}
                          onChange={(e) => setFormData({ ...formData, secondaryColor: e.target.value })}
                          className="w-9 h-9 rounded-lg border cursor-pointer p-0.5"
                        />
                        <input
                          type="text"
                          value={formData.secondaryColor}
                          onChange={(e) => setFormData({ ...formData, secondaryColor: e.target.value })}
                          className="flex-1 px-2.5 py-1.5 text-xs font-mono uppercase bg-muted/40 border rounded-lg"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t flex items-center justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setIsCreateOpen(false)}
                      className="px-4 py-2 text-sm font-medium rounded-xl border hover:bg-muted"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-5 py-2 text-sm font-semibold rounded-xl bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 disabled:opacity-50 flex items-center gap-2"
                    >
                      {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                      Publish Template
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
