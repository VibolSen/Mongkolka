import { Request, Response } from "express"
import { prisma } from "../lib/prisma.js"

export async function listSongs(req: Request, res: Response) {
  try {
    const songs = await prisma.song.findMany({
      orderBy: { createdAt: "desc" },
    })
    return res.json({ success: true, data: songs, songs })
  } catch (error: any) {
    return res.status(500).json({ success: false, message: "Failed to fetch songs", error: error.message })
  }
}

export async function uploadSong(req: Request, res: Response) {
  try {
    const { title, artist, url } = req.body

    if (!title || !url) {
      return res.status(400).json({ success: false, message: "Title and Audio URL are required" })
    }

    const song = await prisma.song.create({
      data: {
        title,
        artist: artist || null,
        url,
      },
    })

    return res.status(201).json({ success: true, data: song, song, message: "Song added to library" })
  } catch (error: any) {
    return res.status(500).json({ success: false, message: "Failed to save song", error: error.message })
  }
}

export async function deleteSong(req: Request, res: Response) {
  try {
    const { id } = req.params
    await prisma.song.delete({ where: { id } })
    return res.json({ success: true, message: "Song deleted from library" })
  } catch (error: any) {
    return res.status(500).json({ success: false, message: "Failed to delete song", error: error.message })
  }
}
