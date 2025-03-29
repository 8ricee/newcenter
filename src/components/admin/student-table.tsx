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

interface Student {
  id: string;
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
  phone?: string | null;
  address?: string | null;
  enrollments: unknown[]; // Assuming it's an array, refine if the type is known
}

interface StudentTableProps {
  students: Student[];
}

export function StudentTable({ students }: StudentTableProps) {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredStudents = students.filter(
    (student: Student) =>
      student.user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.user.email?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-4">
      <div className="flex items-center">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm học viên..."
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
              <TableHead>Tên học viên</TableHead>
              <TableHead>Số điện thoại</TableHead>
              <TableHead>Địa chỉ</TableHead>
              <TableHead>Khóa học</TableHead>
              <TableHead className="w-[100px]">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredStudents.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  Không tìm thấy học viên nào
                </TableCell>
              </TableRow>
            ) : (
              filteredStudents.map((student: Student) => (
                <TableRow key={student.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        {student.user.image ? (
                          <Image
                            src={student.user.image || "/placeholder.svg"}
                            alt={student.user.name || "Student"}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <span className="text-primary font-medium">{student.user.name?.charAt(0) || "S"}</span>
                        )}
                      </div>
                      <div>
                        <div className="font-medium">{student.user.name}</div>
                        <div className="text-sm text-muted-foreground">{student.user.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{student.phone || <span className="text-muted-foreground">Chưa cập nhật</span>}</TableCell>
                  <TableCell>
                    {student.address ? (
                      <span className="truncate max-w-[200px] block">{student.address}</span>
                    ) : (
                      <span className="text-muted-foreground">Chưa cập nhật</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge>{student.enrollments.length}</Badge>
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
                          <Link href={`/admin/students/${student.id}`}>Xem chi tiết</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/admin/students/${student.id}/edit`}>Chỉnh sửa</Link>
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