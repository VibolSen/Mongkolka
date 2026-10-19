"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import {
  ArrowRight, Sparkles, Heart, Camera, QrCode, Users,
  CalendarDays, Star, Check, Globe
} from "lucide-react"
import { useLanguage } from "@/components/language-provider"

/* ── animation helper ── */
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 32 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.55, delay, ease: "easeOut" as const },
})

export default function Home() {
  const { t } = useLanguage()

  /* ── data mapped to translations ── */
  const features = [
    { icon: Heart,        title: t("features.items.invitations.title"),  desc: t("features.items.invitations.desc") },
    { icon: Users,        title: t("features.items.rsvp.title"),      desc: t("features.items.rsvp.desc") },
    { icon: Camera,       title: t("features.items.gallery.title"),        desc: t("features.items.gallery.desc") },
    { icon: QrCode,       title: t("features.items.qr.title"),          desc: t("features.items.qr.desc") },
    { icon: CalendarDays, title: t("features.items.timeline.title"),       desc: t("features.items.timeline.desc") },
    { icon: Globe,        title: t("features.items.bilingual.title"),    desc: t("features.items.bilingual.desc") },
  ]

  const eventTypes = [
    { emoji: "💍", label: "Khmer Wedding",      khmer: "ពិធីអាពាហ៍ពិពាហ៍"   },
    { emoji: "📸", label: "Pre-Wedding",         khmer: "មុនពិធី"              },
    { emoji: "💒", label: "Engagement",          khmer: "ពិធីដណ្ដើម"          },
    { emoji: "🎂", label: "Birthday",            khmer: "ខួបកំណើត"             },
    { emoji: "💝", label: "Anniversary",         khmer: "ខួបរៀបការ"            },
    { emoji: "👶", label: "Baby Shower",         khmer: "ពិធីទទួលទារក"        },
    { emoji: "🏠", label: "Housewarming",        khmer: "ចូលផ្ទះថ្មី"          },
    { emoji: "🎓", label: "Graduation",          khmer: "ពិធីបញ្ចប់ការសិក្សា" },
    { emoji: "🎊", label: "Corporate Event",     khmer: "ព្រឹត្តិការណ៍ក្រុមហ៊ុន" },
    { emoji: "✨", label: "Custom Event",        khmer: "ព្រឹត្តិការណ៍ផ្ទាល់ខ្លួន" },
  ]

  const steps = [
    { n: "01", title: t("howItWorks.steps.s1.title"),   desc: t("howItWorks.steps.s1.desc") },
    { n: "02", title: t("howItWorks.steps.s2.title"),   desc: t("howItWorks.steps.s2.desc") },
    { n: "03", title: t("howItWorks.steps.s3.title"),   desc: t("howItWorks.steps.s3.desc") },
    { n: "04", title: t("howItWorks.steps.s4.title"),   desc: t("howItWorks.steps.s4.desc") },
  ]

  const testimonials = [
    { name: "Sophea & Dara",    role: "Khmer Wedding",   rating: 5, text: "Mongkol made our wedding website look absolutely magical. All our guests loved it!" },
    { name: "Lina Chhun",       role: "Birthday Party",    rating: 5, text: "So easy to use! I created my birthday invitation in under an hour." },
    { name: "Vannak & Sreymom", role: "Engagement",      rating: 5, text: "The bilingual support is perfect. Our families abroad could read everything." },
  ]

  const plans = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      desc: "Perfect for simple events",
      features: ["1 event website", "Up to 50 guests", "Basic templates", "RSVP tracking"],
      cta: "Get Started Free",
      href: "/register",
      highlight: false,
    },
    {
      name: "Premium",
      price: "$9",
      period: "per event",
      desc: "For your most special occasions",
      features: ["Unlimited guests", "All premium templates", "Photo gallery", "QR code check-in", "Custom domain", "Priority support"],
      cta: "Start Premium",
      href: "/register",
      highlight: true,
    },
    {
      name: "Business",
      price: "$29",
      period: "per month",
      desc: "For event planners & agencies",
      features: ["Unlimited events", "Team collaboration", "White-label branding", "Analytics dashboard", "API access", "Dedicated support"],
      cta: "Contact Us",
      href: "/register",
      highlight: false,
    },
  ]

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <main className="flex-1">

        {/* ── HERO ── */}
        <section className="relative overflow-hidden pt-28 pb-32 md:pt-36 md:pb-44">
          <div className="absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[600px] rounded-full bg-primary/8 blur-3xl" />
            <div className="absolute bottom-0 right-0 w-[500px] h-[400px] rounded-full bg-accent/10 blur-3xl" />
          </div>

          <div className="container px-6 md:px-10 mx-auto text-center">
            <motion.div {...fadeUp(0)} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20 mb-8">
              <Sparkles className="w-3.5 h-3.5" />
              <span className="text-sm font-medium">{t("hero.badge")}</span>
            </motion.div>

            <motion.h1 {...fadeUp(0.1)} className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-tight">
              {t("hero.title")} <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary/80 to-accent">
                <span className="font-kantumruy">{t("hero.titleHighlight")}</span>
              </span>
            </motion.h1>

            <motion.p {...fadeUp(0.2)} className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
              {t("hero.subtitle")}
            </motion.p>

            <motion.div {...fadeUp(0.3)} className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/register">
                <Button size="lg" className="h-13 px-8 text-base rounded-full shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-shadow">
                  {t("hero.createBtn")} <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
              <Link href="#templates">
                <Button size="lg" variant="outline" className="h-13 px-8 text-base rounded-full">
                  {t("hero.viewTemplates")}
                </Button>
              </Link>
            </motion.div>

            {/* stats */}
            <motion.div {...fadeUp(0.4)} className="mt-16 flex flex-wrap items-center justify-center gap-8 md:gap-16 text-center">
              {[["10,000+", t("hero.stats.events")], ["98%", t("hero.stats.couples")], ["50+", t("hero.stats.templates")]].map(([num, label]) => (
                <div key={label}>
                  <p className="text-3xl font-bold text-primary">{num}</p>
                  <p className="text-sm text-muted-foreground mt-1">{label}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ── FEATURES ── */}
        <section id="features" className="py-24 bg-muted/30">
          <div className="container px-6 md:px-10 mx-auto">
            <motion.div {...fadeUp()} className="text-center mb-16">
              <p className="text-sm font-medium text-primary mb-3 uppercase tracking-widest">{t("features.badge")}</p>
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                {t("features.title")}
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                {t("features.subtitle")}
              </p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map(({ icon: Icon, title, desc }, i) => (
                <motion.div key={title} {...fadeUp(i * 0.07)}
                  className="group p-6 rounded-2xl bg-card border hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300">
                  <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── EVENT TYPES ── */}
        <section id="templates" className="py-24">
          <div className="container px-6 md:px-10 mx-auto">
            <motion.div {...fadeUp()} className="text-center mb-16">
              <p className="text-sm font-medium text-primary mb-3 uppercase tracking-widest">{t("eventTypes.badge")}</p>
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                {t("eventTypes.title")}
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                {t("eventTypes.subtitle")}
              </p>
            </motion.div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {eventTypes.map(({ emoji, label, khmer }, i) => (
                <motion.div key={label} {...fadeUp(i * 0.05)}
                  className="group flex flex-col items-center text-center p-5 rounded-2xl border bg-card hover:border-primary/50 hover:bg-primary/5 hover:shadow-md transition-all duration-300 cursor-pointer">
                  <span className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">{emoji}</span>
                  <p className="font-medium text-sm mb-1">{label}</p>
                  <p className="text-xs text-muted-foreground font-kantumruy">{khmer}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── HOW IT WORKS ── */}
        <section className="py-24 bg-muted/30">
          <div className="container px-6 md:px-10 mx-auto">
            <motion.div {...fadeUp()} className="text-center mb-16">
              <p className="text-sm font-medium text-primary mb-3 uppercase tracking-widest">{t("howItWorks.badge")}</p>
              <h2 className="text-4xl md:text-5xl font-bold mb-4">{t("howItWorks.title")}</h2>
              <p className="text-muted-foreground max-w-xl mx-auto">{t("howItWorks.subtitle")}</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {steps.map(({ n, title, desc }, i) => (
                <motion.div key={n} {...fadeUp(i * 0.1)} className="relative text-center">
                  {i < steps.length - 1 && (
                    <div className="hidden md:block absolute top-8 left-[60%] w-full h-px border-t border-dashed border-primary/30" />
                  )}
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 border-2 border-primary/20 flex items-center justify-center mx-auto mb-4">
                    <span className="text-xl font-bold text-primary">{n}</span>
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{title}</h3>
                  <p className="text-sm text-muted-foreground">{desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── TESTIMONIALS ── */}
        <section className="py-24">
          <div className="container px-6 md:px-10 mx-auto">
            <motion.div {...fadeUp()} className="text-center mb-16">
              <p className="text-sm font-medium text-primary mb-3 uppercase tracking-widest">{t("testimonials.badge")}</p>
              <h2 className="text-4xl md:text-5xl font-bold mb-4">{t("testimonials.title")}</h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {testimonials.map(({ name, role, rating, text }, i) => (
                <motion.div key={name} {...fadeUp(i * 0.1)}
                  className="p-6 rounded-2xl bg-card border flex flex-col gap-4">
                  <div className="flex gap-1">
                    {Array.from({ length: rating }).map((_, j) => (
                      <Star key={j} className="w-4 h-4 fill-accent text-accent" />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed flex-1">&ldquo;{text}&rdquo;</p>
                  <div>
                    <p className="font-semibold text-sm">{name}</p>
                    <p className="text-xs text-muted-foreground">{role}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── PRICING ── */}
        <section id="pricing" className="py-24 bg-muted/30">
          <div className="container px-6 md:px-10 mx-auto">
            <motion.div {...fadeUp()} className="text-center mb-16">
              <p className="text-sm font-medium text-primary mb-3 uppercase tracking-widest">{t("pricing.badge")}</p>
              <h2 className="text-4xl md:text-5xl font-bold mb-4">{t("pricing.title")}</h2>
              <p className="text-muted-foreground max-w-xl mx-auto">{t("pricing.subtitle")}</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {plans.map(({ name, price, period, desc, features, cta, href, highlight }, i) => (
                <motion.div key={name} {...fadeUp(i * 0.1)}
                  className={`relative p-8 rounded-2xl border flex flex-col gap-6 transition-all duration-300 ${
                    highlight
                      ? "bg-primary text-primary-foreground border-primary shadow-2xl shadow-primary/20 scale-[1.03]"
                      : "bg-card hover:border-primary/40 hover:shadow-lg"
                  }`}>
                  {highlight && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-accent text-accent-foreground text-xs font-bold">
                      Most Popular
                    </div>
                  )}
                  <div>
                    <p className={`text-sm font-medium mb-1 ${highlight ? "text-primary-foreground/70" : "text-muted-foreground"}`}>{name}</p>
                    <div className="flex items-end gap-1">
                      <span className="text-4xl font-bold">{price}</span>
                      <span className={`text-sm mb-1 ${highlight ? "text-primary-foreground/70" : "text-muted-foreground"}`}>/{period}</span>
                    </div>
                    <p className={`text-sm mt-2 ${highlight ? "text-primary-foreground/70" : "text-muted-foreground"}`}>{desc}</p>
                  </div>

                  <ul className="space-y-2.5 flex-1">
                    {features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm">
                        <Check className={`w-4 h-4 flex-shrink-0 ${highlight ? "text-primary-foreground" : "text-primary"}`} />
                        {f}
                      </li>
                    ))}
                  </ul>

                  <Link href={href}>
                    <Button className={`w-full rounded-xl ${highlight ? "bg-primary-foreground text-primary hover:bg-primary-foreground/90" : ""}`}
                      variant={highlight ? "secondary" : "default"}>
                      {cta}
                    </Button>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="py-24">
          <div className="container px-6 md:px-10 mx-auto">
            <motion.div {...fadeUp()}
              className="relative rounded-3xl bg-gradient-to-br from-primary to-primary/70 text-primary-foreground overflow-hidden p-12 md:p-20 text-center">
              <div className="absolute inset-0 -z-10">
                <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-white/10 blur-3xl" />
                <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-accent/20 blur-3xl" />
              </div>
              <Sparkles className="w-10 h-10 mx-auto mb-6 opacity-80" />
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                {t("cta.title1")}<br />
                <span className="font-kantumruy opacity-90">{t("cta.title2")}</span>
              </h2>
              <p className="text-primary-foreground/80 text-lg mb-10 max-w-xl mx-auto">
                {t("cta.subtitle")}
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/register">
                  <Button size="lg" className="h-13 px-8 text-base rounded-full bg-white text-primary hover:bg-white/90 shadow-xl">
                    {t("cta.btnPrimary")} <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
                <Link href="#features">
                  <Button size="lg" variant="outline" className="h-13 px-8 text-base rounded-full border-white/40 text-white hover:bg-white/10">
                    {t("cta.btnSecondary")}
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

      </main>
    </div>
  )
}
