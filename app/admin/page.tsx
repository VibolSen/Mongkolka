import { prisma } from "@/database/prisma"
import { AdminDashboardUI } from "./admin-dashboard-ui"

export default async function AdminDashboardPage() {
  const [totalUsers, totalEvents, premiumTemplates, totalSongs, recentUsers] = await Promise.all([
    prisma.user.count(),
    prisma.userEvent.count(),
    prisma.template.count({ where: { isPremium: true } }),
    prisma.song.count(),
    prisma.user.findMany({
      take: 5,
      orderBy: { id: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
      }
    })
  ])

  return (
    <AdminDashboardUI 
      totalUsers={totalUsers}
      totalEvents={totalEvents}
      premiumTemplates={premiumTemplates}
      totalSongs={totalSongs}
      recentUsers={recentUsers}
    />
  )
}
