"use client"

import { motion } from "framer-motion"
import { KhmerCeremonyData, TemplateTheme } from "@/lib/types/template"
import { useState } from "react"

interface Props {
  data: KhmerCeremonyData
  theme: TemplateTheme
}

const ceremonyDescriptions: Record<string, string> = {
  "ហែជំនូន": "The dowry procession — the groom's family brings symbolic gifts to the bride's home.",
  "កាត់សក់": "The sacred hair-cutting ceremony symbolizing the start of a new chapter.",
  "សែនព្រេន": "A spiritual blessing ritual where monks offer prayers for happiness and prosperity.",
  "បាចផ្កាស្លា": "The flower and betel-leaf blessing ceremony to honor the couple.",
  "សំពះផ្ទឹម": "A reverent seating ceremony where the couple is blessed by their elders.",
  "ចងដៃ": "The hand-tying ceremony — threads are tied to the couple's wrists as a symbol of union.",
  "បង្វិលពពិល": "The candle blessing ceremony, where candles are passed around the couple.",
}

export function KhmerCeremonySection({ data, theme }: Props) {
  const [activeIdx, setActiveIdx] = useState<number | null>(null)
  const visibleEvents = data.events.filter(e => e.visible)

  return (
    <section className="py-24 px-6" style={{ backgroundColor: `${theme.primaryColor}08` }}>
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-sm uppercase tracking-[0.3em] mb-3" style={{ color: theme.primaryColor }}>
            Traditional Ceremony
          </p>
          <h2 className="text-4xl md:text-5xl font-bold" style={{ fontFamily: theme.fontFamilyKm }}>
            {data.title || "ពិធីអាពាហ៍ពិពាហ៍ប្រពៃណីខ្មែរ"}
          </h2>
          <p className="text-sm opacity-60 mt-2">Khmer Traditional Wedding Ceremony</p>
          <div className="flex items-center justify-center gap-4 mt-6">
            <div className="h-px w-20 bg-current opacity-20" />
            <span className="text-2xl opacity-40">🪔</span>
            <div className="h-px w-20 bg-current opacity-20" />
          </div>
        </motion.div>

        <div className="relative">
          {/* Vertical timeline line */}
          <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px -translate-x-1/2"
            style={{ backgroundColor: `${theme.primaryColor}30` }} />

          <div className="space-y-8">
            {visibleEvents.map((event, idx) => {
              const isLeft = idx % 2 === 0
              return (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, x: isLeft ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: idx * 0.1 }}
                  className={`relative flex items-start gap-6 md:gap-0 ${
                    isLeft ? "md:flex-row" : "md:flex-row-reverse"
                  }`}
                >
                  {/* Content */}
                  <div className={`flex-1 md:max-w-[calc(50%-3rem)] ${isLeft ? "md:pr-12" : "md:pl-12"} pl-14 md:pl-0`}>
                    <div
                      className="rounded-2xl p-5 shadow-sm border transition-all cursor-pointer hover:shadow-md"
                      style={{ borderColor: `${theme.primaryColor}20`, backgroundColor: activeIdx === idx ? `${theme.primaryColor}08` : "white" }}
                      onClick={() => setActiveIdx(activeIdx === idx ? null : idx)}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-xs font-semibold tracking-wider px-2 py-0.5 rounded-full"
                          style={{ backgroundColor: `${theme.primaryColor}15`, color: theme.primaryColor }}>
                          {event.time}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold mb-1" style={{ fontFamily: theme.fontFamilyKm, color: theme.primaryColor }}>
                        {event.nameKm}
                      </h3>
                      <p className="text-sm opacity-70">{event.name}</p>
                      {activeIdx === idx && (
                        <motion.p
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          className="text-sm mt-3 pt-3 border-t opacity-70 leading-relaxed"
                          style={{ borderColor: `${theme.primaryColor}20` }}
                        >
                          {event.description || ceremonyDescriptions[event.nameKm] || ""}
                        </motion.p>
                      )}
                    </div>
                  </div>

                  {/* Dot on timeline */}
                  <div className="absolute left-6 md:left-1/2 -translate-x-1/2 top-5 w-4 h-4 rounded-full border-2 flex items-center justify-center"
                    style={{ borderColor: theme.primaryColor, backgroundColor: "white" }}>
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: theme.primaryColor }} />
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
