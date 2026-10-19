import { redirect } from "next/navigation"
import { auth } from "@/auth"
import { prisma } from "@/database/prisma"
import AnalyticsClient from "./AnalyticsClient"

export default async function AnalyticsPage() {
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
    select: { id: true, createdAt: true }
  })

  // Fetch all guests (RSVPs) for these events
  const guests = await prisma.guest.findMany({
    where: { eventId: { in: events.map(e => e.id) } },
    select: { createdAt: true }
  })

  const stats = {
    events: events.length,
    rsvps: guests.length
  }

  // Generate chart data for the last 7 days (New RSVPs per day)
  const chartData = []
  const today = new Date()
  
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(today.getDate() - i)
    d.setHours(0, 0, 0, 0)
    
    const nextDay = new Date(d)
    nextDay.setDate(d.getDate() + 1)

    const count = guests.filter(g => g.createdAt >= d && g.createdAt < nextDay).length
    
    const dayName = d.toLocaleDateString('en-US', { weekday: 'short' })
    chartData.push({ day: dayName, views: count })
  }

  return <AnalyticsClient stats={stats} chartData={chartData} />
}
