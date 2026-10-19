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

  const guests = await prisma.guest.findMany({
    where: { eventId: id },
    orderBy: { createdAt: "desc" },
  })

  return NextResponse.json({ guests })
}
