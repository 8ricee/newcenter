/* eslint-disable @typescript-eslint/no-unused-vars */
"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { EnrollmentStatus } from "@prisma/client";
import { authOptions } from "@/lib/auth";

const paymentSchema = z.object({
  method: z.enum(["BANK", "MOMO"]),
  amount: z.number().min(0),
  enrollmentIds: z.array(z.string()),
  metadata: z.record(z.any()),
});

export async function createPayment(data: z.infer<typeof paymentSchema>) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return { error: "Bạn cần đăng nhập để thực hiện hành động này" };
  }

  const validatedData = paymentSchema.parse(data);

  try {
    // Check if all enrollments belong to the current user
    const enrollments = await db.enrollment.findMany({
      where: {
        id: {
          in: validatedData.enrollmentIds,
        },
      },
      include: {
        student: true,
      },
    });

    const invalidEnrollments = enrollments.filter(
      (enrollment) => enrollment.student.userId !== session.user.id
    );

    if (invalidEnrollments.length > 0) {
      return { error: "Bạn không có quyền thanh toán cho các khóa học này" };
    }

    // Create payment
    const payment = await db.payment.create({
      data: {
        method: validatedData.method,
        amount: validatedData.amount,
        status: "PENDING",
        metadata: validatedData.metadata,
        userId: session.user.id,
        enrollments: {
          connect: validatedData.enrollmentIds.map((id) => ({ id })),
        },
      },
    });

    // Update enrollment status to PENDING_APPROVAL
    await db.enrollment.updateMany({
      where: {
        id: {
          in: validatedData.enrollmentIds,
        },
      },
      data: {
        status: EnrollmentStatus.PENDING,
      },
    });

    revalidatePath("/dashboard/courses");
    revalidatePath("/dashboard/payment");
    return { payment };
  } catch (error) {
    console.error("Error creating payment:", error);
    return { error: "Đã xảy ra lỗi khi tạo thanh toán" };
  }
}

export async function getPaymentsByUserId(userId: string) {
  try {
    const payments = await db.payment.findMany({
      where: {
        userId,
      },
      include: {
        enrollments: {
          include: {
            course: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return { payments };
  } catch (error) {
    console.error("Error fetching payments:", error);
    return { error: "Đã xảy ra lỗi khi lấy danh sách thanh toán" };
  }
}

export async function getAllPayments() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    return { error: "Bạn không có quyền thực hiện hành động này" };
  }

  try {
    const payments = await db.payment.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        enrollments: {
          include: {
            course: true,
            student: {
              include: {
                user: {
                  select: {
                    name: true,
                    email: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return { payments };
  } catch (error) {
    console.error("Error fetching all payments:", error);
    return { error: "Đã xảy ra lỗi khi lấy danh sách thanh toán" };
  }
}

export async function approvePayment(paymentId: string) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    return { error: "Bạn không có quyền thực hiện hành động này" };
  }

  try {
    // Update payment status
    const payment = await db.payment.update({
      where: {
        id: paymentId,
      },
      data: {
        status: "COMPLETED",
      },
      include: {
        enrollments: true,
      },
    });

    // Update enrollment status
    await db.enrollment.updateMany({
      where: {
        id: {
          in: payment.enrollments.map((e) => e.id),
        },
      },
      data: {
        status: EnrollmentStatus.ACTIVE,
      },
    });

    revalidatePath("/admin/payments");
    revalidatePath("/admin/enrollments");
    return { success: true };
  } catch (error) {
    console.error("Error approving payment:", error);
    return { error: "Đã xảy ra lỗi khi xác nhận thanh toán" };
  }
}

export async function rejectPayment(paymentId: string) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    return { error: "Bạn không có quyền thực hiện hành động này" };
  }

  try {
    // Update payment status
    const payment = await db.payment.update({
      where: {
        id: paymentId,
      },
      data: {
        status: "REJECTED",
      },
      include: {
        enrollments: true,
      },
    });

    revalidatePath("/admin/payments");
    return { success: true };
  } catch (error) {
    console.error("Error rejecting payment:", error);
    return { error: "Đã xảy ra lỗi khi từ chối thanh toán" };
  }
}
