import type { Metadata } from "next"
import { db } from "@/lib/db"
import { CourseForm } from "@/components/admin/course-form"

export const metadata: Metadata = {
  title: "Thêm khóa học | Language Center",
  description: "Thêm khóa học mới tại Language Center",
}

export default async function NewCoursePage() {
  const teachers = await db.teacher.findMany({
    include: {
      user: true,
    },
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Thêm khóa học mới</h1>
        <p className="text-muted-foreground">Tạo khóa học mới cho Language Center</p>
      </div>

      <CourseForm teachers={teachers} initialData={undefined} />
    </div>
  )
}

