"use client"

import { useEffect, useRef } from "react"
import { formatDistanceToNow } from "date-fns"
import { vi } from "date-fns/locale"
import { cn } from "@/lib/utils"
import { RefObject } from "react" // Import RefObject

interface Message {
  id: string;
  senderId: string | number;
  content: string;
  createdAt: string;
}

interface MessageListProps {
  messages: Message[];
  currentUserId: string | number;
}

export function MessageList({ messages, currentUserId }: MessageListProps) {
  const messagesEndRef: RefObject<HTMLDivElement | null> = useRef(null) // Allow null for initial value

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  return (
    <div className="space-y-4">
      {messages.length === 0 ? (
        <div className="flex items-center justify-center h-40">
          <p className="text-muted-foreground">Chưa có tin nhắn. Hãy bắt đầu cuộc trò chuyện!</p>
        </div>
      ) : (
        messages.map((message: Message) => {
          const isCurrentUser = message.senderId === currentUserId

          return (
            <div key={message.id} className={cn("flex", isCurrentUser ? "justify-end" : "justify-start")}>
              <div
                className={cn(
                  "max-w-[70%] rounded-lg p-3",
                  isCurrentUser ? "bg-primary text-primary-foreground" : "bg-muted",
                )}
              >
                <p className="text-sm">{message.content}</p>
                <div
                  className={cn("text-xs mt-1", isCurrentUser ? "text-primary-foreground/70" : "text-muted-foreground")}
                >
                  {formatDistanceToNow(new Date(message.createdAt), {
                    addSuffix: true,
                    locale: vi,
                  })}
                </div>
              </div>
            </div>
          )
        })
      )}
      <div ref={messagesEndRef} />
    </div>
  )
}