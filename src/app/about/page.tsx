import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { GraduationCap, Users, BookOpen, Award, Target, Clock } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-hero">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="space-y-4">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Về chúng tôi</h1>
              <p className="text-muted-foreground md:text-xl">
                Kasumi Center là trung tâm đào tạo ngoại ngữ hàng đầu với sứ mệnh mang đến những khóa học chất lượng
                cao, giúp học viên phát triển kỹ năng ngôn ngữ một cách toàn diện và hiệu quả.
              </p>
            </div>
            <div className="mx-auto lg:mx-0 relative aspect-video overflow-hidden rounded-xl">
              <Image
                src="/image/1.jpg?height=720&width=1280"
                alt="Trung tâm ngoại ngữ"
                width={1280}
                height={720}
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-background">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="order-2 lg:order-1 mx-auto lg:mx-0 relative aspect-video overflow-hidden rounded-xl">
              <Image
                src="/image/2.jpg?height=720&width=1280"
                alt="Lịch sử phát triển"
                width={1280}
                height={720}
                className="object-cover"
              />
            </div>
            <div className="order-1 lg:order-2 space-y-4">
              <h2 className="text-3xl font-bold tracking-tighter">Câu chuyện của chúng tôi</h2>
              <p className="text-muted-foreground">
                Kasumi Center được thành lập vào năm 2010 với tầm nhìn trở thành trung tâm đào tạo ngoại ngữ hàng đầu
                tại Việt Nam. Từ những ngày đầu với chỉ 3 lớp học và 5 giáo viên, chúng tôi đã không ngừng phát triển và
                mở rộng.
              </p>
              <p className="text-muted-foreground">
                Đến nay, Kasumi Center đã có hơn 10 chi nhánh trên toàn quốc, đội ngũ hơn 100 giáo viên chuyên nghiệp
                và đã đào tạo thành công cho hơn 50,000 học viên. Chúng tôi tự hào về hành trình phát triển và những
                thành tựu đã đạt được.
              </p>
              <p className="text-muted-foreground">
                Với phương châm &quot;Học để thành công&quot;, chúng tôi luôn nỗ lực không ngừng để mang đến những trải nghiệm học
                tập tốt nhất cho học viên, giúp họ tự tin sử dụng ngoại ngữ trong học tập, công việc và cuộc sống.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-hero">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold tracking-tighter">Sứ mệnh & Tầm nhìn</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2 md:gap-12">
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="p-3 rounded-full bg-primary/10">
                    <Target className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold">Sứ mệnh</h3>
                  <p className="text-muted-foreground">
                    Mang đến những khóa học ngoại ngữ chất lượng cao, phù hợp với nhu cầu đa dạng của học viên, giúp họ
                    phát triển kỹ năng ngôn ngữ một cách toàn diện và hiệu quả, từ đó tự tin hơn trong học tập, công
                    việc và cuộc sống.
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="p-3 rounded-full bg-primary/10">
                    <Award className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold">Tầm nhìn</h3>
                  <p className="text-muted-foreground">
                    Trở thành trung tâm đào tạo ngoại ngữ hàng đầu tại Việt Nam, được công nhận về chất lượng giảng dạy
                    và hiệu quả đào tạo. Mở rộng mạng lưới trên toàn quốc và khu vực, đồng thời không ngừng đổi mới
                    phương pháp giảng dạy để đáp ứng nhu cầu ngày càng cao của xã hội.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-background">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold tracking-tighter">Giá trị cốt lõi</h2>
            <p className="mt-4 text-muted-foreground md:text-xl max-w-[800px] mx-auto">
              Những giá trị định hướng mọi hoạt động của chúng tôi
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {coreValues.map((value, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className="p-3 rounded-full bg-primary/10">{value.icon}</div>
                    <h3 className="text-xl font-bold">{value.title}</h3>
                    <p className="text-muted-foreground">{value.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Our Team */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-hero">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold tracking-tighter">Đội ngũ lãnh đạo</h2>
            <p className="mt-4 text-muted-foreground md:text-xl max-w-[800px] mx-auto">
              Những người đứng sau sự thành công của Kasumi Center
            </p>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {teamMembers.map((member, index) => (
              <div key={index} className="flex flex-col items-center text-center">
                <div className="relative w-40 h-40 rounded-full overflow-hidden mb-4">
                  <Image src={member.avatar || "/placeholder.svg"} alt={member.name} fill className="object-cover" />
                </div>
                <h3 className="text-xl font-bold">{member.name}</h3>
                <p className="text-primary font-medium">{member.position}</p>
                <p className="text-muted-foreground mt-2">{member.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

// Sample data
const coreValues = [
  {
    title: "Chất lượng",
    description:
      "Cam kết mang đến những khóa học chất lượng cao với nội dung cập nhật và phương pháp giảng dạy hiệu quả.",
    icon: <Award className="h-6 w-6 text-primary" />,
  },
  {
    title: "Sáng tạo",
    description:
      "Không ngừng đổi mới và áp dụng những phương pháp giảng dạy tiên tiến để tạo ra trải nghiệm học tập thú vị và hiệu quả.",
    icon: <BookOpen className="h-6 w-6 text-primary" />,
  },
  {
    title: "Tận tâm",
    description:
      "Luôn đặt lợi ích và sự tiến bộ của học viên lên hàng đầu, tận tâm hỗ trợ và đồng hành cùng học viên trong suốt quá trình học tập.",
    icon: <Users className="h-6 w-6 text-primary" />,
  },
  {
    title: "Trách nhiệm",
    description:
      "Chịu trách nhiệm về chất lượng đào tạo và kết quả học tập của học viên, luôn giữ đúng cam kết với khách hàng.",
    icon: <Target className="h-6 w-6 text-primary" />,
  },
  {
    title: "Tôn trọng",
    description:
      "Tôn trọng sự đa dạng và khác biệt của mỗi học viên, tạo môi trường học tập thân thiện và bình đẳng cho tất cả mọi người.",
    icon: <GraduationCap className="h-6 w-6 text-primary" />,
  },
  {
    title: "Hiệu quả",
    description:
      "Tối ưu hóa thời gian và nguồn lực để mang lại hiệu quả học tập cao nhất cho học viên trong thời gian ngắn nhất.",
    icon: <Clock className="h-6 w-6 text-primary" />,
  },
]

const teamMembers = [
  {
    name: "Nguyễn Thị Hồng Vân",
    position: "Giám đốc điều hành",
    description: "Hơn 15 năm kinh nghiệm trong lĩnh vực giáo dục và đào tạo ngoại ngữ",
    avatar: "/avatar/7.jpg?height=200&width=200",
  },
  {
    name: "Nguyễn Thị Hồng Vân",
    position: "Giám đốc học thuật",
    description: "Tiến sĩ ngôn ngữ học, 10 năm kinh nghiệm giảng dạy tại các trường đại học",
    avatar: "/avatar/7.jpg?height=200&width=200",
  },
  {
    name: "Nguyễn Thị Hồng Vân",
    position: "Trưởng phòng đào tạo",
    description: "Chuyên gia phát triển chương trình đào tạo với nhiều năm kinh nghiệm",
    avatar: "/avatar/7.jpg?height=200&width=200",
  },
  {
    name: "Nguyễn Thị Hồng Vân",
    position: "Trưởng phòng tư vấn",
    description: "Chuyên gia tư vấn giáo dục với kinh nghiệm làm việc tại nhiều tổ chức quốc tế",
    avatar: "/avatar/7.jpg?height=200&width=200",
  },
]

