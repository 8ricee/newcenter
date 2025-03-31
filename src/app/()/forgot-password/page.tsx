/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { useState } from "react"
import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner" // Import toast from sonner
import { requestPasswordReset } from "@/lib/actions/auth"
import { Loader2 } from "lucide-react"

const formSchema = z.object({
    email: z.string().email({ message: "Email không hợp lệ" }),
})

export default function ForgotPasswordPage() {
    const [isLoading, setIsLoading] = useState(false)
    const [isSubmitted, setIsSubmitted] = useState(false)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true)

        try {
            const result = await requestPasswordReset(values.email)

            if (result.error) {
                toast.error(result.error) // Use sonner's toast.error
                setIsLoading(false)
                return
            }

            setIsSubmitted(true)
        } catch (error) {
            toast.error("Đã xảy ra lỗi khi gửi yêu cầu đặt lại mật khẩu") // Use sonner's toast.error
            setIsLoading(false)
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-muted py-12">
            <div className="container px-4 md:px-6">
                <div className="mx-auto grid w-full max-w-md gap-6">
                    <Card>
                        <CardHeader className="space-y-1">
                            <CardTitle className="text-2xl font-bold">Quên mật khẩu</CardTitle>
                            <CardDescription>Nhập email của bạn để đặt lại mật khẩu</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {isSubmitted ? (
                                <div className="bg-green-50 p-4 rounded-md mb-4">
                                    <p className="text-green-800 font-medium">Yêu cầu đã được gửi!</p>
                                    <p className="text-green-700 text-sm mt-1">
                                        Chúng tôi đã gửi email hướng dẫn đặt lại mật khẩu đến địa chỉ email của bạn. Vui lòng kiểm tra hộp
                                        thư đến của bạn.
                                    </p>
                                </div>
                            ) : (
                                <Form {...form}>
                                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                        <FormField
                                            control={form.control}
                                            name="email"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Email</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="name@example.com" {...field} />
                                                    </FormControl>
                                                    <FormDescription>
                                                        Chúng tôi sẽ gửi cho bạn một email với liên kết để đặt lại mật khẩu.
                                                    </FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <Button type="submit" className="w-full" disabled={isLoading}>
                                            {isLoading ? (
                                                <>
                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                    Đang gửi...
                                                </>
                                            ) : (
                                                "Gửi liên kết đặt lại"
                                            )}
                                        </Button>
                                    </form>
                                </Form>
                            )}
                        </CardContent>
                        <CardFooter className="flex flex-col">
                            <div className="text-sm text-muted-foreground text-center mt-2">
                                <Link href="/login" className="text-primary underline-offset-4 hover:underline">
                                    Quay lại trang đăng nhập
                                </Link>
                            </div>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </div>
    )
}