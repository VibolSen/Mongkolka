import { Request, Response } from "express"
import { prisma } from "../lib/prisma.js"

export async function listTemplates(req: Request, res: Response) {
  try {
    const templates = await prisma.template.findMany({
      include: {
        _count: { select: { userEvents: true } },
      },
      orderBy: { createdAt: "desc" },
    })
    return res.json({ success: true, data: templates })
  } catch (error: any) {
    return res.status(500).json({ success: false, message: "Failed to fetch templates", error: error.message })
  }
}

export async function createTemplate(req: Request, res: Response) {
  try {
    const { name, type, description, thumbnail, isPremium, defaultTheme, sections } = req.body

    if (!name || !type) {
      return res.status(400).json({ success: false, message: "Template name and type are required" })
    }

    const template = await prisma.template.create({
      data: {
        name,
        type,
        description: description || null,
        thumbnail: thumbnail || null,
        isPremium: !!isPremium,
        defaultTheme: defaultTheme || {
          primaryColor: "#D4AF37",
          secondaryColor: "#C41E3A",
          backgroundColor: "#FAFAF5",
          textColor: "#1A1A1A",
        },
        sections: sections || [],
      },
    })

    return res.status(201).json({ success: true, data: template, message: "Template created successfully" })
  } catch (error: any) {
    return res.status(500).json({ success: false, message: "Failed to create template", error: error.message })
  }
}

export async function updateTemplate(req: Request, res: Response) {
  try {
    const { id } = req.params
    const { name, type, description, thumbnail, isPremium, defaultTheme, sections } = req.body

    const existing = await prisma.template.findUnique({ where: { id } })
    if (!existing) {
      return res.status(404).json({ success: false, message: "Template not found" })
    }

    const updated = await prisma.template.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(type !== undefined && { type }),
        ...(description !== undefined && { description }),
        ...(thumbnail !== undefined && { thumbnail }),
        ...(isPremium !== undefined && { isPremium: !!isPremium }),
        ...(defaultTheme !== undefined && { defaultTheme }),
        ...(sections !== undefined && { sections }),
      },
    })

    return res.json({ success: true, data: updated, message: "Template updated successfully" })
  } catch (error: any) {
    return res.status(500).json({ success: false, message: "Failed to update template", error: error.message })
  }
}

export async function deleteTemplate(req: Request, res: Response) {
  try {
    const { id } = req.params

    const existing = await prisma.template.findUnique({
      where: { id },
      include: { _count: { select: { userEvents: true } } },
    })

    if (!existing) {
      return res.status(404).json({ success: false, message: "Template not found" })
    }

    if (existing._count.userEvents > 0) {
      // Disconnect template from events before deleting
      await prisma.userEvent.updateMany({
        where: { templateId: id },
        data: { templateId: null },
      })
    }

    await prisma.template.delete({ where: { id } })

    return res.json({ success: true, message: "Template deleted successfully" })
  } catch (error: any) {
    return res.status(500).json({ success: false, message: "Failed to delete template", error: error.message })
  }
}
