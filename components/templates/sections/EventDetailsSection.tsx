"use client"

import { motion } from "framer-motion"
import { EventDetailsData, TemplateTheme } from "@/lib/types/template"
import { Calendar, Clock, MapPin, Shirt } from "lucide-react"

interface Props {
  data: EventDetailsData
  theme: TemplateTheme
}

export function EventDetailsSection({ data, theme }: Props) {
  const cards = [
    { icon: Calendar, label: "Date", value: data.title },
    { icon: Clock, label: "Time", value: data.time },
    { icon: MapPin, label: "Venue", value: data.locationName, sub: data.address },
    ...(data.dressCode ? [{ icon: Shirt, label: "Dress Code", value: data.dressCode }] : []),
  ]

  return (
    <section className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <p className="text-sm uppercase tracking-[0.3em] mb-3" style={{ color: theme.primaryColor }}>
            Event Details
          </p>
          <h2 className="text-4xl font-bold">When &amp; Where</h2>
        </motion.div>

        {/* Info cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {cards.map(({ icon: Icon, label, value, sub }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="rounded-2xl p-5 text-center border"
              style={{ borderColor: `${theme.primaryColor}20` }}
            >
              <div className="w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-3"
                style={{ backgroundColor: `${theme.primaryColor}15` }}>
                <Icon className="w-5 h-5" style={{ color: theme.primaryColor }} />
              </div>
              <p className="text-xs uppercase tracking-widest opacity-50 mb-1">{label}</p>
              <p className="font-semibold text-sm leading-tight">{value}</p>
              {sub && <p className="text-xs opacity-50 mt-1">{sub}</p>}
            </motion.div>
          ))}
        </div>

        {/* Google Map embed */}
        {data.mapUrl && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="w-full rounded-3xl overflow-hidden shadow-lg"
            style={{ height: 360 }}
          >
            <iframe
              src={data.mapUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </motion.div>
        )}

        {/* Directions button */}
        {data.address && (
          <div className="text-center mt-6">
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(data.address)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium transition-transform hover:scale-105"
              style={{ backgroundColor: theme.primaryColor, color: "#fff" }}
            >
              <MapPin className="w-4 h-4" /> Get Directions
            </a>
          </div>
        )}
      </div>
    </section>
  )
}
