"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, MapPin, Users } from "lucide-react"
import Link from "next/link"

interface ClassItem {
  id: number;
  courseId: number;
  courseName: string;
  slug: string;
  description: string;
  date: string;
  time: string;
  teacher: string;
  location: string;
  language: string;
  level: string;
  status: "Còn chỗ" | "Hết chỗ";
}

export default function SchedulePage() {
  const groupedClassesAll = groupClassesByDate(classes);
  const englishClasses = classes.filter((c) => c.language === "Tiếng Anh");
  const groupedClassesEnglish = groupClassesByDate(englishClasses);
  const japaneseClasses = classes.filter((c) => c.language === "Tiếng Nhật");
  const groupedClassesJapanese = groupClassesByDate(japaneseClasses);
  const koreanClasses = classes.filter((c) => c.language === "Tiếng Hàn");
  const groupedClassesKorean = groupClassesByDate(koreanClasses);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-hero">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Lịch học</h1>
              <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Xem lịch học và đăng ký các lớp học phù hợp với thời gian của bạn
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Schedule Tabs */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-background">
        <div className="container px-4 md:px-6">
          <Tabs defaultValue="all" className="w-full">
            <div className="flex justify-center mb-8">
              <TabsList className="grid w-full max-w-md grid-cols-4 bg-gradient-hero">
                <TabsTrigger value="all">Tất cả</TabsTrigger>
                <TabsTrigger value="english">Tiếng Anh</TabsTrigger>
                <TabsTrigger value="japanese">Tiếng Nhật</TabsTrigger>
                <TabsTrigger value="korean">Tiếng Hàn</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="all" className="mt-6">
              <div className="space-y-8">
                {Object.entries(groupedClassesAll).map(([date, classes]) => (
                  <div key={date}>
                    <h2 className="text-2xl font-bold mb-4">{date}</h2>
                    <div className="grid gap-4">
                      {classes.map((classItem: ClassItem) => (
                        <ClassCard key={classItem.id} classItem={classItem} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="english" className="mt-6">
              <div className="space-y-8">
                {Object.entries(groupedClassesEnglish).map(
                  ([date, classes]) => (
                    <div key={date}>
                      <h2 className="text-2xl font-bold mb-4">{date}</h2>
                      <div className="grid gap-4">
                        {classes.map((classItem: ClassItem) => (
                          <ClassCard key={classItem.id} classItem={classItem} />
                        ))}
                      </div>
                    </div>
                  ),
                )}
              </div>
            </TabsContent>

            <TabsContent value="japanese" className="mt-6">
              <div className="space-y-8">
                {Object.entries(groupedClassesJapanese).map(
                  ([date, classes]) => (
                    <div key={date}>
                      <h2 className="text-2xl font-bold mb-4">{date}</h2>
                      <div className="grid gap-4">
                        {classes.map((classItem: ClassItem) => (
                          <ClassCard key={classItem.id} classItem={classItem} />
                        ))}
                      </div>
                    </div>
                  ),
                )}
              </div>
            </TabsContent>

            <TabsContent value="korean" className="mt-6">
              <div className="space-y-8">
                {Object.entries(groupedClassesKorean).map(
                  ([date, classes]) => (
                    <div key={date}>
                      <h2 className="text-2xl font-bold mb-4">{date}</h2>
                      <div className="grid gap-4">
                        {classes.map((classItem: ClassItem) => (
                          <ClassCard key={classItem.id} classItem={classItem} />
                        ))}
                      </div>
                    </div>
                  ),
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  )
}

function ClassCard({ classItem }: { classItem: ClassItem }) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="grid gap-4 md:grid-cols-4">
          <div className="md:col-span-2 space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant={classItem.status === "Còn chỗ" ? "default" : "secondary"}>{classItem.status}</Badge>
              <Badge variant="outline">{classItem.language}</Badge>
              <Badge variant="outline">{classItem.level}</Badge>
            </div>
            <h3 className="text-lg font-bold">{classItem.courseName}</h3>
            <p className="text-muted-foreground">{classItem.description}</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center">
              <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
              <span>{classItem.date}</span>
            </div>
            <div className="flex items-center">
              <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
              <span>{classItem.time}</span>
            </div>
            <div className="flex items-center">
              <Users className="mr-2 h-4 w-4 text-muted-foreground" />
              <span>{classItem.teacher}</span>
            </div>
            <div className="flex items-center">
              <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
              <span>{classItem.location}</span>
            </div>
          </div>

          <div className="flex items-center justify-end">
            <Button asChild disabled={classItem.status !== "Còn chỗ"}>
              <Link href={`/courses/${classItem.courseId}/`}>Đăng ký</Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Helper function to group classes by date
function groupClassesByDate(classes: ClassItem[]): Record<string, ClassItem[]> {
  return classes.reduce((groups: Record<string, ClassItem[]>, classItem) => {
    const date = classItem.date
    if (!groups[date]) {
      groups[date] = []
    }
    groups[date].push(classItem)
    return groups
  }, {})
}

// Sample data
const classes: ClassItem[] = [
  {
    id: 1,
    courseId: 1,
    courseName: "Tiếng Anh giao tiếp",
    slug: "tieng-anh-giao-tiep",
    description: "Lớp học tập trung vào kỹ năng giao tiếp tiếng Anh cơ bản",
    date: "Thứ Hai, 15/05/2023",
    time: "18:00 - 19:30",
    teacher: "Sarah Johnson",
    location: "Phòng 101, Cơ sở Quận 7",
    language: "Tiếng Anh",
    level: "Cơ bản",
    status: "Còn chỗ",
  },
  {
    id: 2,
    courseId: 2,
    courseName: "IELTS Academic",
    slug: "ielts-academic",
    description: "Lớp luyện thi IELTS Academic với phương pháp hiệu quả",
    date: "Thứ Hai, 15/05/2023",
    time: "19:45 - 21:45",
    teacher: "Nguyễn Văn Minh",
    location: "Phòng 201, Cơ sở Quận 7",
    language: "Tiếng Anh",
    level: "Nâng cao",
    status: "Hết chỗ",
  },
  {
    id: 3,
    courseId: 1,
    courseName: "Tiếng Nhật cho người mới bắt đầu",
    slug: "tieng-nhat-cho-nguoi-moi-bat-dau",
    description: "Lớp học tập trung vào kỹ năng giao tiếp tiếng Anh cơ bản",
    date: "Thứ Tư, 17/05/2023",
    time: "18:00 - 19:30",
    teacher: "Sarah Johnson",
    location: "Phòng 101, Cơ sở Quận 7",
    language: "Tiếng Anh",
    level: "Cơ bản",
    status: "Còn chỗ",
  },
]
