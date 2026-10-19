import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  console.log("🌱 Starting Mongkolka database seeding...")

  // 1. Seed Default Admin User
  const adminEmail = "admin@mongkolka.com"
  const existingAdmin = await prisma.user.findUnique({ where: { email: adminEmail } })

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash("admin123456", 10)
    await prisma.user.create({
      data: {
        name: "Mongkol Administrator",
        email: adminEmail,
        password: hashedPassword,
        role: "ADMIN",
      },
    })
    console.log("✅ Admin user created: admin@mongkolka.com (password: admin123456)")
  } else {
    console.log("ℹ️ Admin user already exists")
  }

  // 2. Seed Default Templates
  const templates = [
    {
      name: "Khmer Traditional Royal",
      type: "WEDDING_KHMER",
      description: "Timeless Khmer royal golden motifs, Sompeah Ptem, Gaat Sah, and blessings.",
      thumbnail: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80",
      isPremium: true,
      defaultTheme: {
        primaryColor: "#D4AF37",
        secondaryColor: "#C41E3A",
        backgroundColor: "#FAFAF5",
        textColor: "#1a1209",
      },
    },
    {
      name: "Modern Romance",
      type: "WEDDING_MODERN",
      description: "Clean minimalist floral aesthetic with soft blush rose and gold accents.",
      thumbnail: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=600&q=80",
      isPremium: false,
      defaultTheme: {
        primaryColor: "#E11D48",
        secondaryColor: "#F59E0B",
        backgroundColor: "#FFFFFF",
        textColor: "#1F2937",
      },
    },
  ]

  for (const t of templates) {
    const existing = await prisma.template.findFirst({ where: { name: t.name } })
    if (!existing) {
      await prisma.template.create({ data: t })
      console.log(`✅ Template created: ${t.name}`)
    }
  }

  // 3. Seed Default Songs
  const songs = [
    {
      title: "Perfect",
      artist: "Ed Sheeran",
      url: "https://actions.google.com/sounds/v1/ambiences/outdoor_ambience.ogg",
    },
    {
      title: "A Thousand Years",
      artist: "Christina Perri",
      url: "https://actions.google.com/sounds/v1/ambiences/park_fountain.ogg",
    },
  ]

  for (const s of songs) {
    const existing = await prisma.song.findFirst({ where: { title: s.title } })
    if (!existing) {
      await prisma.song.create({ data: s })
      console.log(`✅ Song added: ${s.title}`)
    }
  }

  console.log("🎉 Seeding finished successfully!")
}

main()
  .catch((e) => {
    console.error("❌ Seeding error:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
