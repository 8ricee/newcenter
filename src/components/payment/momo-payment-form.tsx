/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { toast } from "sonner" // Import toast from sonner
import { createPayment } from "@/lib/actions/payment"
import { Loader2 } from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface MomoPaymentFormProps {
    amount: number
    enrollmentIds: string[]
}

export function MomoPaymentForm({ amount, enrollmentIds }: MomoPaymentFormProps) {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [transactionId, setTransactionId] = useState("")

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()

        if (!transactionId) {
            toast.error("Vui lòng nhập mã giao dịch") // Use sonner's toast.error
            return
        }

        if (enrollmentIds.length === 0) {
            toast.error("Không có khóa học nào cần thanh toán") // Use sonner's toast.error
            return
        }

        setIsLoading(true)

        try {
            const result = await createPayment({
                method: "MOMO",
                amount,
                enrollmentIds,
                metadata: {
                    transactionId,
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
                            <p className="font-medium">Số điện thoại MoMo</p>
                            <p>0987654321</p>
                        </div>
                        <div className="flex justify-between">
                            <p className="font-medium">Tên người nhận</p>
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

            <div className="flex flex-col items-center justify-center p-4">
                <div className="bg-white p-4 rounded-lg mb-4">
                    <Image
                        src="/placeholder.svg?height=200&width=200"
                        alt="Mã QR MoMo"
                        width={200}
                        height={200}
                        className="mx-auto"
                    />
                </div>
                <p className="text-center text-sm text-muted-foreground mb-4">Quét mã QR bằng ứng dụng MoMo để thanh toán</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="transactionId">Mã giao dịch</Label>
                    <Input
                        id="transactionId"
                        placeholder="Nhập mã giao dịch MoMo"
                        value={transactionId}
                        onChange={(e) => setTransactionId(e.target.value)}
                        required
                    />
                    <p className="text-sm text-muted-foreground">
                        Mã giao dịch được cung cấp sau khi bạn hoàn tất thanh toán qua MoMo
                    </p>
                </div>

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
        </div>
    )
}