import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { getConversationById } from "@/lib/actions/message"
import { authOptions } from "@/lib/auth"
import { ChatInterface } from "@/components/message/chat-interface"

interface MessagePageProps {
    params: {
        conversationId: string
    }
}

export default async function MessagePage({ params }: MessagePageProps) {
    const session = await getServerSession(authOptions)

    if (!session) {
        redirect("/login")
    }

    const { conversationId } = await params;
    const { conversation, error } = await getConversationById(conversationId)

    if (error || !conversation) {
        redirect("/dashboard/messages")
    }

    // Check if user is part of this conversation
    const isParticipant = conversation.participants.some((participant) => participant.userId === session.user.id)

    if (!isParticipant) {
        redirect("/dashboard/messages")
    }

    // Get the other participant
    const otherParticipant = conversation.participants.find((participant) => participant.userId !== session.user.id)

    return (
        <div className="flex flex-col h-[calc(100vh-10rem)]">
            <ChatInterface conversation={conversation} currentUserId={session.user.id} otherUser={otherParticipant?.user} />
        </div>
    )
}

