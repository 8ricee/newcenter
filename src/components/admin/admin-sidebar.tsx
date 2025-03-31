/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { AdminMainNav } from "@/components/admin/admin-main-nav"
import { UserNav } from "@/components/dashboard/user-nav"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { GraduationCap } from "lucide-react"

interface AdminSidebarProps {
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

export function AdminSidebar({
  children,
  user,
}: AdminSidebarProps) {
  const pathname = usePathname()

  return (
    <SidebarProvider>
      <Sidebar variant="inset" collapsible="icon">
        <SidebarHeader className="border-b">
          <div className="flex h-[53px] items-center px-2">
            <Link href="/admin" className="flex items-center gap-2 px-2">
              <GraduationCap className="h-6 w-6" />
              <span className="font-bold text-lg">Admin Panel</span>
            </Link>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <ScrollArea className="h-[calc(100vh-53px-41px)]">
            <div className="px-2 py-2">
              <AdminMainNav />
            </div>
          </ScrollArea>
        </SidebarContent>
        <SidebarFooter className="border-t">
          <div className="flex h-[41px] items-center px-4 justify-between">
            <div className="flex items-center gap-2">
              <Avatar className="h-7 w-7">
                <AvatarImage src={user?.image || ""} />
                <AvatarFallback>{user?.name?.charAt(0) || user?.email?.charAt(0) || "A"}</AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium truncate max-w-[120px]">{user?.name || "Admin"}</span>
            </div>
            <UserNav user={user} />
          </div>
        </SidebarFooter>
      </Sidebar>
      <div className="flex flex-col">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          <SidebarTrigger />
          <div className="flex flex-1 items-center gap-2 md:hidden">
            <Link href="/admin" className="flex items-center gap-2 font-semibold">
              <GraduationCap className="h-5 w-5" />
              <span>Admin Panel</span>
            </Link>
          </div>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">{children}</main>
      </div>
    </SidebarProvider>
  )
}

