import { Request, Response } from "express"
import ImageKit from "imagekit"

let imagekit: ImageKit | null = null

if (process.env.IMAGEKIT_PUBLIC_KEY && process.env.IMAGEKIT_PRIVATE_KEY && process.env.IMAGEKIT_URL_ENDPOINT) {
  imagekit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
  })
}

export async function handleUpload(req: Request, res: Response) {
  try {
    const { file, fileName, folder } = req.body

    if (!file) {
      return res.status(400).json({ success: false, message: "No file content provided" })
    }

    if (!imagekit) {
      // In development or when ImageKit is not configured yet, return a clean simulated asset URL
      return res.json({
        success: true,
        url: `https://ik.imagekit.io/mongkolka_demo/${fileName || "uploaded_asset.jpg"}`,
        message: "ImageKit not configured; returned mock asset URL",
      })
    }

    const uploadRes = await imagekit.upload({
      file, // base64 or binary
      fileName: fileName || "upload",
      folder: folder || "/mongkolka",
    })

    return res.json({
      success: true,
      url: uploadRes.url,
      fileId: uploadRes.fileId,
      message: "Uploaded successfully",
    })
  } catch (error: any) {
    return res.status(500).json({ success: false, message: "Upload failed", error: error.message })
  }
}
