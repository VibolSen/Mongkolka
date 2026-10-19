"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Sparkles, Crown, Heart, Star, Cake, Baby, Users, Home, GraduationCap, Briefcase } from "lucide-react"

const templates = [
  {
    id: "pre-wedding",
    type: "PRE_WEDDING",
    name: "Pre-Wedding",
    nameKm: "មុនពិធីមង្គល",
    description: "Romantic cinematic design for engagement & save-the-date announcements.",
    icon: Heart,
    gradient: "from-rose-400 to-pink-600",
    badge: null,
    preview: "bg-gradient-to-br from-rose-100 to-pink-200",
  },
  {
    id: "khmer-traditional",
    type: "WEDDING_KHMER",
    name: "Khmer Traditional",
    nameKm: "ពិធីអាពាហ៍ពិពាហ៍ខ្មែរ",
    description: "Gold royal luxury design with full Khmer ceremony flow.",
    icon: Crown,
    gradient: "from-amber-400 to-yellow-600",
    badge: "Popular",
    preview: "bg-gradient-to-br from-amber-100 to-yellow-200",
  },
  {
    id: "modern-wedding",
    type: "WEDDING_MODERN",
    name: "Modern Wedding",
    nameKm: "ពិធីអាពាហ៍ពិពាហ៍ទំនើប",
    description: "Clean minimal luxury with smooth animations and elegant gallery.",
    icon: Sparkles,
    gradient: "from-slate-400 to-gray-600",
    badge: "New",
    preview: "bg-gradient-to-br from-slate-100 to-gray-200",
  },
  {
    id: "engagement",
    type: "ENGAGEMENT",
    name: "Engagement",
    nameKm: "ពិធីភ្ជាប់ពាក្យ",
    description: "Proposal story, family introductions and ceremony details.",
    icon: Star,
    gradient: "from-violet-400 to-purple-600",
    badge: null,
    preview: "bg-gradient-to-br from-violet-100 to-purple-200",
  },
  {
    id: "birthday",
    type: "BIRTHDAY",
    name: "Birthday Party",
    nameKm: "ខួបកំណើត",
    description: "Vibrant party design with age counter and RSVP system.",
    icon: Cake,
    gradient: "from-orange-400 to-red-500",
    badge: null,
    preview: "bg-gradient-to-br from-orange-100 to-red-200",
  },
  {
    id: "baby-shower",
    type: "BABY_SHOWER",
    name: "Baby Shower",
    nameKm: "ពិធីស្វាគមន៍កូន",
    description: "Soft gender-themed colors with gift registry and games.",
    icon: Baby,
    gradient: "from-sky-400 to-blue-500",
    badge: null,
    preview: "bg-gradient-to-br from-sky-100 to-blue-200",
  },
  {
    id: "anniversary",
    type: "ANNIVERSARY",
    name: "Anniversary",
    nameKm: "ខួបលើកទី",
    description: "Timeline memories, gallery and a heartfelt message wall.",
    icon: Heart,
    gradient: "from-red-400 to-rose-600",
    badge: null,
    preview: "bg-gradient-to-br from-red-100 to-rose-200",
  },
  {
    id: "housewarming",
    type: "HOUSEWARMING",
    name: "Housewarming",
    nameKm: "ផ្ទះថ្មី",
    description: "Warm cozy design for celebrating a new home.",
    icon: Home,
    gradient: "from-green-400 to-emerald-600",
    badge: null,
    preview: "bg-gradient-to-br from-green-100 to-emerald-200",
  },
  {
    id: "graduation",
    type: "GRADUATION",
    name: "Graduation",
    nameKm: "ពិធីបញ្ចប់ការសិក្សា",
    description: "Achievement celebration with timeline and photo gallery.",
    icon: GraduationCap,
    gradient: "from-indigo-400 to-blue-700",
    badge: null,
    preview: "bg-gradient-to-br from-indigo-100 to-blue-200",
  },
  {
    id: "corporate",
    type: "CORPORATE",
    name: "Corporate Event",
    nameKm: "ព្រឹត្តិការណ៍ក្រុមហ៊ុន",
    description: "Professional agenda, speakers and registration system.",
    icon: Briefcase,
    gradient: "from-zinc-500 to-gray-700",
    badge: "Premium",
    preview: "bg-gradient-to-br from-zinc-100 to-gray-200",
  },
]

export default function TemplatesPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative py-24 px-6 text-center overflow-hidden border-b">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-rose-50 via-background to-amber-50 dark:from-rose-950/20 dark:to-amber-950/10" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400 mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            {templates.length} Premium Templates
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-4 leading-tight">
            Choose Your{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 via-red-500 to-amber-500">
              Template
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-xl mx-auto">
            Pre-designed, fully customizable event pages built for Cambodian traditions. Pick a design and make it yours in minutes.
          </p>
        </motion.div>
      </section>

      {/* Template grid */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {templates.map((tpl, i) => {
            const Icon = tpl.icon
            return (
              <motion.div
                key={tpl.id}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.06 }}
                className="group rounded-3xl overflow-hidden border bg-card hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col"
              >
                {/* Preview thumbnail */}
                <div className={`relative h-44 ${tpl.preview} overflow-hidden`}>
                  {/* Decorative blobs */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${tpl.gradient} opacity-70`} />
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                    <Icon className="w-12 h-12 mb-2 drop-shadow-lg" />
                    <p className="text-xs font-semibold tracking-widest uppercase opacity-80">{tpl.type.replace("_", " ")}</p>
                  </div>
                  {tpl.badge && (
                    <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-xs font-bold">
                      {tpl.badge}
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-5 flex flex-col flex-1">
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground mb-1" style={{ fontFamily: "Khmer OS Siemreap, serif" }}>
                      {tpl.nameKm}
                    </p>
                    <h3 className="text-lg font-bold mb-2">{tpl.name}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {tpl.description}
                    </p>
                  </div>

                  <div className="flex gap-2 mt-5">
                    <Link
                      href={`/templates/${tpl.id}/preview`}
                      className="flex-1 text-center py-2.5 rounded-xl text-sm font-medium border hover:bg-muted transition-colors"
                    >
                      Preview
                    </Link>
                    <Link
                      href={`/dashboard/create?template=${tpl.id}`}
                      className="flex-1 text-center py-2.5 rounded-xl text-sm font-semibold text-white transition-transform hover:scale-[1.02] active:scale-[0.98]"
                      style={{ background: `linear-gradient(135deg, #e11d48, #f59e0b)` }}
                    >
                      Use Template
                    </Link>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </section>
    </div>
  )
}
