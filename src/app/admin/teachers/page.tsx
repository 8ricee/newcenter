import type { Metadata } from "next"
import Link from "next/link"
import { db } from "@/lib/db"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { TeacherTable } from "@/components/admin/teacher-table"

export const metadata: Metadata = {
    title: "Quản lý giảng viên | Language Center",
    description: "Quản lý giảng viên tại Language Center",
}

export default async function TeachersPage() {
    const teachers = await db.teacher.findMany({
        include: {
            user: true,
            courses: {
                select: {
                    id: true,
                },
            },
        },
        orderBy: {
            createdAt: "desc",
        },
    })

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Quản lý giảng viên</h1>
                    <p className="text-muted-foreground">Quản lý tất cả giảng viên tại Language Center</p>
                </div>
                <Button asChild>
                    <Link href="/admin/teachers/new">
                        <Plus className="mr-2 h-4 w-4" />
                        Thêm giảng viên
                    </Link>
                </Button>
            </div>

            <TeacherTable teachers={teachers} />
        </div>
    )
}

