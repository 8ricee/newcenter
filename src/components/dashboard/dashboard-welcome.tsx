"use client"

import { useState, useEffect } from "react"

type Role = "TEACHER" | "STUDENT" | "ADMIN";

interface DashboardWelcomeProps {
    name?: string;
    role: Role;
}

export function DashboardWelcome({ name, role }: DashboardWelcomeProps) {
    const [greeting, setGreeting] = useState("")

    useEffect(() => {
        const hour = new Date().getHours()
        if (hour < 12) {
            setGreeting("Chào buổi sáng")
        } else if (hour < 18) {
            setGreeting("Chào buổi chiều")
        } else {
            setGreeting("Chào buổi tối")
        }
    }, [])

    const roleText = role === "TEACHER" ? "giảng viên" : role === "STUDENT" ? "học viên" : "quản trị viên"

    return (
        <div>
            <h1 className="text-3xl font-bold">
                {greeting}, {name || "bạn"}!
            </h1>
            <p className="text-muted-foreground">
                Chào mừng {roleText} quay trở lại với Language Center. Dưới đây là tổng quan về tài khoản của bạn.
            </p>
        </div>
    )
}