import { prisma } from "@/database/prisma"

async function seed() {
  console.log("🌱 Seeding Pre-Wedding template...")

  const existing = await prisma.template.findFirst({
    where: { type: "PRE_WEDDING" },
  })

  if (existing) {
    console.log("✅ Pre-Wedding template already exists, skipping.")
    return
  }

  await prisma.template.create({
    data: {
      name: "Modern Romance",
      type: "PRE_WEDDING",
      description: "A beautiful, minimalist design to showcase your pre-wedding photos.",
      thumbnail: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800",
      isPremium: false,
      defaultTheme: {
        primaryColor: "#E11D48",
        secondaryColor: "#FB923C",
        backgroundColor: "#FFF5F7",
        textColor: "#1a1209",
        fontFamily: "Inter, sans-serif",
        fontFamilyKm: "Khmer OS Siemreap, serif",
      },
      sections: [
        {
          id: "hero-1",
          type: "HERO",
          visible: true,
          order: 0,
          data: {
            title: "Our Pre-Wedding",
            subtitle: "Join us on our journey to forever",
            date: "2026-11-15T09:00:00.000Z",
            coverImage: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=1600",
            showCountdown: true,
          },
        },
        {
          id: "story-1",
          type: "STORY",
          visible: true,
          order: 1,
          data: {
            title: "The Beginning",
            content: "Every love story is beautiful, but ours is our favorite.",
            images: [],
          },
        },
        {
          id: "gallery-1",
          type: "GALLERY",
          visible: true,
          order: 2,
          data: {
            title: "Our Favorite Moments",
            images: [
              "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800",
              "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=800",
              "https://images.unsplash.com/photo-1519741497674-611481863552?w=800",
            ],
          },
        },
      ],
    },
  })

  console.log("✅ Pre-Wedding template seeded!")
}

seed()
  .catch(console.error)
  .finally(() => process.exit(0))
