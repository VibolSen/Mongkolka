export type SectionType = 
  | "HERO"
  | "STORY"
  | "EVENT_DETAILS"
  | "KHMER_CEREMONY"
  | "SCHEDULE"
  | "GALLERY"
  | "RSVP"
  | "MESSAGES"
  | "MUSIC_PLAYER"
  | "QR_CODE"
  | "LIVESTREAM"
  | "VIDEO"
  | "COUNTDOWN"
  | "MAP"

export interface BaseSection {
  id: string
  type: SectionType
  visible: boolean
  order: number
}

// ─── SPECIFIC SECTION DATA TYPES ─────────────────────────────

export interface HeroSectionData {
  title: string
  subtitle: string
  date: string
  coverImage: string
  videoUrl?: string
  showCountdown: boolean
  boyName?: string
  girlName?: string
}

export interface StorySectionData {
  title: string
  content: string
  images: string[]
}

export interface KhmerCeremonyEvent {
  id: string
  name: string
  nameKm: string
  time: string
  description: string
  image?: string
  visible: boolean
}

export interface KhmerCeremonyData {
  title: string
  events: KhmerCeremonyEvent[]
}

export interface EventDetailsData {
  title: string
  time: string
  locationName: string
  address: string
  mapUrl: string
  dressCode?: string
}

export interface GalleryData {
  title: string
  images: string[]
}

export interface RSVPData {
  title: string
  deadline: string
  allowPlusOne: boolean
  requireFoodPref: boolean
}

export interface VideoData {
  title?: string
  url: string
  description?: string
}

export interface QrCodeData {
  title: string
  qrImage: string
  bankName?: string
  accountName?: string
  accountNumber?: string
}

export interface CountdownData {
  title?: string
  targetDate: string
}

export interface MapData {
  title?: string
  address?: string
  mapUrl: string
}

// ─── COMBINED SECTION UNION ──────────────────────────────────

export type TemplateSection = 
  | (BaseSection & { type: "HERO"; data: HeroSectionData })
  | (BaseSection & { type: "STORY"; data: StorySectionData })
  | (BaseSection & { type: "KHMER_CEREMONY"; data: KhmerCeremonyData })
  | (BaseSection & { type: "EVENT_DETAILS"; data: EventDetailsData })
  | (BaseSection & { type: "GALLERY"; data: GalleryData })
  | (BaseSection & { type: "RSVP"; data: RSVPData })
  | (BaseSection & { type: "VIDEO"; data: VideoData })
  | (BaseSection & { type: "QR_CODE"; data: QrCodeData })
  | (BaseSection & { type: "COUNTDOWN"; data: CountdownData })
  | (BaseSection & { type: "MAP"; data: MapData })
  // Add others as we build them
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  | (BaseSection & { type: "SCHEDULE" | "MESSAGES" | "MUSIC_PLAYER" | "LIVESTREAM"; data: any })

// ─── THEME TYPE ──────────────────────────────────────────────

export interface TemplateTheme {
  primaryColor: string
  secondaryColor: string
  backgroundColor: string
  textColor: string
  fontFamily: string
  fontFamilyKm: string
}

export interface TemplateConfig {
  theme: TemplateTheme
  sections: TemplateSection[]
}
