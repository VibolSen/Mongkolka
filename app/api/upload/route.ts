import { NextResponse } from "next/server"
import { auth } from "@/auth"
import ImageKit from "imagekit"

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY!,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT!,
})

const ALLOWED_AUDIO_TYPES = [
  "audio/mpeg",
  "audio/mp3",
  "audio/ogg",
  "audio/wav",
  "audio/flac",
  "audio/aac",
  "audio/x-m4a",
  "audio/mp4",
  "video/mp4",
]

const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
]

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const formData = await req.formData()
    const file = formData.get("file") as File | null

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    const isAudio = ALLOWED_AUDIO_TYPES.includes(file.type) || file.name.match(/\.(mp3|ogg|wav|flac|aac|m4a|mp4)$/i)
    const isImage = ALLOWED_IMAGE_TYPES.includes(file.type) || file.name.match(/\.(jpg|jpeg|png|webp|gif|svg)$/i)

    if (!isAudio && !isImage) {
      return NextResponse.json(
        { error: `Invalid file type: "${file.type || "unknown"}". Only audio (MP3, WAV, AAC, FLAC) and image files are supported. YouTube links cannot be uploaded directly.` },
        { status: 400 }
      )
    }

    // Extra guard: if MIME says text/html, reject it (YouTube or web pages)
    if (file.type.startsWith("text/") || file.type === "application/octet-stream" && !isAudio) {
      return NextResponse.json(
        { error: "The file appears to be a web page or unsupported format. Please upload a real audio file (MP3, WAV, etc.)." },
        { status: 400 }
      )
    }

    // Convert file to base64 for ImageKit
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    const base64File = buffer.toString("base64")

    // Determine folder
    const folder = isAudio ? "/pre-wedding/music" : "/pre-wedding/images"

    // Upload to ImageKit
    const result = await imagekit.upload({
      file: base64File,
      fileName: file.name,
      folder: folder,
      useUniqueFileName: true,
    })

    return NextResponse.json({ url: result.url })
  } catch (error) {
    console.error("ImageKit upload error:", error)
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}
