"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Eye, EyeOff } from "lucide-react"

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-hero py-12">
      <div className="container px-4 md:px-6">
        <div className="mx-auto grid w-full max-w-md gap-6">
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-gradient-hero">
              <TabsTrigger value="login">Đăng nhập</TabsTrigger>
              <TabsTrigger value="register">Đăng ký</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <Card className="py-6">
                <CardHeader className="space-y-1">
                  <CardTitle className="text-2xl font-bold">Đăng nhập</CardTitle>
                  <CardDescription>Nhập thông tin đăng nhập của bạn để truy cập vào tài khoản</CardDescription>
                </CardHeader>
                <CardContent>
                  <form>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" placeholder="name@example.com" required />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="password">Mật khẩu</Label>
                          <Link
                            href="/forgot-password"
                            className="text-sm text-primary underline-offset-4 hover:underline"
                          >
                            Quên mật khẩu?
                          </Link>
                        </div>
                        <div className="relative">
                          <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            required
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-2 top-1/2 -translate-y-1/2"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            <span className="sr-only">{showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}</span>
                          </Button>
                        </div>
                      </div>
                      <Button type="submit" className="w-full">
                        Đăng nhập
                      </Button>
                    </div>
                  </form>
                </CardContent>
                <CardFooter className="flex flex-col">
                  <div className="text-sm text-muted-foreground text-center mt-2">
                    Chưa có tài khoản?{" "}
                    <Link href="/register" className="text-primary underline-offset-4 hover:underline">
                      Đăng ký ngay
                    </Link>
                  </div>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="register">
              <Card className="py-6">
                <CardHeader className="space-y-1">
                  <CardTitle className="text-2xl font-bold">Đăng ký tài khoản</CardTitle>
                  <CardDescription>Nhập thông tin của bạn để tạo tài khoản mới</CardDescription>
                </CardHeader>
                <CardContent>
                  <form>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="first-name">Họ</Label>
                          <Input id="first-name" placeholder="Nguyễn" required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="last-name">Tên</Label>
                          <Input id="last-name" placeholder="Văn A" required />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" placeholder="name@example.com" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Số điện thoại</Label>
                        <Input id="phone" type="tel" placeholder="090 123 4567" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="new-password">Mật khẩu</Label>
                        <div className="relative">
                          <Input
                            id="new-password"
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            required
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-0 top-1/2 -translate-y-1/2 "
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            <span className="sr-only">{showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}</span>
                          </Button>
                        </div>
                      </div>
                      <Button type="submit" className="w-full">
                        Đăng ký
                      </Button>
                    </div>
                  </form>
                </CardContent>
                <CardFooter className="flex flex-col">
                  <div className="text-sm text-muted-foreground text-center mt-2">
                    Đã có tài khoản?{" "}
                    <Link href="/login" className="text-primary underline-offset-4 hover:underline">
                      Đăng nhập
                    </Link>
                  </div>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

