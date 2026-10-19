import { Response } from "express"
import { prisma } from "../lib/prisma.js"
import { AuthRequest } from "../middleware/auth.middleware.js"

export async function listStaffEvents(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.id
    if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" })

    // Find events assigned to this staff user
    const assignments = await prisma.eventStaffAssignment.findMany({
      where: { userId },
      include: {
        event: {
          select: {
            id: true,
            title: true,
            slug: true,
            date: true,
            location: true,
          },
        },
      },
    })

    const events = assignments.map((a) => a.event)
    return res.json({ success: true, data: events })
  } catch (error: any) {
    return res.status(500).json({ success: false, message: "Failed to list staff events", error: error.message })
  }
}

export async function scanCheckIn(req: AuthRequest, res: Response) {
  try {
    const { checkInToken } = req.body

    if (!checkInToken) {
      return res.status(400).json({ success: false, message: "Check-in token is required" })
    }

    const guest = await prisma.guest.findUnique({
      where: { checkInToken },
      include: {
        table: true,
        event: { select: { id: true, title: true } },
      },
    })

    if (!guest) {
      return res.status(404).json({ success: false, message: "Invalid check-in QR pass. Guest not found." })
    }

    // Update guest status to CHECKED_IN
    const updated = await prisma.guest.update({
      where: { id: guest.id },
      data: {
        status: "CHECKED_IN",
        checkedInAt: new Date(),
      },
      include: { table: true },
    })

    return res.json({
      success: true,
      data: updated,
      message: `Guest ${guest.name} successfully checked in!`,
    })
  } catch (error: any) {
    return res.status(500).json({ success: false, message: "Check-in failed", error: error.message })
  }
}

export async function guestLookup(req: AuthRequest, res: Response) {
  try {
    const query = (req.query.name as string) || ""

    if (!query.trim()) {
      return res.json({ success: true, data: [] })
    }

    const guests = await prisma.guest.findMany({
      where: {
        name: {
          contains: query.trim(),
        },
      },
      include: { table: true },
      take: 20,
    })

    return res.json({ success: true, data: guests })
  } catch (error: any) {
    return res.status(500).json({ success: false, message: "Lookup failed", error: error.message })
  }
}
