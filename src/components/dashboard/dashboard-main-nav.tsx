"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarGroupLabel, SidebarGroup } from "@/components/ui/sidebar"
import { BookOpen, Calendar, Home, MessageSquare, Users } from "lucide-react"

interface DashboardMainNavProps extends React.HTMLAttributes<HTMLDivElement> {
    isTeacher?: boolean
}

export function DashboardMainNav({ isTeacher = false, className, ...props }: DashboardMainNavProps) {
    const pathname = usePathname()

    const studentNavItems = [
        {
            title: "Tổng quan",
            href: "/dashboard",
            icon: Home,
        },
        {
            title: "Khóa học",
            href: "/dashboard/courses",
            icon: BookOpen,
        },
        {
            title: "Lịch học",
            href: "/dashboard/schedule",
            icon: Calendar,
        },
        {
            title: "Tin nhắn",
            href: "/dashboard/messages",
            icon: MessageSquare,
        },
    ]

    const teacherNavItems = [
        {
            title: "Tổng quan",
            href: "/dashboard",
            icon: Home,
        },
        {
            title: "Lớp học",
            href: "/dashboard/classes",
            icon: Users,
        },
        {
            title: "Lịch dạy",
            href: "/dashboard/schedule",
            icon: Calendar,
        },
        {
            title: "Tin nhắn",
            href: "/dashboard/messages",
            icon: MessageSquare,
        },
    ]

    const navItems = isTeacher ? teacherNavItems : studentNavItems

    return (
        <div className={cn("", className)} {...props}>
            <SidebarGroup>
                <SidebarGroupLabel>Menu</SidebarGroupLabel>
                <SidebarMenu >
                    {navItems.map((item) => (
                        <SidebarMenuItem key={item.href}>
                            <SidebarMenuButton asChild isActive={pathname === item.href} tooltip={item.title}>
                                <Link href={item.href}>
                                    <item.icon />
                                    <span>{item.title}</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarGroup>
        </div>
    )
}

