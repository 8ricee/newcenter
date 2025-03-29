import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Kiểm tra các route cần bảo vệ
  const isProtectedRoute = pathname.startsWith("/dashboard")

  // Lấy token từ session
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  })

  // Nếu không có token và đang truy cập route được bảo vệ
  if (!token && isProtectedRoute) {
    const url = new URL("/login", request.url)
    url.searchParams.set("callbackUrl", encodeURI(request.url))
    return NextResponse.redirect(url)
  }

  // Nếu đã đăng nhập và đang truy cập trang login/register
  if (token && (pathname === "/login" || pathname === "/register")) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return NextResponse.next()
}

// Chỉ áp dụng middleware cho các route cụ thể
export const config = {
  matcher: ["/dashboard/:path*", "/login", "/register"],
}

