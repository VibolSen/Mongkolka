import { NextResponse } from "next/server"
import { prisma } from "@/database/prisma"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const songs = await prisma.song.findMany({
      orderBy: { createdAt: "desc" },
    })
    return NextResponse.json({ songs })
  } catch (error) {
    console.error("Error fetching songs:", error)
    return NextResponse.json({ error: "Failed to fetch songs" }, { status: 500 })
  }
}
