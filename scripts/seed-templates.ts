import { prisma } from "@/database/prisma"

async function seed() {
  console.log("🌱 Seeding Khmer Traditional Wedding template...")

  const existing = await prisma.template.findFirst({
    where: { type: "WEDDING_KHMER" },
  })

  if (existing) {
    console.log("✅ Template already exists, skipping.")
    return
  }

  await prisma.template.create({
    data: {
      name: "Khmer Traditional Royal",
      type: "WEDDING_KHMER",
      description: "A royal gold-themed design with a full Khmer ceremony timeline. Perfect for traditional Cambodian weddings.",
      thumbnail: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800",
      isPremium: false,
      defaultTheme: {
        primaryColor: "#D4AF37",
        secondaryColor: "#C41E3A",
        backgroundColor: "#FAFAF5",
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
            title: "ស្រីរ័ត្ន & ចន្ទ្រា",
            subtitle: "Together with their families, invite you to celebrate their wedding",
            date: "2026-12-20T09:00:00.000Z",
            coverImage: "https://images.unsplash.com/photo-1583939411023-14783179e581?w=1600",
            showCountdown: true,
          },
        },
        {
          id: "story-1",
          type: "STORY",
          visible: true,
          order: 1,
          data: {
            title: "Our Love Story",
            content: "We met at a traditional Khmer ceremony in Phnom Penh and knew from that moment we were meant to be together. After two years of building our lives side by side, we are ready to take the next step surrounded by those we love most.",
            images: [
              "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=800",
              "https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=800",
              "https://images.unsplash.com/photo-1534103362078-d07e750bd0c4?w=800",
            ],
          },
        },
        {
          id: "khmer-ceremony-1",
          type: "KHMER_CEREMONY",
          visible: true,
          order: 2,
          data: {
            title: "ពិធីអាពាហ៍ពិពាហ៍ប្រពៃណីខ្មែរ",
            events: [
              { id: "k1", name: "Dowry Procession", nameKm: "ហែជំនូន", time: "07:00 AM", description: "", visible: true },
              { id: "k2", name: "Hair Cutting Ceremony", nameKm: "កាត់សក់", time: "09:00 AM", description: "", visible: true },
              { id: "k3", name: "Spiritual Blessing", nameKm: "សែនព្រេន", time: "10:30 AM", description: "", visible: true },
              { id: "k4", name: "Flower Blessing", nameKm: "បាចផ្កាស្លា", time: "11:30 AM", description: "", visible: true },
              { id: "k5", name: "Blessing Seating", nameKm: "សំពះផ្ទឹម", time: "01:00 PM", description: "", visible: true },
              { id: "k6", name: "Hand Tying Ceremony", nameKm: "ចងដៃ", time: "02:30 PM", description: "", visible: true },
              { id: "k7", name: "Candle Blessing", nameKm: "បង្វិលពពិល", time: "04:00 PM", description: "", visible: true },
            ],
          },
        },
        {
          id: "details-1",
          type: "EVENT_DETAILS",
          visible: true,
          order: 3,
          data: {
            title: "Saturday, December 20th 2026",
            time: "7:00 AM – 6:00 PM",
            locationName: "Koh Pich Convention Center",
            address: "Koh Pich, Phnom Penh, Cambodia",
            mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3909.2!2d104.9333!3d11.5565!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTHCsDMzJzIzLjQiTiAxMDTCsDU2JzAwLjAiRQ!5e0!3m2!1sen!2skh!4v1622000000000",
            dressCode: "Traditional Khmer attire preferred",
          },
        },
        {
          id: "gallery-1",
          type: "GALLERY",
          visible: true,
          order: 4,
          data: {
            title: "Our Moments",
            images: [
              "https://images.unsplash.com/photo-1583939411023-14783179e581?w=800",
              "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=800",
              "https://images.unsplash.com/photo-1519741497674-611481863552?w=800",
              "https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=800",
              "https://images.unsplash.com/photo-1534103362078-d07e750bd0c4?w=800",
              "https://images.unsplash.com/photo-1606800052052-a08af7148866?w=800",
            ],
          },
        },
        {
          id: "rsvp-1",
          type: "RSVP",
          visible: true,
          order: 5,
          data: {
            title: "Kindly RSVP",
            deadline: "2026-12-01",
            allowPlusOne: true,
            requireFoodPref: true,
          },
        },
      ],
    },
  })

  console.log("✅ Khmer Traditional Royal template seeded!")
}

seed()
  .catch(console.error)
  .finally(() => process.exit(0))
