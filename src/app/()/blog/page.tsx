"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, User } from "lucide-react"
import { blogPosts, BlogPost } from "@/lib/database";
import { useState } from "react";
import { toast } from 'sonner';

export default function BlogPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);

    if (!email) {
      toast.error("Vui lòng nhập địa chỉ email.");
      setLoading(false);
      return;
    }

    if (!/^[\w.-]+@[\w.-]+\.[a-zA-Z]{2,}$/.test(email)) {
      toast.error("Địa chỉ email không hợp lệ.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();
      if (result.status === "success") {
        toast.success("Đăng ký nhận tin thành công!");
        setEmail("");
      } else {
        toast.error(result.message || "Đã xảy ra lỗi khi đăng ký.");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Đăng ký thất bại!");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-hero">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Blog & Tin tức</h1>
              <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Cập nhật thông tin mới nhất về ngôn ngữ, văn hóa và các sự kiện tại trung tâm
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Search and Categories */}
      <section className="w-full py-8 bg-background">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-8">
            <div className="flex w-full max-w-sm items-center space-x-2">
              <Input type="text" placeholder="Tìm kiếm bài viết..." />
              <Button type="submit">Tìm</Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Link key={category} href={`/blog/category/${category.toLowerCase()}`}>
                  <Badge variant="outline" className="hover:bg-gradient-hero">
                    {category}
                  </Badge>
                </Link>
              ))}
            </div>
          </div>

          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-4 mx-auto bg-gradient-hero">
              <TabsTrigger value="all">Tất cả</TabsTrigger>
              <TabsTrigger value="news">Tin tức</TabsTrigger>
              <TabsTrigger value="tips">Mẹo học</TabsTrigger>
              <TabsTrigger value="culture">Văn hóa</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {blogPosts.map((post) => (
                  <BlogCard key={post.id} post={post} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="news" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {blogPosts
                  .filter((post) => post.category === "Tin tức")
                  .map((post) => (
                    <BlogCard key={post.id} post={post} />
                  ))}
              </div>
            </TabsContent>

            <TabsContent value="tips" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {blogPosts
                  .filter((post) => post.category === "Mẹo học")
                  .map((post) => (
                    <BlogCard key={post.id} post={post} />
                  ))}
              </div>
            </TabsContent>

            <TabsContent value="culture" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {blogPosts
                  .filter((post) => post.category === "Văn hóa")
                  .map((post) => (
                    <BlogCard key={post.id} post={post} />
                  ))}
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-center mt-10">
            <Button variant="outline">Xem thêm bài viết</Button>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-hero">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Đăng ký nhận bản tin</h2>
              <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Nhận thông tin mới nhất về các khóa học, sự kiện và mẹo học ngoại ngữ
              </p>
            </div>
            <div className="w-full max-w-md space-y-2">
              <form onSubmit={handleSubscribe} className="flex space-x-2">
                <Input type="email" placeholder="Email của bạn" className="max-w-lg flex-1" onChange={(e) => setEmail(e.target.value)} />
                <Button type="submit" disabled={loading}>{loading ? "Đang xử lý..." : "Đăng ký"}</Button>
              </form>
              <p className="text-xs text-muted-foreground">
                Chúng tôi tôn trọng quyền riêng tư của bạn. Bạn có thể hủy đăng ký bất cứ lúc nào.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

interface BlogPostCardProps {
  post: BlogPost;
}

function BlogCard({ post }: BlogPostCardProps) {
  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="px-6">
        <div className="relative aspect-video overflow-hidden rounded-t-lg">
          <Image
            src={post.image || "/placeholder.svg"}
            alt={post.title}
            width={600}
            height={340}
            className="object-cover"
          />
          <div className="absolute top-2 right-2">
            <Badge>{post.category}</Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-grow p-6">
        <CardTitle className="mb-2 line-clamp-2">
          <Link href={`/blog/${post.id}`} className="hover:underline">
            {post.title}
          </Link>
        </CardTitle>
        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
          <div className="flex items-center">
            <Calendar className="mr-1 h-3 w-3" />
            <span>{post.date}</span>
          </div>
          <div className="flex items-center">
            <User className="mr-1 h-3 w-3" />
            <span>{post.author.name}</span>
          </div>
        </div>
        <CardDescription className="line-clamp-3">{post.excerpt}</CardDescription>
      </CardContent>
      <CardFooter className="pt-0 pb-6 px-6">
        <Button variant="outline" size="sm" asChild className="w-full">
          <Link href={`/blog/${post.slug}`}>Đọc tiếp</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

// Sample data
const categories = ["Tin tức", "Mẹo học", "Văn hóa", "Sự kiện", "Khóa học"]


