import { Response } from "express"
import { prisma } from "../lib/prisma.js"
import { AuthRequest } from "../middleware/auth.middleware.js"

export async function listEvents(req: AuthRequest, res: Response) {
  try {
    if (!req.user) return res.status(401).json({ success: false, message: "Unauthorized" })
    const userId = req.user.id
    const where = req.user.role === "ADMIN" ? {} : { userId }
    const events = await prisma.userEvent.findMany({
      where,
      include: {
        guests: true,
        messages: true,
        tables: true,
      },
      orderBy: { createdAt: "desc" },
    })

    return res.json({ success: true, data: events })
  } catch (error: any) {
    return res.status(500).json({ success: false, message: "Failed to fetch events", error: error.message })
  }
}

export async function createEvent(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.id
    if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" })

    const { title, type, slug, templateId, theme, sections, musicData, date, location } = req.body

    if (!title || !slug) {
      return res.status(400).json({ success: false, message: "Title and URL slug are required" })
    }

    const cleanSlug = slug.toLowerCase().trim().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")
    const existing = await prisma.userEvent.findUnique({ where: { slug: cleanSlug } })
    if (existing) {
      return res.status(409).json({ success: false, message: "This event URL slug is already taken. Please choose another." })
    }

    const defaultSections = [
      { id: "hero-1", type: "HERO", order: 1, visible: true, data: { groomName: "Groom", brideName: "Bride", date: date || new Date().toISOString(), venue: location || "Phnom Penh, Cambodia" } },
      { id: "ceremony-1", type: "KHMER_CEREMONY", order: 2, visible: true, data: { ceremonies: [] } },
      { id: "gallery-1", type: "GALLERY", order: 3, visible: true, data: { images: [] } },
      { id: "rsvp-1", type: "RSVP", order: 4, visible: true, data: {} },
    ]

    const event = await prisma.userEvent.create({
      data: {
        title,
        type: type || "WEDDING_KHMER",
        slug: cleanSlug,
        templateId: templateId || null,
        theme: theme || {
          primaryColor: "#D4AF37",
          secondaryColor: "#C41E3A",
          backgroundColor: "#FAFAF8",
          textColor: "#1a1a1a",
        },
        sections: sections || defaultSections,
        musicData: musicData || { url: "", autoplay: false, volume: 0.5 },
        date: date ? new Date(date) : null,
        location: location || null,
        userId,
      },
    })

    return res.status(201).json({ success: true, data: event, message: "Event created successfully" })
  } catch (error: any) {
    return res.status(500).json({ success: false, message: "Failed to create event", error: error.message })
  }
}

export async function getEventById(req: AuthRequest, res: Response) {
  try {
    const { id } = req.params
    const userId = req.user?.id

    const event = await prisma.userEvent.findUnique({
      where: { id },
      include: {
        guests: { include: { table: true } },
        tables: { include: { guests: true } },
        staffMembers: { include: { user: true } },
      },
    })

    if (!event) {
      return res.status(404).json({ success: false, message: "Event not found" })
    }

    if (event.userId !== userId && req.user?.role !== "ADMIN") {
      return res.status(403).json({ success: false, message: "Forbidden. Not your event." })
    }

    return res.json({ success: true, data: event })
  } catch (error: any) {
    return res.status(500).json({ success: false, message: "Failed to fetch event", error: error.message })
  }
}

export async function updateEvent(req: AuthRequest, res: Response) {
  try {
    const { id } = req.params
    const userId = req.user?.id
    const { title, sections, theme, musicData, isPublished, date, location } = req.body

    const event = await prisma.userEvent.findUnique({ where: { id } })
    if (!event) return res.status(404).json({ success: false, message: "Event not found" })

    if (event.userId !== userId && req.user?.role !== "ADMIN") {
      return res.status(403).json({ success: false, message: "Forbidden" })
    }

    const updated = await prisma.userEvent.update({
      where: { id },
      data: {
        title: title !== undefined ? title : undefined,
        sections: sections !== undefined ? sections : undefined,
        theme: theme !== undefined ? theme : undefined,
        musicData: musicData !== undefined ? musicData : undefined,
        isPublished: isPublished !== undefined ? isPublished : undefined,
        date: date ? new Date(date) : undefined,
        location: location !== undefined ? location : undefined,
      },
    })

    return res.json({ success: true, data: updated, message: "Event updated successfully" })
  } catch (error: any) {
    return res.status(500).json({ success: false, message: "Failed to update event", error: error.message })
  }
}

export async function deleteEvent(req: AuthRequest, res: Response) {
  try {
    const { id } = req.params
    const userId = req.user?.id

    const event = await prisma.userEvent.findUnique({ where: { id } })
    if (!event) return res.status(404).json({ success: false, message: "Event not found" })

    if (event.userId !== userId && req.user?.role !== "ADMIN") {
      return res.status(403).json({ success: false, message: "Forbidden" })
    }

    await prisma.userEvent.delete({ where: { id } })
    return res.json({ success: true, message: "Event deleted successfully" })
  } catch (error: any) {
    return res.status(500).json({ success: false, message: "Failed to delete event", error: error.message })
  }
}

