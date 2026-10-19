"use client"

import { TemplateSection, TemplateTheme } from "@/lib/types/template"
import { HeroSection } from "@/components/templates/sections/HeroSection"
import { StorySection } from "@/components/templates/sections/StorySection"
import { KhmerCeremonySection } from "@/components/templates/sections/KhmerCeremony"
import { GallerySection } from "@/components/templates/sections/GallerySection"
import { EventDetailsSection } from "@/components/templates/sections/EventDetailsSection"
import { RsvpSection } from "@/components/templates/sections/RsvpSection"
import { VideoSection } from "@/components/templates/sections/VideoSection"
import { PaymentSection } from "@/components/templates/sections/PaymentSection"
import { CountdownSection } from "@/components/templates/sections/CountdownSection"
import { MapSection } from "@/components/templates/sections/MapSection"

interface Props {
  sections: TemplateSection[]
  theme: TemplateTheme
  eventId: string
}

export function SectionRenderer({ sections, theme, eventId }: Props) {
  return (
    <>
      {sections.map((section) => {
        switch (section.type) {
          case "HERO":
            return <HeroSection key={section.id} data={section.data} theme={theme} />
          case "STORY":
            return <StorySection key={section.id} data={section.data} theme={theme} />
          case "KHMER_CEREMONY":
            return <KhmerCeremonySection key={section.id} data={section.data} theme={theme} />
          case "GALLERY":
            return <GallerySection key={section.id} data={section.data} theme={theme} />
          case "EVENT_DETAILS":
            return <EventDetailsSection key={section.id} data={section.data} theme={theme} />
          case "RSVP":
            return <RsvpSection key={section.id} data={section.data} theme={theme} eventId={eventId} />
          case "VIDEO":
            return <VideoSection key={section.id} data={section.data} theme={theme} />
          case "QR_CODE":
            return <PaymentSection key={section.id} data={section.data} theme={theme} />
          case "COUNTDOWN":
            return <CountdownSection key={section.id} data={section.data} theme={theme} />
          case "MAP":
            return <MapSection key={section.id} data={section.data} theme={theme} />
          default:
            return null
        }
      })}
    </>
  )
}
