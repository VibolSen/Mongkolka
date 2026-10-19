"use client"

import { motion } from "framer-motion"
import { TemplateTheme, QrCodeData } from "@/lib/types/template"
import { CreditCard, Gift } from "lucide-react"

interface Props {
  data: QrCodeData
  theme: TemplateTheme
}

export function PaymentSection({ data, theme }: Props) {
  return (
    <section className="py-24 px-6">
      <div className="max-w-xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4 text-sm uppercase tracking-[0.3em]" style={{ color: theme.primaryColor }}>
            <Gift className="w-4 h-4" />
            <span>Wedding Gift</span>
          </div>
          <h2 className="text-4xl font-bold">{data.title}</h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="rounded-3xl p-8 md:p-12 shadow-xl border text-center backdrop-blur-sm"
          style={{ 
            backgroundColor: `${theme.primaryColor}05`,
            borderColor: `${theme.primaryColor}15` 
          }}
        >
          <div className="p-6 rounded-2xl mb-8 inline-block border" style={{ backgroundColor: `${theme.primaryColor}08`, borderColor: `${theme.primaryColor}10` }}>
            {data.qrImage ? (
              <img
                src={data.qrImage}
                alt="Payment QR Code"
                className="w-48 h-48 md:w-64 md:h-64 object-contain rounded-xl mix-blend-multiply"
              />
            ) : (
              <div className="w-48 h-48 md:w-64 md:h-64 flex flex-col items-center justify-center opacity-40 gap-4">
                <CreditCard className="w-12 h-12" />
                <span className="text-sm font-medium">No QR Code provided</span>
              </div>
            )}
          </div>

          {(data.bankName || data.accountName || data.accountNumber) && (
            <div className="space-y-3">
              {data.bankName && (
                <p className="text-sm uppercase tracking-widest opacity-50">{data.bankName}</p>
              )}
              {data.accountName && (
                <p className="text-xl md:text-2xl font-bold">{data.accountName}</p>
              )}
              {data.accountNumber && (
                <p className="text-lg md:text-xl font-medium tracking-wider" style={{ color: theme.primaryColor }}>
                  {data.accountNumber}
                </p>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </section>
  )
}
