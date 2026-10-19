"use client"

import { motion } from "framer-motion"

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.45, ease: "easeOut" as const },
}

export default function AdminSettingsPage() {
  return (
    <div className="py-8">
      <div className="container px-6 md:px-10 mx-auto max-w-6xl space-y-8">
        <motion.div {...fadeUp}>
          <h1 className="text-3xl font-bold">Platform Settings</h1>
          <p className="text-muted-foreground text-sm mt-1">Configure global platform settings and features.</p>
        </motion.div>
        
        <motion.div {...fadeUp} transition={{ delay: 0.1 }} className="bg-card rounded-2xl border p-6 min-h-[400px] flex items-center justify-center text-muted-foreground">
          <p>Settings panel will be implemented here.</p>
        </motion.div>
      </div>
    </div>
  )
}
