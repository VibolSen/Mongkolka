"use client"

import * as React from "react"
import { Languages, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/components/language-provider"
import { Locale } from "@/lib/i18n"

export function LanguageToggle() {
  const { lang, setLang } = useLanguage()
  const [open, setOpen] = React.useState(false)
  const dropdownRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleSelect = (newLang: Locale) => {
    setLang(newLang)
    setOpen(false)
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <Button 
        variant="ghost" 
        size="icon" 
        className="rounded-full w-9 h-9" 
        onClick={() => setOpen(!open)}
        title="Change Language"
      >
        <Languages className="h-[1.2rem] w-[1.2rem]" />
        <span className="sr-only">Toggle language</span>
      </Button>

      {open && (
        <div className="absolute right-0 mt-2 w-32 rounded-lg border bg-popover p-1 text-popover-foreground shadow-md z-50 animate-in fade-in-0 zoom-in-95">
          <button
            onClick={() => handleSelect("EN")}
            className="relative flex w-full cursor-pointer items-center justify-between rounded-md px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground"
          >
            English {lang === "EN" && <Check className="h-4 w-4" />}
          </button>
          <button
            onClick={() => handleSelect("KM")}
            className="relative flex w-full cursor-pointer items-center justify-between rounded-md px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground"
          >
            ភាសាខ្មែរ {lang === "KM" && <Check className="h-4 w-4" />}
          </button>
        </div>
      )}
    </div>
  )
}
