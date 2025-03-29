"use client"

import { formatDistanceToNow } from "date-fns"
import { vi } from "date-fns/locale"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export function AdminRecentEnrollments({ enrollments }) {
    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Học viên</TableHead>
                        <TableHead>Khóa học</TableHead>
                        <TableHead>Trạng thái</TableHead>
                        <TableHead>Thời gian</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {enrollments.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={4} className="text-center">
                                Không có đăng ký nào gần đây
                            </TableCell>
                        </TableRow>
                    ) : (
                        enrollments.map((enrollment) => (
                            <TableRow key={enrollment.id}>
                                <TableCell>
                                    <div className="font-medium">{enrollment.student.user.name}</div>
                                </TableCell>
                                <TableCell>{enrollment.course.title}</TableCell>
                                <TableCell>
                                    <Badge variant={enrollment.paymentStatus === "Đã thanh toán" ? "default" : "secondary"}>
                                        {enrollment.paymentStatus}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    {formatDistanceToNow(new Date(enrollment.createdAt), {
                                        addSuffix: true,
                                        locale: vi,
                                    })}
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    )
}

