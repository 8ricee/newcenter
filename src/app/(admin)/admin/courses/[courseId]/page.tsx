import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { db } from "@/lib/db"
import { CourseForm } from "@/components/admin/course-form"

export const metadata: Metadata = {
  title: "Chỉnh sửa khóa học | Language Center",
  description: "Chỉnh sửa thông tin khóa học tại Language Center",
}

export default async function EditCoursePage({
  params,
}: {
  params: { courseId: string }
}) {
  const course = await db.course.findUnique({
    where: {
      id: params.courseId,
    },
  })

  if (!course) {
    notFound()
  }

  const teachers = await db.teacher.findMany({
    include: {
      user: true,
    },
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Chỉnh sửa khóa học</h1>
        <p className="text-muted-foreground">Chỉnh sửa thông tin khóa học {course.title}</p>
      </div>

      <CourseForm teachers={teachers} />
    </div>
  )
}

