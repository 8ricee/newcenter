import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { getConversations } from "@/lib/actions/test/message"
import { getUsers } from "@/lib/actions/user"
import { MessageList } from "@/components/message/test/message-list"

export default async function MessagesPage() {
    const session = await getServerSession(authOptions)

    if (!session) {
        redirect("/login")
    }

    const { conversations } = await getConversations(session.user.id)
    const { users } = await getUsers()

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Tin nhắn</h1>
                <p className="text-muted-foreground">Quản lý các cuộc trò chuyện của bạn</p>
            </div>

            <MessageList conversations={conversations || []} currentUserId={session.user.id} users={users || []} />
        </div>
    )
}

