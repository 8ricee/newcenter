"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, SubmitHandler } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner" // Import toast from sonner

const formSchema = z.object({
  siteName: z.string().min(1, { message: "Tên trang web là bắt buộc" }),
  siteDescription: z.string().min(1, { message: "Mô tả trang web là bắt buộc" }),
  contactEmail: z.string().email({ message: "Email không hợp lệ" }),
  contactPhone: z.string().min(1, { message: "Số điện thoại là bắt buộc" }),
  address: z.string().min(1, { message: "Địa chỉ là bắt buộc" }),
  facebookUrl: z.string().url({ message: "URL Facebook không hợp lệ" }).optional().or(z.literal("")),
  youtubeUrl: z.string().url({ message: "URL Youtube không hợp lệ" }).optional().or(z.literal("")),
  instagramUrl: z.string().url({ message: "URL Instagram không hợp lệ" }).optional().or(z.literal("")),
})

// Define the type for the form values
type SiteSettingsFormValues = z.infer<typeof formSchema>;

export function SiteSettingsForm() {
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<SiteSettingsFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      siteName: "Language Center",
      siteDescription: "Trung tâm đào tạo ngoại ngữ hàng đầu",
      contactEmail: "contact@languagecenter.com",
      contactPhone: "0123456789",
      address: "123 Đường ABC, Quận XYZ, TP. Hồ Chí Minh",
      facebookUrl: "https://facebook.com/languagecenter",
      youtubeUrl: "https://youtube.com/languagecenter",
      instagramUrl: "https://instagram.com/languagecenter",
    },
  })

  const onSubmit: SubmitHandler<SiteSettingsFormValues> = async () => { // Removed the unused 'values' parameter
    try {
      setIsLoading(true)
      // Giả lập API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast.success("Cài đặt đã được lưu", {
        description: "Các thay đổi đã được cập nhật thành công.",
      })
    } catch (error) {
      console.error(error)
      toast.error("Đã xảy ra lỗi", {
        description: "Không thể lưu cài đặt. Vui lòng thử lại sau.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="siteName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tên trang web</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormDescription>Tên hiển thị của trang web</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="contactEmail"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email liên hệ</FormLabel>
                <FormControl>
                  <Input {...field} type="email" />
                </FormControl>
                <FormDescription>Email hiển thị trên trang liên hệ</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="siteDescription"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mô tả trang web</FormLabel>
              <FormControl>
                <Textarea {...field} rows={3} />
              </FormControl>
              <FormDescription>Mô tả ngắn về trang web, hiển thị ở footer và meta description</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="contactPhone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Số điện thoại</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Địa chỉ</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FormField
            control={form.control}
            name="facebookUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Facebook URL</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="youtubeUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Youtube URL</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="instagramUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Instagram URL</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Đang lưu..." : "Lưu thay đổi"}
        </Button>
      </form>
    </Form>
  )
}