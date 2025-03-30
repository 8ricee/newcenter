"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { BarChart3, BookOpen, Calendar, GraduationCap, Home, LayoutDashboard, MessageSquare, Settings, User, Users, FileText, DollarSign, Bell } from 'lucide-react'

const navItems = [
    {
        title: "Tổng quan",
        href: "/admin",
        icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
        title: "Học viên",
        href: "/admin/students",
        icon: <Users className="h-5 w-5" />,
    },
    {
        title: "Giáo viên",
        href: "/admin/teachers",
        icon: <GraduationCap className="h-5 w-5" />,
    },
    {
        title: "Khóa học",
        href: "/admin/courses",
        icon: <BookOpen className="h-5 w-5" />,
    },
    {
        title: "Lớp học",
        href: "/admin/classes",
        icon: <User className="h-5 w-5" />,
    },
    {
        title: "Lịch học",
        href: "/admin/schedule",
        icon: <Calendar className="h-5 w-5" />,
    },
    {
        title: "Thanh toán",
        href: "/admin/payments",
        icon: <DollarSign className="h-5 w-5" />,
    },
    {
        title: "Báo cáo",
        href: "/admin/reports",
        icon: <FileText className="h-5 w-5" />,
    },
    {
        title: "Thống kê",
        href: "/admin/analytics",
        icon: <BarChart3 className="h-5 w-5" />,
    },
    {
        title: "Tin nhắn",
        href: "/admin/messages",
        icon: <MessageSquare className="h-5 w-5" />,
    },
    {
        title: "Thông báo",
        href: "/admin/notifications",
        icon: <Bell className="h-5 w-5" />,
    },
    {
        title: "Cài đặt",
        href: "/admin/settings",
        icon: <Settings className="h-5 w-5" />,
    },
]

export function AdminSidebar() {
    const pathname = usePathname()

    return (
        <div className="hidden border-r bg-background md:block md:w-64">
            <div className="flex h-16 items-center border-b px-6">
                <Link href="/admin" className="flex items-center gap-2 font-semibold">
                    <Home className="h-6 w-6" />
                    <span>Quản trị viên</span>
                </Link>
            </div>
            <nav className="grid items-start px-4 py-4 text-sm font-medium">
                {navItems.map((item, index) => (
                    <Link
                        key={index}
                        href={item.href}
                        className={cn(
                            "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:bg-muted",
                            pathname === item.href && "bg-muted"
                        )}
                    >
                        {item.icon}
                        {item.title}
                    </Link>
                ))}
            </nav>
        </div>
    )
}
