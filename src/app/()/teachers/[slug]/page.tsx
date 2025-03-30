import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  GraduationCap,
  Award,
  Globe,
  Calendar,
  Clock,
  Facebook,
  Linkedin,
  Twitter,
  Instagram,
  Mail,
  Phone,
} from "lucide-react"
import { teachers, courses } from "@/lib/database"

export default async function TeacherDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const teacher = teachers.find((teacher) => teacher.slug === resolvedParams.slug);

  if (!teacher) {
    notFound()
  }

  const teacherCourses = courses.filter((course) => teacher.courseIds.includes(course.id))

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-16 lg:py-20 bg-gradient-hero">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2 mb-3">
                {teacher.languages.map((language, index) => (
                  <Badge key={index} variant="outline">
                    {language}
                  </Badge>
                ))}
              </div>
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">{teacher.name}</h1>
              <p className="text-primary font-medium text-xl">{teacher.position}</p>
              <p className="text-muted-foreground md:text-lg">{teacher.bio}</p>
              <div className="flex space-x-4 mt-2">
                {teacher.socialMedia.facebook && (
                  <Button variant="ghost" size="icon" asChild>
                    <Link href={teacher.socialMedia.facebook} target="_blank" rel="noopener noreferrer">
                      <Facebook className="h-5 w-5" />
                      <span className="sr-only">Facebook</span>
                    </Link>
                  </Button>
                )}
                {teacher.socialMedia.linkedin && (
                  <Button variant="ghost" size="icon" asChild>
                    <Link href={teacher.socialMedia.linkedin} target="_blank" rel="noopener noreferrer">
                      <Linkedin className="h-5 w-5" />
                      <span className="sr-only">LinkedIn</span>
                    </Link>
                  </Button>
                )}
                {teacher.socialMedia.twitter && (
                  <Button variant="ghost" size="icon" asChild>
                    <Link href={teacher.socialMedia.twitter} target="_blank" rel="noopener noreferrer">
                      <Twitter className="h-5 w-5" />
                      <span className="sr-only">Twitter</span>
                    </Link>
                  </Button>
                )}
                {teacher.socialMedia.instagram && (
                  <Button variant="ghost" size="icon" asChild>
                    <Link href={teacher.socialMedia.instagram} target="_blank" rel="noopener noreferrer">
                      <Instagram className="h-5 w-5" />
                      <span className="sr-only">Instagram</span>
                    </Link>
                  </Button>
                )}
              </div>
            </div>
            <div className="mx-auto lg:mx-0 relative">
              <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden mx-auto">
                <Image
                  src={teacher.avatar || "/placeholder.svg"}
                  alt={teacher.name}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Teacher Details */}
      <section className="w-full py-12 md:py-16 lg:py-20 bg-background">
        <div className="container px-4 md:px-6">
          <div className="grid gap-10 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <Tabs defaultValue="about" className="w-full">
                <TabsList className="grid w-full grid-cols-3 bg-gradient-hero">
                  <TabsTrigger value="about">Giới thiệu</TabsTrigger>
                  <TabsTrigger value="courses">Khóa học</TabsTrigger>
                  <TabsTrigger value="schedule">Lịch giảng dạy</TabsTrigger>
                </TabsList>

                <TabsContent value="about" className="mt-6 space-y-8">
                  <div>
                    <h2 className="text-2xl font-bold mb-4">Tiểu sử</h2>
                    <div className="prose max-w-none">
                      {teacher.fullBio.split("\n").map((paragraph, index) => (
                        <p key={index} className="mb-4 text-muted-foreground">
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  </div>

                  <div className="grid gap-8 md:grid-cols-2">
                    <div>
                      <h2 className="text-2xl font-bold mb-4">Học vấn & Kinh nghiệm</h2>
                      <div className="space-y-4">
                        <div className="flex items-start">
                          <GraduationCap className="mr-3 h-5 w-5 text-primary shrink-0 mt-0.5" />
                          <div>
                            <p className="font-medium">Học vấn</p>
                            <p className="text-muted-foreground">{teacher.education}</p>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <Clock className="mr-3 h-5 w-5 text-primary shrink-0 mt-0.5" />
                          <div>
                            <p className="font-medium">Kinh nghiệm</p>
                            <p className="text-muted-foreground">{teacher.experience}</p>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <Globe className="mr-3 h-5 w-5 text-primary shrink-0 mt-0.5" />
                          <div>
                            <p className="font-medium">Chuyên môn</p>
                            <p className="text-muted-foreground">{teacher.specialization}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold mb-4">Thành tựu</h2>
                      <ul className="space-y-2">
                        {teacher.achievements.map((achievement, index) => (
                          <li key={index} className="flex items-start">
                            <Award className="mr-2 h-5 w-5 text-primary shrink-0 mt-0.5" />
                            <span className="text-muted-foreground">{achievement}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="courses" className="mt-6 space-y-8">
                  <h2 className="text-2xl font-bold mb-4">Khóa học giảng dạy</h2>
                  <div className="grid gap-6 md:grid-cols-2">
                    {teacherCourses.map((course) => (
                      <Card key={course.id} className="h-full flex flex-col px-6">
                        <div className="relative aspect-video overflow-hidden">
                          <Image
                            src={course.image || "/placeholder.svg"}
                            alt={course.title}
                            width={600}
                            height={340}
                            className="object-cover rounded-t-lg"
                          />
                          {course.hasPromotion && (
                            <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-medium">
                              Giảm {course.promotionPercent}%
                            </div>
                          )}
                        </div>
                        <CardContent className="flex-grow flex flex-col p-6">
                          <div className="flex items-center gap-2 mb-2">
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
                            <Badge variant="outline">{course.language}</Badge>
                          </div>
                          <h3 className="text-lg font-bold mb-2">{course.title}</h3>
                          <p className="text-sm text-muted-foreground mb-4">{course.description}</p>
                          <div className="mt-auto">
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center">
                                <Clock className="mr-1 h-4 w-4 text-muted-foreground" />
                                <span className="text-sm text-muted-foreground">{course.duration}</span>
                              </div>
                              <div>
                                {course.hasPromotion ? (
                                  <div className="flex items-center gap-2">
                                    <span className="text-lg font-bold">
                                      {course.promotionPrice?.toLocaleString("vi-VN")} đ
                                    </span>
                                    <span className="text-sm text-muted-foreground line-through">
                                      {course.price.toLocaleString("vi-VN")} đ
                                    </span>
                                  </div>
                                ) : (
                                  <span className="text-lg font-bold">{course.price.toLocaleString("vi-VN")} đ</span>
                                )}
                              </div>
                            </div>
                            <Button className="w-full" asChild>
                              <Link href={`/courses/${course.slug}`}>Xem chi tiết</Link>
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="schedule" className="mt-6 space-y-8">
                  <h2 className="text-2xl font-bold mb-4">Lịch giảng dạy</h2>
                  <div className="space-y-4">
                    {teacher.scheduleAvailability.map((schedule, index) => (
                      <Card key={index}>
                        <CardContent className="p-6">
                          <div className="flex items-start">
                            <Calendar className="mr-3 h-5 w-5 text-primary shrink-0 mt-0.5" />
                            <div>
                              <p className="font-medium">{schedule.day}</p>
                              <p className="text-muted-foreground">{schedule.hours}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  <div className="bg-gradient-hero p-6 rounded-lg mt-8">
                    <h3 className="text-lg font-bold mb-3">Đặt lịch học với giảng viên</h3>
                    <p className="text-muted-foreground mb-4">
                      Bạn có thể đặt lịch học trực tiếp với giảng viên {teacher.name} thông qua form dưới đây hoặc liên
                      hệ với chúng tôi qua số điện thoại 090 123 4567.
                    </p>
                    <Button asChild>
                      <Link href="/contact">Đặt lịch ngay</Link>
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            <div className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-4">Thông tin liên hệ</h3>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <Mail className="mr-3 h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium">Email</p>
                        <p className="text-sm text-muted-foreground">info@languagecenter.com</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Phone className="mr-3 h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium">Điện thoại</p>
                        <p className="text-sm text-muted-foreground">090 123 4567</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Calendar className="mr-3 h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium">Lịch giảng dạy</p>
                        <p className="text-sm text-muted-foreground">
                          {teacher.scheduleAvailability
                            .map((schedule) => `${schedule.day}: ${schedule.hours}`)
                            .join(", ")}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t">
                    <Button className="w-full" asChild>
                      <Link href="/contact">Liên hệ giảng viên</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-4">Ngôn ngữ giảng dạy</h3>
                  <div className="flex flex-wrap gap-2">
                    {teacher.languages.map((language, index) => (
                      <Badge key={index} variant="outline" className="text-sm py-1 px-3">
                        {language}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-4">Đăng ký tư vấn</h3>
                  <p className="text-muted-foreground mb-4">
                    Đăng ký để nhận tư vấn miễn phí về các khóa học phù hợp với bạn từ giảng viên {teacher.name}.
                  </p>
                  <Button className="w-full" asChild>
                    <Link href="/contact">Đăng ký tư vấn</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-12 md:py-16 lg:py-20 bg-gradient-primary text-primary-foreground">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 items-center">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                Học cùng giảng viên {teacher.name}
              </h2>
              <p className="max-w-[600px] md:text-xl/relaxed">
                Đăng ký khóa học ngay hôm nay để được học tập cùng với giảng viên {teacher.name} và nhận ưu đãi đặc
                biệt.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row lg:justify-end">
              <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-white/90" asChild>
                <Link href="/courses">Xem khóa học</Link>
              </Button>
              <Button size="lg" className="bg-white/20 hover:bg-white/30 text-white" asChild>
                <Link href="/contact">Liên hệ tư vấn</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

