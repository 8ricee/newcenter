"use client"

import { useState } from "react"
import Link from "next/link"
import { format } from "date-fns"
import { vi } from "date-fns/locale"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { MoreHorizontal, Search } from "lucide-react"

export function ScheduleTable({ schedules }) {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredSchedules = schedules.filter(
    (schedule) =>
      schedule.course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      schedule.teacher.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      schedule.location?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getStatusBadge = (schedule) => {
    if (schedule.currentStudents >= schedule.maxStudents) {
      return <Badge variant="destructive">Hết chỗ</Badge>
    } else if (schedule.currentStudents >= schedule.maxStudents * 0.8) {
      return <Badge variant="secondary">Sắp đầy</Badge>
    } else {
      return <Badge variant="default">Còn chỗ</Badge>
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm lịch học..."
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
              <TableHead>Khóa học</TableHead>
              <TableHead>Giảng viên</TableHead>
              <TableHead>Thời gian</TableHead>
              <TableHead>Địa điểm</TableHead>
              <TableHead>Học viên</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead className="w-[100px]">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSchedules.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center">
                  Không tìm thấy lịch học nào
                </TableCell>
              </TableRow>
            ) : (
              filteredSchedules.map((schedule) => (
                <TableRow key={schedule.id}>
                  <TableCell>
                    <div className="font-medium">{schedule.course.title}</div>
                    <div className="text-sm text-muted-foreground">{schedule.course.level}</div>
                  </TableCell>
                  <TableCell>{schedule.teacher.user.name}</TableCell>
                  <TableCell>
                    <div>{format(new Date(schedule.startDate), "dd/MM/yyyy", { locale: vi })}</div>
                    <div className="text-sm text-muted-foreground">
                      {schedule.startTime} - {schedule.endTime}
                    </div>
                  </TableCell>
                  <TableCell>
                    {schedule.location ? (
                      <div>
                        {schedule.location}
                        {schedule.room && <span>, Phòng {schedule.room}</span>}
                      </div>
                    ) : (
                      <span className="text-muted-foreground">Trực tuyến</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {schedule.currentStudents}/{schedule.maxStudents}
                  </TableCell>
                  <TableCell>{getStatusBadge(schedule)}</TableCell>
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
                          <Link href={`/admin/schedules/${schedule.id}`}>Xem chi tiết</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/admin/schedules/${schedule.id}/edit`}>Chỉnh sửa</Link>
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

