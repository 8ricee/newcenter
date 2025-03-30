import type React from "react"
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar"
import { authOptions } from "@/lib/auth"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login")
  }

  return <DashboardSidebar user={session.user}>{children}</DashboardSidebar>
}

