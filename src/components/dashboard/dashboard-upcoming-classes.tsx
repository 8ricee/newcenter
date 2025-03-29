"use client"

import { format } from "date-fns"
import { vi } from "date-fns/locale"
import { Calendar, Clock, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"

interface ClassItem {
    id: string;
    course: {
        id: string; // Added the 'id' property
        image?: string | null;
        title: string;
    };
    currentStudents: number;
    maxStudents: number;
    startDate: string;
    startTime: string;
    endTime: string;
    location?: string | null;
    room?: string | null;
}

type Role = "STUDENT" | "TEACHER";

interface DashboardUpcomingClassesProps {
    classes: ClassItem[];
    role: Role;
}

export function DashboardUpcomingClasses({ classes, role }: DashboardUpcomingClassesProps) {
    if (!classes || classes.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-10">
                <p className="text-muted-foreground mb-4">Bạn không có lịch học nào sắp tới</p>
                <Button asChild>
                    <a href={role === "STUDENT" ? "/courses" : "/dashboard/schedule"}>
                        {role === "STUDENT" ? "Khám phá khóa học" : "Xem lịch dạy"}
                    </a>
                </Button>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            {classes.map((classItem: ClassItem) => (
                <div key={classItem.id} className="flex flex-col md:flex-row gap-4 p-4 border rounded-lg">
                    <div className="md:w-1/4">
                        <div className="aspect-video rounded-md bg-muted/30 flex items-center justify-center overflow-hidden">
                            {classItem.course.image ? (
                                <Image
                                    src={classItem.course.image || "/placeholder.svg"}
                                    alt={classItem.course.title}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <span className="text-muted-foreground">Không có hình ảnh</span>
                            )}
                        </div>
                    </div>
                    <div className="flex-1">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-2">
                            <h3 className="font-semibold text-lg">{classItem.course.title}</h3>
                            <Badge variant={classItem.currentStudents >= classItem.maxStudents ? "destructive" : "default"}>
                                {classItem.currentStudents}/{classItem.maxStudents} học viên
                            </Badge>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4">
                            <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm">
                                    {format(new Date(classItem.startDate), "EEEE, dd/MM/yyyy", { locale: vi })}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm">
                                    {classItem.startTime} - {classItem.endTime}
                                </span>
                            </div>
                            {classItem.location && (
                                <div className="flex items-center gap-2 md:col-span-2">
                                    <MapPin className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm">
                                        {classItem.location}
                                        {classItem.room ? `, Phòng ${classItem.room}` : ""}
                                    </span>
                                </div>
                            )}
                        </div>
                        <div className="flex justify-end">
                            <Button variant="outline" size="sm" asChild>
                                <a
                                    href={
                                        role === "TEACHER"
                                            ? `/dashboard/schedule/${classItem.id}`
                                            : `/dashboard/my-courses/${classItem.course.id}`
                                    }
                                >
                                    {role === "TEACHER" ? "Chi tiết lớp học" : "Xem khóa học"}
                                </a>
                            </Button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}