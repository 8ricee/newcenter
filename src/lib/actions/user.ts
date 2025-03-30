"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { Role } from "@prisma/client";
import { hash } from "bcrypt";
import { authOptions } from "@/lib/auth";

const userSchema = z.object({
  name: z.string().min(1, { message: "Tên là bắt buộc" }),
  email: z.string().email({ message: "Email không hợp lệ" }),
  role: z.enum(["ADMIN", "TEACHER", "STUDENT"]).optional(),
  password: z
    .string()
    .min(6, { message: "Mật khẩu phải có ít nhất 6 ký tự" })
    .optional(),
  image: z.string().optional(),
});

const studentSchema = z.object({
  phoneNumber: z.string().optional(),
  dateOfBirth: z.string().optional(),
  address: z.string().optional(),
});

const teacherSchema = z.object({
  phoneNumber: z.string().optional(),
  bio: z.string().optional(),
  specialties: z.string().optional(),
  education: z.string().optional(),
  experience: z.coerce.number().optional(),
});

export async function getUsers() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    return { error: "Bạn không có quyền thực hiện hành động này" };
  }

  try {
    const users = await db.user.findMany({
      include: {
        student: true,
        teacher: true,
        admin: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return { users };
  } catch (error) {
    console.error("Error fetching users:", error);
    return { error: "Đã xảy ra lỗi khi lấy danh sách người dùng" };
  }
}

export async function getUserById(id: string) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return { error: "Bạn cần đăng nhập để thực hiện hành động này" };
  }

  // Only allow users to view their own profile or admins to view any profile
  if (session.user.id !== id && session.user.role !== "ADMIN") {
    return { error: "Bạn không có quyền thực hiện hành động này" };
  }

  try {
    const user = await db.user.findUnique({
      where: { id },
      include: {
        student: true,
        teacher: true,
        admin: true,
      },
    });

    if (!user) {
      return { error: "Không tìm thấy người dùng" };
    }

    return { user };
  } catch (error) {
    console.error("Error fetching user:", error);
    return { error: "Đã xảy ra lỗi khi lấy thông tin người dùng" };
  }
}

export async function createUser(formData: FormData) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    return { error: "Bạn không có quyền thực hiện hành động này" };
  }

  const validatedFields = userSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    role: formData.get("role"),
    password: formData.get("password"),
    image: formData.get("image"),
  });

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { name, email, role, password, image } = validatedFields.data;

  try {
    // Check if email already exists
    const existingUser = await db.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return { error: "Email đã được sử dụng" };
    }

    // Hash password
    const hashedPassword = password ? await hash(password, 10) : undefined;

    // Create user
    const user = await db.user.create({
      data: {
        name,
        email,
        role: (role as Role) || Role.STUDENT,
        password: hashedPassword,
        image,
      },
    });

    // Create role-specific profile
    if (role === "STUDENT") {
      await db.student.create({
        data: {
          userId: user.id,
        },
      });
    } else if (role === "TEACHER") {
      await db.teacher.create({
        data: {
          userId: user.id,
        },
      });
    } else if (role === "ADMIN") {
      await db.admin.create({
        data: {
          userId: user.id,
        },
      });
    }

    revalidatePath("/admin/users");
    return { success: true, user };
  } catch (error) {
    console.error("Error creating user:", error);
    return { error: "Đã xảy ra lỗi khi tạo người dùng" };
  }
}

