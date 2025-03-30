import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Users, Clock, BookOpen } from "lucide-react";
import { courses, CourseLanguage, CourseLevel, CourseFormat, Course } from "@/lib/database";

const levels: CourseLevel[] = ["Cơ bản", "Trung cấp", "Nâng cao"];
const formats: CourseFormat[] = ["Trực tiếp", "Trực tuyến", "Kết hợp"];

const courseLanguages: CourseLanguage[] = [
  "Tiếng Anh",
  "Tiếng Nhật",
  "Tiếng Hàn",
  "Tiếng Trung",
];

export default function CoursesPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 ">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Khóa học</h1>
              <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Khám phá các khóa học ngoại ngữ đa dạng, phù hợp với mọi trình độ và nhu cầu
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Search and Filter */}
      <section className="w-full py-8 bg-background">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-4">
            <div className="lg:col-span-1 space-y-6">
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Tìm kiếm</h3>
                <div className="flex w-full max-w-sm items-center space-x-2">
                  <Input type="text" placeholder="Tên khóa học..." />
                  <Button type="submit">Tìm</Button>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-medium">Ngôn ngữ</h3>
                <div className="space-y-1">
                  {courseLanguages.map((language) => (
                    <div key={language} className="flex items-center space-x-2">
                      <input type="checkbox" id={language} className="h-4 w-4 rounded border-gray-300" />
                      <Label htmlFor={language}>{language}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-medium">Trình độ</h3>
                <div className="space-y-1">
                  {levels.map((level) => (
                    <div key={level} className="flex items-center space-x-2">
                      <input type="checkbox" id={level} className="h-4 w-4 rounded border-gray-300" />
                      <Label htmlFor={level}>{level}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-medium">Hình thức học</h3>
                <div className="space-y-1">
                  {formats.map((format) => (
                    <div key={format} className="flex items-center space-x-2">
                      <input type="checkbox" id={format} className="h-4 w-4 rounded border-gray-300" />
                      <Label htmlFor={format}>{format}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-3">
              <Tabs defaultValue="all" className="w-full">
                <TabsList className="grid w-full grid-cols-4 bg-gradient-hero">
                  <TabsTrigger value="all">Tất cả</TabsTrigger>
                  <TabsTrigger value="popular">Phổ biến</TabsTrigger>
                  <TabsTrigger value="new">Mới nhất</TabsTrigger>
                  <TabsTrigger value="promotion">Khuyến mãi</TabsTrigger>
                </TabsList>
                <TabsContent value="all" className="mt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {courses.map((course) => (
                      <CourseCard key={course.id} course={course} />
                    ))}
                  </div>
                </TabsContent>
                <TabsContent value="popular" className="mt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {courses
                      .filter((course) => course.isPopular)
                      .map((course) => (
                        <CourseCard key={course.id} course={course} />
                      ))}
                  </div>
                </TabsContent>
                <TabsContent value="new" className="mt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {courses
                      .filter((course) => course.isNew)
                      .map((course) => (
                        <CourseCard key={course.id} course={course} />
                      ))}
                  </div>
                </TabsContent>
                <TabsContent value="promotion" className="mt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {courses
                      .filter((course) => course.hasPromotion)
                      .map((course) => (
                        <CourseCard key={course.id} course={course} />
                      ))}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

interface CourseCardProps {
  course: Course;
}

function CourseCard({ course }: CourseCardProps) {
  return (
    <Card className="flex flex-col h-full py-6">
      <CardHeader>
        <div className="relative aspect-video overflow-hidden rounded-lg mb-2">
          <Image
            src={course.image || "/placeholder.svg"}
            alt={course.title}
            width={600}
            height={340}
            className="object-cover"
          />
          {course.hasPromotion && (
            <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-medium">
              Giảm {course.promotionPercent}%
            </div>
          )}
        </div>
        <div className="flex items-center gap-2 mb-2">
          <Badge
            variant={course.level === "Cơ bản" ? "default" : course.level === "Trung cấp" ? "secondary" : "destructive"}
          >
            {course.level}
          </Badge>
          <Badge variant="outline">{course.language}</Badge>
          {course.isNew && (
            <Badge variant="outline" className="bg-green-100">
              Mới
            </Badge>
          )}
        </div>
        <CardTitle>{course.title}</CardTitle>
        <CardDescription>{course.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <ul className="space-y-2 text-sm">
          <li className="flex items-center">
            <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
            <span>{course.duration}</span>
          </li>
          <li className="flex items-center">
            <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
            <span>{course.schedule}</span>
          </li>
          <li className="flex items-center">
            <Users className="mr-2 h-4 w-4 text-muted-foreground" />
            <span>{course.groupSize}</span>
          </li>
          <li className="flex items-center">
            <BookOpen className="mr-2 h-4 w-4 text-muted-foreground" />
            <span>{course.format}</span>
          </li>
        </ul>
        <div className="mt-4">
          {course.hasPromotion ? (
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold">{course.promotionPrice?.toLocaleString("vi-VN") || course.price.toLocaleString("vi-VN")} đ</span>
              {course.promotionPrice && (
                <span className="text-sm text-muted-foreground line-through">
                  {course.price.toLocaleString("vi-VN")} đ
                </span>
              )}
            </div>
          ) : (
            <span className="text-lg font-bold">{course.price.toLocaleString("vi-VN")} đ</span>
          )}
        </div>
      </CardContent>
      <CardFooter className="pt-2">
        <Button asChild className="w-full">
          <Link href={`/courses/${course.slug}`}>Xem chi tiết</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}