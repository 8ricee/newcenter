import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { authOptions } from "@/lib/auth"

export default async function SchedulePage() {
    const session = await getServerSession(authOptions)

    if (!session) {
        redirect("/login")
    }

    // Giả lập dữ liệu lịch học
    const schedules = [
        {
            id: 1,
            day: "Thứ 2",
            date: "2025-03-31",
            time: "18:00 - 20:00",
            course: "Tiếng Anh giao tiếp cơ bản",
            teacher: "Nguyễn Thị Minh",
            room: "A101",
        },
        {
            id: 2,
            day: "Thứ 4",
            date: "2025-04-02",
            time: "18:00 - 20:00",
            course: "Tiếng Anh giao tiếp cơ bản",
            teacher: "Nguyễn Thị Minh",
            room: "A101",
        },
        {
            id: 3,
            day: "Thứ 6",
            date: "2025-04-04",
            time: "19:00 - 21:00",
            course: "Tiếng Nhật N5",
            teacher: "Trần Văn Hùng",
            room: "B203",
        },
        {
            id: 4,
            day: "Thứ 7",
            date: "2025-04-05",
            time: "08:00 - 11:30",
            course: "IELTS 6.5+",
            teacher: "Lê Thị Hương",
            room: "C305",
        },
    ]

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Lịch học</h1>
                <p className="text-muted-foreground">Xem lịch học của bạn và quản lý thời gian học tập.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-1">
                <Card>
                    <CardHeader>
                        <CardTitle>Lịch học sắp tới</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {schedules.map((schedule) => (
                                <div
                                    key={schedule.id}
                                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-lg border p-4"
                                >
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <h4 className="font-semibold">{schedule.course}</h4>
                                            <Badge variant="outline">{schedule.day}</Badge>
                                        </div>
                                        <p className="text-sm text-muted-foreground">Giáo viên: {schedule.teacher}</p>
                                    </div>
                                    <div className="flex flex-col sm:items-end gap-1">
                                        <div className="font-medium">{schedule.time}</div>
                                        <div className="text-sm text-muted-foreground">Phòng: {schedule.room}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
                {/* <Card>
                    <CardHeader>
                        <CardTitle>Lịch tháng</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="mt-4 space-y-2">
                            <div className="flex items-center gap-2">
                                <div className="h-3 w-3 rounded-full bg-primary" />
                                <span className="text-sm">Tiếng Anh giao tiếp cơ bản</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="h-3 w-3 rounded-full bg-green-500" />
                                <span className="text-sm">Tiếng Nhật N5</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="h-3 w-3 rounded-full bg-yellow-500" />
                                <span className="text-sm">IELTS 6.5+</span>
                            </div>
                        </div>
                    </CardContent>
                </Card> */}
            </div>
        </div>
    )
}

