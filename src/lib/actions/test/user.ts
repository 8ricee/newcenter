/* eslint-disable @typescript-eslint/no-explicit-any */
"use server"

import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { hash, compare } from "bcryptjs"
import type { Role } from "@prisma/client"
import { put } from "@vercel/blob"
import { v4 as uuidv4 } from "uuid"

export async function getCurrentUserProfile() {
  const session = await getServerSession(authOptions)

  if (!session) {
    return { error: "Bạn cần đăng nhập để thực hiện hành động này" }
  }

  try {
    const user = await db.user.findUnique({
      where: { id: session.user.id },
    })

    if (!user) {
      return { error: "Không tìm thấy người dùng" }
    }

    let profile = null

    if (user.role === "STUDENT") {
      profile = await db.student.findUnique({
        where: { userId: user.id },
      })
    } else if (user.role === "TEACHER") {
      profile = await db.teacher.findUnique({
        where: { userId: user.id },
      })
    } else if (user.role === "ADMIN") {
      profile = await db.admin.findUnique({
        where: { userId: user.id },
      })
    }

    return { user, profile }
  } catch (error) {
    console.error("Error fetching user profile:", error)
    return { error: "Đã xảy ra lỗi khi lấy thông tin người dùng" }
  }
}

export async function getUsers() {
  try {
    const users = await db.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,
      },
      orderBy: {
        name: "asc",
      },
    })

    return { users }
  } catch (error) {
    console.error("Error fetching users:", error)
    return { error: "Đã xảy ra lỗi khi lấy danh sách người dùng" }
  }
}

export async function updateUserProfile(data: any) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return { error: "Bạn cần đăng nhập để thực hiện hành động này" }
  }

  try {
    // Only update fields that are provided and not empty
    const updateData: any = {}

    if (data.name && data.name.trim() !== "") {
      updateData.name = data.name
    }

    // Update user with non-empty fields
    if (Object.keys(updateData).length > 0) {
      await db.user.update({
        where: { id: session.user.id },
        data: updateData,
      })
    }

    // Update profile based on role
    if (session.user.role === "STUDENT") {
      const studentUpdateData: any = {}

      if (data.phoneNumber !== undefined) {
        studentUpdateData.phoneNumber = data.phoneNumber || null
      }

      if (data.dateOfBirth !== undefined) {
        studentUpdateData.dateOfBirth = data.dateOfBirth ? new Date(data.dateOfBirth) : null
      }

      if (data.address !== undefined) {
        studentUpdateData.address = data.address || null
      }

      if (Object.keys(studentUpdateData).length > 0) {
        await db.student.update({
          where: { userId: session.user.id },
          data: studentUpdateData,
        })
      }
    } else if (session.user.role === "TEACHER") {
      const teacherUpdateData: any = {}

      if (data.phoneNumber !== undefined) {
        teacherUpdateData.phoneNumber = data.phoneNumber || null
      }

      if (data.bio !== undefined) {
        teacherUpdateData.bio = data.bio || null
      }

      if (data.specialties !== undefined) {
        teacherUpdateData.specialties = data.specialties ? data.specialties.split(",").map((s: string) => s.trim()) : []
      }

      if (data.education !== undefined) {
        teacherUpdateData.education = data.education || null
      }

      if (data.experience !== undefined) {
        teacherUpdateData.experience = data.experience || null
      }

      if (Object.keys(teacherUpdateData).length > 0) {
        await db.teacher.update({
          where: { userId: session.user.id },
          data: teacherUpdateData,
        })
      }
    }

    revalidatePath("/dashboard/profile")
    return { success: true }
  } catch (error) {
    console.error("Error updating user profile:", error)
    return { error: "Đã xảy ra lỗi khi cập nhật thông tin cá nhân" }
  }
}

export async function updateUserPassword(data: { currentPassword: string; newPassword: string }) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return { error: "Bạn cần đăng nhập để thực hiện hành động này" }
  }

  try {
    const user = await db.user.findUnique({
      where: { id: session.user.id },
    })

    if (!user || !user.password) {
      return { error: "Không tìm thấy người dùng hoặc tài khoản không có mật khẩu" }
    }

    // Verify current password
    const isPasswordValid = await compare(data.currentPassword, user.password)

    if (!isPasswordValid) {
      return { error: "Mật khẩu hiện tại không chính xác" }
    }

    // Hash new password
    const hashedPassword = await hash(data.newPassword, 10)

    // Update password
    await db.user.update({
      where: { id: session.user.id },
      data: {
        password: hashedPassword,
      },
    })

    return { success: true }
  } catch (error) {
    console.error("Error updating user password:", error)
    return { error: "Đã xảy ra lỗi khi cập nhật mật khẩu" }
  }
}

