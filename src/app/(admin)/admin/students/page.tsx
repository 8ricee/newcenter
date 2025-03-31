import type { Metadata } from "next"
import { db } from "@/lib/db"
import { StudentTable } from "@/components/admin/student-table"

export const metadata: Metadata = {
    title: "Quản lý học viên | Language Center",
    description: "Quản lý học viên tại Language Center",
}

export default async function StudentsPage() {
    const students = await db.student.findMany({
        include: {
            user: true,
            enrollments: {
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
            <div>
                <h1 className="text-3xl font-bold">Quản lý học viên</h1>
                <p className="text-muted-foreground">Quản lý tất cả học viên tại Language Center</p>
            </div>

            <StudentTable students={students} />
        </div>
    )
}

