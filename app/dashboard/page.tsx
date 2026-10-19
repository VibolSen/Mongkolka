import { redirect } from "next/navigation"
import { auth } from "@/auth"
import { prisma } from "@/database/prisma"
import DashboardClient from "./DashboardClient"

export default async function DashboardPage() {
  const session = await auth()
  if (!session?.user?.email) {
    redirect("/login")
  }

  const user = await prisma.user.findUnique({ where: { email: session.user.email } })
  if (!user) {
    redirect("/login")
  }

  // Fetch real user events
  const events = await prisma.userEvent.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { guests: true, messages: true } } },
  })

  // Calculate real stats
  const totalEvents = events.length
  const totalGuests = events.reduce((acc, ev) => acc + (ev._count?.guests || 0), 0)
  const totalMessages = events.reduce((acc, ev) => acc + (ev._count?.messages || 0), 0)

  // Calculate RSVPs (count guests with status != "PENDING" for this user's events)
  const rsvpsReceived = await prisma.guest.count({
    where: {
      event: { userId: user.id },
      status: { not: "PENDING" }
    }
  })

  const stats = [
    { iconName: "CalendarDays", label: "Total Events",  value: totalEvents.toString(),   color: "text-primary",         bg: "bg-primary/10"  },
    { iconName: "Users",        label: "Total Guests",  value: totalGuests.toString(),   color: "text-blue-500",        bg: "bg-blue-500/10" },
    { iconName: "MessageSquare",label: "Total Messages",value: totalMessages.toString(), color: "text-emerald-500",     bg: "bg-emerald-500/10" },
    { iconName: "TrendingUp",   label: "RSVPs Received",value: rsvpsReceived.toString(), color: "text-violet-500",      bg: "bg-violet-500/10" },
  ]

  return <DashboardClient events={events} stats={stats} />
}
