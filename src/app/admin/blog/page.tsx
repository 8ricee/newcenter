import type { Metadata } from "next"
import Link from "next/link"
import { db } from "@/lib/db"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { BlogTable } from "@/components/admin/blog-table"

export const metadata: Metadata = {
  title: "Quản lý blog | Language Center",
  description: "Quản lý bài viết blog tại Language Center",
}

export default async function BlogPage() {
  const rawPosts = await db.blogPost.findMany({
    orderBy: {
      createdAt: "desc",
    },
  })

  const posts = rawPosts.map(post => ({
    ...post,
    createdAt: post.createdAt.toISOString(),
    updatedAt: post.updatedAt.toISOString(),
  }))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Quản lý blog</h1>
          <p className="text-muted-foreground">Quản lý tất cả bài viết blog tại Language Center</p>
        </div>
        <Button asChild>
          <Link href="/admin/blog/new">
            <Plus className="mr-2 h-4 w-4" />
            Thêm bài viết
          </Link>
        </Button>
      </div>

      <BlogTable posts={posts} />
    </div>
  )
}


