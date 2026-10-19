import { Navbar } from "@/components/shared/navbar"
import { Footer } from "@/components/shared/footer"

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="pt-16 flex-1">
        {children}
      </main>
      <Footer />
    </>
  )
}
