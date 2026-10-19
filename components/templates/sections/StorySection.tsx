"use client"

import { motion } from "framer-motion"
import { StorySectionData, TemplateTheme } from "@/lib/types/template"

interface Props {
  data: StorySectionData
  theme: TemplateTheme
}

export function StorySection({ data, theme }: Props) {
  return (
    <section className="py-24 px-6 relative overflow-hidden">
      <div className="absolute inset-0 -z-10 opacity-5"
        style={{ background: `radial-gradient(circle at 50% 50%, ${theme.primaryColor}, transparent 70%)` }} />

      <div className="max-w-4xl mx-auto">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <p className="text-sm uppercase tracking-[0.3em] mb-3" style={{ color: theme.primaryColor }}>
            Our Story
          </p>
          <h2 className="text-4xl md:text-5xl font-bold" style={{ fontFamily: theme.fontFamily }}>
            {data.title}
          </h2>
          <div className="flex items-center justify-center gap-4 mt-6">
            <div className="h-px w-20 bg-current opacity-20" />
            <span className="text-xl opacity-40">❋</span>
            <div className="h-px w-20 bg-current opacity-20" />
          </div>
        </motion.div>

        {/* Content and images */}
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <p className="text-lg leading-relaxed opacity-80 whitespace-pre-line">
              {data.content}
            </p>
          </motion.div>

          {data.images.length > 0 && (
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="grid grid-cols-2 gap-3"
            >
              {data.images.slice(0, 4).map((img, i) => (
                <div
                  key={i}
                  className={`rounded-2xl overflow-hidden bg-gray-100 ${i === 0 ? "col-span-2 h-56" : "h-36"}`}
                >
                  <img src={img} alt={`Story photo ${i + 1}`}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" />
                </div>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </section>
  )
}
