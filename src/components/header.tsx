"use client"

import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu } from "lucide-react"
import { cn } from "@/lib/utils"
import { usePathname } from "next/navigation"

interface UserProps {
  id: string
  name?: string | null
  email?: string | null
  role?: string | null
}

interface HeaderProps {
  user: UserProps | null
}

export default function Header({ user }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  const routes = [
    { href: "/", label: "Trang chủ" },
    { href: "/courses", label: "Khóa học" },
    { href: "/schedule", label: "Lịch học" },
    { href: "/teachers", label: "Giảng viên" },
    { href: "/about", label: "Về chúng tôi" },
    { href: "/blog", label: "Blog" },
    { href: "/contact", label: "Liên hệ" },
  ]

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center">
          <Link href="/" className="font-bold text-xl">
            KASUMI CENTER
          </Link>
        </div>

        <div className="hidden md:flex">
          <NavigationMenu>
            <NavigationMenuList>
              {routes.map((route) => (
                <NavigationMenuItem key={route.href}>
                  <Link href={route.href} legacyBehavior passHref>
                    <NavigationMenuLink
                      className={cn(
                        "px-4 py-2 text-sm font-medium hover:text-primary",
                        pathname === route.href ? "text-primary" : "text-muted-foreground"
                      )}
                    >
                      {route.label}
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        <div className="flex items-center gap-2">
          {!user ? (
            <>
              <Button variant="outline" size="sm" asChild className="hidden md:inline-flex">
                <Link href="/login">Đăng nhập</Link>
              </Button>
              <Button size="sm" asChild className="hidden md:inline-flex">
                <Link href="/register">Đăng ký</Link>
              </Button>
            </>
          ) : (
            <>
              <Button size="sm" asChild className="hidden md:inline-flex">
                <Link href="/dashboard">Dashboard</Link>
              </Button>
              {user.role === "ADMIN" && (
                <Button size="sm" variant="secondary" asChild className="hidden md:inline-flex">
                  <Link href="/admin">Admin</Link>
                </Button>
              )}
            </>
          )}

          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <nav className="flex flex-col gap-4 mt-8 px-2">
                {routes.map((route) => (
                  <Link
                    key={route.href}
                    href={route.href}
                    className={cn(
                      "text-md font-medium transition-colors hover:text-primary",
                      pathname === route.href ? "text-primary" : "text-muted-foreground"
                    )}
                    onClick={() => setIsOpen(false)}
                  >
                    {route.label}
                  </Link>
                ))}
                <div className="flex flex-col gap-2 mt-4">
                  {!user ? (
                    <>
                      <Button variant="outline" asChild>
                        <Link href="/login">Đăng nhập</Link>
                      </Button>
                      <Button asChild>
                        <Link href="/register">Đăng ký</Link>
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button asChild>
                        <Link href="/dashboard">Dashboard</Link>
                      </Button>
                      {user.role === "ADMIN" && (
                        <Button variant="secondary" asChild>
                          <Link href="/admin">Admin</Link>
                        </Button>
                      )}
                    </>
                  )}
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
