/* eslint-disable @typescript-eslint/no-unused-vars */
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BankPaymentForm } from "@/components/payment/bank-payment-form"
import { MomoPaymentForm } from "@/components/payment/momo-payment-form"
import { getUserEnrollments } from "@/lib/actions/enrollment"
import { formatCurrency } from "@/lib/utils"
import { authOptions } from "@/lib/auth"

export default async function PaymentPage() {
    const session = await getServerSession(authOptions)

    if (!session) {
        redirect("/login")
    }

    const { enrollments, error } = await getUserEnrollments(session.user.id)

    // Calculate total amount due
    const totalDue =
        enrollments?.reduce((total, enrollment) => {
            if (enrollment.status === "PENDING") {
                return total + Number(enrollment.course.price)
            }
            return total
        }, 0) || 0

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Thanh toán</h1>
                <p className="text-muted-foreground">Thanh toán học phí cho các khóa học của bạn</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Thông tin thanh toán</CardTitle>
                        <CardDescription>Các khóa học cần thanh toán</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {enrollments && enrollments.length > 0 ? (
                            <div className="space-y-4">
                                {enrollments
                                    .filter((enrollment) => enrollment.status === "PENDING")
                                    .map((enrollment) => (
                                        <div key={enrollment.id} className="flex justify-between items-center border-b pb-2">
                                            <div>
                                                <p className="font-medium">{enrollment.course.title}</p>
                                                <p className="text-sm text-muted-foreground">
                                                    Đăng ký: {new Date(enrollment.enrolledAt).toLocaleDateString("vi-VN")}
                                                </p>
                                            </div>
                                            <p className="font-medium">{formatCurrency(Number(enrollment.course.price))}</p>
                                        </div>
                                    ))}
                                <div className="flex justify-between items-center pt-2 font-bold">
                                    <p>Tổng cộng</p>
                                    <p>{formatCurrency(totalDue)}</p>
                                </div>
                            </div>
                        ) : (
                            <p className="text-muted-foreground">Bạn không có khóa học nào cần thanh toán</p>
                        )}
                    </CardContent>
                </Card>

                {totalDue > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Phương thức thanh toán</CardTitle>
                            <CardDescription>Chọn phương thức thanh toán phù hợp</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Tabs defaultValue="bank">
                                <TabsList className="grid w-full grid-cols-2">
                                    <TabsTrigger value="bank">Chuyển khoản ngân hàng</TabsTrigger>
                                    <TabsTrigger value="momo">Momo</TabsTrigger>
                                </TabsList>
                                <TabsContent value="bank" className="mt-4">
                                    <BankPaymentForm
                                        amount={totalDue}
                                        enrollmentIds={enrollments?.filter((e) => e.status === "PENDING").map((e) => e.id) || []}
                                    />
                                </TabsContent>
                                <TabsContent value="momo" className="mt-4">
                                    <MomoPaymentForm
                                        amount={totalDue}
                                        enrollmentIds={enrollments?.filter((e) => e.status === "PENDING").map((e) => e.id) || []}
                                    />
                                </TabsContent>
                            </Tabs>
                        </CardContent>
                        <CardFooter className="text-sm text-muted-foreground">
                            <p>Sau khi thanh toán, vui lòng chờ xác nhận từ nhà trường.</p>
                        </CardFooter>
                    </Card>
                )}
            </div>
        </div>
    )
}

