/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, X, Check } from "lucide-react"
import { createGroupConversation } from "@/lib/actions/test/message"
import { toast } from "sonner"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { getInitials } from "@/lib/utils"

interface NewGroupDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    users: any[]
    currentUserId: string
}

interface CreateGroupConversationResult {
    conversation?: {
        id: string;
        participants: {
            id: string;
            createdAt: Date;
            userId: string;
            conversationId: string;
        }[];
        name: string | null;
        createdAt: Date;
        updatedAt: Date;
        lastMessageId: string | null;
        isGroup: boolean;
    };
    error?: string;
}

export function NewGroupDialog({ open, onOpenChange, users, currentUserId }: NewGroupDialogProps) {
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedUsers, setSelectedUsers] = useState<any[]>([])
    const [groupName, setGroupName] = useState("")
    const [initialMessage, setInitialMessage] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    const filteredUsers = users.filter((user) => {
        const name = user.name?.toLowerCase() || ""
        const email = user.email?.toLowerCase() || ""
        const query = searchQuery.toLowerCase()

        return name.includes(query) || email.includes(query)
    })

    const toggleUserSelection = (user: any) => {
        if (selectedUsers.some((u) => u.id === user.id)) {
            setSelectedUsers(selectedUsers.filter((u) => u.id !== user.id))
        } else {
            setSelectedUsers([...selectedUsers, user])
        }
    }

    const removeSelectedUser = (userId: string) => {
        setSelectedUsers(selectedUsers.filter((u) => u.id !== userId))
    }

    const handleCreateGroup = async () => {
        if (selectedUsers.length < 2) {
            toast.error("Vui lòng chọn ít nhất 2 người dùng")
            return
        }

        if (!groupName.trim()) {
            toast.error("Vui lòng nhập tên nhóm")
            return
        }

        setIsLoading(true)

        try {
            const formData = new FormData();
            formData.append("name", groupName)
            formData.append("participantIds", JSON.stringify([...selectedUsers.map((u) => u.id), currentUserId]))
            formData.append("initialMessage", initialMessage || "Đã tạo nhóm chat")

            const result: CreateGroupConversationResult = await createGroupConversation(formData);

            if (result?.error) {
                toast.error(result.error);
            } else if (result?.conversation) {
                toast.success("Đã tạo nhóm chat");
                router.push(`/dashboard/test/${result.conversation.id}`);
                onOpenChange(false);
            } else {
                console.error("Không tìm thấy thông tin cuộc trò chuyện sau khi tạo:", result);
                toast.error("Có lỗi xảy ra sau khi tạo nhóm chat.");
            }
        } catch (error) {
            toast.error("Đã xảy ra lỗi khi tạo nhóm chat");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Tạo nhóm chat mới</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <div>
                        <Input placeholder="Tên nhóm..." value={groupName} onChange={(e) => setGroupName(e.target.value)} />
                    </div>

                    {selectedUsers.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {selectedUsers.map((user) => (
                                <Badge key={user.id} variant="secondary" className="flex items-center gap-1">
                                    {user.name || user.email}
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-4 w-4 p-0 ml-1"
                                        onClick={() => removeSelectedUser(user.id)}
                                    >
                                        <X className="h-3 w-3" />
                                    </Button>
                                </Badge>
                            ))}
                        </div>
                    )}

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
                                filteredUsers.map((user) => {
                                    const isSelected = selectedUsers.some((u) => u.id === user.id)
                                    return (
                                        <div
                                            key={user.id}
                                            className={`flex items-center justify-between p-2 rounded-md cursor-pointer hover:bg-accent ${isSelected ? "bg-accent" : ""
                                                }`}
                                            onClick={() => toggleUserSelection(user)}
                                        >
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-8 w-8">
                                                    <AvatarImage src={user.image || ""} />
                                                    <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <p className="font-medium text-sm">{user.name}</p>
                                                    <p className="text-xs text-muted-foreground">{user.email}</p>
                                                </div>
                                            </div>
                                            {isSelected && <Check className="h-4 w-4 text-primary" />}
                                        </div>
                                    )
                                })
                            ) : (
                                <p className="text-center text-muted-foreground p-4">Không tìm thấy người dùng</p>
                            )}
                        </div>
                    </ScrollArea>

                    <div className="space-y-2">
                        <p className="text-sm font-medium">Tin nhắn đầu tiên (tùy chọn)</p>
                        <Textarea
                            placeholder="Nhập tin nhắn..."
                            value={initialMessage}
                            onChange={(e) => setInitialMessage(e.target.value)}
                            className="min-h-[80px]"
                        />
                    </div>

                    <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => onOpenChange(false)}>
                            Hủy
                        </Button>
                        <Button onClick={handleCreateGroup} disabled={isLoading || selectedUsers.length < 2 || !groupName.trim()}>
                            Tạo nhóm
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}