"use server";

import { db } from "@/lib/db";
import { hash } from "bcryptjs";
import { z } from "zod";
import { Role } from "@prisma/client";
import { cookies } from "next/headers";

const registerSchema = z.object({
  name: z.string().min(1, { message: "Tên là bắt buộc" }),
  email: z.string().email({ message: "Email không hợp lệ" }),
  password: z.string().min(6, { message: "Mật khẩu phải có ít nhất 6 ký tự" }),
});

export async function register(formData: FormData) {
  const validatedFields = registerSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { name, email, password } = validatedFields.data;

  // Kiểm tra email đã tồn tại chưa
  const existingUser = await db.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    return {
      error: {
        email: ["Email này đã được sử dụng"],
      },
    };
  }

  // Mã hóa mật khẩu
  const hashedPassword = await hash(password, 10);

  try {
    // Tạo user mới
    const user = await db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: Role.STUDENT,
      },
    });

    // Tạo student profile cho user
    await db.student.create({
      data: {
        userId: user.id,
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Lỗi đăng ký:", error);
    return {
      error: {
        _form: ["Đã xảy ra lỗi khi đăng ký. Vui lòng thử lại sau."],
      },
    };
  }
}

export async function login(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return {
      error: "Email và mật khẩu là bắt buộc",
    };
  }

  const cookieStore = await cookies(); // 👈 PHẢI await ở đây

  cookieStore.set("signin-email", email, {
    path: "/",
    maxAge: 60 * 5,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });

  cookieStore.set("signin-password", password, {
    path: "/",
    maxAge: 60 * 5,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });

  cookieStore.set("signin-redirect", "/dashboard", {
    path: "/",
    maxAge: 60 * 5,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });

  return { success: true };
}

export async function loginWithGoogle() {
  const cookieStore = await cookies(); // 👈 PHẢI await ở đây

  cookieStore.set("signin-redirect", "/dashboard", {
    path: "/",
    maxAge: 60 * 5,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });

  return { success: true, provider: "google" };
}
