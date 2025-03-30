import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { authOptions } from "@/lib/auth"

const courses = [
    {
        id: 1,
        title: "Tiếng Anh giao tiếp cơ bản",
        description: "Khóa học dành cho người mới bắt đầu, tập trung vào kỹ năng giao tiếp hàng ngày.",
        level: "Cơ bản",
        duration: "3 tháng",
        lessons: 36,
        progress: 75,
        status: "active",
    },
    {
        id: 2,
        title: "Tiếng Nhật N5",
        description: "Khóa học tiếng Nhật cho người mới bắt đầu, chuẩn bị cho kỳ thi JLPT N5.",
        level: "Cơ bản",
        duration: "4 tháng",
        lessons: 48,
        progress: 40,
        status: "active",
    },
    {
        id: 3,
        title: "IELTS 6.5+",
        description: "Khóa học luyện thi IELTS chuyên sâu, hướng đến band điểm 6.5 trở lên.",
        level: "Nâng cao",
        duration: "6 tháng",
        lessons: 72,
        progress: 20,
        status: "active",
    },
    {
        id: 4,
        title: "Tiếng Hàn sơ cấp",
        description: "Khóa học tiếng Hàn dành cho người mới bắt đầu, tập trung vào giao tiếp cơ bản.",
        level: "Cơ bản",
        duration: "3 tháng",
        lessons: 36,
        progress: 0,
        status: "upcoming",
    },
]

export default async function CoursesPage() {
    const session = await getServerSession(authOptions)

    if (!session) {
        redirect("/login")
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Khóa học</h1>
                    <p className="text-muted-foreground">Quản lý các khóa học của bạn và theo dõi tiến độ học tập.</p>
                </div>
                <Button asChild>
                    <Link href="/dashboard/courses/browse">Tìm khóa học mới</Link>
                </Button>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {courses.map((course) => (
                    <Card key={course.id} className="overflow-hidden">
                        <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                                <CardTitle className="line-clamp-1">{course.title}</CardTitle>
                                <Badge variant={course.status === "active" ? "default" : "secondary"}>
                                    {course.status === "active" ? "Đang học" : "Sắp tới"}
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="pb-3">
                            <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{course.description}</p>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                                <div>
                                    <div className="text-muted-foreground">Cấp độ</div>
                                    <div className="font-medium">{course.level}</div>
                                </div>
                                <div>
                                    <div className="text-muted-foreground">Thời lượng</div>
                                    <div className="font-medium">{course.duration}</div>
                                </div>
                                <div>
                                    <div className="text-muted-foreground">Số buổi học</div>
                                    <div className="font-medium">{course.lessons} buổi</div>
                                </div>
                                <div>
                                    <div className="text-muted-foreground">Tiến độ</div>
                                    <div className="font-medium">{course.progress}%</div>
                                </div>
                            </div>
                            {course.status === "active" && (
                                <div className="mt-4">
                                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                                        <div className="h-full bg-primary" style={{ width: `${course.progress}%` }} />
                                    </div>
                                </div>
                            )}
                        </CardContent>
                        <CardFooter>
                            <Button asChild className="w-full">
                                <Link href={`/dashboard/courses/${course.id}`}>
                                    {course.status === "active" ? "Tiếp tục học" : "Xem chi tiết"}
                                </Link>
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    )
}

