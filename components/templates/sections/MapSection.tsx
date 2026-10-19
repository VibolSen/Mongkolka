"use client"

import { motion } from "framer-motion"
import { TemplateTheme, MapData } from "@/lib/types/template"
import { Map, MapPin, Navigation, ExternalLink } from "lucide-react"
import { useState } from "react"

interface Props {
  data: MapData
  theme: TemplateTheme
}

export function MapSection({ data, theme }: Props) {
  const [locating, setLocating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const openGoogleMaps = () => {
    if (!data.address && !data.mapUrl) return
    const query = encodeURIComponent(data.address || "")
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, "_blank")
  }

  const getDirectionsFromMyLocation = () => {
    setError(null)
    if (!navigator.geolocation) {
      setError("Your browser does not support geolocation.")
      return
    }
    setLocating(true)
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocating(false)
        const { latitude, longitude } = position.coords
        const destination = encodeURIComponent(data.address || "")
        const url = `https://www.google.com/maps/dir/${latitude},${longitude}/${destination}`
        window.open(url, "_blank")
      },
      (err) => {
        setLocating(false)
        if (err.code === err.PERMISSION_DENIED) {
          setError("Location access was denied. Please allow location in your browser and try again.")
        } else {
          setError("Could not get your location. Please try again.")
        }
      },
      { timeout: 10000 }
    )
  }

  return (
    <section className="py-24 px-6 relative">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div
            className="flex items-center justify-center gap-3 mb-4 text-sm uppercase tracking-[0.3em]"
            style={{ color: theme.primaryColor }}
          >
            <MapPin className="w-4 h-4" />
            <span>Location</span>
          </div>
          {data.title && <h2 className="text-4xl font-bold mb-4">{data.title}</h2>}
          {data.address && (
            <p className="opacity-60 max-w-xl mx-auto text-sm leading-relaxed">{data.address}</p>
          )}
        </motion.div>

        {/* Map embed */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="aspect-[4/3] md:aspect-video w-full rounded-3xl overflow-hidden shadow-2xl border relative flex items-center justify-center"
          style={{
            backgroundColor: `${theme.primaryColor}05`,
            borderColor: `${theme.primaryColor}15`,
          }}
        >
          {data.mapUrl ? (
            <iframe
              src={data.mapUrl}
              className="w-full h-full absolute inset-0"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Event Location"
            />
          ) : (
            <div className="flex flex-col items-center justify-center p-6 text-center opacity-50">
              <Map className="w-12 h-12 mb-3" style={{ color: theme.primaryColor }} />
              <p className="text-sm font-medium">No map configured yet</p>
              <p className="text-xs mt-1">Add a Google Maps embed URL in the builder.</p>
            </div>
          )}
        </motion.div>

        {/* Action buttons */}
        {data.address && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            {/* Open in Google Maps */}
            <button
              onClick={openGoogleMaps}
              className="inline-flex items-center gap-2.5 px-8 py-4 rounded-full text-sm font-semibold tracking-wide uppercase shadow-lg transition-transform hover:scale-105 w-full sm:w-auto justify-center"
              style={{ backgroundColor: theme.primaryColor, color: "#fff" }}
            >
              <ExternalLink className="w-4 h-4" />
              Open in Google Maps
            </button>

            {/* Get directions from my location */}
            <button
              onClick={getDirectionsFromMyLocation}
              disabled={locating}
              className="inline-flex items-center gap-2.5 px-8 py-4 rounded-full text-sm font-semibold tracking-wide uppercase border-2 transition-transform hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed w-full sm:w-auto justify-center"
              style={{
                borderColor: theme.primaryColor,
                color: theme.primaryColor,
                backgroundColor: "transparent",
              }}
            >
              <Navigation className={`w-4 h-4 ${locating ? "animate-spin" : ""}`} />
              {locating ? "Getting your location…" : "Get Directions from Here"}
            </button>
          </motion.div>
        )}

        {/* Error message */}
        {error && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 text-center text-sm text-red-500"
          >
            {error}
          </motion.p>
        )}
      </div>
    </section>
  )
}
