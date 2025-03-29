import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Calendar, Clock, Users, GraduationCap, CheckCircle, BookOpen, Target, MapPin } from "lucide-react"
import { courses, teachers } from "@/lib/database"

export default async function CourseDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const course = courses.find((course) => course.slug === resolvedParams.slug);

  if (!course) {
    notFound()
  }

  const courseTeachers = teachers.filter((teacher) => course.teacherIds.includes(teacher.id))
  //   const courseTestimonials = testimonials.filter((testimonial) => course.testimonialIds.includes(testimonial.id))
  const relatedCourses = courses.filter((c) => course.relatedCourseIds.includes(c.id))

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-16 lg:py-20 bg-gradient-hero">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2 mb-3">
                <Badge
                  variant={
                    course.level === "Cơ bản" ? "default" : course.level === "Trung cấp" ? "secondary" : "destructive"
                  }
                >
                  {course.level}
                </Badge>
                <Badge variant="outline">{course.language}</Badge>
                {course.isNew && (
                  <Badge variant="outline" className="bg-green-100">
                    Mới
                  </Badge>
                )}
                {course.isPopular && (
                  <Badge variant="outline" className="bg-blue-100">
                    Phổ biến
                  </Badge>
                )}
              </div>
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">{course.title}</h1>
              <p className="text-muted-foreground md:text-xl">{course.description}</p>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button size="lg" className="bg-gradient-primary" asChild>
                  <Link href={`/courses/${course.slug}/register`}>Đăng ký ngay</Link>
                </Button>
                <Button size="lg" variant="outline" className="border-primary hover:bg-primary/10" asChild>
                  <Link href="/contact">Tư vấn miễn phí</Link>
                </Button>
              </div>
            </div>
            <div className="mx-auto lg:mx-0 relative aspect-video overflow-hidden rounded-xl">
              <Image
                src={course.image || "/placeholder.svg?height=720&width=1280"}
                alt={course.title}
                width={1280}
                height={720}
                className="object-cover"
              />
              {course.hasPromotion && (
                <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-2 rounded-md text-sm font-medium">
                  Giảm {course.promotionPercent}%
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Course Details */}
      <section className="w-full py-12 md:py-16 lg:py-20 bg-background">
        <div className="container px-4 md:px-6">
          <div className="grid gap-10 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-4 bg-gradient-hero">
                  <TabsTrigger value="overview">Tổng quan</TabsTrigger>
                  <TabsTrigger value="curriculum">Chương trình</TabsTrigger>
                  <TabsTrigger value="teachers">Giảng viên</TabsTrigger>
                  <TabsTrigger value="reviews">Đánh giá</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="mt-6 space-y-8">
                  <div>
                    <h2 className="text-2xl font-bold mb-4">Giới thiệu khóa học</h2>
                    <div className="prose max-w-none">
                      {course.fullDescription.split("\n").map((paragraph, index) => (
                        <p key={index} className="mb-4 text-muted-foreground">
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold mb-4">Đặc điểm nổi bật</h2>
                    <div className="grid gap-4 sm:grid-cols-2">
                      {course.features.map((feature, index) => (
                        <div key={index} className="flex items-start">
                          <CheckCircle className="mr-2 h-5 w-5 text-primary shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid gap-8 md:grid-cols-2">
                    <div>
                      <h2 className="text-2xl font-bold mb-4">Yêu cầu</h2>
                      <ul className="space-y-2">
                        {course.requirements.map((requirement, index) => (
                          <li key={index} className="flex items-start">
                            <CheckCircle className="mr-2 h-5 w-5 text-primary shrink-0 mt-0.5" />
                            <span>{requirement}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold mb-4">Kết quả đầu ra</h2>
                      <ul className="space-y-2">
                        {course.outcomes.map((outcome, index) => (
                          <li key={index} className="flex items-start">
                            <Target className="mr-2 h-5 w-5 text-primary shrink-0 mt-0.5" />
                            <span>{outcome}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold mb-4">Câu hỏi thường gặp</h2>
                    <Accordion type="single" collapsible className="w-full">
                      {course.faq.map((item, index) => (
                        <AccordionItem key={index} value={`item-${index}`}>
                          <AccordionTrigger className="text-left">{item.question}</AccordionTrigger>
                          <AccordionContent>{item.answer}</AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </div>
                </TabsContent>

                <TabsContent value="curriculum" className="mt-6 space-y-8">
                  <h2 className="text-2xl font-bold mb-4">Chương trình học</h2>
                  <Accordion type="single" collapsible className="w-full">
                    {course.curriculum.map((section, sectionIndex) => (
                      <AccordionItem key={sectionIndex} value={`section-${sectionIndex}`}>
                        <AccordionTrigger className="text-left">
                          <div className="flex items-center">
                            <span className="font-medium">{section.title}</span>
                            <Badge variant="outline" className="ml-2">
                              {section.lessons.length} bài học
                            </Badge>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-4 pt-2">
                            {section.lessons.map((lesson, lessonIndex) => (
                              <div key={lessonIndex} className="border rounded-md p-4">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <h4 className="font-medium">{lesson.title}</h4>
                                    <p className="text-sm text-muted-foreground mt-1">{lesson.description}</p>
                                  </div>
                                  <div className="flex items-center text-sm text-muted-foreground">
                                    <Clock className="mr-1 h-4 w-4" />
                                    <span>{lesson.duration}</span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </TabsContent>

                <TabsContent value="teachers" className="mt-6 space-y-8">
                  <h2 className="text-2xl font-bold mb-4">Giảng viên</h2>
                  <div className="grid gap-6 md:grid-cols-2">
                    {courseTeachers.map((teacher) => (
                      <Card key={teacher.id} className="overflow-hidden">
                        <CardContent className="p-0">
                          <div className="flex flex-col md:flex-row">
                            <div className="relative w-full md:w-1/3 aspect-square md:aspect-auto">
                              <Image
                                src={teacher.avatar || "/placeholder.svg"}
                                alt={teacher.name}
                                fill
                                className="object-cover rounded-lg px-3"
                              />
                            </div>
                            <div className="p-6 md:w-2/3">
                              <h3 className="text-xl font-bold">{teacher.name}</h3>
                              <p className="text-primary">{teacher.position}</p>
                              <p className="text-sm text-muted-foreground mt-2">{teacher.bio}</p>
                              <div className="mt-4">
                                <Link
                                  href={`/teachers/${teacher.slug}`}
                                  className="text-primary hover:underline text-sm font-medium"
                                >
                                  Xem chi tiết
                                </Link>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="reviews" className="mt-6 space-y-8">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold">Đánh giá từ học viên</h2>
                    {/* <div className="flex items-center">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star key={star} className="h-5 w-5 text-yellow-500 fill-yellow-500" strokeWidth={1} />
                        ))}
                      </div>
                      <span className="ml-2 text-lg font-medium">
                        {courseTestimonials.length > 0
                          ? (
                              courseTestimonials.reduce((acc, testimonial) => acc + testimonial.rating, 0) /
                              courseTestimonials.length
                            ).toFixed(1)
                          : "0.0"}
                      </span>
                      <span className="ml-1 text-muted-foreground">({courseTestimonials.length} đánh giá)</span>
                    </div> */}
                  </div>

                  <div className="space-y-6">
                    {/* {courseTestimonials.map((testimonial) => (
                      <div key={testimonial.id} className="border rounded-lg p-6">
                        <div className="flex items-start space-x-4">
                          <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0">
                            <Image
                              src={testimonial.avatar || "/placeholder.svg"}
                              alt={testimonial.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h4 className="font-medium">{testimonial.name}</h4>
                              <span className="text-sm text-muted-foreground">{testimonial.date}</span>
                            </div>
                            <div className="flex mt-1 mb-2">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={`h-4 w-4 ${
                                    star <= testimonial.rating
                                      ? "text-yellow-500 fill-yellow-500"
                                      : "text-muted-foreground"
                                  }`}
                                  strokeWidth={1}
                                />
                              ))}
                            </div>
                            <p className="text-muted-foreground">{testimonial.comment}</p>
                          </div>
                        </div>
                      </div>
                    ))} */}
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            <div className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-4">Thông tin khóa học</h3>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <Calendar className="mr-3 h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium">Thời lượng</p>
                        <p className="text-sm text-muted-foreground">{course.duration}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Clock className="mr-3 h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium">Lịch học</p>
                        <p className="text-sm text-muted-foreground">{course.schedule}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Users className="mr-3 h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium">Quy mô lớp</p>
                        <p className="text-sm text-muted-foreground">{course.groupSize}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <BookOpen className="mr-3 h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium">Hình thức học</p>
                        <p className="text-sm text-muted-foreground">{course.format}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <GraduationCap className="mr-3 h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium">Trình độ</p>
                        <p className="text-sm text-muted-foreground">{course.level}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <MapPin className="mr-3 h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium">Địa điểm</p>
                        <p className="text-sm text-muted-foreground">
                          {course.format === "Trực tuyến" ? "Học trực tuyến" : "Cơ sở Quận 7, TP. Hồ Chí Minh"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">Học phí</span>
                      {course.hasPromotion && (
                        <span className="text-sm line-through text-muted-foreground">
                          {course.price.toLocaleString("vi-VN")} đ
                        </span>
                      )}
                    </div>
                    <div className="text-2xl font-bold text-primary">
                      {/* {(course.hasPromotion ? course.promotionPrice : course.price).toLocaleString("vi-VN")} đ */}
                    </div>
                    {course.hasPromotion && (
                      <div className="text-sm text-green-600 mt-1">
                        Tiết kiệm {course.promotionPercent}% - Giảm{" "}
                        {(course.price - (course.promotionPrice || 0)).toLocaleString("vi-VN")} đ
                      </div>
                    )}

                    <Button className="w-full mt-4 bg-gradient-primary" size="lg" asChild>
                      <Link href={`/courses/${course.slug}/register`}>Đăng ký ngay</Link>
                    </Button>
                    <Button variant="outline" className="w-full mt-2" size="lg" asChild>
                      <Link href="/contact">Tư vấn miễn phí</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold mb-4">Khai giảng sắp tới</h3>
                  <div className="space-y-4">
                    <div className="border rounded-md p-4">
                      <div className="flex justify-between items-center mb-2">
                        <Badge>Còn chỗ</Badge>
                        <span className="text-sm text-muted-foreground">10/15 học viên</span>
                      </div>
                      <p className="font-medium">Lớp sáng - 15/06/2023</p>
                      <p className="text-sm text-muted-foreground">9:00 - 11:00, Thứ 2 & Thứ 4</p>
                      <Button className="w-full mt-3" size="sm" asChild>
                        <Link href={`/courses/${course.slug}/register?class=morning`}>Đăng ký</Link>
                      </Button>
                    </div>
                    <div className="border rounded-md p-4">
                      <div className="flex justify-between items-center mb-2">
                        <Badge>Còn chỗ</Badge>
                        <span className="text-sm text-muted-foreground">8/15 học viên</span>
                      </div>
                      <p className="font-medium">Lớp tối - 16/06/2023</p>
                      <p className="text-sm text-muted-foreground">18:00 - 20:00, Thứ 3 & Thứ 5</p>
                      <Button className="w-full mt-3" size="sm" asChild>
                        <Link href={`/courses/${course.slug}/register?class=evening`}>Đăng ký</Link>
                      </Button>
                    </div>
                    <div className="border rounded-md p-4">
                      <div className="flex justify-between items-center mb-2">
                        <Badge variant="secondary">Sắp đầy</Badge>
                        <span className="text-sm text-muted-foreground">13/15 học viên</span>
                      </div>
                      <p className="font-medium">Lớp cuối tuần - 17/06/2023</p>
                      <p className="text-sm text-muted-foreground">9:00 - 11:00, Thứ 7 & Chủ nhật</p>
                      <Button className="w-full mt-3" size="sm" asChild>
                        <Link href={`/courses/${course.slug}/register?class=weekend`}>Đăng ký</Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Related Courses */}
      <section className="w-full py-12 md:py-16 lg:py-20 bg-gradient-hero">
        <div className="container px-4 md:px-6">
          <h2 className="text-2xl font-bold text-center mb-10">Khóa học liên quan</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedCourses.slice(0, 3).map((relatedCourse) => (
              <Card key={relatedCourse.id} className="h-full flex flex-col">
                <div className="relative aspect-video overflow-hidden">
                  <Image
                    src={relatedCourse.image || "/placeholder.svg"}
                    alt={relatedCourse.title}
                    width={600}
                    height={340}
                    className="object-cover rounded-t-lg"
                  />
                  {relatedCourse.hasPromotion && (
                    <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-medium">
                      Giảm {relatedCourse.promotionPercent}%
                    </div>
                  )}
                </div>
                <CardContent className="flex-grow flex flex-col p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge
                      variant={
                        relatedCourse.level === "Cơ bản"
                          ? "default"
                          : relatedCourse.level === "Trung cấp"
                            ? "secondary"
                            : "destructive"
                      }
                    >
                      {relatedCourse.level}
                    </Badge>
                    <Badge variant="outline">{relatedCourse.language}</Badge>
                  </div>
                  <h3 className="text-lg font-bold mb-2">{relatedCourse.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{relatedCourse.description}</p>
                  <div className="mt-auto">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <Clock className="mr-1 h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">{relatedCourse.duration}</span>
                      </div>
                      <div className="flex items-center">
                        <Users className="mr-1 h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">{relatedCourse.groupSize}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        {relatedCourse.hasPromotion ? (
                          <div className="flex items-center gap-2">
                            <span className="text-lg font-bold">
                              {relatedCourse.promotionPrice?.toLocaleString("vi-VN")} đ
                            </span>
                            <span className="text-sm text-muted-foreground line-through">
                              {relatedCourse.price.toLocaleString("vi-VN")} đ
                            </span>
                          </div>
                        ) : (
                          <span className="text-lg font-bold">{relatedCourse.price.toLocaleString("vi-VN")} đ</span>
                        )}
                      </div>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/courses/${relatedCourse.slug}`}>Chi tiết</Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-12 md:py-16 lg:py-20 bg-gradient-primary text-primary-foreground">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 items-center">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                Sẵn sàng bắt đầu hành trình học tập của bạn?
              </h2>
              <p className="max-w-[600px] md:text-xl/relaxed">
                Đăng ký ngay hôm nay để nhận tư vấn miễn phí và ưu đãi đặc biệt dành cho học viên mới.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row lg:justify-end">
              <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-white/90" asChild>
                <Link href={`/courses/${course.slug}/register`}>Đăng ký ngay</Link>
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

