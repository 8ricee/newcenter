import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar, Clock, User, MessageSquare, Facebook, Twitter, Linkedin } from "lucide-react"
import { blogPosts } from "@/lib/database"

export default async function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params
  const post = blogPosts.find((post) => post.slug === resolvedParams.slug)

  if (!post) {
    notFound()
  }

  const relatedPosts = blogPosts.filter((p) => post.relatedPostIds.includes(p.id))

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-16 lg:py-20 bg-gradient-hero">
        <div className="container px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <div className="flex justify-center">
              <Badge>{post.category}</Badge>
            </div>
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">{post.title}</h1>
            <div className="flex items-center justify-center space-x-4 text-muted-foreground">
              <div className="flex items-center">
                <Calendar className="mr-1 h-4 w-4" />
                <span>{post.date}</span>
              </div>
              <div className="flex items-center">
                <Clock className="mr-1 h-4 w-4" />
                <span>{post.readTime}</span>
              </div>
              <div className="flex items-center">
                <User className="mr-1 h-4 w-4" />
                <span>{post.author.name}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Content */}
      <section className="w-full py-12 md:py-16 lg:py-20 bg-background">
        <div className="container px-4 md:px-6">
          <div className="grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-8 lg:col-start-3">
              <div className="relative aspect-video overflow-hidden rounded-lg mb-8">
                <Image
                  src={post.image || "/placeholder.svg?height=720&width=1280"}
                  alt={post.title}
                  width={1280}
                  height={720}
                  className="object-cover"
                  priority
                />
              </div>

              <div className="prose prose-lg max-w-none">
                {post.content.split("\n").map((paragraph, index) => {
                  if (paragraph.startsWith("# ")) {
                    return (
                      <h1 key={index} className="text-3xl font-bold mt-8 mb-4">
                        {paragraph.replace("# ", "")}
                      </h1>
                    )
                  } else if (paragraph.startsWith("## ")) {
                    return (
                      <h2 key={index} className="text-2xl font-bold mt-8 mb-4">
                        {paragraph.replace("## ", "")}
                      </h2>
                    )
                  } else if (paragraph.startsWith("### ")) {
                    return (
                      <h3 key={index} className="text-xl font-bold mt-6 mb-3">
                        {paragraph.replace("### ", "")}
                      </h3>
                    )
                  } else if (paragraph.startsWith("- ")) {
                    return (
                      <ul key={index} className="list-disc pl-6 my-4">
                        <li>{paragraph.replace("- ", "")}</li>
                      </ul>
                    )
                  } else if (paragraph.startsWith("**") && paragraph.endsWith("**")) {
                    return (
                      <p key={index} className="font-bold my-4">
                        {paragraph.replace(/^\*\*|\*\*$/g, "")}
                      </p>
                    )
                  } else if (paragraph.trim() === "") {
                    return <div key={index} className="my-4" />
                  } else {
                    return (
                      <p key={index} className="my-4 text-muted-foreground">
                        {paragraph}
                      </p>
                    )
                  }
                })}
              </div>

              <div className="border-t border-b py-6 my-8">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag, index) => (
                      <Link key={index} href={`/blog/tag/${tag}`}>
                        <Badge variant="outline" className="hover:bg-gradient-hero">
                          #{tag}
                        </Badge>
                      </Link>
                    ))}
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-muted-foreground">Chia sẻ:</span>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Facebook className="h-4 w-4" />
                      <span className="sr-only">Facebook</span>
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Twitter className="h-4 w-4" />
                      <span className="sr-only">Twitter</span>
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Linkedin className="h-4 w-4" />
                      <span className="sr-only">LinkedIn</span>
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-4 py-6">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={post.author.avatar} alt={post.author.name} />
                  <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{post.author.name}</p>
                  <p className="text-sm text-muted-foreground">{post.author.role}</p>
                </div>
              </div>

              <div className="border-t pt-8 mt-8">
                <h2 className="text-2xl font-bold mb-6">Bình luận</h2>
                <div className="bg-gradient-hero p-6 rounded-lg text-center">
                  <MessageSquare className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-muted-foreground mb-4">Hãy để lại bình luận của bạn</p>
                  <Button>Đăng nhập để bình luận</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Posts */}
      <section className="w-full py-12 md:py-16 lg:py-20 bg-gradient-hero">
        <div className="container px-4 md:px-6">
          <h2 className="text-2xl font-bold text-center mb-10">Bài viết liên quan</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedPosts.slice(0, 3).map((relatedPost) => (
              <Card key={relatedPost.id} className="h-full flex flex-col">
                <div className="relative aspect-video overflow-hidden">
                  <Image
                    src={relatedPost.image || "/placeholder.svg"}
                    alt={relatedPost.title}
                    width={600}
                    height={340}
                    className="object-cover rounded-t-lg"
                  />
                  <div className="absolute top-2 right-2">
                    <Badge>{relatedPost.category}</Badge>
                  </div>
                </div>
                <CardContent className="flex-grow flex flex-col p-6">
                  <h3 className="text-lg font-bold mb-2 line-clamp-2">
                    <Link href={`/blog/${relatedPost.slug}`} className="hover:underline">
                      {relatedPost.title}
                    </Link>
                  </h3>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                    <div className="flex items-center">
                      <Calendar className="mr-1 h-3 w-3" />
                      <span>{relatedPost.date}</span>
                    </div>
                    <div className="flex items-center">
                      <User className="mr-1 h-3 w-3" />
                      <span>{relatedPost.author.name}</span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-3">{relatedPost.excerpt}</p>
                  <div className="mt-auto">
                    <Button variant="outline" size="sm" asChild className="w-full">
                      <Link href={`/blog/${relatedPost.slug}`}>Đọc tiếp</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="w-full py-12 md:py-16 lg:py-20 bg-gradient-primary text-primary-foreground">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Đăng ký nhận bản tin</h2>
              <p className="max-w-[600px] text-white/80 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Nhận thông tin mới nhất về các khóa học, sự kiện và mẹo học ngoại ngữ
              </p>
            </div>
            <div className="w-full max-w-md space-y-2">
              <form className="flex space-x-2">
                <input
                  type="email"
                  placeholder="Email của bạn"
                  className="flex h-10 w-full rounded-md border border-white/20 bg-white/10 px-3 py-2 text-sm placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
                <Button variant="secondary" className="bg-white text-primary hover:bg-white/90">
                  Đăng ký
                </Button>
              </form>
              <p className="text-xs text-white/60">
                Chúng tôi tôn trọng quyền riêng tư của bạn. Bạn có thể hủy đăng ký bất cứ lúc nào.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}