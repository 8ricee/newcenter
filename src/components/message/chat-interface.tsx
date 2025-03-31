/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { formatDate } from "@/lib/utils"
import { sendMessage } from "@/lib/actions/message"
import { toast } from "sonner" // Import toast from sonner
import { Loader2, Send } from "lucide-react"
import { useRouter } from "next/navigation"

interface ChatInterfaceProps {
    conversation: any
    currentUserId: string
    otherUser: any
}

export function ChatInterface({ conversation, currentUserId, otherUser }: ChatInterfaceProps) {
    const [message, setMessage] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const scrollAreaRef = useRef<HTMLDivElement>(null)
    const router = useRouter()

    // Scroll to bottom on load and when messages change
    useEffect(() => {
        if (scrollAreaRef.current) {
            const scrollContainer = scrollAreaRef.current.querySelector("[data-radix-scroll-area-viewport]")
            if (scrollContainer) {
                scrollContainer.scrollTop = scrollContainer.scrollHeight
            }
        }
    }, [conversation.messages])

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!message.trim()) return

        setIsLoading(true)

        try {
            const result = await sendMessage({
                conversationId: conversation.id,
                senderId: currentUserId,
                content: message,
            })

            if (result.error) {
                toast.error(result.error) // Use sonner's toast.error
            } else {
                setMessage("")
                router.refresh()
            }
        } catch (error) {
            toast.error("Đã xảy ra lỗi khi gửi tin nhắn") // Use sonner's toast.error
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Card className="flex flex-col h-full max-h-screen/2 gap-0">
            <CardHeader className="flex flex-row items-center gap-4 py-4">
                <Avatar>
                    <AvatarImage src={otherUser?.image || ""} />
                    <AvatarFallback>{otherUser?.name?.charAt(0) || otherUser?.email?.charAt(0) || "K"}</AvatarFallback>
                </Avatar>
                <div>
                    <h3 className="font-semibold">{otherUser?.name || otherUser?.email}</h3>
                    <p className="text-sm text-muted-foreground">
                        {otherUser?.role === "TEACHER" ? "Giáo viên" : otherUser?.role === "ADMIN" ? "Quản trị viên" : "Học viên"}
                    </p>
                </div>
            </CardHeader>
            <Separator />
            <CardContent className="flex-1 p-0 flex flex-col">
                <ScrollArea ref={scrollAreaRef} className="flex-1 p-4" style={{ maxHeight: '500px' }}>
                    <div className="space-y-4">
                        {conversation.messages.length === 0 ? (
                            <div className="flex items-center justify-center h-full py-8">
                                <p className="text-muted-foreground">Chưa có tin nhắn nào. Hãy bắt đầu cuộc trò chuyện!</p>
                            </div>
                        ) : (
                            conversation.messages.map((msg: any) => {
                                const isCurrentUser = msg.senderId === currentUserId
                                return (
                                    <div key={msg.id} className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}>
                                        <div
                                            className={`max-w-[80%] rounded-lg p-3 ${isCurrentUser ? "bg-primary text-primary-foreground" : "bg-muted"
                                                }`}
                                        >
                                            <p className="text-s text-primary-foreground">{msg.content}</p>
                                            <p
                                                className={`text-xs mt-1 ${isCurrentUser ? "text-primary-foreground/70" : "text-primary-foreground/50"}`}
                                            >
                                                {formatDate(msg.createdAt)}
                                            </p>
                                        </div>
                                    </div>
                                )
                            })
                        )}
                    </div>
                </ScrollArea>
                <div className="p-4 border-t">
                    <form onSubmit={handleSendMessage} className="flex gap-2">
                        <Input
                            placeholder="Nhập tin nhắn..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            disabled={isLoading}
                            className="flex-1"
                        />
                        <Button type="submit" size="icon" disabled={isLoading || !message.trim()}>
                            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                        </Button>
                    </form>
                </div>
            </CardContent>
        </Card>
    )
}