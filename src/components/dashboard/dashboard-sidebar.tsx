"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSession } from "next-auth/react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, BookOpen, Calendar, MessageSquare, Settings, LogOut, Users } from "lucide-react"
import { signOut } from "next-auth/react"
import Image from "next/image"

export function DashboardSidebar() {
  const pathname = usePathname()
  const { data: session } = useSession()

  const isTeacher = session?.user?.role === "TEACHER"
  const isStudent = session?.user?.role === "STUDENT"

  const routes = [
    {
      label: "Tổng quan",
      icon: LayoutDashboard,
      href: "/dashboard",
      pattern: /^\/dashboard$/,
    },
    ...(isTeacher
      ? [
          {
            label: "Khóa học của tôi",
            icon: BookOpen,
            href: "/dashboard/courses",
            pattern: /^\/dashboard\/courses/,
          },
          {
            label: "Lịch dạy",
            icon: Calendar,
            href: "/dashboard/schedule",
            pattern: /^\/dashboard\/schedule/,
          },
          {
            label: "Học viên",
            icon: Users,
            href: "/dashboard/students",
            pattern: /^\/dashboard\/students/,
          },
        ]
      : []),
    ...(isStudent
      ? [
          {
            label: "Khóa học của tôi",
            icon: BookOpen,
            href: "/dashboard/my-courses",
            pattern: /^\/dashboard\/my-courses/,
          },
          {
            label: "Lịch học",
            icon: Calendar,
            href: "/dashboard/schedule",
            pattern: /^\/dashboard\/schedule/,
          },
        ]
      : []),
    {
      label: "Tin nhắn",
      icon: MessageSquare,
      href: "/dashboard/messages",
      pattern: /^\/dashboard\/messages/,
    },
    {
      label: "Cài đặt",
      icon: Settings,
      href: "/dashboard/settings",
      pattern: /^\/dashboard\/settings/,
    },
  ]

  return (
    <div className="h-screen w-64 border-r bg-muted/10 flex flex-col">
      <div className="p-6">
        <Link href="/" className="flex items-center">
          <h1 className="text-xl font-bold">LANGUAGE CENTER</h1>
        </Link>
      </div>
      <div className="px-3 py-2">
        <div className="flex items-center gap-3 mb-6 p-3 rounded-md bg-muted/50">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            {session?.user?.image ? (
              <Image
                src={session.user.image || "/placeholder.svg"}
                alt={session.user.name || "User"}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <span className="text-primary font-medium">{session?.user?.name?.charAt(0) || "U"}</span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium truncate">{session?.user?.name || "Người dùng"}</p>
            <p className="text-xs text-muted-foreground">
              {session?.user?.role === "TEACHER"
                ? "Giảng viên"
                : session?.user?.role === "STUDENT"
                  ? "Học viên"
                  : "Quản trị viên"}
            </p>
          </div>
        </div>
      </div>
      <div className="flex-1 px-3 py-2 space-y-1">
        {routes.map((route) => (
          <Button
            key={route.href}
            variant={route.pattern.test(pathname) ? "secondary" : "ghost"}
            className={cn("w-full justify-start", route.pattern.test(pathname) && "bg-primary/10")}
            asChild
          >
            <Link href={route.href}>
              <route.icon className="mr-2 h-5 w-5" />
              {route.label}
            </Link>
          </Button>
        ))}
      </div>
      <div className="p-3 mt-auto">
        <Button
          variant="ghost"
          className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
          onClick={() => signOut()}
        >
          <LogOut className="mr-2 h-5 w-5" />
          Đăng xuất
        </Button>
      </div>
    </div>
  )
}

