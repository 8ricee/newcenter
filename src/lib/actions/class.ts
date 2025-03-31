"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";

const classSchema = z.object({
  name: z.string().min(1, { message: "Tên lớp là bắt buộc" }),
  courseId: z.string().min(1, { message: "Khóa học là bắt buộc" }),
  teacherId: z.string().min(1, { message: "Giáo viên là bắt buộc" }),
  startDate: z.string().min(1, { message: "Ngày bắt đầu là bắt buộc" }),
  endDate: z.string().min(1, { message: "Ngày kết thúc là bắt buộc" }),
  schedule: z.string().min(1, { message: "Lịch học là bắt buộc" }),
  room: z.string().optional(),
  maxStudents: z.coerce
    .number()
    .min(1, { message: "Số học viên tối đa phải lớn hơn 0" }),
});

export async function getClasses() {
  try {
    const classes = await db.class.findMany({
      include: {
        course: true,
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
        enrollments: true,
      },
      orderBy: {
        startDate: "desc",
      },
    });

    return { classes };
  } catch (error) {
    console.error("Error fetching classes:", error);
    return { error: "Đã xảy ra lỗi khi lấy danh sách lớp học" };
  }
}

export async function getClassById(id: string) {
  try {
    const classData = await db.class.findUnique({
      where: { id },
      include: {
        course: true,
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
        sessions: {
          include: {
            attendances: true,
          },
          orderBy: {
            date: "asc",
          },
        },
      },
    });

    if (!classData) {
      return { error: "Không tìm thấy lớp học" };
    }

    return { class: classData };
  } catch (error) {
    console.error("Error fetching class:", error);
    return { error: "Đã xảy ra lỗi khi lấy thông tin lớp học" };
  }
}

export async function createClass(formData: FormData) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    return { error: "Bạn không có quyền thực hiện hành động này" };
  }

  const validatedFields = classSchema.safeParse({
    name: formData.get("name"),
    courseId: formData.get("courseId"),
    teacherId: formData.get("teacherId"),
    startDate: formData.get("startDate"),
    endDate: formData.get("endDate"),
    schedule: formData.get("schedule"),
    room: formData.get("room"),
    maxStudents: formData.get("maxStudents"),
  });

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.flatten().fieldErrors,
    };
  }

  const {
    name,
    courseId,
    teacherId,
    startDate,
    endDate,
    schedule,
    room,
    maxStudents,
  } = validatedFields.data;

  try {
    // Parse schedule from JSON string
    const scheduleJson = JSON.parse(schedule);

    const classData = await db.class.create({
      data: {
        name,
        courseId,
        teacherId,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        schedule: scheduleJson,
        room,
        maxStudents,
      },
    });

    revalidatePath("/admin/classes");
    return { success: true, class: classData };
  } catch (error) {
    console.error("Error creating class:", error);
    return { error: "Đã xảy ra lỗi khi tạo lớp học" };
  }
}

export async function updateClass(id: string, formData: FormData) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    return { error: "Bạn không có quyền thực hiện hành động này" };
  }

  const validatedFields = classSchema.safeParse({
    name: formData.get("name"),
    courseId: formData.get("courseId"),
    teacherId: formData.get("teacherId"),
    startDate: formData.get("startDate"),
    endDate: formData.get("endDate"),
    schedule: formData.get("schedule"),
    room: formData.get("room"),
    maxStudents: formData.get("maxStudents"),
  });

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.flatten().fieldErrors,
    };
  }

  const {
    name,
    courseId,
    teacherId,
    startDate,
    endDate,
    schedule,
    room,
    maxStudents,
  } = validatedFields.data;

  try {
    // Parse schedule from JSON string
    const scheduleJson = JSON.parse(schedule);

    const classData = await db.class.update({
      where: { id },
      data: {
        name,
        courseId,
        teacherId,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        schedule: scheduleJson,
        room,
        maxStudents,
      },
    });

    revalidatePath(`/admin/classes/${id}`);
    revalidatePath("/admin/classes");
    return { success: true, class: classData };
  } catch (error) {
    console.error("Error updating class:", error);
    return { error: "Đã xảy ra lỗi khi cập nhật lớp học" };
  }
}

export async function deleteClass(id: string) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    return { error: "Bạn không có quyền thực hiện hành động này" };
  }

  try {
    await db.class.delete({
      where: { id },
    });

    revalidatePath("/admin/classes");
    return { success: true };
  } catch (error) {
    console.error("Error deleting class:", error);
    return { error: "Đã xảy ra lỗi khi xóa lớp học" };
  }
}

export async function getStudentClasses(studentId: string) {
  try {
    const enrollments = await db.enrollment.findMany({
      where: {
        studentId,
        class: {
          isNot: null,
        },
      },
      include: {
        class: {
          include: {
            course: true,
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
      orderBy: {
        enrolledAt: "desc",
      },
    });

    return { enrollments };
  } catch (error) {
    console.error("Error fetching student classes:", error);
    return { error: "Đã xảy ra lỗi khi lấy danh sách lớp học của học viên" };
  }
}

export async function getTeacherClasses(teacherId: string) {
  try {
    const classes = await db.class.findMany({
      where: {
        teacherId,
      },
      include: {
        course: true,
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
        sessions: {
          orderBy: {
            date: "asc",
          },
        },
      },
      orderBy: {
        startDate: "desc",
      },
    });

    return { classes };
  } catch (error) {
    console.error("Error fetching teacher classes:", error);
    return { error: "Đã xảy ra lỗi khi lấy danh sách lớp học của giáo viên" };
  }
}
