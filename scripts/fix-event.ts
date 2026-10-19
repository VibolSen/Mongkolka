import { prisma } from "@/database/prisma"

async function fix() {
  const eventId = "6a1942d0af381c667da3c932"
  console.log(`Fixing event ${eventId}...`)

  const event = await prisma.userEvent.findUnique({ where: { id: eventId } })
  if (!event) {
    console.log("Event not found!")
    return
  }

  const template = await prisma.template.findFirst({ where: { type: "PRE_WEDDING" } })
  if (!template) {
    console.log("Pre-wedding template not found!")
    return
  }

  await prisma.userEvent.update({
    where: { id: eventId },
    data: {
      sections: template.sections as any,
      theme: template.defaultTheme as any,
    }
  })

  console.log("✅ Event updated with pre-wedding template sections!")
}

fix().catch(console.error).finally(() => process.exit(0))
