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
import { formatDate, formatTime, getInitials, isMessageInSequence, needsDateDivider } from "@/lib/utils"
import { markConversationAsRead, sendMessage, sendTypingNotification, uploadMessageFile } from "@/lib/actions/test/message"
import { toast } from "sonner"
import { Loader2, Send, Paperclip, File, X, ThumbsUp, Smile } from "lucide-react"
import { useRouter } from "next/navigation"
import { pusherClient } from "@/lib/pusher"
import { debounce } from "lodash"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import Image from "next/image"

interface ChatInterfaceProps {
    conversation: any
    currentUserId: string
}

export function ChatInterface({ conversation, currentUserId }: ChatInterfaceProps) {
    const [message, setMessage] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [messages, setMessages] = useState(conversation.messages)
    const [typingUsers, setTypingUsers] = useState<Record<string, boolean>>({})
    const [uploadingFile, setUploadingFile] = useState(false)
    const [fileToUpload, setFileToUpload] = useState<File | null>(null)
    const [filePreview, setFilePreview] = useState<string | null>(null)
    const [fileType, setFileType] = useState<string | null>(null)
    const [clickedMessages, setClickedMessages] = useState<Record<string, boolean>>({})
    const scrollAreaRef = useRef<HTMLDivElement>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const router = useRouter()

    // Get other participants (for direct messages) or group info
    const isGroup = conversation.isGroup
    const otherParticipants = conversation.participants.filter((p: any) => p.userId !== currentUserId)

    // Scroll to bottom on load and when messages change
    useEffect(() => {
        scrollToBottom()
    }, [messages])

    // Initialize with conversation messages
    useEffect(() => {
        setMessages(conversation.messages)

        // Mark conversation as read when opened
        markConversationAsRead(conversation.id, currentUserId)
    }, [conversation.messages, conversation.id, currentUserId])

    // Set up Pusher subscription for real-time updates
    useEffect(() => {
        const channel = pusherClient.subscribe(`conversation-${conversation.id}`)

        // Listen for new messages
        channel.bind("new-message", (newMessage: any) => {
            setMessages((current: any[]) => [...current, newMessage])

            // Mark as read if the conversation is currently open
            markConversationAsRead(conversation.id, currentUserId)

            // Clear typing indicator when message is received
            if (newMessage.senderId !== currentUserId) {
                setTypingUsers((current) => ({
                    ...current,
                    [newMessage.senderId]: false,
                }))
            }
        })

        // Listen for typing indicators
        channel.bind("typing-indicator", ({ userId, isTyping }: { userId: string; isTyping: boolean }) => {
            if (userId !== currentUserId) {
                setTypingUsers((current) => ({
                    ...current,
                    [userId]: isTyping,
                }))
            }
        })

        return () => {
            pusherClient.unsubscribe(`conversation-${conversation.id}`)
        }
    }, [conversation.id, currentUserId])

    const scrollToBottom = () => {
        if (scrollAreaRef.current) {
            const scrollContainer = scrollAreaRef.current.querySelector("[data-radix-scroll-area-viewport]")
            if (scrollContainer) {
                scrollContainer.scrollTop = scrollContainer.scrollHeight
            }
        }
    }

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!message.trim() && !fileToUpload) return

        setIsLoading(true)

        try {
            let fileUrl = undefined
            let fileName = undefined
            let fileTypeValue = undefined

            // Upload file if present
            if (fileToUpload) {
                setUploadingFile(true)
                const formData = new FormData()
                formData.append("file", fileToUpload)

                const uploadResult = await uploadMessageFile(formData)

                if (uploadResult.error) {
                    toast.error(uploadResult.error)
                    setIsLoading(false)
                    setUploadingFile(false)
                    return
                }

                fileUrl = uploadResult.url
                fileName = uploadResult.fileName
                fileTypeValue = uploadResult.fileType

                // Clear file upload state
                setFileToUpload(null)
                setFilePreview(null)
                setFileType(null)
                setUploadingFile(false)
            }

            const result = await sendMessage({
                conversationId: conversation.id,
                senderId: currentUserId,
                content: message.trim() || "",
                fileUrl,
                fileName,
                fileType: fileTypeValue,
            })

            if (result.error) {
                toast.error(result.error)
            } else {
                setMessage("")
            }
        } catch (error) {
            toast.error("Đã xảy ra lỗi khi gửi tin nhắn")
        } finally {
            setIsLoading(false)
        }
    }

    // Debounced function to send typing notifications
    const debouncedTypingNotification = useRef(
        debounce((isTyping: boolean) => {
            sendTypingNotification(conversation.id, currentUserId, isTyping)
        }, 300),
    ).current

    const handleMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        setMessage(value)

        // Send typing notification
        const isTyping = value.length > 0
        debouncedTypingNotification(isTyping)
    }

    const handleFileSelect = () => {
        fileInputRef.current?.click()
    }

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        // Check file size (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
            toast.error("Kích thước file không được vượt quá 10MB")
            return
        }

        setFileToUpload(file)
        setFileType(file.type)

        // Create preview for images
        if (file.type.startsWith("image/")) {
            const reader = new FileReader()
            reader.onload = () => {
                setFilePreview(reader.result as string)
            }
            reader.readAsDataURL(file)
        } else {
            setFilePreview(null)
        }
    }

    const cancelFileUpload = () => {
        setFileToUpload(null)
        setFilePreview(null)
        setFileType(null)
        if (fileInputRef.current) {
            fileInputRef.current.value = ""
        }
    }

    const handleMessageClick = (messageId: string) => {
        setClickedMessages(prev => ({
            ...prev,
            [messageId]: !prev[messageId]
        }))
    }

    // Check if any user is typing
    const typingUserIds = Object.keys(typingUsers).filter((id) => typingUsers[id])
    const typingParticipants = conversation.participants.filter((p: any) => typingUserIds.includes(p.userId))

    // Get conversation title
    const getConversationTitle = () => {
        if (isGroup) {
            return conversation.name || "Nhóm chat"
        } else {
            const otherUser = otherParticipants[0]?.user
            return otherUser?.name || otherUser?.email || "Người dùng"
        }
    }

    // Get conversation subtitle
    const getConversationSubtitle = () => {
        if (isGroup) {
            return `${conversation.participants.length} thành viên`
        } else {
            const otherUser = otherParticipants[0]?.user
            return otherUser?.role === "TEACHER" ? "Giáo viên" : otherUser?.role === "ADMIN" ? "Quản trị viên" : "Học viên"
        }
    }

    return (
        <Card className="flex flex-col h-full gap-0 border p-0 shadow-none">
            <CardHeader className="flex flex-row items-center gap-4 py-4 border-b">
                {isGroup ? (
                    <Avatar className="h-10 w-10 bg-primary">
                        <AvatarFallback>{conversation.name?.charAt(0) || "G"}</AvatarFallback>
                    </Avatar>
                ) : (
                    <Avatar className="h-10 w-10">
                        <AvatarImage src={otherParticipants[0]?.user?.image || ""} />
                        <AvatarFallback>
                            {getInitials(otherParticipants[0]?.user?.name) || otherParticipants[0]?.user?.email?.charAt(0) || "U"}
                        </AvatarFallback>
                    </Avatar>
                )}
                <div className="flex-1">
                    <div className="flex items-center">
                        <h3 className="font-semibold">{getConversationTitle()}</h3>
                        {isGroup && <Badge variant="outline">Nhóm</Badge>}
                    </div>
                    <p className="text-sm text-muted-foreground">{getConversationSubtitle()}</p>
                </div>
            </CardHeader>
            <CardContent className="flex-1 p-0 flex flex-col">
                <ScrollArea ref={scrollAreaRef} className="flex-1 px-4" style={{ maxHeight: '450px' }}>
                    <div className="space-y-2">
                        {messages.length === 0 ? (
                            <div className="flex items-center justify-center h-full py-8">
                                <p className="text-muted-foreground">Chưa có tin nhắn nào. Hãy bắt đầu cuộc trò chuyện!</p>
                            </div>
                        ) : (
                            messages.map((msg: any, index: number) => {
                                const isCurrentUser = msg.senderId === currentUserId
                                const sender = conversation.participants.find((p: any) => p.userId === msg.senderId)?.user
                                const previousMsg = index > 0 ? messages[index - 1] : null
                                const isInSequence = isMessageInSequence(msg, previousMsg)
                                const showDateDivider = needsDateDivider(msg, previousMsg)

                                return (
                                    <div key={msg.id}>
                                        {showDateDivider && (
                                            <div className="flex justify-center my-4">
                                                <div className="px-3 py-1 rounded-full text-xs">
                                                    {formatDate(msg.createdAt)}
                                                </div>
                                            </div>
                                        )}

                                        <div className={`flex ${isCurrentUser ? "justify-end" : "justify-start"} gap-2 mb-1`}>
                                            {!isCurrentUser && !isInSequence && (
                                                <Avatar className="h-8 w-8 mt-1">
                                                    <AvatarImage src={sender?.image || ""} />
                                                    <AvatarFallback>{getInitials(sender?.name) || sender?.email?.charAt(0) || "U"}</AvatarFallback>
                                                </Avatar>
                                            )}

                                            {!isCurrentUser && isInSequence && (
                                                <div className="w-8"></div>
                                            )}

                                            <div className={`flex flex-col ${isCurrentUser ? "items-end" : "items-start"} max-w-[70%]`}>
                                                {isGroup && !isCurrentUser && !isInSequence && (
                                                    <p className="text-xs font-medium mb-1 ml-1">{sender?.name || sender?.email || "Người dùng"}</p>
                                                )}
                                                <div
                                                    className={`rounded-2xl px-3 py-2 ${isCurrentUser
                                                        ? "bg-[#0084ff] text-white"
                                                        : "bg-white border border-gray-200"
                                                        } cursor-pointer`}
                                                    onClick={() => handleMessageClick(msg.id)}
                                                >
                                                    {msg.fileUrl && msg.fileType?.startsWith("image/") ? (
                                                        <div className="">
                                                            <a href={msg.fileUrl} target="_blank" rel="noopener noreferrer" className="block">
                                                                <Image
                                                                    src={msg.fileUrl || "/placeholder.svg"}
                                                                    alt={msg.fileName || "Hình ảnh"}
                                                                    className="max-w-full rounded-md max-h-[300px] object-contain"
                                                                    width={500}
                                                                    height={300}
                                                                />
                                                            </a>
                                                        </div>
                                                    ) : msg.fileUrl ? (
                                                        <div className="flex items-center gap-2 mb-1 p-2 bg-background/50 rounded-md">
                                                            <File className="h-5 w-5" />
                                                            <a
                                                                href={msg.fileUrl}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="text-sm underline truncate max-w-[200px]"
                                                            >
                                                                {msg.fileName}
                                                            </a>
                                                        </div>
                                                    ) : null}

                                                    <p className="text-sm break-words">{msg.content}</p>
                                                </div>

                                                {clickedMessages[msg.id] && (
                                                    <p className="text-[10px] mt-1 mx-1">
                                                        {formatTime(msg.createdAt)}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                        )}

                        {typingParticipants.length > 0 && (
                            <div className="flex justify-start gap-2">
                                <Avatar className="h-8 w-8 mt-1">
                                    <AvatarImage src={typingParticipants[0]?.user?.image || ""} />
                                    <AvatarFallback>
                                        {getInitials(typingParticipants[0]?.user?.name) ||
                                            typingParticipants[0]?.user?.email?.charAt(0) ||
                                            "U"}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="border border-gray-200 rounded-2xl px-3 py-2">
                                    <div className="flex items-center space-x-1">
                                        <div
                                            className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                                            style={{ animationDelay: "0ms" }}
                                        ></div>
                                        <div
                                            className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                                            style={{ animationDelay: "300ms" }}
                                        ></div>
                                        <div
                                            className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                                            style={{ animationDelay: "600ms" }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </ScrollArea>

                {fileToUpload && (
                    <div className="px-4 py-2 border-t bg-white">
                        <div className="flex items-center justify-between bg-gray-100 p-2 rounded-md">
                            <div className="flex items-center gap-2">
                                {filePreview ? (
                                    <div className="relative h-12 w-12">
                                        <Image
                                            src={filePreview || "/placeholder.svg"}
                                            alt="Preview"
                                            className="h-full w-full object-cover rounded-md"
                                            width={48}
                                            height={48}
                                        />
                                    </div>
                                ) : (
                                    <div className="h-12 w-12 bg-white rounded-md flex items-center justify-center border border-gray-200">
                                        <File className="h-6 w-6 text-gray-400" />
                                    </div>
                                )}
                                <div className="truncate max-w-[200px]">
                                    <p className="text-sm font-medium truncate">{fileToUpload.name}</p>
                                    <p className="text-xs text-muted-foreground">{(fileToUpload.size / 1024).toFixed(1)} KB</p>
                                </div>
                            </div>
                            <Button variant="ghost" size="icon" onClick={cancelFileUpload} className="text-gray-500 hover:text-gray-700">
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                )}

                <div className="p-3 border-t">
                    <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                        <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" />

                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="text-gray-500 hover:text-gray-700"
                                        onClick={handleFileSelect}
                                        disabled={isLoading || uploadingFile}
                                    >
                                        <Paperclip className="h-5 w-5" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Đính kèm tệp</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                        <Input
                            placeholder="Aa"
                            value={message}
                            onChange={handleMessageChange}
                            disabled={isLoading}
                            className="flex-1 rounded-full bg-gray-100 border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                        />

                        {message.trim() === "" && !fileToUpload ? (
                            <Button type="button" variant="ghost" size="icon" className="text-[#0084ff] hover:text-blue-700">
                                <ThumbsUp className="h-5 w-5" />
                            </Button>
                        ) : (
                            <Button
                                type="submit"
                                size="icon"
                                disabled={isLoading}
                                className="bg-transparent hover:bg-transparent text-[#0084ff] hover:text-blue-700"
                            >
                                {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
                            </Button>
                        )}
                    </form>
                </div>
            </CardContent>
        </Card>
    )
}