"use server"

import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { auth } from "@/auth"

export async function sendMessage(receiverId: string, content: string) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return { error: "Bạn cần đăng nhập để gửi tin nhắn" }
    }

    const message = await db.message.create({
      data: {
        content,
        senderId: session.user.id,
        receiverId,
      },
    })

    revalidatePath(`/dashboard/messages/${receiverId}`)
    return { success: true, message }
  } catch (error) {
    console.error(error)
    return { error: "Đã xảy ra lỗi khi gửi tin nhắn" }
  }
}

export async function markAsRead(messageId: string) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return { error: "Bạn cần đăng nhập để đánh dấu tin nhắn đã đọc" }
    }

    const message = await db.message.findUnique({
      where: { id: messageId },
    })

    if (!message || message.receiverId !== session.user.id) {
      return { error: "Không có quyền đánh dấu tin nhắn này" }
    }

    await db.message.update({
      where: { id: messageId },
      data: { read: true },
    })

    revalidatePath(`/dashboard/messages`)
    revalidatePath(`/dashboard/messages/${message.senderId}`)
    return { success: true }
  } catch (error) {
    console.error(error)
    return { error: "Đã xảy ra lỗi khi đánh dấu tin nhắn đã đọc" }
  }
}

export async function getConversations() {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return { error: "Bạn cần đăng nhập để xem tin nhắn" }
    }

    // Get all users that the current user has exchanged messages with
    const sentMessages = await db.message.findMany({
      where: { senderId: session.user.id },
      select: { receiverId: true },
      distinct: ["receiverId"],
    })

    const receivedMessages = await db.message.findMany({
      where: { receiverId: session.user.id },
      select: { senderId: true },
      distinct: ["senderId"],
    })

    // Combine unique user IDs
    const userIds = new Set([...sentMessages.map((m) => m.receiverId), ...receivedMessages.map((m) => m.senderId)])

    // Get user details and latest message for each conversation
    const conversations = await Promise.all(
      Array.from(userIds).map(async (userId) => {
        const user = await db.user.findUnique({
          where: { id: userId },
          select: {
            id: true,
            name: true,
            image: true,
            role: true,
          },
        })

        const latestMessage = await db.message.findFirst({
          where: {
            OR: [
              { senderId: session.user.id, receiverId: userId },
              { senderId: userId, receiverId: session.user.id },
            ],
          },
          orderBy: { createdAt: "desc" },
        })

        const unreadCount = await db.message.count({
          where: {
            senderId: userId,
            receiverId: session.user.id,
            read: false,
          },
        })

        return {
          user,
          latestMessage,
          unreadCount,
        }
      }),
    )

    return { conversations }
  } catch (error) {
    console.error(error)
    return { error: "Đã xảy ra lỗi khi lấy danh sách cuộc trò chuyện" }
  }
}

export async function getMessages(otherUserId: string) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return { error: "Bạn cần đăng nhập để xem tin nhắn" }
    }

    const messages = await db.message.findMany({
      where: {
        OR: [
          { senderId: session.user.id, receiverId: otherUserId },
          { senderId: otherUserId, receiverId: session.user.id },
        ],
      },
      orderBy: { createdAt: "asc" },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        receiver: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    })

    // Mark all unread messages as read
    await db.message.updateMany({
      where: {
        senderId: otherUserId,
        receiverId: session.user.id,
        read: false,
      },
      data: { read: true },
    })

    const otherUser = await db.user.findUnique({
      where: { id: otherUserId },
      select: {
        id: true,
        name: true,
        image: true,
        role: true,
      },
    })

    revalidatePath(`/dashboard/messages`)
    revalidatePath(`/dashboard/messages/${otherUserId}`)

    return { messages, otherUser }
  } catch (error) {
    console.error(error)
    return { error: "Đã xảy ra lỗi khi lấy tin nhắn" }
  }
}

