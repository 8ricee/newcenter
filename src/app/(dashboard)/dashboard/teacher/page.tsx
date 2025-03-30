import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search } from 'lucide-react'
import { authOptions } from "@/lib/auth"

export default async function TeachersPage() {
    const session = await getServerSession(authOptions)

    if (!session) {
        redirect("/login")
    }

    // Giả lập dữ liệu giáo viên
    const teachers = [
        {
            id: 1,
            name: "Nguyễn Thị Minh",
            avatar: "/placeholder.svg?height=100&width=100",
            email: "minh.nguyen@example.com",
            phone: "0912345678",
            specialization: ["Tiếng Anh giao tiếp", "IELTS"],
            experience: "8 năm",
            rating: 4.9,
            reviewCount: 124,
            bio: "Tốt nghiệp Đại học Sư phạm Hà Nội, chuyên ngành Ngôn ngữ Anh. Có chứng chỉ TESOL và 8 năm kinh nghiệm giảng dạy tiếng Anh cho mọi lứa tuổi.",
            availability: "Thứ 2 - Thứ 6",
        },
        {
            id: 2,
            name: "Trần Văn Hùng",
            avatar: "/placeholder.svg?height=100&width=100",
            email: "hung.tran@example.com",
            phone: "0923456789",
            specialization: ["Tiếng Nhật", "JLPT"],
            experience: "6 năm",
            rating: 4.7,
            reviewCount: 98,
            bio: "Tốt nghiệp Đại học Ngoại ngữ Tokyo, Nhật Bản. Có chứng chỉ JLPT N1 và 6 năm kinh nghiệm giảng dạy tiếng Nhật tại các trung tâm ngoại ngữ.",
            availability: "Thứ 3 - Thứ 7",
        },
        {
            id: 3,
            name: "Lê Thị Hương",
            avatar: "/placeholder.svg?height=100&width=100",
            email: "huong.le@example.com",
            phone: "0934567890",
            specialization: ["IELTS", "TOEFL", "Tiếng Anh học thuật"],
            experience: "10 năm",
            rating: 4.8,
            reviewCount: 156,
            bio: "Tốt nghiệp Thạc sĩ Ngôn ngữ học tại Đại học Oxford, Anh Quốc. Có chứng chỉ CELTA và 10 năm kinh nghiệm giảng dạy IELTS và TOEFL.",
            availability: "Thứ 2 - Chủ nhật",
        },
        {
            id: 4,
            name: "Phạm Văn Đức",
            avatar: "/placeholder.svg?height=100&width=100",
            email: "duc.pham@example.com",
            phone: "0945678901",
            specialization: ["Tiếng Hàn", "TOPIK"],
            experience: "5 năm",
            rating: 4.6,
            reviewCount: 87,
            bio: "Tốt nghiệp Đại học Seoul, Hàn Quốc. Có chứng chỉ TOPIK cấp 6 và 5 năm kinh nghiệm giảng dạy tiếng Hàn cho người Việt.",
            availability: "Thứ 4 - Chủ nhật",
        },
        {
            id: 5,
            name: "Hoàng Thị Lan",
            avatar: "/placeholder.svg?height=100&width=100",
            email: "lan.hoang@example.com",
            phone: "0956789012",
            specialization: ["Tiếng Pháp", "DELF", "DALF"],
            experience: "7 năm",
            rating: 4.7,
            reviewCount: 92,
            bio: "Tốt nghiệp Đại học Sorbonne, Pháp. Có chứng chỉ DALF C2 và 7 năm kinh nghiệm giảng dạy tiếng Pháp cho mọi đối tượng.",
            availability: "Thứ 2 - Thứ 6",
        },
        {
            id: 6,
            name: "Vũ Đình Tuấn",
            avatar: "/placeholder.svg?height=100&width=100",
            email: "tuan.vu@example.com",
            phone: "0967890123",
            specialization: ["Tiếng Trung", "HSK"],
            experience: "9 năm",
            rating: 4.8,
            reviewCount: 118,
            bio: "Tốt nghiệp Đại học Bắc Kinh, Trung Quốc. Có chứng chỉ HSK cấp 6 và 9 năm kinh nghiệm giảng dạy tiếng Trung cho người Việt.",
            availability: "Thứ 3 - Chủ nhật",
        },
    ]

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Giáo viên</h1>
                    <p className="text-muted-foreground">
                        Danh sách giáo viên và thông tin chi tiết.
                    </p>
                </div>
                <div className="relative w-full sm:w-64">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Tìm kiếm giáo viên..."
                        className="w-full pl-8"
                    />
                </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {teachers.map((teacher) => (
                    <Card key={teacher.id} className="overflow-hidden">
                        <CardHeader className="pb-3">
                            <div className="flex items-center gap-4">
                                <Avatar className="h-12 w-12">
                                    <AvatarImage src={teacher.avatar} alt={teacher.name} />
                                    <AvatarFallback>
                                        {teacher.name.split(" ").map(n => n[0]).join("").toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <CardTitle className="text-lg">{teacher.name}</CardTitle>
                                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                        <span className="text-yellow-500">★</span>
                                        <span>{teacher.rating}</span>
                                        <span>({teacher.reviewCount} đánh giá)</span>
                                    </div>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="pb-3">
                            <div className="space-y-4">
                                <div>
                                    <p className="text-sm text-muted-foreground mb-2">Chuyên môn:</p>
                                    <div className="flex flex-wrap gap-2">
                                        {teacher.specialization.map((spec, index) => (
                                            <Badge key={index} variant="secondary">{spec}</Badge>
                                        ))}
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-2 text-sm">
                                    <div>
                                        <p className="text-muted-foreground">Kinh nghiệm</p>
                                        <p className="font-medium">{teacher.experience}</p>
                                    </div>
                                    <div>
                                        <p className="text-muted-foreground">Lịch dạy</p>
                                        <p className="font-medium">{teacher.availability}</p>
                                    </div>
                                </div>
                                <p className="text-sm line-clamp-3">{teacher.bio}</p>
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-between">
                            <Button variant="outline">Xem hồ sơ</Button>
                            <Button>Đặt lịch học</Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    )
}
