/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { formatCurrency } from "@/lib/utils"
import { PaymentDialog } from "@/components/payment/payment-dialog"

interface PaymentListProps {
    enrollments: any[]
}

export function PaymentList({ enrollments }: PaymentListProps) {
    const [selectedEnrollment, setSelectedEnrollment] = useState<any | null>(null)
    const [paymentDialogOpen, setPaymentDialogOpen] = useState(false)

    const handlePayment = (enrollment: any) => {
        setSelectedEnrollment(enrollment)
        setPaymentDialogOpen(true)
    }

    return (
        <div className="space-y-4">
            {enrollments.map((enrollment) => (
                <Card key={enrollment.id}>
                    <CardHeader>
                        <CardTitle>{enrollment.course.title}</CardTitle>
                        <CardDescription>
                            {enrollment.course.level} • {enrollment.course.duration} tuần • {enrollment.course.lessons} buổi học
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Học phí:</span>
                                <span className="font-medium">{formatCurrency(Number(enrollment.course.price))}</span>
                            </div>
                            {enrollment.discount > 0 && (
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Giảm giá:</span>
                                    <span className="font-medium text-green-600">
                                        -{formatCurrency(Number(enrollment.course.price) * (enrollment.discount / 100))}
                                    </span>
                                </div>
                            )}
                            <div className="flex justify-between border-t pt-2 mt-2">
                                <span className="font-medium">Tổng cộng:</span>
                                <span className="font-bold">
                                    {formatCurrency(
                                        Number(enrollment.course.price) * (1 - enrollment.discount / 100)
                                    )}
                                </span>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button className="w-full" onClick={() => handlePayment(enrollment)}>
                            Thanh toán ngay
                        </Button>
                    </CardFooter>
                </Card>
            ))}

            <PaymentDialog
                open={paymentDialogOpen}
                onOpenChange={setPaymentDialogOpen}
                enrollment={selectedEnrollment}
            />
        </div>
    )
}
