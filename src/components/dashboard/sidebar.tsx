"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
    BookOpen,
    Calendar,
    GraduationCap,
    Home,
    LayoutDashboard,
    MessageSquare,
    Settings,
    User,
    Users,
} from "lucide-react"

const navItems = [
    {
        title: "Tổng quan",
        href: "/dashboard",
        icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
        title: "Khóa học",
        href: "/dashboard/courses",
        icon: <BookOpen className="h-5 w-5" />,
    },
    {
        title: "Lịch học",
        href: "/dashboard/schedule",
        icon: <Calendar className="h-5 w-5" />,
    },
    {
        title: "Giáo viên",
        href: "/dashboard/teachers",
        icon: <Users className="h-5 w-5" />,
    },
    {
        title: "Tin nhắn",
        href: "/dashboard/messages",
        icon: <MessageSquare className="h-5 w-5" />,
    },
    {
        title: "Chứng chỉ",
        href: "/dashboard/certificates",
        icon: <GraduationCap className="h-5 w-5" />,
    },
    {
        title: "Hồ sơ",
        href: "/dashboard/profile",
        icon: <User className="h-5 w-5" />,
    },
    {
        title: "Cài đặt",
        href: "/dashboard/settings",
        icon: <Settings className="h-5 w-5" />,
    },
]

export function Sidebar() {
    const pathname = usePathname()

    return (
        <div className="hidden border-r bg-background md:block md:w-64">
            <div className="flex h-16 items-center border-b px-6">
                <Link href="/" className="flex items-center gap-2 font-semibold">
                    <Home className="h-6 w-6" />
                    <span>Trung tâm ngoại ngữ</span>
                </Link>
            </div>
            <nav className="grid items-start px-4 py-4 text-sm font-medium">
                {navItems.map((item, index) => (
                    <Link
                        key={index}
                        href={item.href}
                        className={cn(
                            "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:bg-muted",
                            pathname === item.href && "bg-muted",
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

