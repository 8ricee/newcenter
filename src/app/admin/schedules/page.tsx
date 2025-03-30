import type { Metadata } from "next"
import Link from "next/link"
import { db } from "@/lib/db"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { ScheduleTable } from "@/components/admin/schedule-table"

export const metadata: Metadata = {
  title: "Quản lý lịch học | Language Center",
  description: "Quản lý lịch học tại Language Center",
}

export default async function SchedulesPage() {
  const rawSchedules = await db.schedule.findMany({
    include: {
      course: true,
      teacher: {
        include: {
          user: true,
        },
      },
    },
    orderBy: {
      startDate: "asc",
    },
  })

  const schedules = rawSchedules.map((schedule) => ({
    ...schedule,
    startDate: schedule.startDate.toISOString(),
    endDate: schedule.endDate?.toISOString() ?? null,
    createdAt: schedule.createdAt.toISOString(),
    updatedAt: schedule.updatedAt.toISOString(),
    teacher: {
      ...schedule.teacher,
      user: {
        ...schedule.teacher.user,
        name: schedule.teacher.user.name ?? "Không tên",
        email: schedule.teacher.user.email ?? "Không có email",
        image: schedule.teacher.user.image ?? "/placeholder-avatar.png",
      },
    },
  }))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Quản lý lịch học</h1>
          <p className="text-muted-foreground">Quản lý tất cả lịch học tại Language Center</p>
        </div>
        <Button asChild>
          <Link href="/admin/schedules/new">
            <Plus className="mr-2 h-4 w-4" />
            Thêm lịch học
          </Link>
        </Button>
      </div>

      <ScheduleTable schedules={schedules} />
    </div>
  )
}
