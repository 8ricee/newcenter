/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { DashboardMainNav } from "@/components/dashboard/dashboard-main-nav"
import { UserNav } from "@/components/dashboard/user-nav"
import { GraduationCap } from "lucide-react"
import { Separator } from "@/components/ui/separator"

interface DashboardSidebarProps {
  defaultCollapsed?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  children?: React.ReactNode
  user: {
    name?: string | null
    email?: string | null
    image?: string | null
    role?: string
  }
}

export function DashboardSidebar({
  children,
  user,
}: DashboardSidebarProps) {
  const pathname = usePathname()
  const isTeacher = user?.role === "TEACHER"

  return (
    <SidebarProvider >
      <Sidebar variant="inset" collapsible="icon">
        <SidebarHeader>
          <Link href="/">
            <SidebarMenu>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <GraduationCap className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">
                    Kasumi
                  </span>
                  <span className="truncate text-xs">Language Center</span>
                </div>
              </SidebarMenuButton>
            </SidebarMenu>
          </Link>
        </SidebarHeader>

        <SidebarContent>
          <DashboardMainNav isTeacher={isTeacher} />
        </SidebarContent>
        <SidebarFooter>
          <UserNav user={user} />
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <span className="hidden md:block">
              Language Center
            </span>
          </div>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  )
}

