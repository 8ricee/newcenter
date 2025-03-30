import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { getCurrentUserProfile } from "@/lib/actions/user"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ProfileForm } from "@/components/dashboard/profile-form"
import { authOptions } from "@/lib/auth"

export default async function ProfilePage() {
    const session = await getServerSession(authOptions)

    if (!session) {
        redirect("/login")
    }

    const { user, error } = await getCurrentUserProfile()

    if (error) {
        return (
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Hồ sơ cá nhân</h1>
                    <p className="text-muted-foreground">Quản lý thông tin cá nhân của bạn</p>
                </div>
                <Card>
                    <CardHeader>
                        <CardTitle>Lỗi</CardTitle>
                        <CardDescription>Không thể tải thông tin người dùng</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p>{error}</p>
                    </CardContent>
                </Card>
            </div>
        )
    }

    if (!user) {
        return (
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Hồ sơ cá nhân</h1>
                    <p className="text-muted-foreground">Quản lý thông tin cá nhân của bạn</p>
                </div>
                <Card>
                    <CardHeader>
                        <CardTitle>Lỗi</CardTitle>
                        <CardDescription>Không tìm thấy thông tin người dùng</CardDescription>
                    </CardHeader>
                </Card>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Hồ sơ cá nhân</h1>
                <p className="text-muted-foreground">Quản lý thông tin cá nhân của bạn</p>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Thông tin cá nhân</CardTitle>
                    <CardDescription>Cập nhật thông tin cá nhân của bạn</CardDescription>
                </CardHeader>
                <CardContent>
                    <ProfileForm user={user} />
                </CardContent>
            </Card>
        </div>
    )
}

