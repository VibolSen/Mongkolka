import { notFound } from "next/navigation"
import { prisma } from "@/database/prisma"
import { TemplateSection, TemplateTheme } from "@/lib/types/template"
import { auth } from "@/auth"
import { EventHeader } from "@/components/templates/shared/EventHeader"
import { EventClientWrapper } from "@/components/templates/shared/EventClientWrapper"
import { SectionRenderer } from "@/components/templates/shared/SectionRenderer"

export const dynamic = "force-dynamic"

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const event = await prisma.userEvent.findUnique({ where: { slug } })
  if (!event) return { title: "Event Not Found" }
  return {
    title: `${event.title} | Mongkol`,
    description: `You are invited to ${event.title}`,
    openGraph: {
      title: event.title,
      description: `Join us for ${event.title}`,
    },
  }
}

export default async function EventPage({ params }: Props) {
  const { slug } = await params
  
  const event = await prisma.userEvent.findUnique({
    where: { slug },
    include: { user: true },
  })

  if (!event) notFound()

  // Only hide if not published AND the viewer is not the owner
  if (!event.isPublished) {
    const session = await auth()
    if (session?.user?.email !== event.user.email) {
      notFound()
    }
  }

  const rawSections = event.sections as unknown
  const rawTheme = event.theme as unknown

  const theme = (rawTheme && typeof rawTheme === "object" && !Array.isArray(rawTheme)
    ? rawTheme
    : null) as TemplateTheme | null ?? {
    primaryColor: "#D4AF37",
    secondaryColor: "#C41E3A",
    backgroundColor: "#FAFAF8",
    textColor: "#1a1a1a",
    fontFamily: "Inter, sans-serif",
    fontFamilyKm: "Khmer OS Siemreap, serif",
  }

  // Handle both storage formats: plain array OR { sections: [...], theme: {...} }
  const sectionsArray: TemplateSection[] = Array.isArray(rawSections)
    ? rawSections
    : Array.isArray((rawSections as any)?.sections)
      ? (rawSections as any).sections
      : []

  const sections = sectionsArray
    .filter(s => s.visible)
    .sort((a, b) => a.order - b.order)

  return (
    <EventClientWrapper theme={theme}>
      {/* Floating header with controls */}
      <EventHeader
        musicUrl={(event.musicData as any)?.url}
        autoplay={(event.musicData as any)?.autoplay ?? false}
        volume={(event.musicData as any)?.volume ?? 0.5}
      />

      {/* All sections rendered by a client component */}
      <SectionRenderer sections={sections} theme={theme} eventId={event.id} />

      {/* Footer */}
      <footer className="text-center py-8 text-xs opacity-40 border-t">
        Created with ❤️ on <span className="font-semibold">Mongkol</span> · Cambodia&apos;s Digital Wedding Platform
      </footer>
    </EventClientWrapper>
  )
}
