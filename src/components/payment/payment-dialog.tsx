/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { formatCurrency } from "@/lib/utils"
import { toast } from "sonner" // Import toast from sonner
import { createPayment } from "@/lib/actions/payment" // Import createPayment instead of processPayment
import { Loader2 } from 'lucide-react'

interface PaymentDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    enrollment: any
}

export function PaymentDialog({ open, onOpenChange, enrollment }: PaymentDialogProps) {
    const router = useRouter()
    const [paymentMethod, setPaymentMethod] = useState<string>("bank")
    const [bankInfo, setBankInfo] = useState({
        name: "",
        number: "",
        bank: "vietcombank",
    })
    const [isSubmitting, setIsSubmitting] = useState(false)

    if (!enrollment) return null

    const totalAmount = Number(enrollment.course.price) * (1 - enrollment.discount / 100)

    const handleSubmit = async () => {
        setIsSubmitting(true)
        try {
            const result = await createPayment({ // Call createPayment action
                method: paymentMethod === "bank" ? "BANK" : "MOMO",
                amount: totalAmount,
                enrollmentIds: [enrollment.id],
                metadata: paymentMethod === "bank" ? bankInfo : { type: "momo" },
            })

            if (result.error) {
                toast.error(result.error) // Use sonner's toast.error
                return
            }

            toast.success("Thanh toán thành công", { // Use sonner's toast.success
                description: "Cảm ơn bạn đã thanh toán. Khóa học của bạn đã được kích hoạt.",
            })

            onOpenChange(false)
            router.refresh()
        } catch (error) {
            console.error("Error processing payment:", error)
            toast.error("Đã xảy ra lỗi khi xử lý thanh toán") // Use sonner's toast.error
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Thanh toán khóa học</DialogTitle>
                    <DialogDescription>
                        Vui lòng chọn phương thức thanh toán cho khóa học {enrollment.course.title}
                    </DialogDescription>
                </DialogHeader>

                <Tabs defaultValue="bank" onValueChange={(value) => setPaymentMethod(value)}>
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="bank">Chuyển khoản ngân hàng</TabsTrigger>
                        <TabsTrigger value="momo">Momo</TabsTrigger>
                    </TabsList>

                    <TabsContent value="bank" className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="bank">Ngân hàng</Label>
                            <select
                                id="bank"
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                value={bankInfo.bank}
                                onChange={(e) => setBankInfo({ ...bankInfo, bank: e.target.value })}
                            >
                                <option value="vietcombank">Vietcombank</option>
                                <option value="techcombank">Techcombank</option>
                                <option value="bidv">BIDV</option>
                                <option value="vietinbank">Vietinbank</option>
                                <option value="mbbank">MB Bank</option>
                                <option value="tpbank">TPBank</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="name">Tên chủ tài khoản</Label>
                            <Input
                                id="name"
                                placeholder="Nguyễn Văn A"
                                value={bankInfo.name}
                                onChange={(e) => setBankInfo({ ...bankInfo, name: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="number">Số tài khoản</Label>
                            <Input
                                id="number"
                                placeholder="0123456789"
                                value={bankInfo.number}
                                onChange={(e) => setBankInfo({ ...bankInfo, number: e.target.value })}
                            />
                        </div>

                        <div className="rounded-md border p-4">
                            <p className="text-sm font-medium">Thông tin chuyển khoản:</p>
                            <div className="mt-2 space-y-1 text-sm">
                                <p>Ngân hàng: Vietcombank</p>
                                <p>Số tài khoản: 1234567890</p>
                                <p>Chủ tài khoản: TRUNG TAM NGON NGU</p>
                                <p>Nội dung: {enrollment.id} - {enrollment.course.title}</p>
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="momo" className="space-y-4 py-4">
                        <div className="flex flex-col items-center space-y-4">
                            <div className="text-center">
                                <p className="font-medium">Quét mã QR để thanh toán</p>
                                <p className="text-sm text-muted-foreground">Sử dụng ứng dụng Momo để quét mã</p>
                            </div>

                            <div className="relative h-64 w-64 border rounded-md p-2">
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <Image
                                        src="/placeholder.svg?height=240&width=240"
                                        alt="Mã QR Momo"
                                        width={240}
                                        height={240}
                                        className="rounded-md"
                                    />
                                </div>
                            </div>

                            <div className="text-center text-sm">
                                <p>Số tiền: {formatCurrency(totalAmount)}</p>
                                <p>Nội dung: {enrollment.id} - {enrollment.course.title}</p>
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>

                <div className="border-t pt-4">
                    <div className="flex justify-between mb-4">
                        <span className="font-medium">Tổng thanh toán:</span>
                        <span className="font-bold">{formatCurrency(totalAmount)}</span>
                    </div>
                    <Button onClick={handleSubmit} className="w-full" disabled={isSubmitting}>
                        {isSubmitting ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Đang xử lý...
                            </>
                        ) : (
                            "Xác nhận thanh toán"
                        )}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}