import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/database/prisma"

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const session = await auth()
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const user = await prisma.user.findUnique({ where: { email: session.user.email } })
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 })

  const event = await prisma.userEvent.findFirst({
    where: { id, userId: user.id },
  })

  if (!event) {
    return NextResponse.json({ error: "Event not found" }, { status: 404 })
  }

  return NextResponse.json({ event })
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const session = await auth()
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const user = await prisma.user.findUnique({ where: { email: session.user.email } })
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 })

  const event = await prisma.userEvent.findFirst({
    where: { id, userId: user.id },
  })

  if (!event) {
    return NextResponse.json({ error: "Event not found" }, { status: 404 })
  }

  const body = await req.json()

  const updatedEvent = await prisma.userEvent.update({
    where: { id },
    data: {
      ...(body.sections !== undefined && { sections: body.sections }),
      ...(body.theme !== undefined && { theme: body.theme }),
      ...(body.musicData !== undefined && { musicData: body.musicData }),
      ...(typeof body.isPublished === "boolean" && { isPublished: body.isPublished }),
    },
  })

  return NextResponse.json({ event: updatedEvent })
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const session = await auth()
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const user = await prisma.user.findUnique({ where: { email: session.user.email } })
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 })

  const event = await prisma.userEvent.findFirst({
    where: { id, userId: user.id },
  })

  if (!event) {
    return NextResponse.json({ error: "Event not found" }, { status: 404 })
  }

  await prisma.userEvent.delete({
    where: { id },
  })

  return NextResponse.json({ success: true })
}
