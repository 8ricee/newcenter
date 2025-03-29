"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, SubmitHandler } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { createCourse, updateCourse } from "@/lib/actions/course"

// Định nghĩa interface cho dữ liệu của giảng viên (dựa trên schema Prisma của bạn)
interface Teacher {
  id: string;
  user: {
    name: string | null;
  };
}

// Định nghĩa type cho form values dựa trên formSchema
type CourseFormValues = z.infer<typeof formSchema>;

// Định nghĩa interface cho initialData (dựa trên CourseFormValues hoặc schema Prisma)
interface InitialCourseData extends CourseFormValues {
  id?: string; // Thêm id nếu là trường hợp cập nhật
}

interface CourseFormProps {
  teachers: Teacher[];
  initialData?: InitialCourseData;
}

const formSchema = z.object({
  title: z.string().min(1, { message: "Tiêu đề là bắt buộc" }),
  slug: z.string().min(1, { message: "Slug là bắt buộc" }),
  description: z.string().min(1, { message: "Mô tả ngắn là bắt buộc" }),
  fullDescription: z.string().optional(),
  image: z.string().optional(),
  level: z.string().min(1, { message: "Trình độ là bắt buộc" }),
  language: z.string().min(1, { message: "Ngôn ngữ là bắt buộc" }),
  duration: z.string().min(1, { message: "Thời lượng là bắt buộc" }),
  lessons: z.coerce.number().min(1, { message: "Số buổi học là bắt buộc" }),
  hoursPerLesson: z.coerce.number().min(0.5, { message: "Số giờ mỗi buổi là bắt buộc" }),
  schedule: z.string().optional(),
  groupSize: z.string().optional(),
  format: z.string().min(1, { message: "Hình thức học là bắt buộc" }),
  price: z.coerce.number().min(0, { message: "Giá là bắt buộc" }),
  promotionPrice: z.coerce.number().optional(),
  hasPromotion: z.boolean().default(false),
  promotionPercent: z.coerce.number().optional(),
  isPopular: z.boolean().default(false),
  isNew: z.boolean().default(false),
  features: z.array(z.string()).default([]),
  requirements: z.array(z.string()).default([]),
  outcomes: z.array(z.string()).default([]),
  teacherId: z.string().min(1, { message: "Giảng viên là bắt buộc" }),
})

