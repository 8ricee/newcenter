import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { hash } from "bcrypt";
import { z } from "zod";

const resetPasswordSchema = z.object({
  token: z.string().min(1),
  password: z.string().min(6, { message: "Mật khẩu phải có ít nhất 6 ký tự" }),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { token, password } = resetPasswordSchema.parse(body);

    // Find password reset token
    const passwordResetToken = await db.passwordResetToken.findUnique({
      where: {
        token,
        expires: {
          gt: new Date(),
        },
      },
      include: {
        user: true, // Include the user to get the email
      },
    });

    if (!passwordResetToken) {
      return NextResponse.json(
        { error: "Token không hợp lệ hoặc đã hết hạn" },
        { status: 400 }
      );
    }

    // Hash new password
    const hashedPassword = await hash(password, 10);

    // Update user password
    await db.user.update({
      where: {
        id: passwordResetToken.userId, // Use userId from the token
      },
      data: {
        password: hashedPassword,
      },
    });

    // Delete used token
    await db.passwordResetToken.delete({
      where: {
        id: passwordResetToken.id,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error resetting password:", error);
    return NextResponse.json(
      { error: "Đã xảy ra lỗi khi đặt lại mật khẩu" },
      { status: 500 }
    );
  }
}
