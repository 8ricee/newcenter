"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BookOpen, Calendar, GraduationCap, Home, LayoutDashboard, LogOut, Settings, User, Users } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { signOut } from "next-auth/react"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"

interface AppSidebarProps {
    user: {
        name?: string | null
        email?: string | null
        image?: string | null
        role?: string
    }
}

export function AppSidebar({ user }: AppSidebarProps) {
    const pathname = usePathname()
    const isAdmin = user?.role === "ADMIN"
    const isTeacher = user?.role === "TEACHER"

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
            title: "Hồ sơ",
            href: "/dashboard/profile",
            icon: User,
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
            title: "Hồ sơ",
            href: "/dashboard/profile",
            icon: User,
        },
    ]

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

    const navItems = isAdmin ? adminNavItems : isTeacher ? teacherNavItems : studentNavItems

    return (
        <Sidebar>
            <SidebarHeader className="border-b">
                <div className="flex items-center gap-2 px-2">
                    <Link href="/" className="flex items-center gap-2">
                        <GraduationCap className="h-6 w-6" />
                        <span className="font-bold text-xl">Language Center</span>
                    </Link>
                </div>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Menu</SidebarGroupLabel>
                    <SidebarMenu>
                        {navItems.map((item) => (
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
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter className="border-t p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Avatar>
                            <AvatarImage src={user?.image || ""} />
                            <AvatarFallback>{user?.name?.charAt(0) || user?.email?.charAt(0) || "U"}</AvatarFallback>
                        </Avatar>
                        <div className="space-y-1">
                            <p className="text-sm font-medium leading-none">{user?.name || "Người dùng"}</p>
                            <p className="text-xs text-muted-foreground">{user?.email}</p>
                        </div>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => signOut({ callbackUrl: "/" })} title="Đăng xuất">
                        <LogOut className="h-4 w-4" />
                    </Button>
                </div>
            </SidebarFooter>
        </Sidebar>
        
    )
}