export async function updateUser(id: string, formData: FormData) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return { error: "Bạn cần đăng nhập để thực hiện hành động này" };
  }

  // Only allow users to update their own profile or admins to update any profile
  if (session.user.id !== id && session.user.role !== "ADMIN") {
    return { error: "Bạn không có quyền thực hiện hành động này" };
  }

  const validatedFields = userSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    role: formData.get("role"),
    password: formData.get("password"),
    image: formData.get("image"),
  });

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { name, email, role, password, image } = validatedFields.data;

  try {
    // Check if email already exists (but not for the current user)
    const existingUser = await db.user.findFirst({
      where: {
        email,
        NOT: {
          id,
        },
      },
    });

    if (existingUser) {
      return { error: "Email đã được sử dụng" };
    }

    // Hash password if provided
    const hashedPassword = password ? await hash(password, 10) : undefined;

    // Update user
    const user = await db.user.update({
      where: { id },
      data: {
        name,
        email,
        role: session.user.role === "ADMIN" ? (role as Role) : undefined,
        password: hashedPassword,
        image,
      },
    });

    // Update role-specific profile based on user role
    if (user.role === "STUDENT") {
      const studentData = studentSchema.safeParse({
        phoneNumber: formData.get("phoneNumber"),
        dateOfBirth: formData.get("dateOfBirth"),
        address: formData.get("address"),
      });

      if (studentData.success) {
        const { phoneNumber, dateOfBirth, address } = studentData.data;

        // Check if student profile exists
        const existingStudent = await db.student.findUnique({
          where: { userId: id },
        });

        if (existingStudent) {
          await db.student.update({
            where: { userId: id },
            data: {
              phoneNumber,
              dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
              address,
            },
          });
        } else {
          await db.student.create({
            data: {
              userId: id,
              phoneNumber,
              dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
              address,
            },
          });
        }
      }
    } else if (user.role === "TEACHER") {
      const teacherData = teacherSchema.safeParse({
        phoneNumber: formData.get("phoneNumber"),
        bio: formData.get("bio"),
        specialties: formData.get("specialties"),
        education: formData.get("education"),
        experience: formData.get("experience"),
      });

      if (teacherData.success) {
        const { phoneNumber, bio, specialties, education, experience } =
          teacherData.data;

        // Check if teacher profile exists
        const existingTeacher = await db.teacher.findUnique({
          where: { userId: id },
        });

        if (existingTeacher) {
          await db.teacher.update({
            where: { userId: id },
            data: {
              phoneNumber,
              bio,
              specialties: specialties
                ? specialties.split(",").map((s) => s.trim())
                : undefined,
              education,
              experience,
            },
          });
        } else {
          await db.teacher.create({
            data: {
              userId: id,
              phoneNumber,
              bio,
              specialties: specialties
                ? specialties.split(",").map((s) => s.trim())
                : [],
              education,
              experience,
            },
          });
        }
      }
    }

    revalidatePath(`/admin/users/${id}`);
    revalidatePath("/admin/users");
    revalidatePath("/dashboard/profile");
    return { success: true, user };
  } catch (error) {
    console.error("Error updating user:", error);
    return { error: "Đã xảy ra lỗi khi cập nhật người dùng" };
  }
}

export async function deleteUser(id: string) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    return { error: "Bạn không có quyền thực hiện hành động này" };
  }

  try {
    await db.user.delete({
      where: { id },
    });

    revalidatePath("/admin/users");
    return { success: true };
  } catch (error) {
    console.error("Error deleting user:", error);
    return { error: "Đã xảy ra lỗi khi xóa người dùng" };
  }
}

export async function getTeachers() {
  try {
    const teachers = await db.teacher.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
    });

    return { teachers };
  } catch (error) {
    console.error("Error fetching teachers:", error);
    return { error: "Đã xảy ra lỗi khi lấy danh sách giáo viên" };
  }
}

export async function getStudents() {
  try {
    const students = await db.student.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
    });

    return { students };
  } catch (error) {
    console.error("Error fetching students:", error);
    return { error: "Đã xảy ra lỗi khi lấy danh sách học viên" };
  }
}

export async function getCurrentUserProfile() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return { error: "Bạn cần đăng nhập để thực hiện hành động này" };
  }

  try {
    const user = await db.user.findUnique({
      where: { id: session.user.id },
      include: {
        student: true,
        teacher: true,
        admin: true,
      },
    });

    if (!user) {
      return { error: "Không tìm thấy người dùng" };
    }

    return { user };
  } catch (error) {
    console.error("Error fetching current user profile:", error);
    return { error: "Đã xảy ra lỗi khi lấy thông tin người dùng" };
  }
}
