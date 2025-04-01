/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search } from "lucide-react"
import { createConversation } from "@/lib/actions/message"
import { toast } from "sonner"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { getInitials } from "@/lib/utils"

interface NewMessageDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    users: any[]
    currentUserId: string
}

export function NewMessageDialog({ open, onOpenChange, users, currentUserId }: NewMessageDialogProps) {
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedUser, setSelectedUser] = useState<any | null>(null)
    const [message, setMessage] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    const filteredUsers = users.filter((user) => {
        const name = user.name?.toLowerCase() || ""
        const email = user.email?.toLowerCase() || ""
        const query = searchQuery.toLowerCase()

        return name.includes(query) || email.includes(query)
    })

    const handleUserSelect = (user: any) => {
        setSelectedUser(user)
    }

    const handleSendMessage = async () => {
        if (!selectedUser) {
            toast.error("Vui lòng chọn người nhận tin nhắn")
            return
        }

        if (!message.trim()) {
            toast.error("Vui lòng nhập nội dung tin nhắn")
            return
        }

        setIsLoading(true)

        try {
            const result = await createConversation({
                participantIds: [currentUserId, selectedUser.id],
                message: message.trim(),
                senderId: currentUserId,
            })

            if (result.error) {
                toast.error(result.error)
            } else {
                toast.success("Đã gửi tin nhắn")
                if (result.conversation) { // Thêm điều kiện kiểm tra này
                    router.push(`/dashboard/test/${result.conversation.id}`)
                    onOpenChange(false)
                } else {
                    console.error("Không tìm thấy ID cuộc trò chuyện sau khi tạo:", result);
                    toast.error("Có lỗi xảy ra sau khi tạo cuộc trò chuyện.");
                }
            }
        } catch (error) {
            toast.error("Đã xảy ra lỗi khi gửi tin nhắn")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Tin nhắn mới</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Tìm kiếm người dùng..."
                            className="pl-10"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <ScrollArea className="h-[200px] border rounded-md">
                        <div className="p-2 space-y-1">
                            {filteredUsers.length > 0 ? (
                                filteredUsers.map((user) => (
                                    <div
                                        key={user.id}
                                        className={`flex items-center gap-3 p-2 rounded-md cursor-pointer hover:bg-accent ${selectedUser?.id === user.id ? "bg-accent" : ""
                                            }`}
                                        onClick={() => handleUserSelect(user)}
                                    >
                                        <Avatar className="h-8 w-8">
                                            <AvatarImage src={user.image || ""} />
                                            <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="font-medium text-sm">{user.name}</p>
                                            <p className="text-xs text-muted-foreground">{user.email}</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-center text-muted-foreground p-4">Không tìm thấy người dùng</p>
                            )}
                        </div>
                    </ScrollArea>

                    {selectedUser && (
                        <div className="space-y-2">
                            <p className="text-sm font-medium">Gửi tin nhắn đến: {selectedUser.name || selectedUser.email}</p>
                            <Textarea
                                placeholder="Nhập tin nhắn..."
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                className="min-h-[100px]"
                            />
                        </div>
                    )}

                    <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => onOpenChange(false)}>
                            Hủy
                        </Button>
                        <Button onClick={handleSendMessage} disabled={isLoading || !selectedUser || !message.trim()}>
                            Gửi
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}