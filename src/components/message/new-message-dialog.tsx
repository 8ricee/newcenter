/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner" // Import toast from sonner
import { createConversation } from "@/lib/actions/message"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Loader2 } from "lucide-react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

const formSchema = z.object({
    recipientId: z.string().min(1, { message: "Vui lòng chọn người nhận" }),
    message: z.string().min(1, { message: "Tin nhắn không được để trống" }),
})

interface NewConversationFormProps {
    users: any[]
    currentUserId: string
}

export function NewConversationForm({ users, currentUserId }: NewConversationFormProps) {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            recipientId: "",
            message: "",
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true)

        try {
            const result = await createConversation({
                participantIds: [currentUserId, values.recipientId],
                message: values.message,
                senderId: currentUserId,
            })

            if (result.error) {
                toast.error(result.error)
                setIsLoading(false)
                return
            }

            if (result.conversation && result.conversation.id) {
                toast.success("Đã tạo cuộc trò chuyện mới")
                router.push(`/dashboard/messages/${result.conversation.id}`)
                router.refresh()
            } else {
                toast.error("Đã có lỗi xảy ra, không thể tạo cuộc trò chuyện hoặc không nhận được thông tin cuộc trò chuyện.");
            }

            setIsLoading(false)
        } catch (error) {
            toast.error("Đã xảy ra lỗi khi tạo cuộc trò chuyện")
            setIsLoading(false)
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                    control={form.control}
                    name="recipientId"
                    render={({ field }) => (
                        <FormItem className="space-y-3">
                            <FormLabel>Người nhận</FormLabel>
                            <FormControl>
                                <RadioGroup
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                    className="flex flex-col space-y-2"
                                >
                                    {users.map((user) => (
                                        <FormItem
                                            key={user.id}
                                            className="flex items-center space-x-3 space-y-0 rounded-md border p-4 hover:bg-accent"
                                        >
                                            <FormControl>
                                                <RadioGroupItem value={user.id} />
                                            </FormControl>
                                            <div className="flex items-center gap-3">
                                                <Avatar>
                                                    <AvatarImage src={user.image || ""} />
                                                    <AvatarFallback>{user.name?.charAt(0) || user.email?.charAt(0) || "U"}</AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <p className="font-medium">{user.name}</p>
                                                    <p className="text-sm text-muted-foreground">{user.email}</p>
                                                </div>
                                            </div>
                                        </FormItem>
                                    ))}
                                </RadioGroup>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Tin nhắn</FormLabel>
                            <FormControl>
                                <Textarea placeholder="Nhập tin nhắn của bạn..." className="min-h-[100px]" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit" disabled={isLoading}>
                    {isLoading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Đang gửi...
                        </>
                    ) : (
                        "Gửi tin nhắn"
                    )}
                </Button>
            </form>
        </Form>
    )
}