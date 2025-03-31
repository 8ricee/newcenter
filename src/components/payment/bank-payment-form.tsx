/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner" // Import toast from sonner
import { createPayment } from "@/lib/actions/payment"
import { Loader2 } from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"

const formSchema = z.object({
    bank: z.string().min(1, { message: "Vui lòng chọn ngân hàng" }),
    accountName: z.string().min(1, { message: "Tên người chuyển khoản là bắt buộc" }),
    transactionId: z.string().min(1, { message: "Mã giao dịch là bắt buộc" }),
    note: z.string().optional(),
})

interface BankPaymentFormProps {
    amount: number
    enrollmentIds: string[]
}

export function BankPaymentForm({ amount, enrollmentIds }: BankPaymentFormProps) {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            bank: "",
            accountName: "",
            transactionId: "",
            note: "",
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        if (enrollmentIds.length === 0) {
            toast.error("Không có khóa học nào cần thanh toán") // Use sonner's toast.error
            return
        }

        setIsLoading(true)

        try {
            const result = await createPayment({
                method: "BANK",
                amount,
                enrollmentIds,
                metadata: {
                    bank: values.bank,
                    accountName: values.accountName,
                    transactionId: values.transactionId,
                    note: values.note,
                },
            })

            if (result.error) {
                toast.error(result.error) // Use sonner's toast.error
                setIsLoading(false)
                return
            }

            toast.success("Thông tin thanh toán đã được ghi nhận. Vui lòng chờ xác nhận từ nhà trường.") // Use sonner's toast.success

            router.push("/dashboard/courses")
            router.refresh()
        } catch (error) {
            toast.error("Đã xảy ra lỗi khi xử lý thanh toán") // Use sonner's toast.error
            setIsLoading(false)
        }
    }

    return (
        <div className="space-y-4">
            <Card className="bg-muted/50">
                <CardContent className="p-4">
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <p className="font-medium">Ngân hàng nhận</p>
                            <p>Vietcombank</p>
                        </div>
                        <div className="flex justify-between">
                            <p className="font-medium">Số tài khoản</p>
                            <p>1234567890</p>
                        </div>
                        <div className="flex justify-between">
                            <p className="font-medium">Chủ tài khoản</p>
                            <p>TRUNG TÂM NGOẠI NGỮ ABC</p>
                        </div>
                        <div className="flex justify-between">
                            <p className="font-medium">Số tiền</p>
                            <p className="font-bold">{formatCurrency(amount)}</p>
                        </div>
                        <div className="flex justify-between">
                            <p className="font-medium">Nội dung chuyển khoản</p>
                            <p>HP_{enrollmentIds[0]}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                        control={form.control}
                        name="bank"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Ngân hàng chuyển</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Chọn ngân hàng" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="Vietcombank">Vietcombank</SelectItem>
                                        <SelectItem value="Techcombank">Techcombank</SelectItem>
                                        <SelectItem value="BIDV">BIDV</SelectItem>
                                        <SelectItem value="Agribank">Agribank</SelectItem>
                                        <SelectItem value="VPBank">VPBank</SelectItem>
                                        <SelectItem value="TPBank">TPBank</SelectItem>
                                        <SelectItem value="MBBank">MBBank</SelectItem>
                                        <SelectItem value="ACB">ACB</SelectItem>
                                        <SelectItem value="Sacombank">Sacombank</SelectItem>
                                        <SelectItem value="other">Ngân hàng khác</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="accountName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Tên người chuyển khoản</FormLabel>
                                <FormControl>
                                    <Input placeholder="Nhập tên người chuyển khoản" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="transactionId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Mã giao dịch</FormLabel>
                                <FormControl>
                                    <Input placeholder="Nhập mã giao dịch" {...field} />
                                </FormControl>
                                <FormDescription>Mã giao dịch được cung cấp sau khi bạn hoàn tất chuyển khoản</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="note"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Ghi chú (tùy chọn)</FormLabel>
                                <FormControl>
                                    <Textarea placeholder="Nhập ghi chú nếu có" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Đang xử lý...
                            </>
                        ) : (
                            "Xác nhận thanh toán"
                        )}
                    </Button>
                </form>
            </Form>
        </div>
    )
}