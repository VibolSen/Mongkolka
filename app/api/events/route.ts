import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/database/prisma"
import { TemplateConfig } from "@/lib/types/template"

// ── GET /api/events ─ list user's events ──────────────────────
export async function GET() {
  const session = await auth()
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  const user = await prisma.user.findUnique({ where: { email: session.user.email } })
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 })

  const events = await prisma.userEvent.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { guests: true, messages: true } } },
  })

  return NextResponse.json({ events })
}

// ── POST /api/events ─ create new event ───────────────────────
export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const user = await prisma.user.findUnique({ where: { email: session.user.email } })
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 })

  const { title, type, templateId, slug } = await req.json()

  if (!title || !type || !slug) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
  }

  // Check slug uniqueness
  const slugExists = await prisma.userEvent.findUnique({ where: { slug } })
  if (slugExists) {
    return NextResponse.json({ error: "This URL is already taken. Try another." }, { status: 400 })
  }

  // Copy template sections from a provided templateId OR match by event type
  let sections = null
  let theme = null
  let actualTemplateId = templateId || null

  const template = templateId 
    ? await prisma.template.findUnique({ where: { id: templateId } })
    : await prisma.template.findFirst({ where: { type } })

  if (template) {
    sections = template.sections
    theme = template.defaultTheme
    actualTemplateId = template.id
  }

  const event = await prisma.userEvent.create({
    data: {
      title,
      type,
      slug,
      userId: user.id,
      templateId: actualTemplateId,
      sections: sections ?? [],
      theme: theme ?? {},
      isPublished: false,
    },
  })

  return NextResponse.json({ event }, { status: 201 })
}
