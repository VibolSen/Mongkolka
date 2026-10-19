"use client"

import { motion, AnimatePresence } from "framer-motion"
import { GalleryData, TemplateTheme } from "@/lib/types/template"
import { useState } from "react"
import { X, ChevronLeft, ChevronRight } from "lucide-react"

interface Props {
  data: GalleryData
  theme: TemplateTheme
}

export function GallerySection({ data, theme }: Props) {
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null)

  const prev = () => setLightboxIdx(i => (i !== null ? Math.max(0, i - 1) : null))
  const next = () => setLightboxIdx(i => (i !== null ? Math.min(data.images.length - 1, i + 1) : null))

  return (
    <section className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <p className="text-sm uppercase tracking-[0.3em] mb-3" style={{ color: theme.primaryColor }}>
            Memories
          </p>
          <h2 className="text-4xl md:text-5xl font-bold" style={{ fontFamily: theme.fontFamily }}>
            {data.title}
          </h2>
        </motion.div>

        {/* Masonry-style grid */}
        <div className="columns-2 md:columns-3 lg:columns-4 gap-3 space-y-3">
          {data.images.map((img, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className="break-inside-avoid cursor-pointer overflow-hidden rounded-xl group"
              onClick={() => setLightboxIdx(i)}
            >
              <img
                src={img}
                alt={`Gallery ${i + 1}`}
                className="w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIdx !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
            onClick={() => setLightboxIdx(null)}
          >
            <button className="absolute top-4 right-4 text-white/70 hover:text-white p-2"
              onClick={() => setLightboxIdx(null)}>
              <X className="w-6 h-6" />
            </button>
            {lightboxIdx > 0 && (
              <button className="absolute left-4 text-white/70 hover:text-white p-2"
                onClick={(e) => { e.stopPropagation(); prev() }}>
                <ChevronLeft className="w-8 h-8" />
              </button>
            )}
            {lightboxIdx < data.images.length - 1 && (
              <button className="absolute right-4 text-white/70 hover:text-white p-2"
                onClick={(e) => { e.stopPropagation(); next() }}>
                <ChevronRight className="w-8 h-8" />
              </button>
            )}
            <motion.img
              key={lightboxIdx}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              src={data.images[lightboxIdx]}
              alt="Gallery photo"
              className="max-h-[85vh] max-w-[90vw] object-contain rounded-xl shadow-2xl"
              onClick={e => e.stopPropagation()}
            />
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/50 text-sm">
              {lightboxIdx + 1} / {data.images.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
