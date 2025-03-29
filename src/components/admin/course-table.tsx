"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Input } from "@/components/ui/input"
import { MoreHorizontal, Search } from "lucide-react"
import { deleteCourse } from "@/lib/actions/course"

interface Course {
  id: string;
  title: string;
  language: string;
  level: "Cơ bản" | "Trung cấp" | "Nâng cao" | string;
  price: number;
  promotionPrice?: number | null;
  hasPromotion: boolean;
  teacher: {
    user: {
      name: string;
    };
  };
  format: string;
}

interface CourseTableProps {
  courses: Course[];
}

export function CourseTable({ courses }: CourseTableProps) {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [courseToDelete, setCourseToDelete] = useState<Course | null>(null)

  const filteredCourses = courses.filter(
    (course: Course) =>
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.language.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.level.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleDelete = async () => {
    if (!courseToDelete) return

    const result = await deleteCourse(courseToDelete.id)

    if (result.success) {
      setIsDeleteDialogOpen(false)
      setCourseToDelete(null)
      router.refresh()
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm khóa học..."
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
              <TableHead>Tên khóa học</TableHead>
              <TableHead>Ngôn ngữ</TableHead>
              <TableHead>Trình độ</TableHead>
              <TableHead>Giá</TableHead>
              <TableHead>Giảng viên</TableHead>
              <TableHead className="w-[100px]">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCourses.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  Không tìm thấy khóa học nào
                </TableCell>
              </TableRow>
            ) : (
              filteredCourses.map((course: Course) => (
                <TableRow key={course.id}>
                  <TableCell>
                    <div className="font-medium">{course.title}</div>
                    <div className="text-sm text-muted-foreground">{course.format}</div>
                  </TableCell>
                  <TableCell>{course.language}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        course.level === "Cơ bản"
                          ? "default"
                          : course.level === "Trung cấp"
                            ? "secondary"
                            : "destructive"
                      }
                    >
                      {course.level}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {course.hasPromotion ? (
                      <div>
                        <span className="font-medium">{course.promotionPrice?.toLocaleString("vi-VN")} đ</span>
                        <span className="text-sm text-muted-foreground line-through ml-2">
                          {course.price.toLocaleString("vi-VN")} đ
                        </span>
                      </div>
                    ) : (
                      <span className="font-medium">{course.price.toLocaleString("vi-VN")} đ</span>
                    )}
                  </TableCell>
                  <TableCell>{course.teacher.user.name}</TableCell>
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
                          <Link href={`/admin/courses/${course.id}`}>Chỉnh sửa</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => {
                            setCourseToDelete(course)
                            setIsDeleteDialogOpen(true)
                          }}
                        >
                          Xóa
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa khóa học</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa khóa học &quot;
              {courseToDelete?.title}&quot;? Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction className="bg-red-600 hover:bg-red-700" onClick={handleDelete}>
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}