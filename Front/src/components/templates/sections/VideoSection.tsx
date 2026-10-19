"use client"

import { motion } from "framer-motion"
import { TemplateTheme, VideoData } from "@/lib/types/template"
import { PlayCircle } from "lucide-react"

interface Props {
  data: VideoData
  theme: TemplateTheme
}

export function VideoSection({ data, theme }: Props) {
  // Try to determine if it's a YouTube URL to use the embed format
  const getEmbedUrl = (url: string) => {
    try {
      if (url.includes("youtube.com") || url.includes("youtu.be")) {
        let videoId = ""
        if (url.includes("youtu.be")) {
          videoId = url.split("youtu.be/")[1]?.split("?")[0]
        } else if (url.includes("watch?v=")) {
          videoId = url.split("watch?v=")[1]?.split("&")[0]
        }
        if (videoId) {
          return `https://www.youtube.com/embed/${videoId}`
        }
      }
      return url
    } catch {
      return url
    }
  }

  const embedUrl = getEmbedUrl(data.url)
  const isEmbed = embedUrl.includes("youtube.com/embed") || embedUrl.includes("vimeo.com")

  return (
    <section className="py-24 px-6 relative">
      <div className="max-w-5xl mx-auto">
        {(data.title || data.description) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="flex items-center justify-center gap-3 mb-4 text-sm uppercase tracking-[0.3em]" style={{ color: theme.primaryColor }}>
              <PlayCircle className="w-4 h-4" />
              <span>Video</span>
            </div>
            {data.title && <h2 className="text-4xl font-bold mb-4">{data.title}</h2>}
            {data.description && <p className="text-white/60 max-w-2xl mx-auto">{data.description}</p>}
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="aspect-video w-full rounded-3xl overflow-hidden shadow-2xl border border-white/10 relative flex items-center justify-center"
          style={{ backgroundColor: `${theme.primaryColor}10` }}
        >
          {embedUrl ? (
            isEmbed ? (
              <iframe
                src={embedUrl}
                title={data.title || "Video player"}
                className="w-full h-full absolute inset-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <video
                src={embedUrl}
                controls
                className="w-full h-full object-cover absolute inset-0"
                title={data.title || "Video player"}
              />
            )
          ) : (
            <div className="flex flex-col items-center justify-center p-6 text-center z-10 opacity-50">
              <PlayCircle className="w-12 h-12 mb-3" style={{ color: theme.primaryColor }} />
              <p className="text-sm font-medium">No video URL provided</p>
              <p className="text-xs mt-1">Please add a YouTube, Vimeo, or direct MP4 link in the builder.</p>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  )
}
