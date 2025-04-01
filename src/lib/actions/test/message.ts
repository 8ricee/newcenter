"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { pusherServer } from "@/lib/pusher";
import { v4 as uuidv4 } from "uuid";

interface CreateConversationParams {
  participantIds: string[];
  message: string;
  senderId: string;
  isGroup?: boolean;
  groupName?: string;
}

interface SendMessageParams {
  conversationId: string;
  senderId: string;
  content: string;
  fileUrl?: string;
  fileName?: string;
  fileType?: string;
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
        unreadMessages: {
          where: {
            NOT: {
              userId,
            },
          },
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
  isGroup = false,
  groupName = "",
}: CreateConversationParams) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return { error: "Bạn cần đăng nhập để thực hiện hành động này" };
  }

  try {
    // For non-group chats, check if conversation already exists between these users
    if (!isGroup && participantIds.length === 2) {
      const existingConversation = await db.conversation.findFirst({
        where: {
          AND: [
            {
              participants: {
                some: {
                  userId: participantIds[0],
                },
              },
            },
            {
              participants: {
                some: {
                  userId: participantIds[1],
                },
              },
            },
            {
              isGroup: false,
            },
          ],
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
    }

    // Create new conversation
    const conversation = await db.conversation.create({
      data: {
        isGroup,
        name: isGroup ? groupName : undefined,
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
      include: {
        participants: {
          include: {
            user: true,
          },
        },
        messages: {
          include: {
            sender: true,
          },
          orderBy: {
            createdAt: "desc",
          },
          take: 1,
        },
      },
    });

    // Create unread message records for all participants except sender
    await Promise.all(
      participantIds
        .filter((id) => id !== senderId)
        .map((userId) =>
          db.unreadMessage.create({
            data: {
              conversationId: conversation.id,
              userId,
              count: 1,
            },
          })
        )
    );

    // Notify all participants about the new conversation
    for (const participant of conversation.participants) {
      if (participant.userId !== senderId) {
        await pusherServer.trigger(
          `user-${participant.userId}`,
          "new-conversation",
          {
            conversation: {
              id: conversation.id,
              participants: conversation.participants,
              messages: conversation.messages,
              isGroup: conversation.isGroup,
              name: conversation.name,
            },
          }
        );
      }
    }

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
  fileUrl,
  fileName,
  fileType,
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
      include: {
        participants: true,
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
        fileUrl,
        fileName,
        fileType,
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
    });

    // Update conversation's updatedAt
    await db.conversation.update({
      where: { id: conversationId },
      data: { updatedAt: new Date() },
    });

    // Update or create unread message records for all participants except sender
    for (const participant of conversation.participants) {
      if (participant.userId !== senderId) {
        const existingUnread = await db.unreadMessage.findFirst({
          where: {
            conversationId,
            userId: participant.userId,
          },
        });

        if (existingUnread) {
          await db.unreadMessage.update({
            where: { id: existingUnread.id },
            data: { count: existingUnread.count + 1 },
          });
        } else {
          await db.unreadMessage.create({
            data: {
              conversationId,
              userId: participant.userId,
              count: 1,
            },
          });
        }
      }
    }

    // Trigger Pusher event for real-time updates
    await pusherServer.trigger(
      `conversation-${conversationId}`,
      "new-message",
      message
    );

    // Also trigger an event to update the conversation list for all participants
    for (const participant of conversation.participants) {
      await pusherServer.trigger(
        `user-${participant.userId}`,
        "conversation-update",
        {
          conversationId,
          lastMessage: message,
        }
      );
    }

    revalidatePath(`/dashboard/messages/${conversationId}`);
    return { message };
  } catch (error) {
    console.error("Error sending message:", error);
    return { error: "Đã xảy ra lỗi khi gửi tin nhắn" };
  }
}

export async function markConversationAsRead(
  conversationId: string,
  userId: string
) {
  try {
    await db.unreadMessage.deleteMany({
      where: {
        conversationId,
        userId,
      },
    });

    revalidatePath(`/dashboard/messages/${conversationId}`);
    revalidatePath(`/dashboard/messages`);

    return { success: true };
  } catch (error) {
    console.error("Error marking conversation as read:", error);
    return { error: "Đã xảy ra lỗi khi đánh dấu đã đọc" };
  }
}

export async function sendTypingNotification(
  conversationId: string,
  userId: string,
  isTyping: boolean
) {
  try {
    await pusherServer.trigger(
      `conversation-${conversationId}`,
      "typing-indicator",
      {
        userId,
        isTyping,
      }
    );

    return { success: true };
  } catch (error) {
    console.error("Error sending typing notification:", error);
    return { error: "Đã xảy ra lỗi khi gửi thông báo đang nhập" };
  }
}

export async function createGroupConversation(formData: FormData) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return { error: "Bạn cần đăng nhập để thực hiện hành động này" };
  }

  try {
    const name = formData.get("name") as string;
    const participantIds = JSON.parse(
      formData.get("participantIds") as string
    ) as string[];
    const initialMessage = formData.get("initialMessage") as string;

    if (!name || !participantIds || participantIds.length < 2) {
      return { error: "Thiếu thông tin cần thiết để tạo nhóm chat" };
    }

    // Make sure current user is included
    if (!participantIds.includes(session.user.id)) {
      participantIds.push(session.user.id);
    }

    const result = await createConversation({
      participantIds,
      message: initialMessage || "Đã tạo nhóm chat",
      senderId: session.user.id,
      isGroup: true,
      groupName: name,
    });

    return result;
  } catch (error) {
    console.error("Error creating group conversation:", error);
    return { error: "Đã xảy ra lỗi khi tạo nhóm chat" };
  }
}

export async function uploadMessageFile(formData: FormData) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return { error: "Bạn cần đăng nhập để thực hiện hành động này" };
  }

  try {
    const file = formData.get("file") as File;

    if (!file) {
      return { error: "Không tìm thấy file" };
    }

    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return { error: "Kích thước file không được vượt quá 10MB" };
    }

    // For development, instead of using Vercel Blob which requires a token,
    // we'll return a placeholder URL for images or pretend the file was uploaded
    let placeholderUrl;
    if (file.type.startsWith("image/")) {
      // For images, use a placeholder image service
      placeholderUrl = `https://picsum.photos/800/600?random=${Math.random()}`;
    } else {
      // For other files, use a generic file URL
      placeholderUrl = `/api/files/${uuidv4()}-${file.name}`;
    }

    return {
      success: true,
      url: placeholderUrl,
      fileName: file.name,
      fileType: file.type,
    };

    // The Vercel Blob storage code is commented out since it requires a token
    // Uncomment this when you have the BLOB_READ_WRITE_TOKEN configured
    /*
    // Generate a unique filename
    const filename = `messages/${session.user.id}/${uuidv4()}-${file.name}`;

    // Upload to Vercel Blob
    const blob = await put(filename, file, {
      access: "public",
    });

    return {
      success: true,
      url: blob.url,
      fileName: file.name,
      fileType: file.type,
    };
    */
  } catch (error) {
    console.error("Error uploading file:", error);
    return { error: "Đã xảy ra lỗi khi tải lên file" };
  }
}

export async function getUnreadMessageCount(userId: string) {
  try {
    const unreadMessages = await db.unreadMessage.findMany({
      where: {
        userId,
      },
    });

    const totalCount = unreadMessages.reduce(
      (sum, item) => sum + item.count,
      0
    );

    return { count: totalCount };
  } catch (error) {
    console.error("Error getting unread message count:", error);
    return { error: "Đã xảy ra lỗi khi lấy số tin nhắn chưa đọc" };
  }
}
