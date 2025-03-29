"use client"

import type React from "react"

import { useState, useTransition, useEffect } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import { login, register, loginWithGoogle } from "@/lib/actions/auth"
import { toast } from "sonner" // Import toast from sonner

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [loginError, setLoginError] = useState<string | null>(null)
  const [registerError, setRegisterError] = useState<{
    name?: string[]
    email?: string[]
    password?: string[]
    _form?: string[]
  } | null>(null)
  // Remove registerSuccess state
  // const router = useRouter()
  const searchParams = useSearchParams()
  const error = searchParams.get("error")
  const tab = searchParams.get("tab")

  useEffect(() => {
    if (error) {
      setLoginError(
        error === "CredentialsSignin" ? "Email hoặc mật khẩu không chính xác" : "Đã xảy ra lỗi khi đăng nhập",
      )
    }
  }, [error])

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoginError(null)

    startTransition(async () => {
      const formData = new FormData(e.currentTarget)
      const email = formData.get("email") as string
      const password = formData.get("password") as string

      // Sử dụng server action để lưu thông tin đăng nhập vào cookies
      const result = await login(formData)

      if (result?.error) {
        setLoginError(result.error)
        return
      }

      // Sử dụng next-auth/react để đăng nhập
      const signInResult = await signIn("credentials", {
        email,
        password,
        redirect: true,
        callbackUrl: "/dashboard",
      })

      if (signInResult?.error) {
        setLoginError("Email hoặc mật khẩu không chính xác")
      }
    })
  }

  const handleRegister = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setRegisterError(null)
    // Remove setRegisterSuccess(false)

    startTransition(async () => {
      const formData = new FormData(e.currentTarget)
      const result = await register(formData)

      if (result?.error) {
        setRegisterError(result.error)
      } else if (result?.success) {
        // Use toast from sonner
        toast.success("Đăng ký thành công", {
          description: "Tài khoản của bạn đã được tạo. Vui lòng đăng nhập.",
        })

        // Reset form
        e.currentTarget.reset()
      }
    })
  }

  const handleGoogleLogin = async () => {
    startTransition(async () => {
      const result = await loginWithGoogle()

      if (result?.success) {
        await signIn("google", { callbackUrl: "/dashboard" })
      }
    })
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted py-12">
      <div className="container px-4 md:px-6">
        <div className="mx-auto grid w-full max-w-md gap-6">
          <Tabs defaultValue={tab === "register" ? "register" : "login"} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Đăng nhập</TabsTrigger>
              <TabsTrigger value="register">Đăng ký</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <Card>
                <CardHeader className="space-y-1">
                  <CardTitle className="text-2xl font-bold">Đăng nhập</CardTitle>
                  <CardDescription>Nhập thông tin đăng nhập của bạn để truy cập vào tài khoản</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleLogin}>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" name="email" type="email" placeholder="name@example.com" required />
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
                            name="password"
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

                      {loginError && <div className="text-sm text-red-500">{loginError}</div>}

                      <Button type="submit" className="w-full" disabled={isPending}>
                        {isPending ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Đang đăng nhập...
                          </>
                        ) : (
                          "Đăng nhập"
                        )}
                      </Button>

                      <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                          <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                          <span className="bg-card px-2 text-muted-foreground">Hoặc đăng nhập với</span>
                        </div>
                      </div>

                      <Button
                        type="button"
                        variant="outline"
                        className="w-full"
                        onClick={handleGoogleLogin}
                        disabled={isPending}
                      >
                        <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                          <path
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            fill="#4285F4"
                          />
                          <path
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            fill="#34A853"
                          />
                          <path
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                            fill="#FBBC05"
                          />
                          <path
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            fill="#EA4335"
                          />
                        </svg>
                        Google
                      </Button>
                    </div>
                  </form>
                </CardContent>
                <CardFooter className="flex flex-col">
                  <div className="text-sm text-muted-foreground text-center mt-2">
                    Chưa có tài khoản?{" "}
                    <button
                      className="text-primary underline-offset-4 hover:underline"
                      onClick={() =>
                        document.querySelector('[value="register"]')?.dispatchEvent(new MouseEvent("click"))
                      }
                    >
                      Đăng ký ngay
                    </button>
                  </div>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="register">
              <Card>
                <CardHeader className="space-y-1">
                  <CardTitle className="text-2xl font-bold">Đăng ký tài khoản</CardTitle>
                  <CardDescription>Nhập thông tin của bạn để tạo tài khoản mới</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleRegister}>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="register-name">Họ và tên</Label>
                        <Input id="register-name" name="name" placeholder="Nguyễn Văn A" required />
                        {registerError?.name && <p className="text-sm text-red-500">{registerError.name[0]}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="register-email">Email</Label>
                        <Input
                          id="register-email"
                          name="email"
                          type="email"
                          placeholder="name@example.com"
                          required
                        />
                        {registerError?.email && <p className="text-sm text-red-500">{registerError.email[0]}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="register-password">Mật khẩu</Label>
                        <div className="relative">
                          <Input
                            id="register-password"
                            name="password"
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
                        {registerError?.password && (
                          <p className="text-sm text-red-500">{registerError.password[0]}</p>
                        )}
                      </div>

                      {registerError?._form && <div className="text-sm text-red-500">{registerError._form[0]}</div>}

                      <Button type="submit" className="w-full" disabled={isPending}>
                        {isPending ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Đang đăng ký...
                          </>
                        ) : (
                          "Đăng ký"
                        )}
                      </Button>
                    </div>
                  </form>
                </CardContent>
                <CardFooter className="flex flex-col">
                  <div className="text-sm text-muted-foreground text-center mt-2">
                    Đã có tài khoản?{" "}
                    <button
                      className="text-primary underline-offset-4 hover:underline"
                      onClick={() => document.querySelector('[value="login"]')?.dispatchEvent(new MouseEvent("click"))}
                    >
                      Đăng nhập
                    </button>
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