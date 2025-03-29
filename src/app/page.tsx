"use client"

/* eslint-disable @typescript-eslint/no-explicit-any */
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, BookOpen, Calendar, GraduationCap, Users, Star } from "lucide-react"
import ScrollAnimation from "@/components/scroll-animation"
import { courses } from "@/lib/database";

export default function Home() {
  // Filter courses with id 1, 2, or 3
  const featuredCourses = courses.filter(course => course.id === 1 || course.id === 2 || course.id === 3);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative w-full py-12 md:py-24 lg:py-32 bg-gradient-hero">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <ScrollAnimation animation="animate-fade-up">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <Badge className="mb-2" variant="outline">
                    Trung tâm ngoại ngữ hàng đầu
                  </Badge>
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Mở cánh cửa tương lai với ngôn ngữ mới
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Phương pháp giảng dạy hiện đại, đội ngũ giáo viên chuyên nghiệp và môi trường học tập thân thiện.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button size="lg" className="bg-gradient-primary" asChild>
                    <Link href="/courses">
                      Khám phá khóa học <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" className="border-primary hover:bg-primary/10" asChild>
                    <Link href="/contact">Liên hệ tư vấn</Link>
                  </Button>
                </div>
              </div>
            </ScrollAnimation>
            <ScrollAnimation animation="animate-fade-up" delay="animate-delay-200">
              <div className="mx-auto lg:mx-0 relative aspect-video overflow-hidden rounded-xl shadow-lg">
                <Image
                  src="/image/2.jpg"
                  alt="Học viên đang học tập"
                  width={1280}
                  height={720}
                  className="object-cover"
                  priority
                />
              </div>
            </ScrollAnimation>
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-background">
        <div className="container px-4 md:px-6">
          <ScrollAnimation animation="animate-fade-up">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Khóa học nổi bật</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Các khóa học được thiết kế phù hợp với mọi trình độ và nhu cầu học tập
                </p>
              </div>
            </div>
          </ScrollAnimation>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8 grid-flow-row auto-rows-fr">
            {featuredCourses.map((course, index) => (
              <ScrollAnimation
                key={course.id}
                animation="animate-fade-up"
                delay={`animate-delay-${(index + 1) * 100}` as any}
              >
                <Card className="flex flex-col h-full card-hover">
                  <CardHeader className="space-y-3">
                    <div className="relative aspect-video overflow-hidden rounded-lg">
                      <Image
                        src={course.image || "/placeholder.svg"}
                        alt={course.title}
                        width={600}
                        height={340}
                        className="object-cover"
                      />
                    </div>
                    <div className="flex items-center gap-2">
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
                    <div>
                      <CardTitle className="mb-1">{course.title}</CardTitle>
                      <CardDescription>{course.description}</CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center">
                        <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span>{course.duration}</span>
                      </li>
                      <li className="flex items-center">
                        <Users className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span>{course.groupSize}</span>
                      </li>
                    </ul>
                  </CardContent>
                  <CardFooter className="pt-2">
                    <Button asChild className="w-full bg-gradient-primary">
                      <Link href={`/courses/${course.slug}`}>Xem chi tiết</Link>
                    </Button>
                  </CardFooter>
                </Card>
              </ScrollAnimation>
            ))}
          </div>
          <ScrollAnimation animation="animate-fade-up" delay="animate-delay-300">
            <div className="flex justify-center mt-10">
              <Button variant="outline" size="lg" className="border-primary hover:bg-primary/10" asChild>
                <Link href="/courses">
                  Xem tất cả khóa học <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </ScrollAnimation>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-hero">
        <div className="container px-4 md:px-6">
          <ScrollAnimation animation="animate-fade-up">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Tại sao chọn chúng tôi?</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Những lý do khiến chúng tôi trở thành lựa chọn hàng đầu cho việc học ngoại ngữ
                </p>
              </div>
            </div>
          </ScrollAnimation>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8 grid-flow-row auto-rows-fr">
            {features.map((feature, index) => (
              <ScrollAnimation
                key={feature.title}
                animation="animate-zoom-in"
                delay={`animate-delay-${(index + 1) * 100}` as any}
              >
                <div className="flex flex-col items-center text-center p-6 rounded-lg bg-background shadow-sm card-hover h-full">
                  <div className="p-3 rounded-full bg-primary/10 mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              </ScrollAnimation>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-background">
        <div className="container px-4 md:px-6">
          <ScrollAnimation animation="animate-fade-up">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Học viên nói gì về chúng tôi
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Phản hồi từ những học viên đã trải nghiệm các khóa học tại trung tâm
                </p>
              </div>
            </div>
          </ScrollAnimation>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8 grid-flow-row auto-rows-fr">
            {testimonials.map((testimonial, index) => (
              <ScrollAnimation
                key={index}
                animation={index % 2 === 0 ? "animate-slide-in-left" : "animate-slide-in-right"}
                delay={`animate-delay-${(index + 1) * 100}` as any}
              >
                <Card className="card-hover h-full p-3">
                  <div className="flex items-start space-x-3">
                    <div className="relative w-10 h-10 rounded-full overflow-hidden shrink-0">
                      <Image
                        src={testimonial.avatar || "/placeholder.svg"}
                        alt={testimonial.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex flex-col items-start text-left">
                      <p className="font-medium text-sm">{testimonial.name}</p>
                      <p className="text-xs text-muted-foreground">{testimonial.course}</p>
                      <div className="flex mt-0.5">
                        {Array(5)
                          .fill(0)
                          .map((_, i) => (
                            <Star
                              key={i}
                              className={`h-2.5 w-2.5 ${i < testimonial.rating ? "text-yellow-500 fill-yellow-500" : "text-muted-foreground"}`}
                            />
                          ))}
                      </div>
                    </div>
                  </div>
                  <div className="mt-2">
                    <p className="text-muted-foreground italic text-xs leading-relaxed">&quot;{testimonial.comment}&quot;</p>
                  </div>
                </Card>
              </ScrollAnimation>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-primary text-primary-foreground">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 items-center">
            <ScrollAnimation animation="animate-slide-in-left">
              <div className="space-y-4">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                  Sẵn sàng bắt đầu hành trình ngôn ngữ của bạn?
                </h2>
                <p className="max-w-[600px] md:text-xl/relaxed">
                  Đăng ký ngay hôm nay để nhận tư vấn miễn phí và ưu đãi đặc biệt dành cho học viên mới.
                </p>
              </div>
            </ScrollAnimation>
            <ScrollAnimation animation="animate-slide-in-right">
              <div className="flex flex-col gap-2 min-[400px]:flex-row lg:justify-end">
                <Button size="lg" variant="secondary" className="bg-gradient-secondary" asChild>
                  <Link href="/courses">Khám phá khóa học</Link>
                </Button>
                <Button size="lg" className="bg-white text-primary hover:bg-white/90" asChild>
                  <Link href="/contact">Đăng ký tư vấn</Link>
                </Button>
              </div>
            </ScrollAnimation>
          </div>
        </div>
      </section>
    </div>
  )
}

// Sample data (assuming your actual data in "@/lib/database" has 'id' property)
const features = [
  {
    title: "Giáo viên chuyên nghiệp",
    description: "Đội ngũ giảng viên có trình độ chuyên môn cao, giàu kinh nghiệm và nhiệt huyết",
    icon: <GraduationCap className="h-6 w-6 text-primary" />,
  },
  {
    title: "Phương pháp hiện đại",
    description: "Áp dụng phương pháp giảng dạy tiên tiến, tương tác và hiệu quả",
    icon: <BookOpen className="h-6 w-6 text-primary" />,
  },
  {
    title: "Lớp học quy mô nhỏ",
    description: "Số lượng học viên mỗi lớp được giới hạn để đảm bảo chất lượng giảng dạy",
    icon: <Users className="h-6 w-6 text-primary" />,
  },
]

const testimonials = [
  {
    name: "Nguyễn Văn A",
    avatar: "/placeholder.svg?height=100&width=100",
    course: "IELTS Academic",
    rating: 5,
    comment: "Tôi đã đạt được 7.0 IELTS sau khóa học. Giáo viên tận tâm và phương pháp học hiệu quả.",
  },
  {
    name: "Trần Thị B",
    avatar: "/placeholder.svg?height=100&width=100",
    course: "Tiếng Nhật N3",
    rating: 5,
    comment: "Môi trường học thân thiện, giáo viên nhiệt tình. Tôi đã vượt qua kỳ thi JLPT N3 dễ dàng.",
  },
  {
    name: "Lê Văn C",
    avatar: "/placeholder.svg?height=100&width=100",
    course: "Tiếng Anh giao tiếp",
    rating: 4,
    comment: "Khóa học giúp tôi tự tin hơn khi giao tiếp bằng tiếng Anh trong công việc.",
  },
  {
    name: "Phạm Thị D",
    avatar: "/placeholder.svg?height=100&width=100",
    course: "Tiếng Hàn cơ bản",
    rating: 5,
    comment: "Chỉ sau 3 tháng học, tôi đã có thể giao tiếp cơ bản bằng tiếng Hàn và hiểu được văn hóa Hàn Quốc.",
  },
  {
    name: "Hoàng Minh E",
    avatar: "/placeholder.svg?height=100&width=100",
    course: "TOEIC 4 kỹ năng",
    rating: 5,
    comment: "Đạt 850 điểm TOEIC sau khóa học. Phương pháp luyện thi hiệu quả và đội ngũ giáo viên chuyên nghiệp.",
  },
  {
    name: "Vũ Thị F",
    avatar: "/placeholder.svg?height=100&width=100",
    course: "Tiếng Trung thương mại",
    rating: 4,
    comment:
      "Khóa học giúp tôi tự tin giao tiếp với đối tác Trung Quốc. Giáo viên nhiệt tình và tài liệu học phong phú.",
  },
]