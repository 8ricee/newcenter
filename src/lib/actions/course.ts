"use server"

import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { z } from "zod"

const CourseSchema = z.object({
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

export type CourseFormValues = z.infer<typeof CourseSchema>

export async function createCourse(values: CourseFormValues) {
  const validatedFields = CourseSchema.safeParse(values)

  if (!validatedFields.success) {
    return { error: validatedFields.error.flatten().fieldErrors }
  }

  const {
    title,
    slug,
    description,
    fullDescription,
    image,
    level,
    language,
    duration,
    lessons,
    hoursPerLesson,
    schedule,
    groupSize,
    format,
    price,
    promotionPrice,
    hasPromotion,
    promotionPercent,
    isPopular,
    isNew,
    features,
    requirements,
    outcomes,
    teacherId,
  } = validatedFields.data

  try {
    await db.course.create({
      data: {
        title,
        slug,
        description,
        fullDescription,
        image,
        level,
        language,
        duration,
        lessons,
        hoursPerLesson,
        schedule,
        groupSize,
        format,
        price,
        promotionPrice,
        hasPromotion,
        promotionPercent,
        isPopular,
        isNew,
        features,
        requirements,
        outcomes,
        teacherId,
      },
    })

    revalidatePath("/admin/courses")
    redirect("/admin/courses")
  } catch (error) {
    return { error: "Đã xảy ra lỗi khi tạo khóa học." }
  }
}

export async function updateCourse(courseId: string, values: CourseFormValues) {
  const validatedFields = CourseSchema.safeParse(values)

  if (!validatedFields.success) {
    return { error: validatedFields.error.flatten().fieldErrors }
  }

  const {
    title,
    slug,
    description,
    fullDescription,
    image,
    level,
    language,
    duration,
    lessons,
    hoursPerLesson,
    schedule,
    groupSize,
    format,
    price,
    promotionPrice,
    hasPromotion,
    promotionPercent,
    isPopular,
    isNew,
    features,
    requirements,
    outcomes,
    teacherId,
  } = validatedFields.data

  try {
    await db.course.update({
      where: { id: courseId },
      data: {
        title,
        slug,
        description,
        fullDescription,
        image,
        level,
        language,
        duration,
        lessons,
        hoursPerLesson,
        schedule,
        groupSize,
        format,
        price,
        promotionPrice,
        hasPromotion,
        promotionPercent,
        isPopular,
        isNew,
        features,
        requirements,
        outcomes,
        teacherId,
      },
    })

    revalidatePath(`/admin/courses/${courseId}`)
    revalidatePath(`/courses/${slug}`)
    redirect("/admin/courses")
  } catch (error) {
    return { error: "Đã xảy ra lỗi khi cập nhật khóa học." }
  }
}

export async function deleteCourse(courseId: string) {
  try {
    await db.course.delete({
      where: { id: courseId },
    })

    revalidatePath("/admin/courses")
    return { success: true }
  } catch (error) {
    return { error: "Đã xảy ra lỗi khi xóa khóa học." }
  }
}

