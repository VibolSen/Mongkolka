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

export async function deleteUser(req: any, res: Response) {
  try {
    const { id } = req.params
    if (req.user?.id === id) {
      return res.status(400).json({ success: false, message: "You cannot delete your own admin account." })
    }

    await prisma.user.delete({ where: { id } })
    return res.json({ success: true, message: "User deleted successfully" })
  } catch (error: any) {
    return res.status(500).json({ success: false, message: "Failed to delete user", error: error.message })
  }
}

export async function deleteEvent(req: Request, res: Response) {
  try {
    const { id } = req.params
    await prisma.userEvent.delete({ where: { id } })
    return res.json({ success: true, message: "Event deleted successfully" })
  } catch (error: any) {
    return res.status(500).json({ success: false, message: "Failed to delete event", error: error.message })
  }
}

export async function togglePublishEvent(req: Request, res: Response) {
  try {
    const { id } = req.params
    const event = await prisma.userEvent.findUnique({ where: { id } })
    if (!event) return res.status(404).json({ success: false, message: "Event not found" })

    const updated = await prisma.userEvent.update({
      where: { id },
      data: { isPublished: !event.isPublished },
    })

    return res.json({
      success: true,
      data: updated,
      message: `Event ${updated.isPublished ? "published" : "unpublished"} successfully`,
    })
  } catch (error: any) {
    return res.status(500).json({ success: false, message: "Failed to toggle event publish status", error: error.message })
  }
}

export async function listAllEvents(req: Request, res: Response) {
  try {
    const events = await prisma.userEvent.findMany({
      include: {
        user: { select: { id: true, name: true, email: true } },
        _count: { select: { guests: true, messages: true, tables: true } },
      },
      orderBy: { createdAt: "desc" },
    })
    return res.json({ success: true, data: events })
  } catch (error: any) {
    return res.status(500).json({ success: false, message: "Failed to fetch platform events", error: error.message })
  }
}

