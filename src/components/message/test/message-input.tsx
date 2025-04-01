"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Send } from "lucide-react"
import { sendMessage } from "@/lib/actions/test/message"
import { FormEvent, KeyboardEvent } from "react"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

interface MessageInputProps {
  receiverId: string;
}

export function MessageInput({ receiverId }: MessageInputProps) {
  const router = useRouter()
  const [content, setContent] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (!content.trim()) return

    try {
      setIsLoading(true)
      const session = await getServerSession(authOptions);
      if (!session?.user?.id) {
        console.error("Không tìm thấy ID người dùng trong session");
        return;
      }

      await sendMessage({
        conversationId: receiverId,
        senderId: session.user.id,
        content: content,
      });
      setContent("")
      router.refresh()
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-end gap-2">
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Nhập tin nhắn..."
        className="resize-none"
        rows={1}
      />
      <Button type="submit" size="icon" disabled={!content.trim() || isLoading}>
        <Send className="h-4 w-4" />
      </Button>
    </form>
  )
}