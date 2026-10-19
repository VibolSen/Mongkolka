"use client"

import * as React from "react"
import { useParams, useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
  Eye, EyeOff, Settings2, Globe, Save,
  Palette, ChevronDown, ChevronUp, ExternalLink, ArrowLeft,
  Loader2, Check, ToggleLeft, ToggleRight, RefreshCw, Music2, Smartphone, Monitor, MapPin
} from "lucide-react"
import Link from "next/link"
import { TemplateSection, TemplateTheme, TemplateConfig } from "@/lib/types/template"
import { getSectionLabel, renderEditor } from "@/components/dashboard/builder/SectionEditors"

// ─── Main Builder ──────────────────────────────────────────────────────

export default function BuilderPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()

  const [event, setEvent] = React.useState<any>(null)
  const [sections, setSections] = React.useState<TemplateSection[]>([])
  const [theme, setTheme] = React.useState<TemplateTheme>({
    primaryColor: "#D4AF37", secondaryColor: "#C41E3A",
    backgroundColor: "#FAFAF5", textColor: "#1a1209",
    fontFamily: "Inter, sans-serif", fontFamilyKm: "Khmer OS Siemreap, serif",
  })
  const [activeSection, setActiveSection] = React.useState<string | null>(null)
  const [activeTab, setActiveTab] = React.useState<"sections" | "theme" | "music">("sections")
  const [musicData, setMusicData] = React.useState<{ url: string; autoplay: boolean; volume: number }>({
    url: "",
    autoplay: false,
    volume: 0.5,
  })
  const [saving, setSaving] = React.useState(false)
  const [saved, setSaved] = React.useState(false)
  const [publishing, setPublishing] = React.useState(false)
  const [loading, setLoading] = React.useState(true)
  const [uploadingMusic, setUploadingMusic] = React.useState(false)
  const [uploadingImage, setUploadingImage] = React.useState(false)
  const [librarySongs, setLibrarySongs] = React.useState<{ id: string; title: string; artist: string | null; url: string }[]>([])
  const [mobileView, setMobileView] = React.useState<"edit" | "preview">("edit")

  // Fetch event
  React.useEffect(() => {
    fetch(`/api/events/${id}`)
      .then(r => r.json())
      .then(data => {
        if (!data.event) return
        const ev = data.event
        setEvent(ev)

        // Sections can be stored as plain array OR as { sections: [...], theme: {...} }
        const rawSections = ev.sections
        let loadedSections: TemplateSection[] = []
        if (Array.isArray(rawSections)) {
          loadedSections = rawSections
        } else if (Array.isArray(rawSections?.sections)) {
          loadedSections = rawSections.sections
          if (rawSections.theme) setTheme(rawSections.theme)
        }
        
        const defaultAvailable = [
          { type: "VIDEO", id: "video-1", visible: false, order: 90, data: { url: "" } },
          { type: "COUNTDOWN", id: "countdown-1", visible: false, order: 91, data: { targetDate: ev.date ? new Date(ev.date).toISOString() : new Date().toISOString() } },
          { type: "QR_CODE", id: "qr-1", visible: false, order: 92, data: { title: "Wedding Gift", qrImage: "" } },
          { type: "MAP", id: "map-1", visible: false, order: 93, data: { title: "Location", mapUrl: "", address: "" } },
        ]
        
        defaultAvailable.forEach(def => {
          if (!loadedSections.some((s: any) => s.type === def.type)) {
            loadedSections.push(def as any)
          }
        })
        
        setSections(loadedSections)

        // Theme is stored separately in event.theme
        if (ev.theme && typeof ev.theme === "object" && !Array.isArray(ev.theme)) {
          setTheme(ev.theme as TemplateTheme)
        }

        // Music data
        if (ev.musicData && typeof ev.musicData === "object") {
          setMusicData(ev.musicData as any)
        }
      })
      .catch(err => console.error(err))

    fetch("/api/songs")
      .then(r => r.json())
      .then(data => {
        if (data.songs) setLibrarySongs(data.songs)
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }, [id])

  const save = React.useCallback(async (publish = false) => {
    setSaving(true)
    try {
      await fetch(`/api/events/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sections: sections,
          theme: theme,
          musicData: musicData,
          isPublished: publish ? true : event?.isPublished,
        }),
      })
      if (publish) setEvent((e: any) => ({ ...e, isPublished: true }))
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    } finally {
      setSaving(false)
    }
  }, [id, sections, theme, musicData, event])

  const toggleVisible = (sectionId: string) => {
    setSections(prev => prev.map(s => s.id === sectionId ? { ...s, visible: !s.visible } : s))
  }

  const moveSection = (idx: number, dir: -1 | 1) => {
    setSections(prev => {
      const arr = [...prev]
      const swap = idx + dir
      if (swap < 0 || swap >= arr.length) return arr
      ;[arr[idx], arr[swap]] = [arr[swap], arr[idx]]
      return arr.map((s, i) => ({ ...s, order: i }))
    })
  }

  const updateSectionData = (sectionId: string, data: any) => {
    setSections(prev => prev.map(s => s.id === sectionId ? { ...s, data } as any : s))
  }

  const handleMusicUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingMusic(true)
    try {
      const formData = new FormData()
      formData.append("file", file)
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })
      const data = await res.json()
      if (data.url) {
        setMusicData(prev => ({ ...prev, url: data.url }))
      } else {
        alert(data.error || "Upload failed")
      }
    } catch (err) {
      console.error(err)
      alert("Failed to upload file")
    } finally {
      setUploadingMusic(false)
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, onSuccess: (url: string) => void) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingImage(true)
    try {
      const formData = new FormData()
      formData.append("file", file)
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })
      const data = await res.json()
      if (data.url) {
        onSuccess(data.url)
      } else {
        alert(data.error || "Upload failed")
      }
    } catch (err) {
      console.error(err)
      alert("Failed to upload image")
    } finally {
      setUploadingImage(false)
    }
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
    </div>
  )

  if (!event) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <p className="text-xl font-semibold">Event not found</p>
      <Link href="/dashboard" className="text-primary hover:underline text-sm">← Back to dashboard</Link>
    </div>
  )

  const activeSec = sections.find(s => s.id === activeSection)

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-background">
      {/* ── Top bar ── */}
      <header className="flex items-center gap-2 px-3 sm:px-5 py-3 border-b bg-card/80 backdrop-blur z-10 shrink-0">
        <Link href="/dashboard" className="p-2 rounded-xl hover:bg-muted transition-colors shrink-0">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm truncate">{event.title}</p>
          <p className="text-xs text-muted-foreground hidden sm:block">mongkol.com/e/{event.slug}</p>
        </div>

        {/* Status badge */}
        <span className={`text-xs px-2 py-1 rounded-full font-medium shrink-0 hidden sm:inline-block ${
          event.isPublished ? "bg-emerald-500/10 text-emerald-600" : "bg-amber-500/10 text-amber-600"
        }`}>
          {event.isPublished ? "🟢 Live" : "🟡 Draft"}
        </span>

        <div className="flex items-center gap-1.5">
          {/* Mobile edit/preview toggle */}
          <div className="flex md:hidden items-center rounded-xl border bg-muted/30 p-0.5">
            <button
              onClick={() => setMobileView("edit")}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                mobileView === "edit" ? "bg-background shadow-sm" : "text-muted-foreground"
              }`}
            >
              Edit
            </button>
            <button
              onClick={() => setMobileView("preview")}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                mobileView === "preview" ? "bg-background shadow-sm" : "text-muted-foreground"
              }`}
            >
              Preview
            </button>
          </div>

          <Link
            href={`/e/${event.slug}`}
            target="_blank"
            className="hidden sm:flex items-center gap-1.5 px-3 py-2 text-sm border rounded-xl hover:bg-muted transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" /> Preview
          </Link>

          <button
            onClick={() => save(false)}
            disabled={saving}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-2 text-sm border rounded-xl hover:bg-muted transition-colors"
          >
            {saved ? <><Check className="w-3.5 h-3.5 text-emerald-500" /><span className="hidden sm:inline"> Saved</span></> :
              saving ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /><span className="hidden sm:inline"> Saving...</span></> :
              <><Save className="w-3.5 h-3.5" /><span className="hidden sm:inline"> Save</span></>}
          </button>

          {!event.isPublished && (
            <button
              onClick={async () => { setPublishing(true); await save(true); setPublishing(false) }}
              disabled={publishing}
              className="flex items-center gap-1.5 px-2.5 sm:px-4 py-2 text-sm rounded-xl text-white font-medium transition-transform hover:scale-[1.02]"
              style={{ background: "linear-gradient(135deg, #e11d48, #f59e0b)" }}
            >
              {publishing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Globe className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">Publish</span>
            </button>
          )}
        </div>
      </header>

      {/* ── Body ── */}
      <div className="flex flex-1 overflow-hidden">

        {/* ── Left sidebar ── */}
        <aside className={`border-r bg-card/50 flex-col overflow-hidden shrink-0 w-full md:w-72 ${mobileView === "preview" ? "hidden md:flex" : "flex"}`}>
          {/* Tabs */}
          <div className="flex border-b shrink-0">
            {([
              ["sections", "Sections", <Settings2 key="s" className="w-3.5 h-3.5 inline mr-1" />],
              ["theme", "Theme", <Palette key="t" className="w-3.5 h-3.5 inline mr-1" />],
              ["music", "Music", <Music2 key="m" className="w-3.5 h-3.5 inline mr-1" />],
            ] as const).map(([tab, label, icon]) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-3 text-xs font-medium transition-colors ${
                  activeTab === tab ? "border-b-2 border-primary text-primary" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {icon}{label}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-2">

            {/* Sections tab */}
            {activeTab === "sections" && sections.map((section, idx) => {
              const { label, emoji } = getSectionLabel(section.type)
              const isActive = activeSection === section.id

              return (
                <div key={section.id} className={`rounded-2xl border transition-all ${isActive ? "border-primary shadow-sm" : "border-transparent bg-muted/30 hover:bg-muted/50"}`}>
                  <div
                    className="flex items-center gap-2 p-3 cursor-pointer"
                    onClick={() => setActiveSection(isActive ? null : section.id)}
                  >
                    {/* Reorder */}
                    <div className="flex flex-col gap-0.5">
                      <button onClick={e => { e.stopPropagation(); moveSection(idx, -1) }} disabled={idx === 0}
                        className="hover:text-primary disabled:opacity-20 transition-colors">
                        <ChevronUp className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={e => { e.stopPropagation(); moveSection(idx, 1) }} disabled={idx === sections.length - 1}
                        className="hover:text-primary disabled:opacity-20 transition-colors">
                        <ChevronDown className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <span className="text-lg">{emoji}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{label}</p>
                      <p className={`text-xs ${section.visible ? "text-emerald-500" : "text-muted-foreground"}`}>
                        {section.visible ? "Visible" : "Hidden"}
                      </p>
                    </div>

                    {/* Visibility toggle */}
                    <button
                      onClick={e => { e.stopPropagation(); toggleVisible(section.id) }}
                      className="p-1.5 rounded-lg hover:bg-muted transition-colors"
                    >
                      {section.visible
                        ? <Eye className="w-4 h-4 text-primary" />
                        : <EyeOff className="w-4 h-4 text-muted-foreground" />}
                    </button>
                  </div>

                  {/* Editor panel */}
                  <AnimatePresence>
                    {isActive && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden border-t"
                      >
                        <div className="p-4">
                          {renderEditor(section, (data) => updateSectionData(section.id, data), handleImageUpload, uploadingImage)}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )
            })}

            {/* Theme tab */}
            {activeTab === "theme" && (
              <div className="space-y-5">
                {/* Colors */}
                <div className="space-y-3">
                  <p className="text-xs uppercase tracking-wider font-semibold opacity-60">Colors</p>
                  {([
                    ["primaryColor", "Primary Color"],
                    ["secondaryColor", "Secondary Color"],
                    ["backgroundColor", "Background"],
                    ["textColor", "Text Color"],
                  ] as const).map(([key, label]) => (
                    <div key={key} className="flex items-center justify-between">
                      <span className="text-sm">{label}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">{theme[key]}</span>
                        <input
                          type="color"
                          value={theme[key]}
                          onChange={e => setTheme(t => ({ ...t, [key]: e.target.value }))}
                          className="w-8 h-8 rounded-lg cursor-pointer border"
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Preset palettes */}
                <div>
                  <p className="text-xs uppercase tracking-wider font-semibold opacity-60 mb-3">Preset Palettes</p>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { name: "Royal Gold", primary: "#D4AF37", secondary: "#C41E3A", bg: "#FAFAF5" },
                      { name: "Rose Romance", primary: "#E11D48", secondary: "#FB923C", bg: "#FFF5F7" },
                      { name: "Royal Blue", primary: "#1D4ED8", secondary: "#7C3AED", bg: "#F5F8FF" },
                      { name: "Emerald", primary: "#059669", secondary: "#0284C7", bg: "#F0FDF4" },
                      { name: "Midnight", primary: "#A855F7", secondary: "#EC4899", bg: "#0F0F1A" },
                      { name: "Champagne", primary: "#C9A96E", secondary: "#8B6C42", bg: "#FFFAF0" },
                    ].map(p => (
                      <button
                        key={p.name}
                        onClick={() => setTheme(t => ({ ...t, primaryColor: p.primary, secondaryColor: p.secondary, backgroundColor: p.bg }))}
                        className="flex items-center gap-2 p-2.5 rounded-xl border hover:border-primary transition-colors text-left"
                      >
                        <div className="flex gap-1">
                          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: p.primary }} />
                          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: p.secondary }} />
                        </div>
                        <span className="text-xs font-medium">{p.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}\n
            {/* Music tab */}
            {activeTab === "music" && (
              <div className="space-y-6">
                {/* Info banner */}
                <div className="p-3 rounded-xl bg-primary/5 border border-primary/20 text-xs text-muted-foreground">
                  🎵 Add a background song that plays when guests open your invitation.
                </div>

                <div className="space-y-4">
                  {/* Library Songs Dropdown / List */}
                  {librarySongs.length > 0 && (
                    <div>
                      <label className="text-xs uppercase tracking-wider font-semibold opacity-60 block mb-2">Select from Library</label>
                      <div className="max-h-48 overflow-y-auto space-y-1 pr-1 border rounded-xl bg-muted/10 p-2">
                        {librarySongs.map(song => (
                          <button
                            key={song.id}
                            onClick={() => setMusicData(m => ({ ...m, url: song.url }))}
                            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center justify-between ${
                              musicData.url === song.url ? "bg-primary/10 text-primary font-medium" : "hover:bg-muted/50"
                            }`}
                          >
                            <div className="truncate pr-2">
                              {song.title} {song.artist && <span className="text-muted-foreground font-normal text-xs ml-1">- {song.artist}</span>}
                            </div>
                            {musicData.url === song.url && <Check className="w-4 h-4 shrink-0" />}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-4">
                    <div className="flex-1 h-px bg-border" />
                    <span className="text-xs text-muted-foreground uppercase">OR</span>
                    <div className="flex-1 h-px bg-border" />
                  </div>

                  <div>
                    <label className="text-xs uppercase tracking-wider font-semibold opacity-60 block mb-2">Upload Custom MP3/MP4</label>
                    <div className="relative">
                      <input
                        type="file"
                        accept="audio/*,video/mp4"
                        onChange={handleMusicUpload}
                        disabled={uploadingMusic}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                      />
                      <div className="w-full px-3 py-4 rounded-xl border-2 border-dashed bg-muted/10 text-center flex flex-col items-center justify-center gap-2 hover:bg-muted/30 transition-colors">
                        {uploadingMusic ? (
                          <Loader2 className="w-5 h-5 animate-spin text-primary" />
                        ) : (
                          <Music2 className="w-5 h-5 text-muted-foreground" />
                        )}
                        <span className="text-xs font-medium text-muted-foreground">
                          {uploadingMusic ? "Uploading..." : "Click to upload an audio file"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex-1 h-px bg-border" />
                    <span className="text-xs text-muted-foreground uppercase">OR</span>
                    <div className="flex-1 h-px bg-border" />
                  </div>

                  <div>
                    <label className="text-xs uppercase tracking-wider font-semibold opacity-60 block mb-2">Song URL</label>
                    <input
                      type="url"
                      placeholder="https://example.com/song.mp3"
                      value={musicData.url}
                      onChange={e => setMusicData(m => ({ ...m, url: e.target.value }))}
                      className="w-full px-3 py-2.5 rounded-xl border bg-muted/30 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                </div>

                {/* Autoplay toggle */}
                <div className="flex items-center justify-between p-3 rounded-xl border bg-muted/20">
                  <div>
                    <p className="text-sm font-medium">Auto-play on open</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Guests must interact first (browser policy)</p>
                  </div>
                  <button
                    onClick={() => setMusicData(m => ({ ...m, autoplay: !m.autoplay }))}
                    className={`transition-colors ${musicData.autoplay ? "text-primary" : "text-muted-foreground"}`}
                  >
                    {musicData.autoplay ? <ToggleRight className="w-7 h-7" /> : <ToggleLeft className="w-7 h-7" />}
                  </button>
                </div>

                {/* Volume */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs uppercase tracking-wider font-semibold opacity-60">Volume</label>
                    <span className="text-xs text-muted-foreground">{Math.round(musicData.volume * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.05}
                    value={musicData.volume}
                    onChange={e => setMusicData(m => ({ ...m, volume: parseFloat(e.target.value) }))}
                    className="w-full accent-primary"
                  />
                </div>

                {/* Preview player */}
                {musicData.url && (
                  <div>
                    <p className="text-xs uppercase tracking-wider font-semibold opacity-60 mb-2">Preview</p>
                    <audio
                      controls
                      src={musicData.url}
                      className="w-full rounded-xl"
                      style={{ height: 40 }}
                    />
                  </div>
                )}

                {/* Save reminder */}
                <button
                  onClick={() => save(false)}
                  disabled={saving}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
                >
                  {saved ? <Check className="w-4 h-4" /> : saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Music2 className="w-4 h-4" />}
                  {saved ? "Music Saved!" : "Save Music Settings"}
                </button>
              </div>
            )}
          </div>
        </aside>

        {/* ── Preview panel ── */}
        <main className={`
          flex-1 overflow-hidden flex-col bg-muted/30
          ${mobileView === "edit" ? "hidden md:flex" : "flex"}
        `}>
          <div className="flex items-center justify-between px-5 py-3 border-b bg-card/50 shrink-0">
            <p className="text-sm text-muted-foreground font-medium">Live Preview</p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  const iframe = document.getElementById("preview-frame") as HTMLIFrameElement
                  if (iframe) iframe.src = iframe.src
                }}
                className="p-2 rounded-lg hover:bg-muted transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Preview placeholder — shows a live reconstruction */}
          <div className="flex-1 overflow-y-auto">
            <div className="max-w-2xl mx-auto p-6 space-y-4">
              {/* Mini preview of each visible section */}
              {sections.filter(s => s.visible).map(s => {
                const { label, emoji } = getSectionLabel(s.type)
                const d = (s as any).data
                return (
                  <motion.div
                    key={s.id}
                    layout
                    className={`rounded-2xl overflow-hidden border cursor-pointer transition-all ${
                      activeSection === s.id ? "ring-2 shadow-lg" : "hover:border-primary/40"
                    }`}
                    style={{ ringColor: theme.primaryColor } as any}
                    onClick={() => { setActiveSection(s.id); setActiveTab("sections") }}
                  >
                    {/* Section header */}
                    <div
                      className="px-4 py-2 flex items-center gap-2 text-white text-sm font-medium"
                      style={{ backgroundColor: theme.primaryColor }}
                    >
                      <span>{emoji}</span> {label}
                    </div>

                    {/* Mini preview content */}
                    <div className="p-5 bg-white dark:bg-zinc-900" style={{ backgroundColor: theme.backgroundColor, color: theme.textColor }}>
                      {s.type === "HERO" && (
                        <div className="text-center py-6" style={{
                          background: d.coverImage ? `url(${d.coverImage}) center/cover` : `linear-gradient(135deg, ${theme.primaryColor}, ${theme.secondaryColor})`,
                          borderRadius: "1rem", minHeight: 140
                        }}>
                          <div className="bg-black/40 rounded-2xl p-6">
                            <h2 className="text-2xl font-bold text-white">{d.title || "Event Title"}</h2>
                            <p className="text-white/80 text-sm mt-1">{d.subtitle || "Subtitle"}</p>
                            {d.date && <p className="text-white/60 text-xs mt-2">{new Date(d.date).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}</p>}
                          </div>
                        </div>
                      )}
                      {s.type === "STORY" && (
                        <div>
                          <h3 className="font-bold text-lg mb-2">{d.title}</h3>
                          <p className="text-sm opacity-70 line-clamp-3">{d.content}</p>
                        </div>
                      )}
                      {s.type === "KHMER_CEREMONY" && (
                        <div>
                          <h3 className="font-bold mb-2" style={{ fontFamily: theme.fontFamilyKm }}>{d.title}</h3>
                          <div className="flex flex-wrap gap-2">
                            {(d.events ?? []).filter((e: any) => e.visible).map((e: any) => (
                              <span key={e.id} className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: `${theme.primaryColor}20`, color: theme.primaryColor }}>
                                {e.nameKm} · {e.time}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      {s.type === "EVENT_DETAILS" && (
                        <div className="grid grid-cols-2 gap-3">
                          {[{ l: "📅 Date", v: d.title }, { l: "🕐 Time", v: d.time }, { l: "📍 Venue", v: d.locationName }, { l: "👗 Dress", v: d.dressCode }].filter(i => i.v).map(i => (
                            <div key={i.l} className="text-sm"><p className="opacity-50 text-xs">{i.l}</p><p className="font-medium">{i.v}</p></div>
                          ))}
                        </div>
                      )}
                      {s.type === "GALLERY" && (
                        <div>
                          <h3 className="font-bold mb-2">{d.title}</h3>
                          <div className="grid grid-cols-4 gap-2">
                            {(d.images ?? []).slice(0, 4).map((img: string, i: number) => (
                              <div key={i} className="aspect-square rounded-lg overflow-hidden bg-muted">
                                <img src={img} alt="" className="w-full h-full object-cover" />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      {s.type === "RSVP" && (
                        <div className="text-center py-4">
                          <h3 className="font-bold text-lg mb-1">{d.title || "RSVP"}</h3>
                          {d.deadline && <p className="text-sm opacity-60">Deadline: {new Date(d.deadline).toLocaleDateString()}</p>}
                        </div>
                      )}
                      {s.type === "VIDEO" && (
                        <div className="text-center py-6 bg-black text-white rounded-xl">
                          <p className="text-2xl mb-2">🎥</p>
                          <h3 className="font-bold">{d.title || "Video"}</h3>
                        </div>
                      )}
                      {s.type === "COUNTDOWN" && (
                        <div className="text-center py-6 border rounded-xl">
                          <h3 className="font-bold mb-3">{d.title || "Countdown"}</h3>
                          <div className="flex gap-2 justify-center text-sm font-mono opacity-70">
                            <span>00d</span>:<span>00h</span>:<span>00m</span>:<span>00s</span>
                          </div>
                        </div>
                      )}
                      {s.type === "QR_CODE" && (
                        <div className="text-center py-6 bg-gray-50 rounded-xl border">
                          <h3 className="font-bold mb-3">{d.title || "Wedding Gift"}</h3>
                          {d.qrImage ? (
                            <img src={d.qrImage} alt="QR" className="w-16 h-16 mx-auto object-contain rounded" />
                          ) : (
                            <div className="w-16 h-16 mx-auto bg-gray-200 rounded flex items-center justify-center text-[10px] text-gray-500">No QR</div>
                          )}
                          {d.accountName && <p className="text-sm font-medium mt-2">{d.accountName}</p>}
                        </div>
                      )}
                      {s.type === "MAP" && (
                        <div className="text-center py-6 bg-blue-50/50 rounded-xl border border-blue-100">
                          <h3 className="font-bold mb-3">{d.title || "Location Map"}</h3>
                          <div className="w-full h-24 bg-gray-200 rounded flex items-center justify-center opacity-50">
                            <span className="text-xl">🗺️</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )
              })}

              {sections.filter(s => s.visible).length === 0 && (
                <div className="text-center py-20 text-muted-foreground">
                  <p className="text-4xl mb-3">👁️</p>
                  <p>All sections are hidden. Toggle some on in the Sections panel.</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
