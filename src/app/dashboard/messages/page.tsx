import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { auth } from "@/auth"
import { getConversations } from "@/lib/actions/message"
import { ConversationList } from "@/components/messages/conversation-list"

export const metadata: Metadata = {
  title: "Tin nhắn | Language Center",
  description: "Quản lý tin nhắn tại Language Center",
}

export default async function MessagesPage() {
  const session = await auth()

  if (!session?.user) {
    redirect("/login")
  }

  const { conversations, error } = await getConversations()

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">{error}</p>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b">
        <h1 className="text-2xl font-bold">Tin nhắn</h1>
        <p className="text-muted-foreground">Quản lý tin nhắn của bạn</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {conversations && conversations.length > 0 ? (
          <ConversationList conversations={conversations} />
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground">Bạn chưa có cuộc trò chuyện nào</p>
          </div>
        )}
      </div>
    </div>
  )
}

