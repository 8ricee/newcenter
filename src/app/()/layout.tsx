import type React from "react"
import { Inter } from "next/font/google"
// import "./globals.css"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from 'sonner';
import { authOptions } from "@/lib/auth"
import { getServerSession } from "next-auth"

const inter = Inter({ subsets: ["latin", "vietnamese"], variable: "--font-inter" })

export const metadata = {
  title: "Trung Tâm Ngoại Ngữ Kasumi",
  description: "Trung tâm đào tạo ngoại ngữ hàng đầu với đội ngũ giáo viên chuyên nghiệp",
  icons: {
    icon: '/favicon/favicon.svg',
  },
  keywords: [
    "trung tâm ngoại ngữ",
    "tiếng Nhật",
    "học tiếng Nhật",
    "đào tạo ngoại ngữ",
    "giáo viên chuyên nghiệp",
    "phương pháp giảng dạy hiện đại",
    "Kasumi Center",
    "khóa học tiếng Nhật",
    "luyện thi JLPT",
    // Thêm các từ khóa liên quan khác đến nội dung và dịch vụ của trung tâm
  ],
  authors: [
    {
      name: "Kasumi Center",
      url: "https://kasumi-center.com", // Thay bằng URL trang web của bạn
    },
  ],
  robots: {
    index: true,
    follow: true,
    nocache: false,
  },
  openGraph: {
    title: "Trung Tâm Ngoại Ngữ Kasumi",
    description: "Trung tâm đào tạo ngoại ngữ hàng đầu với đội ngũ giáo viên chuyên nghiệp",
    url: "https://kasumi-center.com", // Thay bằng URL trang web của bạn
    siteName: "Kasumi Center",
    images: [
      {
        url: "https://kasumi-center.com/images/logo.png", // Thay bằng URL logo hoặc hình ảnh đại diện của bạn
        width: 800,
        height: 600,
      },
    ],
    locale: "vi_VN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Trung Tâm Ngoại Ngữ Kasumi",
    description: "Trung tâm đào tạo ngoại ngữ hàng đầu với đội ngũ giáo viên chuyên nghiệp",
    site: "@kasumi_center", // Thay bằng Twitter handle của bạn (nếu có)
    creator: "@kasumi_center", // Thay bằng Twitter handle của bạn (nếu có)
    images: ["https://kasumi-center.com/images/logo.png"], // Thay bằng URL logo hoặc hình ảnh đại diện của bạn
  },
}

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {

  const session = await getServerSession(authOptions)

  return (
    <html lang="vi" suppressHydrationWarning>
      <head>
        {/* Favicon (đã có) */}
        <link rel="icon" href="/favicon/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" sizes="180x180" href="/favicon/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon/favicon-16x16.png" />
        <link rel="manifest" href="/favicon/site.webmanifest" />
      </head>
      <body className={`${inter.variable} font-sans`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <div className="relative flex min-h-screen flex-col">
            <Header user={session?.user ?? null} />
            <main className="flex-1">
              {children}
              <Toaster />
            </main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
