"use client"

import * as React from "react"
import { Loader2, ToggleLeft, ToggleRight, MapPin } from "lucide-react"
import { TemplateSection } from "@/lib/types/template"

// ─── Shared mini components ────────────────────────────────────────────
function Field({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (v: string) => void; type?: string }) {
  return (
    <div>
      <label className="text-xs uppercase tracking-wider opacity-60 block mb-1.5">{label}</label>
      <input
        type={type}
        value={value ?? ""}
        onChange={e => onChange(e.target.value)}
        className="w-full px-3 py-2.5 rounded-xl border bg-muted/30 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
      />
    </div>
  )
}
function Toggle({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm">{label}</span>
      <button onClick={() => onChange(!value)} className={`transition-colors ${value ? "text-primary" : "text-muted-foreground"}`}>
        {value ? <ToggleRight className="w-6 h-6" /> : <ToggleLeft className="w-6 h-6" />}
      </button>
    </div>
  )
}

function ImageUploader({ label, onUpload, isUploading }: { label: string; onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void; isUploading: boolean }) {
  return (
    <div>
      <label className="text-xs uppercase tracking-wider opacity-60 block mb-1.5">{label}</label>
      <div className="relative">
        <input
          type="file"
          accept="image/*"
          onChange={onUpload}
          disabled={isUploading}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
        />
        <div className="w-full px-3 py-3 rounded-xl border border-dashed bg-muted/10 text-center flex flex-col items-center justify-center hover:bg-muted/30 transition-colors">
          {isUploading ? (
            <Loader2 className="w-4 h-4 animate-spin text-primary" />
          ) : (
            <span className="text-xs font-medium text-muted-foreground">Click or Drop to upload image</span>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Sidebar section editors ──────────────────────────────────────────

function HeroEditor({ data, onChange, handleUpload, isUploading }: any) {
  return (
    <div className="space-y-4">
      <Field label="Boy's Name" value={data.boyName ?? ""} onChange={v => onChange({ ...data, boyName: v })} />
      <Field label="Girl's Name" value={data.girlName ?? ""} onChange={v => onChange({ ...data, girlName: v })} />
      <Field label="Event Title" value={data.title} onChange={v => onChange({ ...data, title: v })} />
      <Field label="Subtitle" value={data.subtitle} onChange={v => onChange({ ...data, subtitle: v })} />
      <Field label="Event Date" type="date" value={data.date?.split("T")[0] ?? ""} onChange={v => onChange({ ...data, date: v })} />
      <Field label="Cover Image URL" value={data.coverImage} onChange={v => onChange({ ...data, coverImage: v })} />
      <ImageUploader label="Upload Cover Image" isUploading={isUploading} onUpload={e => handleUpload(e, (url: string) => onChange({ ...data, coverImage: url }))} />
      <Toggle label="Show Countdown Timer" value={data.showCountdown} onChange={v => onChange({ ...data, showCountdown: v })} />
    </div>
  )
}

function StoryEditor({ data, onChange }: { data: any; onChange: (d: any) => void }) {
  return (
    <div className="space-y-4">
      <Field label="Section Title" value={data.title} onChange={v => onChange({ ...data, title: v })} />
      <div>
        <label className="text-xs uppercase tracking-wider opacity-60 block mb-1.5">Story Content</label>
        <textarea
          className="w-full px-3 py-2.5 rounded-xl border bg-muted/30 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-primary"
          rows={5}
          value={data.content}
          onChange={e => onChange({ ...data, content: e.target.value })}
        />
      </div>
    </div>
  )
}

function EventDetailsEditor({ data, onChange }: { data: any; onChange: (d: any) => void }) {
  return (
    <div className="space-y-4">
      <Field label="Date (display)" value={data.title} onChange={v => onChange({ ...data, title: v })} />
      <Field label="Time" value={data.time} onChange={v => onChange({ ...data, time: v })} />
      <Field label="Venue Name" value={data.locationName} onChange={v => onChange({ ...data, locationName: v })} />
      <Field label="Address" value={data.address} onChange={v => onChange({ ...data, address: v })} />
      <Field label="Google Maps Embed URL" value={data.mapUrl ?? ""} onChange={v => onChange({ ...data, mapUrl: v })} />
      <Field label="Dress Code (optional)" value={data.dressCode ?? ""} onChange={v => onChange({ ...data, dressCode: v })} />
    </div>
  )
}

function KhmerEditor({ data, onChange }: { data: any; onChange: (d: any) => void }) {
  return (
    <div className="space-y-4">
      <Field label="Section Title (KM)" value={data.title} onChange={v => onChange({ ...data, title: v })} />
      <div className="space-y-2">
        <p className="text-xs uppercase tracking-wider opacity-60">Ceremonies</p>
        {(data.events ?? []).map((ev: any, i: number) => (
          <div key={ev.id} className="flex items-center gap-2 p-2.5 rounded-lg border bg-muted/20">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium">{ev.nameKm}</p>
              <p className="text-xs opacity-60">{ev.name}</p>
            </div>
            <input
              type="time"
              value={ev.time?.replace(" AM", "").replace(" PM", "") ?? ""}
              onChange={e => {
                const updated = [...data.events]
                updated[i] = { ...ev, time: e.target.value }
                onChange({ ...data, events: updated })
              }}
              className="text-xs border rounded-lg px-2 py-1 bg-transparent w-24"
            />
            <button
              onClick={() => {
                const updated = [...data.events]
                updated[i] = { ...ev, visible: !ev.visible }
                onChange({ ...data, events: updated })
              }}
              className={`p-1 rounded-lg transition-colors ${ev.visible ? "text-primary" : "text-muted-foreground"}`}
            >
              {ev.visible ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

function RsvpEditor({ data, onChange }: { data: any; onChange: (d: any) => void }) {
  return (
    <div className="space-y-4">
      <Field label="RSVP Heading" value={data.title} onChange={v => onChange({ ...data, title: v })} />
      <Field label="Deadline Date" type="date" value={data.deadline ?? ""} onChange={v => onChange({ ...data, deadline: v })} />
      <Toggle label="Allow Plus One (+1)" value={data.allowPlusOne} onChange={v => onChange({ ...data, allowPlusOne: v })} />
      <Toggle label="Require Food Preference" value={data.requireFoodPref} onChange={v => onChange({ ...data, requireFoodPref: v })} />
    </div>
  )
}

function GalleryEditor({ data, onChange, handleUpload, isUploading }: any) {
  return (
    <div className="space-y-4">
      <Field label="Gallery Title" value={data.title} onChange={v => onChange({ ...data, title: v })} />
      <div>
        <p className="text-xs uppercase tracking-wider opacity-60 mb-2">Image URLs (one per line)</p>
        <textarea
          className="w-full px-3 py-2.5 rounded-xl border bg-muted/30 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-primary"
          rows={6}
          value={(data.images ?? []).join("\n")}
          onChange={e => onChange({ ...data, images: e.target.value.split("\n").filter(Boolean) })}
        />
      </div>
      <ImageUploader label="Upload Gallery Image" isUploading={isUploading} onUpload={e => handleUpload(e, (url: string) => onChange({ ...data, images: [...(data.images ?? []), url] }))} />
    </div>
  )
}

function VideoEditor({ data, onChange }: { data: any; onChange: (d: any) => void }) {
  return (
    <div className="space-y-4">
      <Field label="Section Title (Optional)" value={data.title ?? ""} onChange={v => onChange({ ...data, title: v })} />
      <Field label="Video URL (YouTube/Vimeo/MP4)" value={data.url ?? ""} onChange={v => onChange({ ...data, url: v })} />
      <div>
        <label className="text-xs uppercase tracking-wider opacity-60 block mb-1.5">Description (Optional)</label>
        <textarea
          className="w-full px-3 py-2.5 rounded-xl border bg-muted/30 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-primary"
          rows={3}
          value={data.description ?? ""}
          onChange={e => onChange({ ...data, description: e.target.value })}
        />
      </div>
    </div>
  )
}

function QrCodeEditor({ data, onChange, handleUpload, isUploading }: any) {
  return (
    <div className="space-y-4">
      <Field label="Section Title" value={data.title ?? ""} onChange={v => onChange({ ...data, title: v })} />
      <Field label="Bank Name (Optional)" value={data.bankName ?? ""} onChange={v => onChange({ ...data, bankName: v })} />
      <Field label="Account Name (Optional)" value={data.accountName ?? ""} onChange={v => onChange({ ...data, accountName: v })} />
      <Field label="Account Number (Optional)" value={data.accountNumber ?? ""} onChange={v => onChange({ ...data, accountNumber: v })} />
      <ImageUploader label="Upload QR Code Image" isUploading={isUploading} onUpload={e => handleUpload(e, (url: string) => onChange({ ...data, qrImage: url }))} />
    </div>
  )
}

function CountdownEditor({ data, onChange }: { data: any; onChange: (d: any) => void }) {
  return (
    <div className="space-y-4">
      <Field label="Section Title (Optional)" value={data.title ?? ""} onChange={v => onChange({ ...data, title: v })} />
      <Field label="Target Date & Time" type="datetime-local" value={data.targetDate ? new Date(data.targetDate).toISOString().slice(0, 16) : ""} onChange={v => onChange({ ...data, targetDate: new Date(v).toISOString() })} />
    </div>
  )
}

function MapEditor({ data, onChange }: { data: any; onChange: (d: any) => void }) {
  const [locating, setLocating] = React.useState(false)

  const generateEmbedUrl = () => {
    if (!data.address) return
    const encoded = encodeURIComponent(data.address)
    const url = `https://maps.google.com/maps?q=${encoded}&t=&z=15&ie=UTF8&iwloc=&output=embed`
    onChange({ ...data, mapUrl: url })
  }

  const useCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser")
      return
    }
    setLocating(true)
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords
        const url = `https://maps.google.com/maps?q=${latitude},${longitude}&t=&z=15&ie=UTF8&iwloc=&output=embed`
        
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`)
          const json = await res.json()
          onChange({ ...data, mapUrl: url, address: json.display_name || `${latitude}, ${longitude}` })
        } catch {
          onChange({ ...data, mapUrl: url, address: `${latitude}, ${longitude}` })
        }
        setLocating(false)
      },
      () => {
        alert("Unable to retrieve your location. Please check your browser permissions.")
        setLocating(false)
      }
    )
  }

  return (
    <div className="space-y-4">
      <Field label="Section Title" value={data.title ?? ""} onChange={v => onChange({ ...data, title: v })} />
      
      <div>
        <Field label="Search Location (Venue Name or Address)" value={data.address ?? ""} onChange={v => onChange({ ...data, address: v })} />
        <div className="flex gap-2 mt-3">
          <button
            onClick={generateEmbedUrl}
            disabled={!data.address}
            className="flex-1 px-3 py-2 rounded-xl bg-primary/10 text-primary hover:bg-primary/20 text-xs font-semibold disabled:opacity-50 transition-colors"
          >
            Find by Address
          </button>
          <button
            onClick={useCurrentLocation}
            disabled={locating}
            className="flex-1 px-3 py-2 rounded-xl border hover:bg-muted text-xs font-semibold disabled:opacity-50 transition-colors flex items-center justify-center gap-1.5"
          >
            {locating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <MapPin className="w-3.5 h-3.5" />}
            Use My Location
          </button>
        </div>
      </div>

      <Field label="Google Maps Embed URL" value={data.mapUrl ?? ""} onChange={v => onChange({ ...data, mapUrl: v })} />

      {data.mapUrl && (
        <div className="mt-2 rounded-xl overflow-hidden border bg-muted/20">
          <p className="text-xs uppercase tracking-wider opacity-60 p-2 font-medium border-b bg-card">Preview Map</p>
          <iframe src={data.mapUrl} className="w-full h-40" />
        </div>
      )}
    </div>
  )
}

export function getSectionLabel(type: string) {
  const labels: Record<string, { label: string; emoji: string }> = {
    HERO: { label: "Hero / Cover", emoji: "🖼️" },
    STORY: { label: "Love Story", emoji: "💬" },
    KHMER_CEREMONY: { label: "Khmer Ceremony", emoji: "🪔" },
    EVENT_DETAILS: { label: "Event Details", emoji: "📍" },
    GALLERY: { label: "Photo Gallery", emoji: "🖼️" },
    RSVP: { label: "RSVP", emoji: "✅" },
    SCHEDULE: { label: "Schedule", emoji: "📅" },
    MESSAGES: { label: "Guest Messages", emoji: "💌" },
    MUSIC_PLAYER: { label: "Music Player", emoji: "🎵" },
    QR_CODE: { label: "QR Code", emoji: "📲" },
    VIDEO: { label: "Video", emoji: "🎥" },
    COUNTDOWN: { label: "Countdown", emoji: "⏳" },
    MAP: { label: "Location Map", emoji: "🗺️" },
    LIVESTREAM: { label: "Livestream", emoji: "📡" },
  }
  return labels[type] ?? { label: type, emoji: "📄" }
}

export function renderEditor(section: TemplateSection, onChange: (data: any) => void, handleUpload: any, isUploading: boolean) {
  const props = { data: (section as any).data, onChange, handleUpload, isUploading }
  switch (section.type) {
    case "HERO": return <HeroEditor {...props} />
    case "STORY": return <StoryEditor {...props} />
    case "EVENT_DETAILS": return <EventDetailsEditor {...props} />
    case "KHMER_CEREMONY": return <KhmerEditor {...props} />
    case "RSVP": return <RsvpEditor {...props} />
    case "GALLERY": return <GalleryEditor {...props} />
    case "VIDEO": return <VideoEditor {...props} />
    case "QR_CODE": return <QrCodeEditor {...props} />
    case "COUNTDOWN": return <CountdownEditor {...props} />
    case "MAP": return <MapEditor {...props} />
    default: return <p className="text-sm opacity-50 italic">No editor available for this section yet.</p>
  }
}
