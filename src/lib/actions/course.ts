"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { CourseStatus } from "@prisma/client";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";

const courseSchema = z.object({
  title: z.string().min(1, { message: "Tiêu đề là bắt buộc" }),
  description: z.string().optional(),
  level: z.string().min(1, { message: "Cấp độ là bắt buộc" }),
  duration: z.coerce.number().min(1, { message: "Thời lượng phải lớn hơn 0" }),
  lessons: z.coerce.number().min(1, { message: "Số buổi học phải lớn hơn 0" }),
  price: z.coerce.number().min(0, { message: "Giá không được âm" }),
  teacherId: z.string().optional(),
  image: z.string().optional(),
  status: z.enum(["UPCOMING", "ACTIVE", "COMPLETED", "CANCELLED"]).optional(),
});

export async function getCourses() {
  try {
    const courses = await db.course.findMany({
      include: {
        teacher: {
          include: {
            user: {
              select: {
                name: true,
                image: true,
              },
            },
          },
        },
        classes: true,
        enrollments: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return { courses };
  } catch (error) {
    console.error("Error fetching courses:", error);
    return { error: "Đã xảy ra lỗi khi lấy danh sách khóa học" };
  }
}

export async function getCourseById(id: string) {
  try {
    const course = await db.course.findUnique({
      where: { id },
      include: {
        teacher: {
          include: {
            user: {
              select: {
                name: true,
                image: true,
              },
            },
          },
        },
        classes: {
          include: {
            teacher: {
              include: {
                user: {
                  select: {
                    name: true,
                  },
                },
              },
            },
            enrollments: true,
          },
        },
        enrollments: {
          include: {
            student: {
              include: {
                user: {
                  select: {
                    name: true,
                    email: true,
                    image: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!course) {
      return { error: "Không tìm thấy khóa học" };
    }

    return { course };
  } catch (error) {
    console.error("Error fetching course:", error);
    return { error: "Đã xảy ra lỗi khi lấy thông tin khóa học" };
  }
}

export async function createCourse(formData: FormData) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    return { error: "Bạn không có quyền thực hiện hành động này" };
  }

  const validatedFields = courseSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    level: formData.get("level"),
    duration: formData.get("duration"),
    lessons: formData.get("lessons"),
    price: formData.get("price"),
    teacherId: formData.get("teacherId"),
    image: formData.get("image"),
    status: formData.get("status"),
  });

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.flatten().fieldErrors,
    };
  }

  const {
    title,
    description,
    level,
    duration,
    lessons,
    price,
    teacherId,
    image,
    status,
  } = validatedFields.data;

  try {
    const course = await db.course.create({
      data: {
        title,
        description,
        level,
        duration,
        lessons,
        price,
        teacherId: teacherId || undefined,
        image,
        status: (status as CourseStatus) || CourseStatus.UPCOMING,
      },
    });

    revalidatePath("/admin/courses");
    return { success: true, course };
  } catch (error) {
    console.error("Error creating course:", error);
    return { error: "Đã xảy ra lỗi khi tạo khóa học" };
  }
}

export async function updateCourse(id: string, formData: FormData) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    return { error: "Bạn không có quyền thực hiện hành động này" };
  }

  const validatedFields = courseSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    level: formData.get("level"),
    duration: formData.get("duration"),
    lessons: formData.get("lessons"),
    price: formData.get("price"),
    teacherId: formData.get("teacherId"),
    image: formData.get("image"),
    status: formData.get("status"),
  });

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.flatten().fieldErrors,
    };
  }

  const {
    title,
    description,
    level,
    duration,
    lessons,
    price,
    teacherId,
    image,
    status,
  } = validatedFields.data;

  try {
    const course = await db.course.update({
      where: { id },
      data: {
        title,
        description,
        level,
        duration,
        lessons,
        price,
        teacherId: teacherId || null,
        image,
        status: (status as CourseStatus) || undefined,
      },
    });

    revalidatePath(`/admin/courses/${id}`);
    revalidatePath("/admin/courses");
    return { success: true, course };
  } catch (error) {
    console.error("Error updating course:", error);
    return { error: "Đã xảy ra lỗi khi cập nhật khóa học" };
  }
}

export async function deleteCourse(id: string) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    return { error: "Bạn không có quyền thực hiện hành động này" };
  }

  try {
    await db.course.delete({
      where: { id },
    });

    revalidatePath("/admin/courses");
    return { success: true };
  } catch (error) {
    console.error("Error deleting course:", error);
    return { error: "Đã xảy ra lỗi khi xóa khóa học" };
  }
}

export async function getStudentCourses(studentId: string) {
  try {
    const enrollments = await db.enrollment.findMany({
      where: {
        studentId,
      },
      include: {
        course: {
          include: {
            teacher: {
              include: {
                user: {
                  select: {
                    name: true,
                    image: true,
                  },
                },
              },
            },
          },
        },
        class: true,
      },
      orderBy: {
        enrolledAt: "desc",
      },
    });

    return { enrollments };
  } catch (error) {
    console.error("Error fetching student courses:", error);
    return { error: "Đã xảy ra lỗi khi lấy danh sách khóa học của học viên" };
  }
}
