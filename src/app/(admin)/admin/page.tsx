import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { db } from "@/lib/db"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, GraduationCap, Users } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { authOptions } from "@/lib/auth"

export default async function AdminDashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== "ADMIN") {
    redirect("/login")
  }

  // Get counts for dashboard
  const coursesCount = await db.course.count()
  const classesCount = await db.class.count()
  const studentsCount = await db.student.count()
  const teachersCount = await db.teacher.count()
  const enrollmentsCount = await db.enrollment.count()
  const pendingEnrollmentsCount = await db.enrollment.count({
    where: {
      status: "PENDING",
    },
  })

  // Get recent courses
  const recentCourses = await db.course.findMany({
    take: 5,
    orderBy: {
      createdAt: "desc",
    },
    include: {
      teacher: {
        include: {
          user: {
            select: {
              name: true,
            },
          },
        },
      },
      enrollments: true,
    },
  })

  // Get recent enrollments
  const recentEnrollments = await db.enrollment.findMany({
    take: 5,
    orderBy: {
      enrolledAt: "desc",
    },
    include: {
      student: {
        include: {
          user: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      },
      course: true,
    },
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Trang quản trị</h1>
        <p className="text-muted-foreground">Xem tổng quan về trung tâm ngôn ngữ của bạn</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Khóa học</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{coursesCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lớp học</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{classesCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Học viên</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{studentsCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Giáo viên</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{teachersCount}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Khóa học gần đây</CardTitle>
              <CardDescription>Danh sách các khóa học được tạo gần đây</CardDescription>
            </div>
            <Button asChild variant="outline" size="sm">
              <Link href="/admin/courses">Xem tất cả</Link>
            </Button>
          </CardHeader>
          <CardContent>
            {recentCourses.length > 0 ? (
              <div className="space-y-4">
                {recentCourses.map((course) => (
                  <div key={course.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{course.title}</p>
                      <p className="text-sm text-muted-foreground">
                        Giáo viên: {course.teacher?.user.name || "Chưa phân công"} - {course.enrollments.length} học
                        viên
                      </p>
                    </div>
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/admin/courses/${course.id}`}>Xem chi tiết</Link>
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">Chưa có khóa học nào</p>
            )}
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Đăng ký gần đây</CardTitle>
              <CardDescription>Danh sách các đăng ký mới nhất</CardDescription>
            </div>
            <Button asChild variant="outline" size="sm">
              <Link href="/admin/enrollments">Xem tất cả</Link>
            </Button>
          </CardHeader>
          <CardContent>
            {recentEnrollments.length > 0 ? (
              <div className="space-y-4">
                {recentEnrollments.map((enrollment) => (
                  <div key={enrollment.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{enrollment.student.user.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {enrollment.course.title} -{" "}
                        {enrollment.status === "PENDING"
                          ? "Chờ xác nhận"
                          : enrollment.status === "ACTIVE"
                            ? "Đang học"
                            : enrollment.status === "COMPLETED"
                              ? "Đã hoàn thành"
                              : "Đã hủy"}
                      </p>
                    </div>
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/admin/enrollments/${enrollment.id}`}>Xem chi tiết</Link>
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">Chưa có đăng ký nào</p>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Tổng số đăng ký</CardTitle>
            <CardDescription>Số lượng đăng ký khóa học</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{enrollmentsCount}</div>
            <p className="text-sm text-muted-foreground mt-2">Đang chờ xác nhận: {pendingEnrollmentsCount}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

