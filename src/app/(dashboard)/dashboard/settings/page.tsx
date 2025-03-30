import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { authOptions } from "@/lib/auth"

export default async function SettingsPage() {
    const session = await getServerSession(authOptions)

    if (!session) {
        redirect("/login")
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Cài đặt</h1>
                <p className="text-muted-foreground">
                    Quản lý cài đặt tài khoản và tùy chọn của bạn.
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Thông báo</CardTitle>
                    <CardDescription>
                        Cấu hình cách bạn nhận thông báo từ hệ thống.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label htmlFor="email-notifications">Thông báo qua email</Label>
                            <p className="text-sm text-muted-foreground">
                                Nhận thông báo về khóa học, lịch học và tin nhắn qua email.
                            </p>
                        </div>
                        <Switch id="email-notifications" defaultChecked />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label htmlFor="marketing-emails">Email quảng cáo</Label>
                            <p className="text-sm text-muted-foreground">
                                Nhận thông tin về khóa học mới, khuyến mãi và sự kiện.
                            </p>
                        </div>
                        <Switch id="marketing-emails" />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label htmlFor="reminder-notifications">Nhắc nhở lịch học</Label>
                            <p className="text-sm text-muted-foreground">
                                Nhận thông báo nhắc nhở trước khi buổi học bắt đầu.
                            </p>
                        </div>
                        <Switch id="reminder-notifications" defaultChecked />
                    </div>
                </CardContent>
                <CardFooter>
                    <Button>Lưu cài đặt</Button>
                </CardFooter>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Hiển thị</CardTitle>
                    <CardDescription>
                        Tùy chỉnh giao diện người dùng.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label htmlFor="dark-mode">Chế độ tối</Label>
                            <p className="text-sm text-muted-foreground">
                                Sử dụng giao diện tối cho ứng dụng.
                            </p>
                        </div>
                        <Switch id="dark-mode" />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label htmlFor="compact-view">Chế độ xem gọn</Label>
                            <p className="text-sm text-muted-foreground">
                                Hiển thị nhiều nội dung hơn trên mỗi trang.
                            </p>
                        </div>
                        <Switch id="compact-view" />
                    </div>
                </CardContent>
                <CardFooter>
                    <Button>Lưu cài đặt</Button>
                </CardFooter>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Ngôn ngữ và khu vực</CardTitle>
                    <CardDescription>
                        Cài đặt ngôn ngữ và định dạng thời gian.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="language">Ngôn ngữ</Label>
                        <select
                            id="language"
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            defaultValue="vi"
                        >
                            <option value="vi">Tiếng Việt</option>
                            <option value="en">English</option>
                            <option value="ja">日本語</option>
                            <option value="ko">한국어</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="timezone">Múi giờ</Label>
                        <select
                            id="timezone"
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            defaultValue="Asia/Ho_Chi_Minh"
                        >
                            <option value="Asia/Ho_Chi_Minh">Hồ Chí Minh (GMT+7)</option>
                            <option value="Asia/Bangkok">Bangkok (GMT+7)</option>
                            <option value="Asia/Tokyo">Tokyo (GMT+9)</option>
                            <option value="America/New_York">New York (GMT-4)</option>
                            <option value="Europe/London">London (GMT+1)</option>
                        </select>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button>Lưu cài đặt</Button>
                </CardFooter>
            </Card>
        </div>
    )
}