// ─── GUESTS & TABLES ──────────────────────────────────────────

export async function getGuests(req: AuthRequest, res: Response) {
  try {
    const { id } = req.params
    const guests = await prisma.guest.findMany({
      where: { eventId: id },
      include: { table: true },
      orderBy: { createdAt: "desc" },
    })
    return res.json({ success: true, data: guests })
  } catch (error: any) {
    return res.status(500).json({ success: false, message: "Failed to fetch guests", error: error.message })
  }
}

export async function addGuest(req: AuthRequest, res: Response) {
  try {
    const { id } = req.params
    const { name, phone, pax, status, foodPref, tableId } = req.body

    if (!name) return res.status(400).json({ success: false, message: "Guest name is required" })

    const guest = await prisma.guest.create({
      data: {
        eventId: id,
        name,
        phone: phone || null,
        pax: pax ? parseInt(pax) : 1,
        status: status || "PENDING",
        foodPref: foodPref || null,
        tableId: tableId || null,
      },
      include: { table: true },
    })

    return res.status(201).json({ success: true, data: guest })
  } catch (error: any) {
    return res.status(500).json({ success: false, message: "Failed to add guest", error: error.message })
  }
}

export async function updateGuest(req: AuthRequest, res: Response) {
  try {
    const { id, guestId } = req.params
    const { name, phone, pax, status, foodPref, tableId } = req.body

    const updated = await prisma.guest.update({
      where: { id: guestId },
      data: {
        name: name !== undefined ? name : undefined,
        phone: phone !== undefined ? phone : undefined,
        pax: pax !== undefined ? parseInt(pax) : undefined,
        status: status !== undefined ? status : undefined,
        foodPref: foodPref !== undefined ? foodPref : undefined,
        tableId: tableId !== undefined ? (tableId === null || tableId === "none" ? null : tableId) : undefined,
      },
      include: { table: true },
    })

    return res.json({ success: true, data: updated })
  } catch (error: any) {
    return res.status(500).json({ success: false, message: "Failed to update guest", error: error.message })
  }
}

export async function deleteGuest(req: AuthRequest, res: Response) {
  try {
    const { guestId } = req.params
    await prisma.guest.delete({ where: { id: guestId } })
    return res.json({ success: true, message: "Guest removed" })
  } catch (error: any) {
    return res.status(500).json({ success: false, message: "Failed to delete guest", error: error.message })
  }
}

export async function getTables(req: AuthRequest, res: Response) {
  try {
    const { id } = req.params
    const tables = await prisma.table.findMany({
      where: { eventId: id },
      include: { guests: true },
      orderBy: { createdAt: "asc" },
    })
    return res.json({ success: true, data: tables })
  } catch (error: any) {
    return res.status(500).json({ success: false, message: "Failed to fetch tables", error: error.message })
  }
}

export async function createTable(req: AuthRequest, res: Response) {
  try {
    const { id } = req.params
    const { name, capacity } = req.body

    if (!name) return res.status(400).json({ success: false, message: "Table name is required" })

    const table = await prisma.table.create({
      data: {
        eventId: id,
        name,
        capacity: capacity ? parseInt(capacity) : 10,
      },
    })

    return res.status(201).json({ success: true, data: table })
  } catch (error: any) {
    return res.status(500).json({ success: false, message: "Failed to create table", error: error.message })
  }
}

export async function authorizeStaff(req: AuthRequest, res: Response) {
  try {
    const { id } = req.params
    const { email, passCode } = req.body

    if (!email || !passCode) {
      return res.status(400).json({ success: false, message: "Staff email and PIN passCode are required" })
    }

    let staffUser = await prisma.user.findUnique({ where: { email } })
    if (!staffUser) {
      staffUser = await prisma.user.create({
        data: {
          email,
          password: "temp_staff_login",
          role: "STAFF",
        },
      })
    } else if (staffUser.role !== "STAFF" && staffUser.role !== "ADMIN") {
      await prisma.user.update({
        where: { id: staffUser.id },
        data: { role: "STAFF" },
      })
    }

    const assignment = await prisma.eventStaffAssignment.upsert({
      where: {
        userId_eventId: {
          userId: staffUser.id,
          eventId: id,
        },
      },
      create: {
        userId: staffUser.id,
        eventId: id,
        passCode: passCode.toString(),
      },
      update: {
        passCode: passCode.toString(),
      },
    })

    return res.json({
      success: true,
      data: assignment,
      message: `Staff member ${email} authorized for event check-in with PIN ${passCode}`,
    })
  } catch (error: any) {
    return res.status(500).json({ success: false, message: "Failed to authorize staff", error: error.message })
  }
}