export async function updateUserAvatar(formData: FormData) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return { error: "Bạn cần đăng nhập để thực hiện hành động này" }
  }

  try {
    const file = formData.get("avatar") as File

    if (!file) {
      return { error: "Không tìm thấy tệp" }
    }

    // Check file type
    if (!file.type.startsWith("image/")) {
      return { error: "Vui lòng chọn một tệp hình ảnh" }
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return { error: "Kích thước tệp không được vượt quá 5MB" }
    }

    // Generate a unique filename
    const filename = `avatars/${session.user.id}/${uuidv4()}-${file.name}`

    // Upload to Vercel Blob
    const blob = await put(filename, file, {
      access: "public",
    })

    // Update user image
    await db.user.update({
      where: { id: session.user.id },
      data: {
        image: blob.url,
      },
    })

    revalidatePath("/dashboard/profile")
    return { success: true, url: blob.url }
  } catch (error) {
    console.error("Error updating user avatar:", error)
    return { error: "Đã xảy ra lỗi khi cập nhật ảnh đại diện" }
  }
}

export async function getAllUsers() {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== "ADMIN") {
    return { error: "Bạn không có quyền thực hiện hành động này" }
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
    })

    return { users }
  } catch (error) {
    console.error("Error fetching all users:", error)
    return { error: "Đã xảy ra lỗi khi lấy danh sách người dùng" }
  }
}

export async function createUser(formData: FormData) {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== "ADMIN") {
    return { error: "Bạn không có quyền thực hiện hành động này" }
  }

  const name = formData.get("name") as string
  const email = formData.get("email") as string
  const role = formData.get("role") as Role
  const password = formData.get("password") as string

  if (!name || !email || !role || !password) {
    return { error: "Vui lòng điền đầy đủ thông tin" }
  }

  try {
    // Check if email already exists
    const existingUser = await db.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return { error: "Email đã được sử dụng" }
    }

    // Hash password
    const hashedPassword = await hash(password, 10)

    // Create user
    const user = await db.user.create({
      data: {
        name,
        email,
        role,
        password: hashedPassword,
      },
    })

    // Create role-specific profile
    if (role === "STUDENT") {
      await db.student.create({
        data: {
          userId: user.id,
        },
      })
    } else if (role === "TEACHER") {
      await db.teacher.create({
        data: {
          userId: user.id,
        },
      })
    } else if (role === "ADMIN") {
      await db.admin.create({
        data: {
          userId: user.id,
        },
      })
    }

    revalidatePath("/admin/users")
    return { success: true, user }
  } catch (error) {
    console.error("Error creating user:", error)
    return { error: "Đã xảy ra lỗi khi tạo người dùng" }
  }
}

export async function updateUserRole(userId: string, role: Role) {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== "ADMIN") {
    return { error: "Bạn không có quyền thực hiện hành động này" }
  }

  try {
    const user = await db.user.findUnique({
      where: { id: userId },
      include: {
        student: true,
        teacher: true,
        admin: true,
      },
    })

    if (!user) {
      return { error: "Không tìm thấy người dùng" }
    }

    // Remove existing role-specific profile
    if (user.student) {
      await db.student.delete({
        where: { userId },
      })
    }

    if (user.teacher) {
      await db.teacher.delete({
        where: { userId },
      })
    }

    if (user.admin) {
      await db.admin.delete({
        where: { userId },
      })
    }

    // Create new role-specific profile
    if (role === "STUDENT") {
      await db.student.create({
        data: {
          userId,
        },
      })
    } else if (role === "TEACHER") {
      await db.teacher.create({
        data: {
          userId,
        },
      })
    } else if (role === "ADMIN") {
      await db.admin.create({
        data: {
          userId,
        },
      })
    }

    // Update user role
    await db.user.update({
      where: { id: userId },
      data: {
        role,
      },
    })

    revalidatePath("/admin/users")
    return { success: true }
  } catch (error) {
    console.error("Error updating user role:", error)
    return { error: "Đã xảy ra lỗi khi cập nhật vai trò người dùng" }
  }
}

export async function deleteUser(userId: string) {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== "ADMIN") {
    return { error: "Bạn không có quyền thực hiện hành động này" }
  }

  try {
    await db.user.delete({
      where: { id: userId },
    })

    revalidatePath("/admin/users")
    return { success: true }
  } catch (error) {
    console.error("Error deleting user:", error)
    return { error: "Đã xảy ra lỗi khi xóa người dùng" }
  }
}

