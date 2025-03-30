/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { updateUser } from "@/lib/actions/user"
import { ImageUpload } from "@/components/ui/image-upload"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"

interface ProfileFormProps {
    user: any
}

export function ProfileForm({ user }: ProfileFormProps) {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)

    const formSchema = z.object({
        name: z.string().min(1, { message: "Tên là bắt buộc" }),
        email: z.string().email({ message: "Email không hợp lệ" }),
        image: z.string().optional(),
        password: z.string().min(6, { message: "Mật khẩu phải có ít nhất 6 ký tự" }).optional().or(z.literal("")),
        ...(user.role === "STUDENT"
            ? {
                phoneNumber: z.string().optional(),
                dateOfBirth: z.string().optional(),
                address: z.string().optional(),
            }
            : user.role === "TEACHER"
                ? {
                    phoneNumber: z.string().optional(),
                    bio: z.string().optional(),
                    specialties: z.string().optional(),
                    education: z.string().optional(),
                    experience: z.coerce.number().optional(),
                }
                : {}),
    })

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: user.name || "",
            email: user.email || "",
            image: user.image || "",
            password: "",
            ...(user.role === "STUDENT" && user.student
                ? {
                    phoneNumber: user.student.phoneNumber || "",
                    dateOfBirth: user.student.dateOfBirth
                        ? new Date(user.student.dateOfBirth).toISOString().split("T")[0]
                        : "",
                    address: user.student.address || "",
                }
                : user.role === "TEACHER" && user.teacher
                    ? {
                        phoneNumber: user.teacher.phoneNumber || "",
                        bio: user.teacher.bio || "",
                        specialties: user.teacher.specialties?.join(", ") || "",
                        education: user.teacher.education || "",
                        experience: user.teacher.experience || undefined,
                    }
                    : {}),
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true)

        const formData = new FormData()
        Object.entries(values).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== "") {
                formData.append(key, value.toString())
            }
        })

        const result = await updateUser(user.id, formData)
        setIsLoading(false)

        if (result.error) {
            toast.error(
                typeof result.error === "string"
                    ? result.error
                    : "Đã xảy ra lỗi khi cập nhật thông tin"
            )
            return
        }

        toast.success("Thông tin cá nhân đã được cập nhật")
        router.refresh()
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="flex justify-center mb-6">
                    <FormField
                        control={form.control}
                        name="image"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <ImageUpload onUpload={field.onChange} defaultImage={field.value} type="avatar" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Họ và tên</FormLabel>
                                <FormControl>
                                    <Input placeholder="Nhập họ và tên" {...field} />
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
                                    <Input placeholder="Nhập email" {...field} disabled />
                                </FormControl>
                                <FormDescription>Email không thể thay đổi</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Mật khẩu</FormLabel>
                                <FormControl>
                                    <Input type="password" placeholder="Nhập mật khẩu mới" {...field} />
                                </FormControl>
                                <FormDescription>Để trống nếu không muốn thay đổi mật khẩu</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {user.role === "STUDENT" && (
                        <>
                            <FormField
                                control={form.control}
                                name="phoneNumber"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Số điện thoại</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Nhập số điện thoại" {...field} value={field.value as string} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="dateOfBirth"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Ngày sinh</FormLabel>
                                        <FormControl>
                                            <Input type="date" {...field} value={field.value as string} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="address"
                                render={({ field }) => (
                                    <FormItem className="md:col-span-2">
                                        <FormLabel>Địa chỉ</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Nhập địa chỉ" {...field} value={field.value as string} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </>
                    )}

                    {user.role === "TEACHER" && (
                        <>
                            <FormField
                                control={form.control}
                                name="phoneNumber"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Số điện thoại</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Nhập số điện thoại" {...field} value={field.value as string} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="experience"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Số năm kinh nghiệm</FormLabel>
                                        <FormControl>
                                            <Input type="number" placeholder="Nhập số năm kinh nghiệm" {...field} value={field.value as string} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="education"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Học vấn</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Nhập thông tin học vấn" {...field} value={field.value as string} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="specialties"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Chuyên môn</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Nhập chuyên môn (phân cách bằng dấu phẩy)" {...field} value={field.value as string} />
                                        </FormControl>
                                        <FormDescription>Ví dụ: Tiếng Anh giao tiếp, IELTS, TOEIC</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="bio"
                                render={({ field }) => (
                                    <FormItem className="md:col-span-2">
                                        <FormLabel>Giới thiệu</FormLabel>
                                        <FormControl>
                                            <Textarea placeholder="Nhập thông tin giới thiệu" className="min-h-[120px]" {...field} value={field.value as string} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </>
                    )}
                </div>

                <Button type="submit" disabled={isLoading}>
                    {isLoading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Đang lưu...
                        </>
                    ) : (
                        "Lưu thay đổi"
                    )}
                </Button>
            </form>
        </Form>
    )
}
