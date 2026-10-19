import { Request, Response } from "express"
import { prisma } from "../lib/prisma.js"

export async function getStats(req: Request, res: Response) {
  try {
    const [totalUsers, totalEvents, totalTemplates, totalSongs, recentUsers] = await Promise.all([
      prisma.user.count(),
      prisma.userEvent.count(),
      prisma.template.count(),
      prisma.song.count(),
      prisma.user.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        select: { id: true, name: true, email: true, createdAt: true, role: true },
      }),
    ])

    return res.json({
      success: true,
      data: {
        totalUsers,
        totalEvents,
        totalTemplates,
        totalSongs,
        recentUsers,
      },
    })
  } catch (error: any) {
    return res.status(500).json({ success: false, message: "Failed to fetch admin stats", error: error.message })
  }
}

export async function listUsers(req: Request, res: Response) {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        _count: { select: { events: true } },
      },
    })
    return res.json({ success: true, data: users })
  } catch (error: any) {
    return res.status(500).json({ success: false, message: "Failed to list users", error: error.message })
  }
}

export async function updateUserRole(req: Request, res: Response) {
  try {
    const { id } = req.params
    const { role } = req.body

    if (!["USER", "ADMIN", "STAFF"].includes(role)) {
      return res.status(400).json({ success: false, message: "Invalid role value" })
    }

    const updated = await prisma.user.update({
      where: { id },
      data: { role },
      select: { id: true, name: true, email: true, role: true },
    })

    return res.json({ success: true, data: updated, message: "User role updated" })
  } catch (error: any) {
    return res.status(500).json({ success: false, message: "Failed to update role", error: error.message })
  }
}

export async function listAllEvents(req: Request, res: Response) {
  try {
    const events = await prisma.userEvent.findMany({
      include: {
        user: { select: { name: true, email: true } },
        _count: { select: { guests: true, messages: true } },
      },
      orderBy: { createdAt: "desc" },
    })
    return res.json({ success: true, data: events })
  } catch (error: any) {
    return res.status(500).json({ success: false, message: "Failed to fetch platform events", error: error.message })
  }
}
