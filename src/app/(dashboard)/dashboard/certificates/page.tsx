import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Download, Award, Clock } from 'lucide-react'
import Image from "next/image"
import { authOptions } from "@/lib/auth"

export default async function CertificatesPage() {
    const session = await getServerSession(authOptions)

    if (!session) {
        redirect("/login")
    }

    // Giả lập dữ liệu chứng chỉ
    const certificates = [
        {
            id: 1,
            name: "Chứng chỉ hoàn thành khóa học Tiếng Anh giao tiếp cơ bản",
            issueDate: "2024-12-15",
            expiryDate: null,
            issuer: "Trung tâm Ngoại ngữ",
            credentialId: "CERT-ENG-2024-001",
            course: "Tiếng Anh giao tiếp cơ bản",
            grade: "Xuất sắc",
            status: "issued",
            downloadUrl: "#",
            image: "/placeholder.svg?height=200&width=300",
        },
        {
            id: 2,
            name: "Chứng chỉ JLPT N5",
            issueDate: "2024-09-20",
            expiryDate: null,
            issuer: "Japan Foundation",
            credentialId: "JLPT-N5-2024-12345",
            course: "Tiếng Nhật N5",
            grade: "Đạt",
            status: "issued",
            downloadUrl: "#",
            image: "/placeholder.svg?height=200&width=300",
        },
        {
            id: 3,
            name: "Chứng chỉ IELTS",
            issueDate: null,
            expiryDate: null,
            issuer: "British Council",
            credentialId: "Đang chờ",
            course: "IELTS 6.5+",
            grade: "Đang chờ",
            status: "pending",
            downloadUrl: null,
            image: "/placeholder.svg?height=200&width=300",
        },
    ]

    const formatDate = (dateString: string | null) => {
        if (!dateString) return "Không giới hạn";
        return new Date(dateString).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Chứng chỉ</h1>
                <p className="text-muted-foreground">
                    Quản lý các chứng chỉ và thành tích học tập của bạn.
                </p>
            </div>

            <Tabs defaultValue="issued" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="issued">Đã cấp</TabsTrigger>
                    <TabsTrigger value="pending">Đang chờ</TabsTrigger>
                </TabsList>

                <TabsContent value="issued" className="mt-6">
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {certificates
                            .filter(cert => cert.status === "issued")
                            .map((certificate) => (
                                <Card key={certificate.id} className="overflow-hidden">
                                    <div className="aspect-[3/2] relative">
                                        <Image
                                            src={certificate.image || "/placeholder.svg"}
                                            alt={certificate.name}
                                            className="object-cover w-full h-full"
                                            width={40} height={40}
                                        />
                                        <div className="absolute top-2 right-2">
                                            <Badge className="bg-green-500 hover:bg-green-600">Đã cấp</Badge>
                                        </div>
                                    </div>
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-lg">{certificate.name}</CardTitle>
                                        <CardDescription>{certificate.course}</CardDescription>
                                    </CardHeader>
                                    <CardContent className="pb-2">
                                        <div className="grid grid-cols-2 gap-2 text-sm">
                                            <div>
                                                <p className="text-muted-foreground">Ngày cấp</p>
                                                <p className="font-medium">{formatDate(certificate.issueDate)}</p>
                                            </div>
                                            <div>
                                                <p className="text-muted-foreground">Đơn vị cấp</p>
                                                <p className="font-medium">{certificate.issuer}</p>
                                            </div>
                                            <div>
                                                <p className="text-muted-foreground">Mã chứng chỉ</p>
                                                <p className="font-medium">{certificate.credentialId}</p>
                                            </div>
                                            <div>
                                                <p className="text-muted-foreground">Xếp loại</p>
                                                <p className="font-medium">{certificate.grade}</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                    <CardFooter>
                                        <Button className="w-full" variant="outline">
                                            <Download className="mr-2 h-4 w-4" />
                                            Tải xuống
                                        </Button>
                                    </CardFooter>
                                </Card>
                            ))}
                    </div>
                </TabsContent>  

                <TabsContent value="pending" className="mt-6">
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {certificates
                            .filter(cert => cert.status === "pending")
                            .map((certificate) => (
                                <Card key={certificate.id} className="overflow-hidden">
                                    <div className="aspect-[3/2] relative bg-muted flex items-center justify-center">
                                        <Clock className="h-16 w-16 text-muted-foreground/50" />
                                        <div className="absolute top-2 right-2">
                                            <Badge variant="outline">Đang chờ</Badge>
                                        </div>
                                    </div>
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-lg">{certificate.name}</CardTitle>
                                        <CardDescription>{certificate.course}</CardDescription>
                                    </CardHeader>
                                    <CardContent className="pb-2">
                                        <div className="grid grid-cols-2 gap-2 text-sm">
                                            <div>
                                                <p className="text-muted-foreground">Ngày cấp dự kiến</p>
                                                <p className="font-medium">Đang chờ kết quả</p>
                                            </div>
                                            <div>
                                                <p className="text-muted-foreground">Đơn vị cấp</p>
                                                <p className="font-medium">{certificate.issuer}</p>
                                            </div>
                                            <div>
                                                <p className="text-muted-foreground">Mã chứng chỉ</p>
                                                <p className="font-medium">{certificate.credentialId}</p>
                                            </div>
                                            <div>
                                                <p className="text-muted-foreground">Trạng thái</p>
                                                <p className="font-medium">Đang xử lý</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                    <CardFooter>
                                        <Button className="w-full" variant="outline" disabled>
                                            <Clock className="mr-2 h-4 w-4" />
                                            Đang chờ cấp
                                        </Button>
                                    </CardFooter>
                                </Card>
                            ))}
                    </div>
                </TabsContent>
            </Tabs>

            <Card>
                <CardHeader>
                    <CardTitle>Thông tin về chứng chỉ</CardTitle>
                    <CardDescription>
                        Hiểu về các chứng chỉ và cách sử dụng chúng.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <h3 className="text-lg font-medium">Chứng chỉ là gì?</h3>
                        <p className="text-sm text-muted-foreground">
                            Chứng chỉ là văn bản xác nhận bạn đã hoàn thành một khóa học hoặc đạt được một trình độ nhất định trong một lĩnh vực cụ thể. Chứng chỉ có thể được sử dụng để chứng minh kỹ năng và kiến thức của bạn với nhà tuyển dụng hoặc các tổ chức giáo dục.
                        </p>
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-lg font-medium">Cách sử dụng chứng chỉ</h3>
                        <p className="text-sm text-muted-foreground">
                            Bạn có thể tải xuống chứng chỉ dưới dạng PDF để in hoặc chia sẻ trực tuyến. Mỗi chứng chỉ đều có mã xác thực duy nhất để người khác có thể xác minh tính xác thực của chứng chỉ.
                        </p>
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-lg font-medium">Xác minh chứng chỉ</h3>
                        <p className="text-sm text-muted-foreground">
                            Để xác minh một chứng chỉ, người nhận có thể sử dụng mã chứng chỉ và truy cập vào trang xác minh chứng chỉ trên website của chúng tôi.
                        </p>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button variant="outline">
                        <Award className="mr-2 h-4 w-4" />
                        Tìm hiểu thêm về chứng chỉ
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}
