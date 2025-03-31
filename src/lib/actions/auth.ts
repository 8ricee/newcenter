"use server";

import { db } from "@/lib/db";
import { hash, compare } from "bcryptjs";
import { z } from "zod";
import { Role } from "@prisma/client";
import { randomBytes } from "crypto";
import { sendEmail } from "@/lib/email";
import { signIn } from "next-auth/react";

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

const loginSchema = z.object({
  email: z.string().email({ message: "Email không hợp lệ" }),
  password: z.string().min(1, { message: "Mật khẩu là bắt buộc" }),
});

export async function login(formData: FormData) {
  const validatedFields = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validatedFields.success) {
    return { error: "Email hoặc mật khẩu không hợp lệ" };
  }

  const { email, password } = validatedFields.data;

  try {
    const existingUser = await db.user.findUnique({ where: { email } });

    if (!existingUser || !existingUser.password) {
      return { error: "Email hoặc mật khẩu không chính xác" };
    }

    const passwordsMatch = await compare(password, existingUser.password);

    if (!passwordsMatch) {
      return { error: "Email hoặc mật khẩu không chính xác" };
    }

    return { success: true }; // Authentication successful, NextAuth will handle the session
  } catch (error) {
    console.error("Lỗi đăng nhập:", error);
    return { error: "Đã xảy ra lỗi khi đăng nhập" };
  }
}

export async function loginWithGoogle() {
  try {
    await signIn("google", { redirectTo: "/dashboard" });
    return { success: true };
  } catch (error) {
    console.error("Lỗi đăng nhập bằng Google:", error);
    return { error: "Đã xảy ra lỗi khi đăng nhập bằng Google" };
  }
}

export async function requestPasswordReset(email: string) {
  try {
    // Kiểm tra email có tồn tại không
    const user = await db.user.findUnique({
      where: { email },
    });

    if (!user) {
      return { error: "Email không tồn tại trong hệ thống" };
    }

    // Tạo token đặt lại mật khẩu
    const token = randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 3600000); // 1 giờ

    // Lưu token vào database
    await db.passwordResetToken.upsert({
      where: { userId: user.id },
      update: {
        token,
        expires,
      },
      create: {
        userId: user.id,
        token,
        expires,
      },
    });

    // Gửi email đặt lại mật khẩu
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`;

    await sendEmail({
      to: email,
      subject: "Đặt lại mật khẩu",
      html: `
        <p>Bạn đã yêu cầu đặt lại mật khẩu.</p>
        <p>Vui lòng nhấp vào liên kết sau để đặt lại mật khẩu của bạn:</p>
        <p><a href="${resetUrl}">${resetUrl}</a></p>
        <p>Liên kết này sẽ hết hạn sau 1 giờ.</p>
        <p>Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.</p>
      `,
    });

    return { success: true };
  } catch (error) {
    console.error("Lỗi yêu cầu đặt lại mật khẩu:", error);
    return { error: "Đã xảy ra lỗi khi xử lý yêu cầu đặt lại mật khẩu" };
  }
}

export async function resetPassword(token: string, password: string) {
  try {
    // Kiểm tra token có hợp lệ không
    const passwordReset = await db.passwordResetToken.findFirst({
      where: {
        token,
        expires: {
          gt: new Date(),
        },
      },
      include: {
        user: true,
      },
    });

    if (!passwordReset) {
      return { error: "Token không hợp lệ hoặc đã hết hạn" };
    }

    // Mã hóa mật khẩu mới
    const hashedPassword = await hash(password, 10);

    // Cập nhật mật khẩu
    await db.user.update({
      where: { id: passwordReset.userId },
      data: {
        password: hashedPassword,
      },
    });

    // Xóa token đã sử dụng
    await db.passwordResetToken.delete({
      where: { id: passwordReset.id },
    });

    return { success: true };
  } catch (error) {
    console.error("Lỗi đặt lại mật khẩu:", error);
    return { error: "Đã xảy ra lỗi khi đặt lại mật khẩu" };
  }
}
