"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, BookOpen, Users, Calendar, FileText, Settings, LogOut } from "lucide-react"
import { signOut } from "next-auth/react"

const routes = [
  {
    label: "Tổng quan",
    icon: LayoutDashboard,
    href: "/admin",
    pattern: /^\/admin$/,
  },
  {
    label: "Khóa học",
    icon: BookOpen,
    href: "/admin/courses",
    pattern: /^\/admin\/courses/,
  },
  {
    label: "Giảng viên",
    icon: Users,
    href: "/admin/teachers",
    pattern: /^\/admin\/teachers/,
  },
  {
    label: "Học viên",
    icon: Users,
    href: "/admin/students",
    pattern: /^\/admin\/students/,
  },
  {
    label: "Lịch học",
    icon: Calendar,
    href: "/admin/schedules",
    pattern: /^\/admin\/schedules/,
  },
  {
    label: "Blog",
    icon: FileText,
    href: "/admin/blog",
    pattern: /^\/admin\/blog/,
  },
  {
    label: "Cài đặt",
    icon: Settings,
    href: "/admin/settings",
    pattern: /^\/admin\/settings/,
  },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <div className="h-screen w-64 border-r bg-muted/10 flex flex-col">
      <div className="p-6">
        <Link href="/" className="flex items-center">
          <h1 className="text-xl font-bold">LANGUAGE CENTER</h1>
        </Link>
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

