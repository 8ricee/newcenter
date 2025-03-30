"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Facebook, Instagram, Youtube, Mail, Phone, MapPin, Clock } from "lucide-react"
import Link from "next/link"
import { useState } from "react";
import { toast } from 'sonner';

export default function ContactPage() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    const target = event.target as HTMLFormElement;
    const formData = {
      name: (target.elements.namedItem("name") as HTMLInputElement).value.trim(),
      phone: (target.elements.namedItem("phone") as HTMLInputElement).value.trim(),
      email: (target.elements.namedItem("email") as HTMLInputElement).value.trim(),
      subject: (target.elements.namedItem("subject") as HTMLInputElement).value.trim(),
      message: (target.elements.namedItem("message") as HTMLTextAreaElement).value.trim(),
    };

    if (!/^[\p{L}\s]{3,50}$/u.test(formData.name)) {
      toast.error("Họ và tên không hợp lệ!");
      setLoading(false);
      return;
    }
    if (!/^\d{10,11}$/.test(formData.phone)) {
      toast.error("Số điện thoại không hợp lệ!");
      setLoading(false);
      return;
    }
    if (!/^[\w.-]+@[\w.-]+\.[a-zA-Z]{2,}$/.test(formData.email)) {
      toast.error("Email không hợp lệ!");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (result.status === "success") {
        toast.success("Gửi tin nhắn thành công!");
        (event.target as HTMLFormElement).reset();
      } else {
        toast.error(result.message || "Đã xảy ra lỗi khi gửi tin nhắn!");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Gửi tin nhắn thất bại!");
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
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Liên hệ với chúng tôi</h1>
              <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn. Hãy liên hệ với chúng tôi ngay hôm nay!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form and Info */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-background">
        <div className="container px-4 md:px-6">
          <div className="grid gap-10 lg:grid-cols-2">
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold mb-4">Thông tin liên hệ</h2>
                <div className="space-y-4">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <MapPin className="h-6 w-6 text-primary shrink-0 mt-1" />
                        <div>
                          <h3 className="font-medium">Địa chỉ</h3>
                          <p className="text-muted-foreground mt-1">
                            123 Đường Nguyễn Văn Linh, Quận 7, TP. Hồ Chí Minh
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <Phone className="h-6 w-6 text-primary shrink-0 mt-1" />
                        <div>
                          <h3 className="font-medium">Điện thoại</h3>
                          <p className="text-muted-foreground mt-1">
                            <Link href="tel:+84901234567" className="hover:text-primary transition-colors">
                              090 123 4567
                            </Link>
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <Mail className="h-6 w-6 text-primary shrink-0 mt-1" />
                        <div>
                          <h3 className="font-medium">Email</h3>
                          <p className="text-muted-foreground mt-1">
                            <Link
                              href="mailto:info@languagecenter.com"
                              className="hover:text-primary transition-colors"
                            >
                              info@languagecenter.com
                            </Link>
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <Clock className="h-6 w-6 text-primary shrink-0 mt-1" />
                        <div>
                          <h3 className="font-medium">Giờ làm việc</h3>
                          <p className="text-muted-foreground mt-1">Thứ Hai - Thứ Bảy: 8:00 - 21:00</p>
                          <p className="text-muted-foreground">Chủ Nhật: 8:00 - 17:00</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">Kết nối với chúng tôi</h2>
                <div className="flex space-x-4">
                  <Button variant="outline" size="icon" asChild>
                    <Link href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                      <Facebook className="h-5 w-5" />
                      <span className="sr-only">Facebook</span>
                    </Link>
                  </Button>
                  <Button variant="outline" size="icon" asChild>
                    <Link href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                      <Instagram className="h-5 w-5" />
                      <span className="sr-only">Instagram</span>
                    </Link>
                  </Button>
                  <Button variant="outline" size="icon" asChild>
                    <Link href="https://youtube.com" target="_blank" rel="noopener noreferrer">
                      <Youtube className="h-5 w-5" />
                      <span className="sr-only">YouTube</span>
                    </Link>
                  </Button>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-6">Gửi tin nhắn cho chúng tôi</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Họ và tên</Label>
                    <Input id="name" name="name" placeholder="Nhập họ và tên của bạn" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Số điện thoại</Label>
                    <Input id="phone" name="phone" placeholder="Nhập số điện thoại của bạn" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" type="email" placeholder="Nhập địa chỉ email của bạn" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">Chủ đề</Label>
                  <Input id="subject" name="subject" placeholder="Nhập chủ đề" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Nội dung</Label>
                  <Textarea id="message" name="message" placeholder="Nhập nội dung tin nhắn" className="min-h-[150px]" />
                </div>

                <Button type="submit" disabled={loading} className="w-full">
                  {loading ? "Đang gửi..." : "Gửi tin nhắn"}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="w-full py-12 bg-gradient-hero">
        <div className="container px-4 md:px-6">
          <h2 className="text-2xl font-bold mb-6 text-center">Bản đồ</h2>
          <div className="w-full h-[400px] bg-gray-200 rounded-lg flex items-center justify-center">
            <p className="text-muted-foreground">Bản đồ Google Maps sẽ được hiển thị ở đây</p>
            {/* Thay thế bằng iframe Google Maps thực tế */}
          </div>
        </div>
      </section>
    </div>
  )
}