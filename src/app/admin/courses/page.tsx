import type { Metadata } from "next"
import Link from "next/link"
import { db } from "@/lib/db"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { CourseTable } from "@/components/admin/course-table"

export const metadata: Metadata = {
  title: "Quản lý khóa học | Language Center",
  description: "Quản lý khóa học tại Language Center",
}

export default async function CoursesPage() {
  const courses = await db.course.findMany({
    include: {
      teacher: {
        include: {
          user: true,
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
          <h1 className="text-3xl font-bold">Quản lý khóa học</h1>
          <p className="text-muted-foreground">Quản lý tất cả khóa học tại Language Center</p>
        </div>
        <Button asChild>
          <Link href="/admin/courses/new">
            <Plus className="mr-2 h-4 w-4" />
            Thêm khóa học
          </Link>
        </Button>
      </div>

      <CourseTable courses={courses} />
    </div>
  )
}