export function CourseForm({ teachers, initialData }: CourseFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [features, setFeatures] = useState<string[]>(initialData?.features || [""])
  const [requirements, setRequirements] = useState<string[]>(initialData?.requirements || [""])
  const [outcomes, setOutcomes] = useState<string[]>(initialData?.outcomes || [""])

  const form = useForm<CourseFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      title: "",
      slug: "",
      description: "",
      fullDescription: "",
      image: "/placeholder.svg?height=340&width=600",
      level: "Cơ bản",
      language: "Tiếng Anh",
      duration: "",
      lessons: 0,
      hoursPerLesson: 0,
      schedule: "",
      groupSize: "",
      format: "Trực tiếp",
      price: 0,
      promotionPrice: 0,
      hasPromotion: false,
      promotionPercent: 0,
      isPopular: false,
      isNew: false,
      features: [],
      requirements: [],
      outcomes: [],
      teacherId: "",
    },
  })

  const onSubmit: SubmitHandler<CourseFormValues> = async (values) => {
    try {
      setIsLoading(true)

      // Filter out empty strings
      values.features = features.filter((feature: string) => feature.trim() !== "")
      values.requirements = requirements.filter((req: string) => req.trim() !== "")
      values.outcomes = outcomes.filter((outcome: string) => outcome.trim() !== "")

      if (initialData) {
        if (initialData?.id) {
          await updateCourse(initialData.id, values)
        } else {
          throw new Error("Course ID is undefined.")
        }
      } else {
        await createCourse(values)
      }

      router.push("/admin/courses")
      router.refresh()
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value
    // Chỉ tạo slug nếu initialData không có id (tức là tạo mới)
    if (!initialData?.id) {
      const slug = title
        .toLowerCase()
        .replace(/[^\w\s]/gi, "")
        .replace(/\s+/g, "-")
      form.setValue("slug", slug)
    }
    // Nếu initialData có id (tức là cập nhật), chúng ta không thay đổi slug ở đây.
  }

  const handlePriceChange = () => {
    const price = form.getValues("price")
    const hasPromotion = form.getValues("hasPromotion")
    const promotionPercent = form.getValues("promotionPercent")

    if (hasPromotion && price && promotionPercent) {
      const promotionPrice = price * (1 - promotionPercent / 100)
      form.setValue("promotionPrice", Math.round(promotionPrice))
    }
  }

  const addFeature = () => {
    setFeatures([...features, ""])
  }

  const updateFeature = (index: number, value: string) => {
    const newFeatures = [...features]
    newFeatures[index] = value
    setFeatures(newFeatures)
  }

  const removeFeature = (index: number) => {
    const newFeatures = [...features]
    newFeatures.splice(index, 1)
    setFeatures(newFeatures)
  }

  const addRequirement = () => {
    setRequirements([...requirements, ""])
  }

  const updateRequirement = (index: number, value: string) => {
    const newRequirements = [...requirements]
    newRequirements[index] = value
    setRequirements(newRequirements)
  }

  const removeRequirement = (index: number) => {
    const newRequirements = [...requirements]
    newRequirements.splice(index, 1)
    setRequirements(newRequirements)
  }

  const addOutcome = () => {
    setOutcomes([...outcomes, ""])
  }

  const updateOutcome = (index: number, value: string) => {
    const newOutcomes = [...outcomes]
    newOutcomes[index] = value
    setOutcomes(newOutcomes)
  }

  const removeOutcome = (index: number) => {
    const newOutcomes = [...outcomes]
    newOutcomes.splice(index, 1)
    setOutcomes(newOutcomes)
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="basic">Thông tin cơ bản</TabsTrigger>
          <TabsTrigger value="details">Chi tiết khóa học</TabsTrigger>
          <TabsTrigger value="features">Tính năng & Yêu cầu</TabsTrigger>
        </TabsList>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <TabsContent value="basic" className="space-y-6 mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tên khóa học</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          onChange={(e) => {
                            field.onChange(e)
                            handleTitleChange(e)
                          }}
                          placeholder="Nhập tên khóa học"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="slug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>URL</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="ten-khoa-hoc" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mô tả ngắn</FormLabel>
                    <FormControl>
                      <Textarea {...field} placeholder="Nhập mô tả ngắn về khóa học" rows={3} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="fullDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mô tả đầy đủ</FormLabel>
                    <FormControl>
                      <Textarea {...field} placeholder="Nhập mô tả đầy đủ về khóa học" rows={6} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hình ảnh</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="/placeholder.svg?height=340&width=600" />
                    </FormControl>
                    <FormDescription>Đường dẫn đến hình ảnh khóa học</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField
                  control={form.control}
                  name="level"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Trình độ</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn trình độ" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Cơ bản">Cơ bản</SelectItem>
                          <SelectItem value="Trung cấp">Trung cấp</SelectItem>
                          <SelectItem value="Nâng cao">Nâng cao</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="language"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ngôn ngữ</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn ngôn ngữ" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Tiếng Anh">Tiếng Anh</SelectItem>
                          <SelectItem value="Tiếng Nhật">Tiếng Nhật</SelectItem>
                          <SelectItem value="Tiếng Hàn">Tiếng Hàn</SelectItem>
                          <SelectItem value="Tiếng Trung">Tiếng Trung</SelectItem>
                          <SelectItem value="Tiếng Pháp">Tiếng Pháp</SelectItem>
                          <SelectItem value="Tiếng Đức">Tiếng Đức</SelectItem>
                          <SelectItem value="Tiếng Tây Ban Nha">Tiếng Tây Ban Nha</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="format"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Hình thức học</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn hình thức học" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Trực tiếp">Trực tiếp</SelectItem>
                          <SelectItem value="Trực tuyến">Trực tuyến</SelectItem>
                          <SelectItem value="Kết hợp">Kết hợp</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField
                  control={form.control}
                  name="duration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Thời lượng</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="3 tháng" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lessons"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Số buổi học</FormLabel>
                      <FormControl>
                        <Input {...field} type="number" placeholder="24" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="hoursPerLesson"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Số giờ mỗi buổi</FormLabel>
                      <FormControl>
                        <Input {...field} type="number" step="0.5" placeholder="1.5" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="schedule"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Lịch học</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="2 buổi/tuần, 90 phút/buổi" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="groupSize"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quy mô lớp</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="10-15 học viên" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </TabsContent>

            <TabsContent value="details" className="space-y-6 mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Giá (VNĐ)</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          placeholder="3500000"
                          onChange={(e) => {
                            field.onChange(e)
                            handlePriceChange()
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="teacherId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Giảng viên</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn giảng viên" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {teachers.map((teacher: Teacher) => (
                            <SelectItem key={teacher.id} value={teacher.id}>
                              {teacher.user.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="hasPromotion"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={(checked) => {
                            field.onChange(checked)
                            handlePriceChange()
                          }}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Có khuyến mãi</FormLabel>
                        <FormDescription>Khóa học này đang có khuyến mãi</FormDescription>
                      </div>
                    </FormItem>
                  )}
                />

                {form.watch("hasPromotion") && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="promotionPercent"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phần trăm giảm giá (%)</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="number"
                              placeholder="20"
                              onChange={(e) => {
                                field.onChange(e)
                                handlePriceChange()
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="promotionPrice"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Giá khuyến mãi (VNĐ)</FormLabel>
                          <FormControl>
                            <Input {...field} type="number" placeholder="2800000" disabled />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="isPopular"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Khóa học phổ biến</FormLabel>
                        <FormDescription>Đánh dấu khóa học này là phổ biến</FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="isNew"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Khóa học mới</FormLabel>
                        <FormDescription>Đánh dấu khóa học này là mới</FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
            </TabsContent>

            <TabsContent value="features" className="space-y-6 mt-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Tính năng nổi bật</h3>
                  <Button type="button" variant="outline" onClick={addFeature}>
                    Thêm tính năng
                  </Button>
                </div>
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input
                      value={feature}
                      onChange={(e) => updateFeature(index, e.target.value)}
                      placeholder="Nhập tính năng nổi bật"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFeature(index)}
                      disabled={features.length === 1}
                    >
                      Xóa
                    </Button>
                  </div>
                ))}
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Yêu cầu</h3>
                  <Button type="button" variant="outline" onClick={addRequirement}>
                    Thêm yêu cầu
                  </Button>
                </div>
                {requirements.map((requirement, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input
                      value={requirement}
                      onChange={(e) => updateRequirement(index, e.target.value)}
                      placeholder="Nhập yêu cầu khóa học"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeRequirement(index)}
                      disabled={requirements.length === 1}
                    >
                      Xóa
                    </Button>
                  </div>
                ))}
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Kết quả đầu ra</h3>
                  <Button type="button" variant="outline" onClick={addOutcome}>
                    Thêm kết quả
                  </Button>
                </div>
                {outcomes.map((outcome, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input
                      value={outcome}
                      onChange={(e) => updateOutcome(index, e.target.value)}
                      placeholder="Nhập kết quả đầu ra"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeOutcome(index)}
                      disabled={outcomes.length === 1}
                    >
                      Xóa
                    </Button>
                  </div>
                ))}
              </div>
            </TabsContent>

            <div className="flex items-center justify-end space-x-4 mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/admin/courses")}
                disabled={isLoading}
              >
                Hủy
              </Button>
              <Button type="submit" disabled={isLoading}>
                {initialData ? "Cập nhật" : "Tạo"} khóa học
              </Button>
            </div>
          </form>
        </Form>
      </Tabs>
    </div>
  )
}