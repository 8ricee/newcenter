import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";
import { randomBytes } from "crypto";
import { sendEmail } from "@/lib/email"; // Import sendEmail

const forgotPasswordSchema = z.object({
  email: z.string().email({ message: "Email không hợp lệ" }),
});

async function sendPasswordResetEmail(email: string, token: string) {
  const resetLink = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`;
  const html = `<p>Xin chào,</p><p>Bạn đã yêu cầu đặt lại mật khẩu cho tài khoản của mình. Vui lòng nhấp vào liên kết sau để đặt lại mật khẩu:</p><p><a href="${resetLink}">Đặt lại mật khẩu</a></p><p>Liên kết này sẽ hết hạn sau 1 giờ.</p><p>Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.</p><p>Trân trọng,<br/>Đội ngũ hỗ trợ</p>`;
  await sendEmail({
    to: email,
    subject: "Đặt lại mật khẩu",
    html,
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email } = forgotPasswordSchema.parse(body);

    // Check if user exists
    const user = await db.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      // Don't reveal that the user doesn't exist
      return NextResponse.json({ success: true });
    }

    // Generate token
    const token = randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 3600000); // 1 hour

    // Delete any existing tokens for this user
    await db.passwordResetToken.deleteMany({
      where: {
        userId: user.id,
      },
    });

    // Create new token
    await db.passwordResetToken.create({
      data: {
        userId: user.id,
        token,
        expires,
      },
    });

    // Send email
    await sendPasswordResetEmail(email, token);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error processing forgot password:", error);
    return NextResponse.json(
      { error: "Đã xảy ra lỗi khi xử lý yêu cầu đặt lại mật khẩu" },
      { status: 500 }
    );
  }
}
