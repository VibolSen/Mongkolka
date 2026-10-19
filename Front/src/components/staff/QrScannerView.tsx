"use client"

import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { QrCode, CheckCircle2, AlertCircle, Camera, Armchair, Users, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { api } from "@/lib/api"

export function QrScannerView() {
  const [tokenInput, setTokenInput] = useState("")
  const [scanning, setScanning] = useState(false)
  const [result, setResult] = useState<any | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleScanToken = async (tokenToUse?: string) => {
    const token = tokenToUse || tokenInput.trim()
    if (!token) return

    setScanning(true)
    setError(null)
    setResult(null)

    try {
      const res = await api.post("/staff/scan", { checkInToken: token })
      if (res?.data) {
        setResult(res.data)
        setTokenInput("")
      } else {
        setError(res?.message || "Invalid or already checked-in QR pass")
      }
    } catch (err: any) {
      setError(err?.message || "Check-in failed. Please verify the QR code.")
    } finally {
      setScanning(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Scanner Card */}
      <div className="bg-card rounded-2xl border p-6 shadow-sm text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-blue-500/10 text-blue-600 flex items-center justify-center mx-auto">
          <Camera className="w-8 h-8" />
        </div>

        <div>
          <h2 className="text-lg font-bold">Door QR Scanner</h2>
          <p className="text-xs text-muted-foreground mt-1">
            Point camera at the guest's digital wedding pass or enter their check-in code below
          </p>
        </div>

        <div className="p-4 rounded-xl border border-dashed border-blue-500/30 bg-blue-500/5">
          <p className="text-xs text-muted-foreground font-medium mb-3">
            Simulate or Enter Guest QR Check-in Code:
          </p>
          <div className="flex gap-2">
            <Input
              placeholder="Paste guest checkInToken..."
              value={tokenInput}
              onChange={(e) => setTokenInput(e.target.value)}
              className="text-xs h-10 font-mono"
            />
            <Button
              onClick={() => handleScanToken()}
              disabled={scanning || !tokenInput.trim()}
              className="h-10 px-4 bg-blue-600 hover:bg-blue-700 text-white"
            >
              {scanning ? "Validating..." : "Verify"}
            </Button>
          </div>
        </div>
      </div>

      {/* Result Card */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="bg-card rounded-2xl border-2 border-emerald-500/50 p-6 shadow-md space-y-4 bg-gradient-to-b from-emerald-500/5 to-transparent"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                  Guest Verified & Checked In!
                </span>
                <h3 className="text-xl font-bold text-foreground">{result.name}</h3>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2 border-t">
              <div className="p-3 rounded-xl bg-muted/60">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                  <Users className="w-3.5 h-3.5" /> Party Pax
                </div>
                <p className="text-base font-bold">{result.pax || 1} Person(s)</p>
              </div>

              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
                <div className="flex items-center gap-1.5 text-xs text-amber-600 font-semibold mb-1">
                  <Armchair className="w-3.5 h-3.5" /> Assigned Table
                </div>
                <p className="text-base font-bold text-amber-600">
                  {result.table?.name || "VIP Banquet Floor"}
                </p>
              </div>
            </div>

            <Button
              onClick={() => setResult(null)}
              variant="outline"
              className="w-full rounded-xl text-xs"
            >
              Ready for Next Guest
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error Card */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm flex items-center gap-3"
          >
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p className="font-medium text-xs">{error}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
