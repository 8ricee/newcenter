import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { CheckCircle2, Clock, FileText, PlayCircle, Users, Download } from 'lucide-react'
import Link from "next/link"
import Image from "next/image"
import { authOptions } from "@/lib/auth"

interface CoursePageProps {
    params: {
        id: string
    }
}

export default async function CoursePage({ params }: CoursePageProps) {
    const session = await getServerSession(authOptions)

    if (!session) {
        redirect("/login")
    }

    const courseId = parseInt(params.id)

    // Giả lập dữ liệu khóa học
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
            image: "/placeholder.svg?height=300&width=600",
            teacher: {
                id: 101,
                name: "Nguyễn Thị Minh",
                avatar: "/placeholder.svg?height=100&width=100",
                bio: "Tốt nghiệp Đại học Sư phạm Hà Nội, chuyên ngành Ngôn ngữ Anh. Có chứng chỉ TESOL và 8 năm kinh nghiệm giảng dạy tiếng Anh cho mọi lứa tuổi.",
            },
            schedule: [
                { day: "Thứ 2", time: "18:00 - 20:00", room: "A101" },
                { day: "Thứ 4", time: "18:00 - 20:00", room: "A101" },
            ],
            modules: [
                {
                    id: 1,
                    title: "Giới thiệu và chào hỏi",
                    lessons: [
                        { id: 1, title: "Chào hỏi và giới thiệu bản thân", duration: "45 phút", completed: true },
                        { id: 2, title: "Hỏi thông tin cá nhân", duration: "45 phút", completed: true },
                        { id: 3, title: "Nói về sở thích", duration: "45 phút", completed: true },
                    ],
                },
                {
                    id: 2,
                    title: "Cuộc sống hàng ngày",
                    lessons: [
                        { id: 4, title: "Nói về thói quen hàng ngày", duration: "45 phút", completed: true },
                        { id: 5, title: "Mô tả công việc", duration: "45 phút", completed: true },
                        { id: 6, title: "Kể về một ngày điển hình", duration: "45 phút", completed: false },
                    ],
                },
                {
                    id: 3,
                    title: "Mua sắm và dịch vụ",
                    lessons: [
                        { id: 7, title: "Từ vựng về mua sắm", duration: "45 phút", completed: false },
                        { id: 8, title: "Hỏi giá và mặc cả", duration: "45 phút", completed: false },
                        { id: 9, title: "Đặt phòng khách sạn", duration: "45 phút", completed: false },
                    ],
                },
            ],
            materials: [
                { id: 1, title: "Sách giáo trình", type: "pdf", size: "15MB", url: "#" },
                { id: 2, title: "Bài tập về nhà", type: "pdf", size: "5MB", url: "#" },
                { id: 3, title: "Tài liệu tham khảo", type: "pdf", size: "10MB", url: "#" },
                { id: 4, title: "Bảng từ vựng", type: "xlsx", size: "2MB", url: "#" },
            ],
            classmates: [
                { id: 201, name: "Trần Văn A", avatar: "/placeholder.svg?height=40&width=40" },
                { id: 202, name: "Lê Thị B", avatar: "/placeholder.svg?height=40&width=40" },
                { id: 203, name: "Phạm Văn C", avatar: "/placeholder.svg?height=40&width=40" },
                { id: 204, name: "Hoàng Thị D", avatar: "/placeholder.svg?height=40&width=40" },
                { id: 205, name: "Nguyễn Văn E", avatar: "/placeholder.svg?height=40&width=40" },
                { id: 206, name: "Vũ Thị F", avatar: "/placeholder.svg?height=40&width=40" },
                { id: 207, name: "Đỗ Văn G", avatar: "/placeholder.svg?height=40&width=40" },
                { id: 208, name: "Ngô Thị H", avatar: "/placeholder.svg?height=40&width=40" },
            ],
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
            image: "/placeholder.svg?height=300&width=600",
            teacher: {
                id: 102,
                name: "Trần Văn Hùng",
                avatar: "/placeholder.svg?height=100&width=100",
                bio: "Tốt nghiệp Đại học Ngoại ngữ Tokyo, Nhật Bản. Có chứng chỉ JLPT N1 và 6 năm kinh nghiệm giảng dạy tiếng Nhật tại các trung tâm ngoại ngữ.",
            },
            schedule: [
                { day: "Thứ 6", time: "19:00 - 21:00", room: "B203" },
            ],
            modules: [
                {
                    id: 1,
                    title: "Bảng chữ cái Hiragana và Katakana",
                    lessons: [
                        { id: 1, title: "Hiragana cơ bản", duration: "45 phút", completed: true },
                        { id: 2, title: "Katakana cơ bản", duration: "45 phút", completed: true },
                        { id: 3, title: "Luyện viết và đọc", duration: "45 phút", completed: true },
                    ],
                },
                {
                    id: 2,
                    title: "Ngữ pháp cơ bản",
                    lessons: [
                        { id: 4, title: "Cấu trúc câu cơ bản", duration: "45 phút", completed: true },
                        { id: 5, title: "Từ chỉ định và đại từ", duration: "45 phút", completed: false },
                        { id: 6, title: "Động từ nhóm 1", duration: "45 phút", completed: false },
                    ],
                },
                {
                    id: 3,
                    title: "Giao tiếp hàng ngày",
                    lessons: [
                        { id: 7, title: "Chào hỏi và giới thiệu", duration: "45 phút", completed: false },
                        { id: 8, title: "Mua sắm", duration: "45 phút", completed: false },
                        { id: 9, title: "Hỏi đường", duration: "45 phút", completed: false },
                    ],
                },
            ],
            materials: [
                { id: 1, title: "Minna no Nihongo", type: "pdf", size: "20MB", url: "#" },
                { id: 2, title: "Bảng chữ cái", type: "pdf", size: "3MB", url: "#" },
                { id: 3, title: "Bài tập về nhà", type: "pdf", size: "8MB", url: "#" },
                { id: 4, title: "Từ vựng N5", type: "xlsx", size: "2MB", url: "#" },
            ],
            classmates: [
                { id: 201, name: "Trần Văn A", avatar: "/placeholder.svg?height=40&width=40" },
                { id: 202, name: "Lê Thị B", avatar: "/placeholder.svg?height=40&width=40" },
                { id: 203, name: "Phạm Văn C", avatar: "/placeholder.svg?height=40&width=40" },
                { id: 204, name: "Hoàng Thị D", avatar: "/placeholder.svg?height=40&width=40" },
            ],
        },
    ]

    const course = courses.find(c => c.id === courseId)

    if (!course) {
        redirect("/dashboard/courses")
    }

    const completedLessons = course.modules.reduce(
        (count, module) => count + module.lessons.filter(lesson => lesson.completed).length,
        0
    )

    const totalLessons = course.modules.reduce(
        (count, module) => count + module.lessons.length,
        0
    )

    const progress = Math.round((completedLessons / totalLessons) * 100)

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">{course.title}</h1>
                    <p className="text-muted-foreground">{course.description}</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" asChild>
                        <Link href="/dashboard/courses">Quay lại</Link>
                    </Button>
                    <Button>
                        <PlayCircle className="mr-2 h-4 w-4" />
                        Tiếp tục học
                    </Button>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-[2fr_1fr]">
                <div className="space-y-6">
                    <Card>
                        <div className="aspect-video relative">
                            <Image
                                src={course.image || "/placeholder.svg"}
                                alt={course.title}
                                className="object-cover w-full h-full"
                            />
                            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                                <Button size="lg" className="gap-2">
                                    <PlayCircle className="h-5 w-5" />
                                    Xem giới thiệu khóa học
                                </Button>
                            </div>
                        </div>
                        <CardContent className="pt-6">
                            <div className="space-y-4">
                                <div>
                                    <h2 className="text-xl font-semibold">Thông tin khóa học</h2>
                                    <Separator className="my-2" />
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                        <div>
                                            <p className="text-muted-foreground">Cấp độ</p>
                                            <p className="font-medium">{course.level}</p>
                                        </div>
                                        <div>
                                            <p className="text-muted-foreground">Thời lượng</p>
                                            <p className="font-medium">{course.duration}</p>
                                        </div>
                                        <div>
                                            <p className="text-muted-foreground">Số buổi học</p>
                                            <p className="font-medium">{course.lessons} buổi</p>
                                        </div>
                                        <div>
                                            <p className="text-muted-foreground">Tiến độ</p>
                                            <p className="font-medium">{progress}%</p>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h2 className="text-xl font-semibold">Giáo viên</h2>
                                    <Separator className="my-2" />
                                    <div className="flex items-start gap-4">
                                        <Avatar className="h-12 w-12">
                                            <AvatarImage src={course.teacher.avatar} alt={course.teacher.name} />
                                            <AvatarFallback>
                                                {course.teacher.name.split(" ").map(n => n[0]).join("").toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="font-medium">{course.teacher.name}</p>
                                            <p className="text-sm text-muted-foreground">{course.teacher.bio}</p>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h2 className="text-xl font-semibold">Lịch học</h2>
                                    <Separator className="my-2" />
                                    <div className="space-y-2">
                                        {course.schedule.map((schedule, index) => (
                                            <div key={index} className="flex items-center justify-between p-2 rounded-md border">
                                                <div className="flex items-center gap-2">
                                                    <Clock className="h-4 w-4 text-muted-foreground" />
                                                    <span>{schedule.day}, {schedule.time}</span>
                                                </div>
                                                <div className="text-sm text-muted-foreground">Phòng: {schedule.room}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Nội dung khóa học</CardTitle>
                            <CardDescription>
                                {totalLessons} bài học • {completedLessons} bài đã hoàn thành
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {course.modules.map((module) => {
                                const moduleCompletedLessons = module.lessons.filter(lesson => lesson.completed).length
                                const moduleProgress = Math.round((moduleCompletedLessons / module.lessons.length) * 100)

                                return (
                                    <div key={module.id} className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <h3 className="font-medium">{module.title}</h3>
                                            <span className="text-sm text-muted-foreground">
                                                {moduleCompletedLessons}/{module.lessons.length} bài học
                                            </span>
                                        </div>
                                        <div className="h-2 rounded-full bg-muted overflow-hidden">
                                            <div
                                                className="h-full bg-primary"
                                                style={{ width: `${moduleProgress}%` }}
                                            />
                                        </div>
                                        <div className="space-y-1 mt-2">
                                            {module.lessons.map((lesson) => (
                                                <div
                                                    key={lesson.id}
                                                    className="flex items-center justify-between p-2 rounded-md hover:bg-muted"
                                                >
                                                    <div className="flex items-center gap-2">
                                                        {lesson.completed ? (
                                                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                                                        ) : (
                                                            <Clock className="h-4 w-4 text-muted-foreground" />
                                                        )}
                                                        <span className={lesson.completed ? "text-muted-foreground" : ""}>
                                                            {lesson.title}
                                                        </span>
                                                    </div>
                                                    <div className="text-sm text-muted-foreground">{lesson.duration}</div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )
                            })}
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Tiến độ học tập</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex flex-col items-center gap-2">
                                <div className="relative h-32 w-32">
                                    <svg className="h-full w-full" viewBox="0 0 100 100">
                                        <circle
                                            className="text-muted stroke-current"
                                            strokeWidth="10"
                                            fill="transparent"
                                            r="40"
                                            cx="50"
                                            cy="50"
                                        />
                                        <circle
                                            className="text-primary stroke-current"
                                            strokeWidth="10"
                                            strokeLinecap="round"
                                            fill="transparent"
                                            r="40"
                                            cx="50"
                                            cy="50"
                                            strokeDasharray={`${progress * 2.51} 251`}
                                            strokeDashoffset="0"
                                            transform="rotate(-90 50 50)"
                                        />
                                    </svg>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <span className="text-2xl font-bold">{progress}%</span>
                                    </div>
                                </div>
                                <p className="text-center text-sm text-muted-foreground">
                                    {completedLessons} / {totalLessons} bài học đã hoàn thành
                                </p>
                            </div>
                            <Button className="w-full">Tiếp tục học</Button>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Tài liệu học tập</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            {course.materials.map((material) => (
                                <div
                                    key={material.id}
                                    className="flex items-center justify-between p-2 rounded-md hover:bg-muted"
                                >
                                    <div className="flex items-center gap-2">
                                        <FileText className="h-4 w-4 text-muted-foreground" />
                                        <span>{material.title}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs text-muted-foreground">{material.size}</span>
                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                            <Download className="h-4 w-4" />
                                            <span className="sr-only">Tải xuống</span>
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Học viên trong lớp</CardTitle>
                            <CardDescription>
                                {course.classmates.length} học viên đang tham gia khóa học này
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-wrap gap-2">
                                {course.classmates.map((classmate) => (
                                    <Avatar key={classmate.id} className="h-10 w-10">
                                        <AvatarImage src={classmate.avatar} alt={classmate.name} />
                                        <AvatarFallback>
                                            {classmate.name.split(" ").map(n => n[0]).join("").toUpperCase()}
                                        </AvatarFallback>
                                        <span className="sr-only">{classmate.name}</span>
                                    </Avatar>
                                ))}
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button variant="outline" className="w-full" asChild>
                                <Link href="#">
                                    <Users className="mr-2 h-4 w-4" />
                                    Xem tất cả học viên
                                </Link>
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </div>
    )
}
