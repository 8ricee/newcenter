"use client"

import { useRouter } from "next/navigation"
import { formatDistanceToNow } from "date-fns"
import { vi } from "date-fns/locale"
import { cn } from "@/lib/utils"
import Image from "next/image"

interface Conversation {
  user: {
    id: string;
    image?: string | null;
    name?: string | null;
  };
  unreadCount: number;
  latestMessage?: {
    createdAt: string;
    content?: string | null;
  } | null;
}

interface ConversationListProps {
  conversations: Conversation[];
}

export function ConversationList({ conversations }: ConversationListProps) {
  const router = useRouter()

  return (
    <div className="space-y-2">
      {conversations.map((conversation: Conversation) => (
        <div
          key={conversation.user.id}
          className={cn(
            "flex items-center gap-3 p-3 rounded-md cursor-pointer hover:bg-muted transition-colors",
            conversation.unreadCount > 0 && "bg-primary/5",
          )}
          onClick={() => router.push(`/dashboard/test/${conversation.user.id}`)}
        >
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            {conversation.user.image ? (
              <Image
                src={conversation.user.image || "/placeholder.svg"}
                alt={conversation.user.name || "User"}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <span className="text-primary font-medium">{conversation.user.name?.charAt(0) || "U"}</span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h3 className="font-medium truncate">{conversation.user.name || "Người dùng"}</h3>
              {conversation.latestMessage && (
                <span className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(conversation.latestMessage.createdAt), {
                    addSuffix: true,
                    locale: vi,
                  })}
                </span>
              )}
            </div>
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground truncate">
                {conversation.latestMessage?.content || "Chưa có tin nhắn"}
              </p>
              {conversation.unreadCount > 0 && (
                <span className="bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {conversation.unreadCount}
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}