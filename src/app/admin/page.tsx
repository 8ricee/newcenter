import type { Metadata } from "next"
import { db } from "@/lib/db"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, BookOpen, Calendar, DollarSign } from "lucide-react"
import { AdminOverviewChart } from "@/components/admin/admin-overview-chart"
import { AdminRecentEnrollments } from "@/components/admin/admin-recent-enrollments"

export const metadata: Metadata = {
  title: "Quản trị | Language Center",
  description: "Trang quản trị Language Center",
}

export default async function AdminPage() {
  const studentsCount = await db.user.count({
    where: { role: "STUDENT" },
  })

  const teachersCount = await db.user.count({
    where: { role: "TEACHER" },
  })

  const coursesCount = await db.course.count()

  const schedulesCount = await db.schedule.count()

  const recentEnrollments = await db.enrollment.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    include: {
      student: {
        include: {
          user: true,
        },
      },
      course: true,
      schedule: true,
    },
  })

  // Calculate total revenue
  const paidEnrollments = await db.enrollment.findMany({
    where: { paymentStatus: "Đã thanh toán" },
    include: {
      course: true,
    },
  })

  const totalRevenue = paidEnrollments.reduce((total, enrollment) => {
    return (
      total +
      (enrollment.course.hasPromotion && enrollment.course.promotionPrice
        ? enrollment.course.promotionPrice
        : enrollment.course.price)
    )
  }, 0)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Tổng quan</h1>
        <p className="text-muted-foreground">Xem thông tin tổng quan về Language Center</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Học viên</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{studentsCount}</div>
            <p className="text-xs text-muted-foreground">
              +{Math.floor(Math.random() * 10)} học viên mới trong tuần này
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Khóa học</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{coursesCount}</div>
            <p className="text-xs text-muted-foreground">
              +{Math.floor(Math.random() * 3)} khóa học mới trong tháng này
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Lớp học</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{schedulesCount}</div>
            <p className="text-xs text-muted-foreground">{Math.floor(Math.random() * 5)} lớp học đang diễn ra</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Doanh thu</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalRevenue.toLocaleString("vi-VN")} đ</div>
            <p className="text-xs text-muted-foreground">+{Math.floor(Math.random() * 10)}% so với tháng trước</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Thống kê đăng ký</CardTitle>
          </CardHeader>
          <CardContent>
            <AdminOverviewChart />
          </CardContent>
        </Card>
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Đăng ký gần đây</CardTitle>
          </CardHeader>
          <CardContent>
            <AdminRecentEnrollments enrollments={recentEnrollments} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

