/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { formatDate, getInitials } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Search, Plus } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { usePathname } from "next/navigation"
import { pusherClient } from "@/lib/pusher"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { NewMessageDialog } from "@/components/message/test/new-message-dialog"
import { NewGroupDialog } from "@/components/message/test/new-group-dialog"

interface MessageListProps {
  conversations: any[]
  currentUserId: string
  users: any[]
}

export function MessageList({ conversations: initialConversations, currentUserId, users }: MessageListProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [conversations, setConversations] = useState(initialConversations)
  const [isNewMessageOpen, setIsNewMessageOpen] = useState(false)
  const [isNewGroupOpen, setIsNewGroupOpen] = useState(false)
  const pathname = usePathname()

  // Set up Pusher subscription for real-time updates
  useEffect(() => {
    const channel = pusherClient.subscribe(`user-${currentUserId}`)

    // Listen for new conversations
    channel.bind("new-conversation", (data: { conversation: any }) => {
      setConversations((current) => {
        // Check if conversation already exists
        const exists = current.some((conv) => conv.id === data.conversation.id)
        if (exists) return current
        return [data.conversation, ...current]
      })
    })

    // Listen for conversation updates (new messages)
    channel.bind("conversation-update", (data: { conversationId: string; lastMessage: any }) => {
      setConversations((current) => {
        return current
          .map((conv) => {
            if (conv.id === data.conversationId) {
              // Update conversation with the new message
              return {
                ...conv,
                messages: [data.lastMessage],
                updatedAt: new Date().toISOString(),
                // Increment unread count if the message is not from the current user
                unreadMessages:
                  data.lastMessage.senderId !== currentUserId
                    ? [...(conv.unreadMessages || []), { id: Date.now().toString(), count: 1 }]
                    : conv.unreadMessages,
              }
            }
            return conv
          })
          .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      })
    })

    return () => {
      pusherClient.unsubscribe(`user-${currentUserId}`)
    }
  }, [currentUserId])

  // Filter conversations based on search query
  const filteredConversations = conversations.filter((conversation) => {
    if (conversation.isGroup) {
      return conversation.name?.toLowerCase().includes(searchQuery.toLowerCase())
    } else {
      // Find the other participant
      const otherParticipant = conversation.participants.find(
        (participant: any) => participant.userId !== currentUserId,
      )

      if (!otherParticipant) return false

      const userName = otherParticipant.user.name || ""
      const userEmail = otherParticipant.user.email || ""

      return (
        userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        userEmail.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }
  })

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm cuộc trò chuyện..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="outline" size="icon" onClick={() => setIsNewMessageOpen(true)}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">Tin nhắn</h3>
        <Button variant="ghost" size="sm" className="text-xs" onClick={() => setIsNewGroupOpen(true)}>
          Tạo nhóm
        </Button>
      </div>

      {filteredConversations.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center text-muted-foreground">
            {searchQuery ? "Không tìm thấy cuộc trò chuyện nào" : "Bạn chưa có cuộc trò chuyện nào"}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {filteredConversations.map((conversation) => {
            const isGroup = conversation.isGroup
            let displayName = ""
            let image = ""
            let unreadCount = 0

            if (isGroup) {
              displayName = conversation.name || "Nhóm chat"
              unreadCount = conversation.unreadMessages?.length || 0
            } else {
              // Find the other participant
              const otherParticipant = conversation.participants.find(
                (participant: any) => participant.userId !== currentUserId,
              )

              if (!otherParticipant) return null

              displayName = otherParticipant.user.name || otherParticipant.user.email
              image = otherParticipant.user.image || ""
              unreadCount = conversation.unreadMessages?.length || 0
            }

            const lastMessage = conversation.messages[0]
            const isActive = pathname.includes(`/dashboard/test/${conversation.id}`)

            return (
              <Link key={conversation.id} href={`/dashboard/test/${conversation.id}`}>
                <Card className={cn("hover:bg-accent/50 transition-colors", isActive && "bg-accent")}>
                  <CardContent className="p-3">
                    <div className="flex items-center gap-3">
                      {isGroup ? (
                        <Avatar className="h-10 w-10 bg-primary">
                          <AvatarFallback>{conversation.name?.charAt(0) || "G"}</AvatarFallback>
                        </Avatar>
                      ) : (
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={image} />
                          <AvatarFallback>{getInitials(displayName)}</AvatarFallback>
                        </Avatar>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <p className="font-medium truncate">{displayName}</p>
                            {isGroup && (
                              <Badge variant="outline" className="h-5">
                                Nhóm
                              </Badge>
                            )}
                          </div>
                          {lastMessage && (
                            <p className="text-xs text-muted-foreground">{formatDate(lastMessage.createdAt)}</p>
                          )}
                        </div>
                        <div className="flex items-center justify-between">
                          {lastMessage && (
                            <p className="text-sm text-muted-foreground truncate max-w-[180px]">
                              {lastMessage.senderId === currentUserId ? "Bạn: " : ""}
                              {lastMessage.fileUrl
                                ? lastMessage.fileType?.startsWith("image/")
                                  ? "🖼️ Hình ảnh"
                                  : "📎 Tệp đính kèm"
                                : lastMessage.content}
                            </p>
                          )}
                          {unreadCount > 0 && <Badge className="ml-2">{unreadCount}</Badge>}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      )}

      <NewMessageDialog
        open={isNewMessageOpen}
        onOpenChange={setIsNewMessageOpen}
        users={users.filter((user) => user.id !== currentUserId)}
        currentUserId={currentUserId}
      />

      <NewGroupDialog
        open={isNewGroupOpen}
        onOpenChange={setIsNewGroupOpen}
        users={users.filter((user) => user.id !== currentUserId)}
        currentUserId={currentUserId}
      />
    </div>
  )
}

