"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

interface CreateConversationParams {
  participantIds: string[];
  message: string;
  senderId: string;
}

interface SendMessageParams {
  conversationId: string;
  senderId: string;
  content: string;
}

export async function getConversations(userId: string) {
  try {
    const conversations = await db.conversation.findMany({
      where: {
        participants: {
          some: {
            userId,
          },
        },
      },
      include: {
        participants: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true,
                role: true,
              },
            },
          },
        },
        messages: {
          orderBy: {
            createdAt: "desc",
          },
          take: 1,
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    return { conversations };
  } catch (error) {
    console.error("Error fetching conversations:", error);
    return { error: "Đã xảy ra lỗi khi lấy danh sách cuộc trò chuyện" };
  }
}

export async function getConversationById(id: string) {
  try {
    const conversation = await db.conversation.findUnique({
      where: { id },
      include: {
        participants: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true,
                role: true,
              },
            },
          },
        },
        messages: {
          orderBy: {
            createdAt: "asc",
          },
          include: {
            sender: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
        },
      },
    });

    if (!conversation) {
      return { error: "Không tìm thấy cuộc trò chuyện" };
    }

    return { conversation };
  } catch (error) {
    console.error("Error fetching conversation:", error);
    return { error: "Đã xảy ra lỗi khi lấy thông tin cuộc trò chuyện" };
  }
}

export async function createConversation({
  participantIds,
  message,
  senderId,
}: CreateConversationParams) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return { error: "Bạn cần đăng nhập để thực hiện hành động này" };
  }

  try {
    // Check if conversation already exists between these users
    const existingConversation = await db.conversation.findFirst({
      where: {
        AND: participantIds.map((id) => ({
          participants: {
            some: {
              userId: id,
            },
          },
        })),
      },
      include: {
        participants: true,
      },
    });

    if (
      existingConversation &&
      existingConversation.participants.length === participantIds.length
    ) {
      // Conversation exists, return it
      return { conversation: existingConversation };
    }

    // Create new conversation
    const conversation = await db.conversation.create({
      data: {
        participants: {
          create: participantIds.map((userId) => ({
            userId,
          })),
        },
        messages: {
          create: {
            content: message,
            senderId,
          },
        },
      },
    });

    revalidatePath("/dashboard/messages");
    return { conversation };
  } catch (error) {
    console.error("Error creating conversation:", error);
    return { error: "Đã xảy ra lỗi khi tạo cuộc trò chuyện" };
  }
}

export async function sendMessage({
  conversationId,
  senderId,
  content,
}: SendMessageParams) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return { error: "Bạn cần đăng nhập để thực hiện hành động này" };
  }

  try {
    // Check if user is part of the conversation
    const conversation = await db.conversation.findFirst({
      where: {
        id: conversationId,
        participants: {
          some: {
            userId: senderId,
          },
        },
      },
    });

    if (!conversation) {
      return {
        error: "Bạn không có quyền gửi tin nhắn trong cuộc trò chuyện này",
      };
    }

    // Create message
    const message = await db.message.create({
      data: {
        content,
        senderId,
        conversationId,
      },
    });

    // Update conversation's updatedAt
    await db.conversation.update({
      where: { id: conversationId },
      data: { updatedAt: new Date() },
    });

    revalidatePath(`/dashboard/messages/${conversationId}`);
    return { message };
  } catch (error) {
    console.error("Error sending message:", error);
    return { error: "Đã xảy ra lỗi khi gửi tin nhắn" };
  }
}
