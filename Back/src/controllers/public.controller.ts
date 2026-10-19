import { Request, Response } from "express"
import { prisma } from "../lib/prisma.js"
import crypto from "crypto"

export async function getPublicEvent(req: Request, res: Response) {
  try {
    const { slug } = req.params
    const event = await prisma.userEvent.findUnique({
      where: { slug },
      include: {
        template: true,
        messages: {
          where: { isPrivate: false },
          orderBy: { createdAt: "desc" },
        },
      },
    })

    if (!event) {
      return res.status(404).json({ success: false, message: "Event not found" })
    }

    return res.json({ success: true, data: event })
  } catch (error: any) {
    return res.status(500).json({ success: false, message: "Error fetching event", error: error.message })
  }
}

export async function submitRsvp(req: Request, res: Response) {
  try {
    const { id } = req.params
    const { name, phone, status, pax, foodPref, message } = req.body

    if (!name) {
      return res.status(400).json({ success: false, message: "Guest name is required" })
    }

    const checkInToken = crypto.randomUUID()

    const guest = await prisma.guest.create({
      data: {
        eventId: id,
        name,
        phone: phone || null,
        status: status || "ATTENDING",
        pax: pax ? parseInt(pax) : 1,
        foodPref: foodPref || null,
        checkInToken,
      },
      include: { table: true },
    })

    // If a wedding blessing or wish message is provided, save it to GuestMessage
    if (message && message.trim()) {
      await prisma.guestMessage.create({
        data: {
          eventId: id,
          guestName: name,
          message: message.trim(),
          isPrivate: false,
        },
      })
    }

    return res.status(201).json({
      success: true,
      data: {
        guest,
        checkInToken,
      },
      message: "RSVP submitted successfully",
    })
  } catch (error: any) {
    return res.status(500).json({ success: false, message: "Failed to submit RSVP", error: error.message })
  }
}

export async function getMessages(req: Request, res: Response) {
  try {
    const { id } = req.params
    const messages = await prisma.guestMessage.findMany({
      where: { eventId: id, isPrivate: false },
      orderBy: { createdAt: "desc" },
    })
    return res.json({ success: true, data: messages })
  } catch (error: any) {
    return res.status(500).json({ success: false, message: "Failed to fetch messages", error: error.message })
  }
}

export async function postMessage(req: Request, res: Response) {
  try {
    const { id } = req.params
    const { guestName, message, isPrivate } = req.body

    if (!guestName || !message) {
      return res.status(400).json({ success: false, message: "Name and message are required" })
    }

    const msg = await prisma.guestMessage.create({
      data: {
        eventId: id,
        guestName,
        message,
        isPrivate: !!isPrivate,
      },
    })

    return res.status(201).json({ success: true, data: msg, message: "Blessing posted" })
  } catch (error: any) {
    return res.status(500).json({ success: false, message: "Failed to post message", error: error.message })
  }
}
