import { auth } from "@/auth"
import { redirect } from "next/navigation"
import AdminClientLayout from "./client-layout"

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  
  if (!session) {
    redirect("/login")
  }
  
  if (session.user?.role !== "ADMIN") {
    redirect("/dashboard")
  }

  return <AdminClientLayout>{children}</AdminClientLayout>
}
