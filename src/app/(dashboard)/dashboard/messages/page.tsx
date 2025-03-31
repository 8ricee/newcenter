import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { getConversations } from "@/lib/actions/message"
import { MessageList } from "@/components/message/message-list"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import Link from "next/link"
import { authOptions } from "@/lib/auth"

export default async function MessagesPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login")
  }

  // const { user } = await getCurrentUserProfile() // Giải quyết lỗi ESLint (nếu không dùng thì bỏ)
  const { conversations } = await getConversations(session.user.id)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tin nhắn</h1>
          <p className="text-muted-foreground">Quản lý các cuộc trò chuyện của bạn</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/messages/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Cuộc trò chuyện mới
          </Link>
        </Button>
      </div>

      <MessageList conversations={conversations || []} currentUserId={session.user.id} />
    </div>
  )
}