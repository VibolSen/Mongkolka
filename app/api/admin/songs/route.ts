import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/database/prisma"

export async function GET() {
  const session = await auth()
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const songs = await prisma.song.findMany({
    orderBy: { createdAt: "desc" },
  })
  return NextResponse.json({ songs })
}

export async function POST(req: Request) {
  const session = await auth()
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await req.json()
    const { title, artist, url } = body

    if (!title || !url) {
      return NextResponse.json({ error: "Title and URL are required" }, { status: 400 })
    }

    const song = await prisma.song.create({
      data: {
        title,
        artist,
        url,
      },
    })

    return NextResponse.json({ song })
  } catch (error) {
    console.error("Error creating song:", error)
    return NextResponse.json({ error: "Failed to create song" }, { status: 500 })
  }
}
