"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, SubmitHandler } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { toast } from "sonner" // Import toast from sonner
import { useSession } from "next-auth/react"

const formSchema = z
    .object({
        name: z.string().min(1, { message: "Tên là bắt buộc" }),
        email: z.string().email({ message: "Email không hợp lệ" }),
        currentPassword: z.string().optional(),
        newPassword: z.string().min(8, { message: "Mật khẩu phải có ít nhất 8 ký tự" }).optional(),
        confirmPassword: z.string().optional(),
    })
    .refine(
        (data) => {
            if (data.newPassword && !data.currentPassword) {
                return false
            }
            return true
        },
        {
            message: "Vui lòng nhập mật khẩu hiện tại",
            path: ["currentPassword"],
        },
    )
    .refine(
        (data) => {
            if (data.newPassword && data.confirmPassword !== data.newPassword) {
                return false
            }
            return true
        },
        {
            message: "Mật khẩu xác nhận không khớp",
            path: ["confirmPassword"],
        },
    )

// Định nghĩa type cho form values
type AccountSettingsFormValues = z.infer<typeof formSchema>;

export function AccountSettingsForm() {
    const [isLoading, setIsLoading] = useState(false)
    const { data: session, update } = useSession()

    const form = useForm<AccountSettingsFormValues>({ // Thêm generic type cho useForm
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: session?.user?.name || "",
            email: session?.user?.email || "",
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
        },
    })

    const onSubmit: SubmitHandler<AccountSettingsFormValues> = async (values) => {
        try {
            setIsLoading(true)
            // Giả lập API call
            await new Promise((resolve) => setTimeout(resolve, 1000))

            // Cập nhật session
            if (session) {
                await update({
                    ...session,
                    user: {
                        ...session.user,
                        name: values.name,
                    },
                })
            }

            toast.success("Cài đặt đã được lưu", {
                description: "Thông tin tài khoản đã được cập nhật thành công.",
            })

            // Reset password fields
            form.reset({
                ...values,
                currentPassword: "",
                newPassword: "",
                confirmPassword: "",
            })
        } catch (error) {
            console.error(error)
            toast.error("Đã xảy ra lỗi", {
                description: "Không thể lưu cài đặt. Vui lòng thử lại sau.",
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Tên</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input {...field} type="email" disabled />
                                </FormControl>
                                <FormDescription>Email không thể thay đổi</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="space-y-4">
                    <h3 className="text-lg font-medium">Đổi mật khẩu</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                            control={form.control}
                            name="currentPassword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Mật khẩu hiện tại</FormLabel>
                                    <FormControl>
                                        <Input {...field} type="password" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div></div>
                        <FormField
                            control={form.control}
                            name="newPassword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Mật khẩu mới</FormLabel>
                                    <FormControl>
                                        <Input {...field} type="password" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="confirmPassword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Xác nhận mật khẩu mới</FormLabel>
                                    <FormControl>
                                        <Input {...field} type="password" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>

                <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Đang lưu..." : "Lưu thay đổi"}
                </Button>
            </form>
        </Form>
    )
}