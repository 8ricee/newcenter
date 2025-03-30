"use client"

import { Bell, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SidebarTrigger } from "@/components/ui/sidebar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function DashboardHeader() {
    return (
        <div className="flex h-16 items-center px-4 border-b">
            <SidebarTrigger />
            <div className="ml-auto flex items-center space-x-4">
                <div className="hidden md:flex">
                    <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Tìm kiếm..."
                            className="w-[200px] pl-8 md:w-[300px] rounded-full bg-muted"
                        />
                    </div>
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="relative">
                            <Bell className="h-5 w-5" />
                            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-primary" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-[300px]">
                        <DropdownMenuLabel>Thông báo</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <div className="grid gap-1 p-2">
                            <div className="grid gap-1">
                                <p className="text-sm font-medium">Không có thông báo mới</p>
                                <p className="text-xs text-muted-foreground">Bạn sẽ nhận được thông báo khi có sự kiện mới</p>
                            </div>
                        </div>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    )
}

