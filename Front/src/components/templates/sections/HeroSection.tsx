"use client"

import { motion } from "framer-motion"
import { Calendar } from "lucide-react"
import { HeroSectionData, TemplateTheme } from "@/lib/types/template"
import { useEffect, useState } from "react"

interface Props {
  data: HeroSectionData
  theme: TemplateTheme
}

function Countdown({ targetDate }: { targetDate: string }) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })

  useEffect(() => {
    const interval = setInterval(() => {
      const diff = new Date(targetDate).getTime() - Date.now()
      if (diff <= 0) return clearInterval(interval)
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / 1000 / 60) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [targetDate])

  const units = [
    { label: "Days", value: timeLeft.days },
    { label: "Hours", value: timeLeft.hours },
    { label: "Minutes", value: timeLeft.minutes },
    { label: "Seconds", value: timeLeft.seconds },
  ]

  return (
    <div className="flex gap-3 justify-center flex-wrap">
      {units.map(({ label, value }) => (
        <div key={label} className="flex flex-col items-center bg-white/10 backdrop-blur-sm rounded-2xl px-4 py-3 min-w-[70px]">
          <span className="text-3xl font-bold text-white leading-none">
            {String(value).padStart(2, "0")}
          </span>
          <span className="text-white/70 text-xs mt-1 tracking-wider uppercase">{label}</span>
        </div>
      ))}
    </div>
  )
}

export function HeroSection({ data, theme }: Props) {
  const formattedDate = data.date
    ? new Date(data.date).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
    : ""

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      {data.coverImage ? (
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${data.coverImage})` }}
        />
      ) : (
        <div
          className="absolute inset-0"
          style={{ background: `linear-gradient(135deg, ${theme.primaryColor}, ${theme.secondaryColor})` }}
        />
      )}

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-black/60" />

      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-64 h-64 rounded-full opacity-20 blur-3xl"
        style={{ backgroundColor: theme.primaryColor }} />
      <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full opacity-20 blur-3xl"
        style={{ backgroundColor: theme.secondaryColor }} />

      {/* Content */}
      <div className="relative z-10 text-center text-white px-4 sm:px-6 py-12 sm:py-20 max-w-5xl mx-auto w-full flex flex-col items-center justify-center min-h-[80vh]">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-bold mb-6 sm:mb-12 tracking-wide text-center bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary leading-snug px-2"
          style={{
            fontFamily: theme.fontFamily
          }}
        >
          {data.title}
        </motion.h1>

        {(data.boyName || data.girlName) && (
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-col items-center justify-center mb-8 sm:mb-12"
            style={{ fontFamily: theme.fontFamily }}
          >
            <span className="text-4xl sm:text-5xl md:text-6xl font-bold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] tracking-wide">
              {data.boyName}
            </span>
            <div className="flex items-center justify-center -space-x-1 my-2">
              <span className="text-2xl drop-shadow-md text-primary">♡</span>
              <span className="text-2xl drop-shadow-md text-primary">♡</span>
            </div>
            <span className="text-4xl sm:text-5xl md:text-6xl font-bold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] tracking-wide">
              {data.girlName}
            </span>
          </motion.h2>
        )}

        {data.subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl sm:text-2xl font-medium text-white mb-6 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]"
          >
            {data.subtitle}
          </motion.p>
        )}

        {/* Decorative Frame Divider */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="w-full max-w-sm mx-auto h-16 border-t-2 border-b-2 border-white/60 mb-8 relative flex items-center justify-center"
        >
          <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 border-2 border-white/60 rounded-full bg-transparent" />
          <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 border-2 border-white/60 rounded-full bg-transparent" />
        </motion.div>

        {formattedDate && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col items-center justify-center gap-1 text-white mb-10 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]"
          >
            <span className="text-xl sm:text-2xl font-bold tracking-wide">{formattedDate}</span>
          </motion.div>
        )}

        <motion.a
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          href="#rsvp"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-md text-sm font-semibold text-gray-800 bg-white shadow-xl hover:bg-gray-100 transition-colors mt-4"
        >
          <Calendar className="w-4 h-4" />
          <span>Add to Calendar</span>
        </motion.a>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 8, 0] }}
        transition={{ duration: 1.5, repeat: Infinity, delay: 2 }}
        className="absolute bottom-6 left-6 text-white"
      >
        <svg className="w-8 h-8 drop-shadow-md" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
        </svg>
      </motion.div>
    </section>
  )
}
