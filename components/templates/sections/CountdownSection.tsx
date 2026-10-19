"use client"

import { motion } from "framer-motion"
import { TemplateTheme, CountdownData } from "@/lib/types/template"
import { useEffect, useState } from "react"
import { Clock } from "lucide-react"

interface Props {
  data: CountdownData
  theme: TemplateTheme
}

export function CountdownSection({ data, theme }: Props) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })

  useEffect(() => {
    const interval = setInterval(() => {
      const diff = new Date(data.targetDate).getTime() - Date.now()
      if (diff <= 0) return clearInterval(interval)
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / 1000 / 60) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [data.targetDate])

  const units = [
    { label: "Days", value: timeLeft.days },
    { label: "Hours", value: timeLeft.hours },
    { label: "Minutes", value: timeLeft.minutes },
    { label: "Seconds", value: timeLeft.seconds },
  ]

  return (
    <section className="py-24 px-6 relative overflow-hidden flex items-center justify-center">
      <div className="absolute inset-0 opacity-5" style={{ backgroundColor: theme.primaryColor }} />
      
      <div className="max-w-4xl mx-auto relative z-10 w-full text-center">
        {data.title && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12 text-center"
          >
            <div className="flex items-center justify-center gap-3 mb-4 text-sm uppercase tracking-[0.3em]" style={{ color: theme.primaryColor }}>
              <Clock className="w-4 h-4" />
              <span>Countdown</span>
            </div>
            <h2 className="text-4xl font-bold">{data.title}</h2>
          </motion.div>
        )}

        <div className="flex gap-4 md:gap-8 justify-center flex-wrap">
          {units.map(({ label, value }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex flex-col items-center backdrop-blur-sm shadow-xl rounded-3xl p-6 min-w-[100px] md:min-w-[140px] border"
              style={{ 
                backgroundColor: `${theme.primaryColor}08`, 
                borderColor: `${theme.primaryColor}15` 
              }}
            >
              <span className="text-4xl md:text-6xl font-light tracking-tight mb-2" style={{ color: theme.primaryColor }}>
                {String(value).padStart(2, "0")}
              </span>
              <span className="text-xs md:text-sm font-medium tracking-widest uppercase opacity-50">{label}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
