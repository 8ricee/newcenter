/* eslint-disable @typescript-eslint/no-empty-object-type */
"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar"
import { BookOpen, Calendar, GraduationCap, LayoutDashboard, Settings, User, Users } from "lucide-react"

interface AdminMainNavProps extends React.HTMLAttributes<HTMLDivElement> { }

export function AdminMainNav({ className, ...props }: AdminMainNavProps) {
    const pathname = usePathname()

    const adminNavItems = [
        {
            title: "Tổng quan",
            href: "/admin",
            icon: LayoutDashboard,
        },
        {
            title: "Khóa học",
            href: "/admin/courses",
            icon: BookOpen,
        },
        {
            title: "Lớp học",
            href: "/admin/classes",
            icon: GraduationCap,
        },
        {
            title: "Học viên",
            href: "/admin/students",
            icon: Users,
        },
        {
            title: "Giáo viên",
            href: "/admin/teachers",
            icon: Users,
        },
        {
            title: "Đăng ký",
            href: "/admin/enrollments",
            icon: Calendar,
        },
        {
            title: "Người dùng",
            href: "/admin/users",
            icon: User,
        },
        {
            title: "Cài đặt",
            href: "/admin/settings",
            icon: Settings,
        },
    ]

    return (
        <div className={cn("", className)} {...props}>
            <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">Quản trị</h2>
            <SidebarMenu>
                {adminNavItems.map((item) => (
                    <SidebarMenuItem key={item.href}>
                        <SidebarMenuButton asChild isActive={pathname === item.href} tooltip={item.title}>
                            <Link href={item.href}>
                                <item.icon className="h-4 w-4" />
                                <span>{item.title}</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                ))}
            </SidebarMenu>
            <div className="mt-6">
                <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">Truy cập nhanh</h2>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild tooltip="Dashboard">
                            <Link href="/dashboard">
                                <LayoutDashboard className="h-4 w-4" />
                                <span>Dashboard</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </div>
        </div>
    )
}

