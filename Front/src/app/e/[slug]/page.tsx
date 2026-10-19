import { notFound } from "next/navigation"
import { TemplateSection, TemplateTheme } from "@/lib/types/template"
import { EventHeader } from "@/components/templates/shared/EventHeader"
import { EventClientWrapper } from "@/components/templates/shared/EventClientWrapper"
import { SectionRenderer } from "@/components/templates/shared/SectionRenderer"

export const dynamic = "force-dynamic"

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

interface Props {
  params: Promise<{ slug: string }>
}

async function getPublicEvent(slug: string) {
  try {
    const res = await fetch(`${API_BASE}/public/events/${slug}`, { cache: "no-store" })
    if (!res.ok) return null
    const data = await res.json()
    return data?.data || data?.event || null
  } catch (err) {
    console.error("Failed to fetch public event", err)
    return null
  }
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const event = await getPublicEvent(slug)
  if (!event) return { title: "Invitation Not Found | Mongkol" }
  return {
    title: `${event.title} | Mongkol`,
    description: `You are cordially invited to ${event.title}`,
    openGraph: {
      title: event.title,
      description: `Join us in celebrating ${event.title}`,
    },
  }
}

export default async function EventPage({ params }: Props) {
  const { slug } = await params
  const event = await getPublicEvent(slug)

  if (!event) notFound()

  const rawSections = event.sections as unknown
  const rawTheme = event.theme as unknown

  const theme: TemplateTheme =
    rawTheme && typeof rawTheme === "object" && !Array.isArray(rawTheme)
      ? (rawTheme as TemplateTheme)
      : {
          primaryColor: "#D4AF37",
          secondaryColor: "#C41E3A",
          backgroundColor: "#FAFAF8",
          textColor: "#1a1a1a",
          fontFamily: "Inter, sans-serif",
          fontFamilyKm: "Khmer OS Siemreap, serif",
        }

  let sections: TemplateSection[] = []
  if (Array.isArray(rawSections)) {
    sections = rawSections as TemplateSection[]
  } else if (
    rawSections &&
    typeof rawSections === "object" &&
    Array.isArray((rawSections as any).sections)
  ) {
    sections = (rawSections as any).sections as TemplateSection[]
  }

  const visibleSections = sections
    .filter((s) => s.visible !== false)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))

  return (
    <EventClientWrapper theme={theme}>
      <EventHeader
        musicUrl={event.musicData?.url}
        autoplay={event.musicData?.autoplay}
        volume={event.musicData?.volume}
      />
      <div className="flex-1 flex flex-col">
        <SectionRenderer
          sections={visibleSections}
          theme={theme}
          eventId={event.id}
        />
      </div>
    </EventClientWrapper>
  )
}
