/* eslint-disable @typescript-eslint/no-explicit-any */

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

import { getConversationById, getConversations } from "@/lib/actions/test/message";
import { getUsers } from "@/lib/actions/test/user";

import { ChatInterface } from "@/components/message/test/chat-interface";
import { MessageList } from "@/components/message/test/message-list";

interface MessagePageProps {
    params: {
        conversationId: string;
    };
}

export default async function MessagePage({ params }: MessagePageProps) {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/login");
    }

    const conversationId = (await params).conversationId;

    if (!conversationId) {
        redirect("/dashboard/messages");
    }

    const { conversation, error } = await getConversationById(conversationId);
    const { conversations } = await getConversations(session.user.id);
    const { users } = await getUsers();

    if (error || !conversation) {
        redirect("/dashboard/messages");
    }

    const isParticipant = conversation.participants.some(
        (participant: any) => participant.userId === session.user.id
    );

    if (!isParticipant) {
        redirect("/dashboard/messages");
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Tin nhắn</h1>
                <p className="text-muted-foreground">Quản lý các cuộc trò chuyện của bạn</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1">
                    <MessageList
                        conversations={conversations || []}
                        currentUserId={session.user.id}
                        users={users || []}
                    />
                </div>
                <div className="md:col-span-2 h-[calc(100vh-16rem)]">
                    <ChatInterface conversation={conversation} currentUserId={session.user.id} />
                </div>
            </div>
        </div>
    );
}
