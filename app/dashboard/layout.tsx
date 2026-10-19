import { auth } from "@/auth"
import { redirect } from "next/navigation"
import DashboardClientLayout from "./client-layout"

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  
  if (!session) {
    redirect("/login")
  }
  
  if (session.user?.role === "ADMIN") {
    redirect("/admin")
  }

  return <DashboardClientLayout>{children}</DashboardClientLayout>
}
