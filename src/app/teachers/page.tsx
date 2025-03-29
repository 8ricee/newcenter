import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GraduationCap, Award, Globe } from "lucide-react";
import { teachers, Teacher } from "@/lib/database";

interface TeacherCardProps {
  teacher: Teacher;
}

function TeacherCard({ teacher }: TeacherCardProps) {
  return (
    <Card className="flex flex-col h-full py-6">
      <CardHeader>
        <div className="flex justify-center mb-4">
          <div className="relative w-32 h-32 rounded-full overflow-hidden">
            <Image src={teacher.avatar || "/placeholder.svg"} alt={teacher.name} fill className="object-cover" />
          </div>
        </div>
        <CardTitle className="text-center">{teacher.name}</CardTitle>
        <CardDescription className="text-center">{teacher.position}</CardDescription>
        <div className="flex justify-center flex-wrap gap-2 mt-2">
          {teacher.languages.map((language, index) => (
            <Badge key={index} variant="outline">
              {language}
            </Badge>
          ))}
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-muted-foreground text-center mb-4">{teacher.bio}</p>
        <div className="space-y-3">
          <div className="flex items-center">
            <GraduationCap className="mr-2 h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{teacher.education}</span>
          </div>
          <div className="flex items-center">
            <Award className="mr-2 h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{teacher.experience}</span>
          </div>
          <div className="flex items-center">
            <Globe className="mr-2 h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{teacher.specialization}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-2">
        <Button asChild className="w-full">
          <Link href={`/teachers/${teacher.slug}`}>Xem chi tiết</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

export default function TeachersPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-hero">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Đội ngũ giảng viên</h1>
              <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Đội ngũ giảng viên chuyên nghiệp, giàu kinh nghiệm và nhiệt huyết
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Teachers Filter */}
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {teachers.map((teacher) => (
                  <TeacherCard key={teacher.id} teacher={teacher} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="english" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {teachers
                  .filter((teacher) => teacher.languages.includes("Tiếng Anh"))
                  .map((teacher) => (
                    <TeacherCard key={teacher.id} teacher={teacher} />
                  ))}
              </div>
            </TabsContent>

            <TabsContent value="japanese" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {teachers
                  .filter((teacher) => teacher.languages.includes("Tiếng Nhật"))
                  .map((teacher) => (
                    <TeacherCard key={teacher.id} teacher={teacher} />
                  ))}
              </div>
            </TabsContent>

            <TabsContent value="korean" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {teachers
                  .filter((teacher) => teacher.languages.includes("Tiếng Hàn"))
                  .map((teacher) => (
                    <TeacherCard key={teacher.id} teacher={teacher} />
                  ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Join Our Team */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-primary text-primary-foreground">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 items-center">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                Tham gia đội ngũ giảng viên của chúng tôi
              </h2>
              <p className="max-w-[600px] md:text-xl/relaxed">
                Chúng tôi luôn tìm kiếm những giảng viên tài năng và nhiệt huyết để cùng nhau phát triển. Nếu bạn có đam
                mê giảng dạy và muốn trở thành một phần của Kasumi Center, hãy liên hệ với chúng tôi ngay hôm nay.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row lg:justify-end">
              <Button size="lg" variant="secondary" asChild>
                <Link href="/contact">Liên hệ ngay</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}