import React from "react"
import { Footer } from "@/components/shared/footer"

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex-1 flex flex-col">
      <div className="flex-1">{children}</div>
      <Footer />
    </div>
  )
}
