import { NextResponse } from "next/server"
import { prisma } from "@/database/prisma"

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  try {
    const { name, phone, status, pax, foodPref, message } = await req.json()

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 })
    }

    const event = await prisma.userEvent.findFirst({
      where: { id },
    })

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 })
    }

    // Create the guest RSVP record
    const guest = await prisma.guest.create({
      data: {
        eventId: id,
        name,
        phone: phone || null,
        status: status || "ATTENDING",
        pax: pax || 1,
        foodPref: foodPref || null,
      },
    })

    // If message was provided, create a GuestMessage too
    if (message?.trim()) {
      await prisma.guestMessage.create({
        data: {
          eventId: id,
          guestName: name,
          message: message.trim(),
          isPrivate: false,
        },
      })
    }

    return NextResponse.json({ success: true, guest }, { status: 201 })
  } catch (error) {
    console.error("[RSVP_POST]", error)
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}
