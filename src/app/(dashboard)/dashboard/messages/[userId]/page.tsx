import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { auth } from "@/auth"
import { getMessages } from "@/lib/actions/message"
import { MessageList } from "@/components/messages/message-list"
import { MessageInput } from "@/components/messages/message-input"
import Image from "next/image"

export const metadata: Metadata = {
    title: "Tin nhắn | Language Center",
    description: "Quản lý tin nhắn tại Language Center",
}

export default async function MessageDetailPage({
    params,
}: {
    params: { userId: string }
}) {
    const session = await auth()

    if (!session?.user) {
        redirect("/login")
    }

    const { messages: rawMessages, otherUser, error } = await getMessages(params.userId)

    if (error) {
        return (
            <div className="flex items-center justify-center h-full">
                <p className="text-muted-foreground">{error}</p>
            </div>
        )
    }

    if (!otherUser) {
        redirect("/dashboard/messages")
    }

    const messages = (rawMessages ?? []).map((msg) => ({
        ...msg,
        createdAt: msg.createdAt.toISOString(),
        updatedAt: msg.updatedAt.toISOString(),
        sender: {
            ...msg.sender,
            name: msg.sender.name ?? "Không tên",
            image: msg.sender.image ?? "/placeholder-avatar.png",
        },
        receiver: {
            ...msg.receiver,
            name: msg.receiver.name ?? "Không tên",
            image: msg.receiver.image ?? "/placeholder-avatar.png",
        },
    }))

    return (
        <div className="h-full flex flex-col">
            <div className="p-4 border-b flex items-center space-x-2">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
                    {otherUser.image ? (
                        <Image
                            src={otherUser.image || "/placeholder.svg"}
                            alt={otherUser.name || "User"}
                            width={40}
                            height={40}
                            className="w-10 h-10 rounded-full object-cover"
                        />
                    ) : (
                        <span className="text-primary font-medium">
                            {otherUser.name?.charAt(0).toUpperCase() || "U"}
                        </span>
                    )}
                </div>
                <div>
                    <h2 className="font-medium">{otherUser.name}</h2>
                    <p className="text-xs text-muted-foreground">
                        {otherUser.role === "TEACHER"
                            ? "Giảng viên"
                            : otherUser.role === "STUDENT"
                                ? "Học viên"
                                : "Quản trị viên"}
                    </p>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
                <MessageList messages={messages} currentUserId={session.user.id} />
            </div>

            <div className="p-4 border-t">
                <MessageInput receiverId={params.userId} />
            </div>
        </div>
    )
}
