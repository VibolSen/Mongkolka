import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/database/prisma"

// GET /api/user — get current user profile
export async function GET() {
  const session = await auth()
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true, name: true, email: true, image: true, role: true }
  })

  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 })
  return NextResponse.json({ user })
}

// PATCH /api/user — update current user's name
export async function PATCH(req: Request) {
  const session = await auth()
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { name } = await req.json()
  if (!name || typeof name !== "string" || name.trim().length < 1) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 })
  }

  const user = await prisma.user.update({
    where: { email: session.user.email },
    data: { name: name.trim() },
    select: { id: true, name: true, email: true }
  })

  return NextResponse.json({ user })
}
