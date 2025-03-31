"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { EnrollmentStatus } from "@prisma/client";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";

const enrollmentSchema = z.object({
  studentId: z.string().min(1, { message: "Học viên là bắt buộc" }),
  courseId: z.string().min(1, { message: "Khóa học là bắt buộc" }),
  classId: z.string().optional(),
  status: z.enum(["PENDING", "ACTIVE", "COMPLETED", "CANCELLED"]).optional(),
  progress: z.coerce.number().min(0).max(100).optional(),
  notes: z.string().optional(),
});

export async function getEnrollments() {
  try {
    const enrollments = await db.enrollment.findMany({
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
        course: true,
        class: true,
      },
      orderBy: {
        enrolledAt: "desc",
      },
    });

    return { enrollments };
  } catch (error) {
    console.error("Error fetching enrollments:", error);
    return { error: "Đã xảy ra lỗi khi lấy danh sách đăng ký" };
  }
}

export async function getEnrollmentById(id: string) {
  try {
    const enrollment = await db.enrollment.findUnique({
      where: { id },
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
        class: {
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
            sessions: {
              orderBy: {
                date: "asc",
              },
            },
          },
        },
      },
    });

    if (!enrollment) {
      return { error: "Không tìm thấy đăng ký" };
    }

    const enrollmentsWithAttendances = await db.enrollment.findUnique({
      where: { id },
      include: {
        class: {
          include: {
            sessions: {
              include: {
                attendances: {
                  where: {
                    student: {
                      userId: enrollment.student.userId,
                    },
                  },
                },
              },
              orderBy: {
                date: "asc",
              },
            },
          },
        },
      },
    });

    // Merge the attendances back into the original enrollment object
    const updatedEnrollment = {
      ...enrollment,
      class: enrollmentsWithAttendances?.class,
    };

    return { enrollment: updatedEnrollment };
  } catch (error) {
    console.error("Error fetching enrollment:", error);
    return { error: "Đã xảy ra lỗi khi lấy thông tin đăng ký" };
  }
}

export async function createEnrollment(formData: FormData) {
  const session = await getServerSession(authOptions);

  if (
    !session ||
    (session.user.role !== "ADMIN" && session.user.role !== "STUDENT")
  ) {
    return { error: "Bạn không có quyền thực hiện hành động này" };
  }

  const validatedFields = enrollmentSchema.safeParse({
    studentId: formData.get("studentId"),
    courseId: formData.get("courseId"),
    classId: formData.get("classId"),
    status: formData.get("status"),
    progress: formData.get("progress"),
    notes: formData.get("notes"),
  });

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { studentId, courseId, classId, status, progress, notes } =
    validatedFields.data;

  try {
    // Check if student is already enrolled in this course
    const existingEnrollment = await db.enrollment.findFirst({
      where: {
        studentId,
        courseId,
        status: {
          in: ["PENDING", "ACTIVE"],
        },
      },
    });

    if (existingEnrollment) {
      return { error: "Học viên đã đăng ký khóa học này" };
    }

    // Check if class has available slots
    if (classId) {
      const classData = await db.class.findUnique({
        where: { id: classId },
        include: {
          enrollments: true,
        },
      });

      if (classData && classData.enrollments.length >= classData.maxStudents) {
        return { error: "Lớp học đã đầy" };
      }
    }

    const enrollment = await db.enrollment.create({
      data: {
        studentId,
        courseId,
        classId: classId || null,
        status: (status as EnrollmentStatus) || EnrollmentStatus.PENDING,
        progress: progress || 0,
        notes,
      },
    });

    revalidatePath("/admin/enrollments");
    revalidatePath("/dashboard/courses");
    return { success: true, enrollment };
  } catch (error) {
    console.error("Error creating enrollment:", error);
    return { error: "Đã xảy ra lỗi khi tạo đăng ký" };
  }
}

export async function updateEnrollment(id: string, formData: FormData) {
  const session = await getServerSession(authOptions);

  if (
    !session ||
    (session.user.role !== "ADMIN" && session.user.role !== "TEACHER")
  ) {
    return { error: "Bạn không có quyền thực hiện hành động này" };
  }

  const validatedFields = enrollmentSchema.safeParse({
    studentId: formData.get("studentId"),
    courseId: formData.get("courseId"),
    classId: formData.get("classId"),
    status: formData.get("status"),
    progress: formData.get("progress"),
    notes: formData.get("notes"),
  });

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { studentId, courseId, classId, status, progress, notes } =
    validatedFields.data;

  try {
    const enrollment = await db.enrollment.update({
      where: { id },
      data: {
        studentId,
        courseId,
        classId: classId || null,
        status: (status as EnrollmentStatus) || undefined,
        progress: progress || undefined,
        notes,
      },
    });

    revalidatePath(`/admin/enrollments/${id}`);
    revalidatePath("/admin/enrollments");
    revalidatePath("/dashboard/courses");
    return { success: true, enrollment };
  } catch (error) {
    console.error("Error updating enrollment:", error);
    return { error: "Đã xảy ra lỗi khi cập nhật đăng ký" };
  }
}

export async function deleteEnrollment(id: string) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    return { error: "Bạn không có quyền thực hiện hành động này" };
  }

  try {
    await db.enrollment.delete({
      where: { id },
    });

    revalidatePath("/admin/enrollments");
    return { success: true };
  } catch (error) {
    console.error("Error deleting enrollment:", error);
    return { error: "Đã xảy ra lỗi khi xóa đăng ký" };
  }
}

export async function updateEnrollmentProgress(id: string, progress: number) {
  const session = await getServerSession(authOptions);

  if (
    !session ||
    (session.user.role !== "ADMIN" && session.user.role !== "TEACHER")
  ) {
    return { error: "Bạn không có quyền thực hiện hành động này" };
  }

  try {
    const enrollment = await db.enrollment.update({
      where: { id },
      data: {
        progress,
      },
    });

    revalidatePath(`/admin/enrollments/${id}`);
    revalidatePath("/admin/enrollments");
    revalidatePath("/dashboard/courses");
    return { success: true, enrollment };
  } catch (error) {
    console.error("Error updating enrollment progress:", error);
    return { error: "Đã xảy ra lỗi khi cập nhật tiến độ học tập" };
  }
}

export async function getUserEnrollments(userId: string) {
  try {
    // Get student ID from user ID
    const student = await db.student.findUnique({
      where: { userId },
    });

    if (!student) {
      return { error: "Không tìm thấy thông tin học viên" };
    }

    const enrollments = await db.enrollment.findMany({
      where: {
        studentId: student.id,
      },
      include: {
        course: true,
        class: true,
      },
      orderBy: {
        enrolledAt: "desc",
      },
    });

    return { enrollments };
  } catch (error) {
    console.error("Error fetching user enrollments:", error);
    return { error: "Đã xảy ra lỗi khi lấy danh sách đăng ký" };
  }
}
