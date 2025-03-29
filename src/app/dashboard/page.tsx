import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { auth } from "@/auth"
import { db } from "@/lib/db"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Calendar, MessageSquare, Clock } from "lucide-react"
import { DashboardWelcome } from "@/components/dashboard/dashboard-welcome"
import { DashboardUpcomingClasses } from "@/components/dashboard/dashboard-upcoming-classes"

export const metadata: Metadata = {
  title: "Dashboard | Language Center",
  description: "Dashboard của Language Center",
}

export default async function DashboardPage() {
  const session = await auth()

  if (!session) {
    redirect("/login")
  }

  const isTeacher = session.user.role === "TEACHER"
  const isStudent = session.user.role === "STUDENT"

  let coursesCount = 0
  let schedulesCount = 0
  let unreadMessagesCount = 0
  let upcomingClasses = []

  if (isTeacher) {
    const teacher = await db.teacher.findFirst({
      where: { userId: session.user.id },
    })

    if (teacher) {
      coursesCount = await db.course.count({
        where: { teacherId: teacher.id },
      })

      schedulesCount = await db.schedule.count({
        where: { teacherId: teacher.id },
      })

      upcomingClasses = await db.schedule.findMany({
        where: {
          teacherId: teacher.id,
          startDate: {
            gte: new Date(),
          },
        },
        include: {
          course: true,
        },
        orderBy: {
          startDate: "asc",
        },
        take: 5,
      })
    }
  }

  if (isStudent) {
    const student = await db.student.findFirst({
      where: { userId: session.user.id },
    })

    if (student) {
      coursesCount = await db.enrollment.count({
        where: { studentId: student.id },
      })

      schedulesCount = await db.enrollment.count({
        where: {
          studentId: student.id,
          status: "Đang học",
        },
      })

      const enrollments = await db.enrollment.findMany({
        where: {
          studentId: student.id,
          status: "Đang học",
        },
        include: {
          schedule: {
            include: {
              course: true,
            },
          },
        },
      })

      upcomingClasses = enrollments.map((enrollment) => enrollment.schedule)
    }
  }

  unreadMessagesCount = await db.message.count({
    where: {
      receiverId: session.user.id,
      read: false,
    },
  })

  return (
    <div className="p-6 space-y-6">
      <DashboardWelcome name={session.user.name} role={session.user.role} />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              {isTeacher ? "Khóa học đang dạy" : "Khóa học đang học"}
            </CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{coursesCount}</div>
            <p className="text-xs text-muted-foreground">
              {isTeacher ? "Số khóa học bạn đang giảng dạy" : "Số khóa học bạn đang tham gia"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{isTeacher ? "Lớp học" : "Lớp đang học"}</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{schedulesCount}</div>
            <p className="text-xs text-muted-foreground">
              {isTeacher ? "Tổng số lớp học của bạn" : "Số lớp học bạn đang tham gia"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Tin nhắn chưa đọc</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{unreadMessagesCount}</div>
            <p className="text-xs text-muted-foreground">Số tin nhắn bạn chưa đọc</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Sắp tới</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{upcomingClasses.length}</div>
            <p className="text-xs text-muted-foreground">{isTeacher ? "Lớp học sắp diễn ra" : "Buổi học sắp tới"}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="col-span-1 md:col-span-2">
          <CardHeader>
            <CardTitle>Lịch học sắp tới</CardTitle>
          </CardHeader>
          <CardContent>
            <DashboardUpcomingClasses classes={upcomingClasses} role={session.user.role} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

