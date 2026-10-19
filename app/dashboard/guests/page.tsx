import { redirect } from "next/navigation"
import { auth } from "@/auth"
import { prisma } from "@/database/prisma"
import GuestsClient from "./GuestsClient"

export default async function GuestsPage() {
  const session = await auth()
  if (!session?.user?.email) {
    redirect("/login")
  }

  const user = await prisma.user.findUnique({ where: { email: session.user.email } })
  if (!user) {
    redirect("/login")
  }

  // Fetch all events for the user
  const events = await prisma.userEvent.findMany({
    where: { userId: user.id },
    select: { id: true, title: true }
  })

  // Fetch all guests for these events
  const guestsData = await prisma.guest.findMany({
    where: { eventId: { in: events.map(e => e.id) } },
    orderBy: { createdAt: "desc" },
    include: { event: { select: { title: true } } }
  })

  // Map guests to include eventTitle
  const initialGuests = guestsData.map(g => ({
    ...g,
    eventTitle: g.event.title
  }))

  return <GuestsClient events={events} initialGuests={initialGuests} />
}
