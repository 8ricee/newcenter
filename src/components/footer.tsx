"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Facebook, Instagram, Youtube, Mail, Phone, MapPin } from "lucide-react"
import { ModeToggle } from "@/components/mode-toggle"
import { useState } from "react";
import { toast } from 'sonner';

export default function Footer() {
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
    <footer className="">
      <div className="container px-4 py-12 md:py-16 md:px-6">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <h3 className="text-lg font-bold">KASUMI CENTER</h3>
            <p className="text-sm text-muted-foreground">
              Trung tâm đào tạo ngoại ngữ hàng đầu với đội ngũ giáo viên chuyên nghiệp và phương pháp giảng dạy hiện
              đại.
            </p>
            <div className="flex space-x-3">
              <Button variant="ghost" size="icon" asChild>
                <Link href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                  <Facebook className="h-5 w-5" />
                  <span className="sr-only">Facebook</span>
                </Link>
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <Link href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                  <Instagram className="h-5 w-5" />
                  <span className="sr-only">Instagram</span>
                </Link>
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <Link href="https://youtube.com" target="_blank" rel="noopener noreferrer">
                  <Youtube className="h-5 w-5" />
                  <span className="sr-only">YouTube</span>
                </Link>
              </Button>
            </div>
            <ModeToggle />
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-bold">Liên kết nhanh</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/courses" className="text-muted-foreground hover:text-foreground transition-colors">
                  Khóa học
                </Link>
              </li>
              <li>
                <Link href="/schedule" className="text-muted-foreground hover:text-foreground transition-colors">
                  Lịch học
                </Link>
              </li>
              <li>
                <Link href="/teachers" className="text-muted-foreground hover:text-foreground transition-colors">
                  Giảng viên
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-foreground transition-colors">
                  Về chúng tôi
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-muted-foreground hover:text-foreground transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-foreground transition-colors">
                  Liên hệ
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-bold">Thông tin liên hệ</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start">
                <MapPin className="mr-2 h-5 w-5 text-muted-foreground shrink-0" />
                <span className="text-muted-foreground">123 Đường Nguyễn Văn Linh, Quận 7, TP. Hồ Chí Minh</span>
              </li>
              <li className="flex items-center">
                <Phone className="mr-2 h-5 w-5 text-muted-foreground" />
                <Link href="tel:+84901234567" className="text-muted-foreground hover:text-foreground transition-colors">
                  090 123 4567
                </Link>
              </li>
              <li className="flex items-center">
                <Mail className="mr-2 h-5 w-5 text-muted-foreground" />
                <Link
                  href="mailto:info@languagecenter.com"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  info@languagecenter.com
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-bold">Đăng ký nhận tin</h3>
            <p className="text-sm text-muted-foreground">Nhận thông tin về khóa học mới và ưu đãi đặc biệt</p>
            <form onSubmit={handleSubscribe} className="flex flex-col space-y-2">
              <Input
                type="email"
                placeholder="Email của bạn"
                className="max-w-full"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Button type="submit" disabled={loading}>
                {loading ? "Đang xử lý..." : "Đăng ký"}
              </Button>
            </form>
          </div>
        </div>
        <div className="mt-12 pt-6 border-t text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Kasumi Center. Tất cả quyền được bảo lưu.</p>
        </div>
      </div>
    </footer>
  )
}