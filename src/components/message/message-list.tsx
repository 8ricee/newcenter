/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { formatDate } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { usePathname } from "next/navigation"

interface MessageListProps {
  conversations: any[]
  currentUserId: string
}

export function MessageList({ conversations, currentUserId }: MessageListProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const pathname = usePathname()

  // Filter conversations based on search query
  const filteredConversations = conversations.filter((conversation) => {
    // Find the other participant
    const otherParticipant = conversation.participants.find((participant: any) => participant.userId !== currentUserId)

    if (!otherParticipant) return false

    const userName = otherParticipant.user.name || ""
    const userEmail = otherParticipant.user.email || ""

    return (
      userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      userEmail.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Tìm kiếm cuộc trò chuyện..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
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
            // Find the other participant
            const otherParticipant = conversation.participants.find(
              (participant: any) => participant.userId !== currentUserId,
            )

            if (!otherParticipant) return null

            const lastMessage = conversation.messages[0]
            const isActive = pathname === `/dashboard/messages/${conversation.id}`

            return (
              <Link key={conversation.id} href={`/dashboard/messages/${conversation.id}`}>
                <Card className={cn("hover:bg-accent/50 transition-colors mb-4", isActive && "bg-accent")}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <Avatar>
                        <AvatarImage src={otherParticipant.user.image || ""} />
                        <AvatarFallback>
                          {otherParticipant.user.name?.charAt(0) || otherParticipant.user.email?.charAt(0) || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="font-medium truncate">
                            {otherParticipant.user.name || otherParticipant.user.email}
                          </p>
                          {lastMessage && (
                            <p className="text-xs text-muted-foreground">{formatDate(lastMessage.createdAt)}</p>
                          )}
                        </div>
                        {lastMessage && (
                          <p className="text-sm text-muted-foreground truncate">
                            {lastMessage.senderId === currentUserId ? "Bạn: " : ""}
                            {lastMessage.content}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}

