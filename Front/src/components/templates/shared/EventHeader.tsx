"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Music, Music4, Volume2, VolumeX } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/shared/theme-toggle"
import { LanguageToggle } from "@/components/shared/language-toggle"

interface EventHeaderProps {
  musicUrl?: string
  autoplay?: boolean
  volume?: number
}

export function EventHeader({ musicUrl, autoplay = false, volume = 0.5 }: EventHeaderProps) {
  const [isPlaying, setIsPlaying] = React.useState(false)
  const audioRef = React.useRef<HTMLAudioElement | null>(null)

  React.useEffect(() => {
    if (!musicUrl) return

    const audio = new Audio(musicUrl)
    audio.loop = true
    audio.volume = volume
    audioRef.current = audio

    // Auto-play after first user interaction (browser policy)
    if (autoplay) {
      const tryPlay = () => {
        audio.play().then(() => {
          setIsPlaying(true)
          document.removeEventListener("click", tryPlay)
          document.removeEventListener("keydown", tryPlay)
        }).catch(() => {})
      }
      document.addEventListener("click", tryPlay, { once: true })
      document.addEventListener("keydown", tryPlay, { once: true })
    }

    return () => {
      audio.pause()
      audioRef.current = null
    }
  }, [musicUrl, autoplay, volume])

  const toggleMusic = () => {
    if (!audioRef.current) return

    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play().catch(e => console.log("Audio play failed:", e))
    }
    setIsPlaying(!isPlaying)
  }

  return (
    <>
      {/* Top Header (Scrolls away with page) */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.8 }}
        className="absolute top-0 left-0 right-0 w-full z-50 p-4 md:px-8 flex items-center justify-between pointer-events-none"
      >
        {/* Website name */}
        <div className="pointer-events-auto bg-background/40 backdrop-blur-md px-4 py-2 rounded-full border shadow-sm">
          <span className="font-bold text-lg tracking-wide bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Mongkol
          </span>
        </div>

        <div className="flex items-center gap-2 pointer-events-auto bg-background/40 backdrop-blur-md p-1.5 rounded-full border shadow-sm">
          <LanguageToggle />
          <div className="w-px h-5 bg-border mx-1" />
          <ThemeToggle />
        </div>
      </motion.header>

      {/* Fixed Music Button (Always visible) */}
      <motion.div 
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.8, type: "spring" }}
        className="fixed bottom-6 right-6 z-50"
      >
        <Button
          variant="default"
          size="icon"
          onClick={toggleMusic}
          className="rounded-full w-12 h-12 shadow-xl hover:scale-110 transition-transform relative"
          title="Play Background Music"
        >
          {isPlaying ? (
            <>
              <Volume2 className="h-5 w-5" />
              <motion.span 
                animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="absolute inset-0 bg-primary rounded-full -z-10"
              />
            </>
          ) : (
            <VolumeX className="h-5 w-5" />
          )}
        </Button>
      </motion.div>
    </>
  )
}
