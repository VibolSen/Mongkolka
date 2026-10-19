"use client"

import * as React from "react"
import { useTheme } from "next-themes"

interface Props {
  children: React.ReactNode
  theme: any
}

export function EventClientWrapper({ children, theme }: Props) {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => setMounted(true), [])

  // In dark mode, we let Tailwind's global dark classes handle the background and text colors
  // Otherwise, we use the specific template theme colors
  const isDark = mounted && resolvedTheme === "dark"

  return (
    <main
      className="min-h-screen transition-colors duration-500"
      style={{
        backgroundColor: isDark ? undefined : theme.backgroundColor,
        color: isDark ? undefined : theme.textColor,
        fontFamily: theme.fontFamily,
      }}
    >
      {children}
    </main>
  )
}
