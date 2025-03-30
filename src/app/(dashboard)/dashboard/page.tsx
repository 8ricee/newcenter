/* eslint-disable @typescript-eslint/no-explicit-any */
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { db } from "@/lib/db"
import { authOptions } from "@/lib/auth"
import { formatDate } from "@/lib/utils"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { BookOpen, GraduationCap, Users } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session) redirect("/login")
  if (session.user.role === "ADMIN") redirect("/admin")

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    include: {
      student: true,
      teacher: true,
    },
  })

  if (!user) return <div>Không tìm thấy thông tin người dùng</div>

  // -------------------------- STUDENT --------------------------
  if (user.role === "STUDENT" && user.student) {
    const enrollments = await db.enrollment.findMany({
      where: { studentId: user.student.id },
      include: {
        course: true,
        class: {
          include: {
            sessions: {
              where: { date: { gte: new Date() } },
              orderBy: { date: "asc" },
              take: 3,
            },
          },
        },
      },
      orderBy: { enrolledAt: "desc" },
    })

    const activeCourses = enrollments.filter(e => e.status === "ACTIVE").length
    const upcomingSessions = enrollments
      .flatMap(e => e.class?.sessions || [])
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, 3)

    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Chào bạn, {user.name}</h1>
          <p className="text-muted-foreground">Đây là trang tổng quan của bạn.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <DashboardCard title="Khóa học đang học" value={activeCourses} icon={BookOpen} />
          <DashboardCard title="Tổng số khóa học" value={enrollments.length} icon={GraduationCap} />
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <DashboardCardList
            title="Khóa học gần đây"
            description="Các khóa học bạn đã đăng ký"
            items={enrollments.slice(0, 5).map(enrollment => ({
              id: enrollment.id,
              name: enrollment.course.title,
              status: enrollment.status,
              link: `/dashboard/courses/${enrollment.courseId}`,
            }))}
            type="course"
            className="col-span-4"
          />
          <DashboardCardList
            title="Lịch học sắp tới"
            description="Các buổi học sắp diễn ra"
            items={upcomingSessions.map(session => ({
              id: session.id,
              name: session.topic || "Buổi học",
              date: formatDate(session.date),
              time: `${session.startTime} - ${session.endTime}`,
              room: session.room || "Chưa cập nhật",
            }))}
            type="session"
            className="col-span-3"
          />
        </div>
      </div>
    )
  }

  // -------------------------- TEACHER --------------------------
  if (user.role === "TEACHER" && user.teacher) {
    const classes = await db.class.findMany({
      where: { teacherId: user.teacher.id },
      include: {
        course: true,
        enrollments: {
          include: { student: { include: { user: true } } },
        },
        sessions: {
          where: { date: { gte: new Date() } },
          orderBy: { date: "asc" },
          take: 3,
        },
      },
      orderBy: { startDate: "desc" },
    })

    const activeClasses = classes.filter(
      c => new Date(c.startDate) <= new Date() && new Date(c.endDate) >= new Date(),
    ).length

    const totalStudents = classes.reduce((acc, c) => acc + c.enrollments.length, 0)

    const upcomingSessions = classes
      .flatMap(c => c.sessions)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, 3)

    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Xin chào, {user.name}</h1>
          <p className="text-muted-foreground">Đây là trang tổng quan giảng dạy của bạn.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <DashboardCard title="Lớp học đang dạy" value={activeClasses} icon={BookOpen} />
          <DashboardCard title="Tổng số lớp học" value={classes.length} icon={GraduationCap} />
          <DashboardCard title="Tổng số học viên" value={totalStudents} icon={Users} />
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <DashboardCardList
            title="Lớp học của bạn"
            description="Các lớp bạn đang dạy"
            items={classes.slice(0, 5).map(cls => ({
              id: cls.id,
              name: cls.name,
              course: cls.course.title,
              studentCount: cls.enrollments.length,
              link: `/dashboard/classes/${cls.id}`,
            }))}
            type="class"
            className="col-span-4"
          />
          <DashboardCardList
            title="Lịch dạy sắp tới"
            description="Các buổi dạy gần nhất"
            items={upcomingSessions.map(session => ({
              id: session.id,
              name: session.topic || "Buổi học",
              date: formatDate(session.date),
              time: `${session.startTime} - ${session.endTime}`,
              room: session.room || "Chưa cập nhật",
            }))}
            type="session"
            className="col-span-3"
          />
        </div>
      </div>
    )
  }

  return <div>Không tìm thấy vai trò hợp lệ.</div>
}

// ======================== COMPONENTS ========================

function DashboardCard({ title, value, icon: Icon }: { title: string; value: number; icon: React.ElementType }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  )
}

function DashboardCardList({
  title,
  description,
  items,
  type,
  className,
}: {
  title: string
  description: string
  items: any[]
  type: "course" | "class" | "session"
  className?: string
}) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {items.length > 0 ? (
          <div className="space-y-4">
            {items.map((item: any) => (
              <div key={item.id} className="flex items-start justify-between">
                <div>
                  <p className="font-medium">{item.name}</p>
                  {type === "course" && (
                    <p className="text-sm text-muted-foreground">
                      Trạng thái: {item.status === "ACTIVE" ? "Đang học" : item.status === "PENDING" ? "Chờ xác nhận" : item.status === "COMPLETED" ? "Đã hoàn thành" : "Đã hủy"}
                    </p>
                  )}
                  {type === "class" && (
                    <p className="text-sm text-muted-foreground">
                      {item.course} - {item.studentCount} học viên
                    </p>
                  )}
                  {type === "session" && (
                    <p className="text-sm text-muted-foreground">
                      {item.date} ({item.time}) <br />
                      Phòng: {item.room}
                    </p>
                  )}
                </div>
                {item.link && (
                  <Button asChild variant="outline" size="sm">
                    <Link href={item.link}>Xem chi tiết</Link>
                  </Button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">Không có dữ liệu hiển thị</p>
        )}
      </CardContent>
    </Card>
  )
}
