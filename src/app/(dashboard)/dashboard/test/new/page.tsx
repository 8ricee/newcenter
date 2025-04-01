import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { NewConversationForm } from "@/components/message/test/new-conversation-form"
import { getUsers } from "@/lib/actions/test/user"

export default async function NewMessagePage() {
    const session = await getServerSession(authOptions)

    if (!session) {
        redirect("/login")
    }

    const { users } = await getUsers()

    // Filter out current user
    const filteredUsers = users?.filter((user) => user.id !== session.user.id) || []

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Cuộc trò chuyện mới</h1>
                <p className="text-muted-foreground">Bắt đầu cuộc trò chuyện với người dùng khác</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Chọn người nhận</CardTitle>
                    <CardDescription>Chọn người dùng bạn muốn bắt đầu cuộc trò chuyện</CardDescription>
                </CardHeader>
                <CardContent>
                    <NewConversationForm users={filteredUsers} currentUserId={session.user.id} />
                </CardContent>
            </Card>
        </div>
    )
}

