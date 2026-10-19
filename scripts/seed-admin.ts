import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"
import * as dotenv from "dotenv"

dotenv.config()

const prisma = new PrismaClient()

async function main() {
  const email = process.env.ADMIN_EMAIL || "khornsaokhouch4456@gmail.com"
  const password = process.env.ADMIN_PASSWORD || "khouch123"

  console.log(`Seeding admin user: ${email}`)

  const hashedPassword = await bcrypt.hash(password, 10)

  const admin = await prisma.user.upsert({
    where: { email },
    update: {
      password: hashedPassword,
      role: "ADMIN",
    },
    create: {
      email,
      name: "Admin",
      password: hashedPassword,
      role: "ADMIN",
    },
  })

  console.log(`Admin user seeded successfully: ${admin.email}`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
