"use client"

import { useState } from "react"
import Link from "next/link"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { MoreHorizontal, Search } from "lucide-react"
import Image from "next/image"

interface Teacher {
    id: string;
    user: {
        name?: string | null;
        email?: string | null;
        image?: string | null;
    };
    position?: string | null;
    specialization?: string | null;
    courses: unknown[]; // Assuming it's an array, refine if the type is known
}

interface TeacherTableProps {
    teachers: Teacher[];
}

export function TeacherTable({ teachers }: TeacherTableProps) {
    const [searchTerm, setSearchTerm] = useState("")

    const filteredTeachers = teachers.filter(
        (teacher: Teacher) =>
            teacher.user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            teacher.position?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            teacher.specialization?.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    return (
        <div className="space-y-4">
            <div className="flex items-center">
                <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Tìm kiếm giảng viên..."
                        className="pl-8"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Tên giảng viên</TableHead>
                            <TableHead>Chức vụ</TableHead>
                            <TableHead>Chuyên môn</TableHead>
                            <TableHead>Khóa học</TableHead>
                            <TableHead className="w-[100px]">Thao tác</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredTeachers.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center">
                                    Không tìm thấy giảng viên nào
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredTeachers.map((teacher: Teacher) => (
                                <TableRow key={teacher.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                                {teacher.user.image ? (
                                                    <Image
                                                        src={teacher.user.image || "/placeholder.svg"}
                                                        alt={teacher.user.name || "Teacher"}
                                                        className="w-10 h-10 rounded-full object-cover"
                                                    />
                                                ) : (
                                                    <span className="text-primary font-medium">{teacher.user.name?.charAt(0) || "T"}</span>
                                                )}
                                            </div>
                                            <div>
                                                <div className="font-medium">{teacher.user.name}</div>
                                                <div className="text-sm text-muted-foreground">{teacher.user.email}</div>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>{teacher.position || "Giảng viên"}</TableCell>
                                    <TableCell>
                                        {teacher.specialization ? (
                                            <Badge variant="outline">{teacher.specialization}</Badge>
                                        ) : (
                                            <span className="text-muted-foreground">Chưa cập nhật</span>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <Badge>{teacher.courses.length}</Badge>
                                    </TableCell>
                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                    <span className="sr-only">Mở menu</span>
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem asChild>
                                                    <Link href={`/admin/teachers/${teacher.id}`}>Xem chi tiết</Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem asChild>
                                                    <Link href={`/admin/teachers/${teacher.id}/edit`}>Chỉnh sửa</Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="text-red-600">Xóa</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}