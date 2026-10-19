import React from "react"

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex-1 flex items-center justify-center p-4 md:p-8 min-h-[calc(100vh-4rem)] bg-muted/20">
      <div className="w-full max-w-md">{children}</div>
    </div>
  )
}
