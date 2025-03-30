"use server";

import { getServerSession } from "next-auth";
import { put } from "@vercel/blob";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { authOptions } from "@/lib/auth";

export async function uploadImage(formData: FormData) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return { error: "Bạn cần đăng nhập để thực hiện hành động này" };
  }

  try {
    const file = formData.get("file") as File;

    if (!file) {
      return { error: "Không tìm thấy file" };
    }

    // Check file type
    if (!file.type.startsWith("image/")) {
      return { error: "Chỉ chấp nhận file hình ảnh" };
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return { error: "Kích thước file không được vượt quá 5MB" };
    }

    // Generate a unique filename
    const filename = `${session.user.id}-${Date.now()}-${file.name}`;

    // Upload to Vercel Blob
    const blob = await put(filename, file, {
      access: "public",
    });

    return { success: true, url: blob.url };
  } catch (error) {
    console.error("Error uploading image:", error);
    return { error: "Đã xảy ra lỗi khi tải lên hình ảnh" };
  }
}

export async function uploadUserAvatar(formData: FormData) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return { error: "Bạn cần đăng nhập để thực hiện hành động này" };
  }

  try {
    const file = formData.get("file") as File;

    if (!file) {
      return { error: "Không tìm thấy file" };
    }

    // Check file type
    if (!file.type.startsWith("image/")) {
      return { error: "Chỉ chấp nhận file hình ảnh" };
    }

    // Check file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      return { error: "Kích thước file không được vượt quá 2MB" };
    }

    // Generate a unique filename
    const filename = `avatars/${session.user.id}-${Date.now()}-${file.name}`;

    // Upload to Vercel Blob
    const blob = await put(filename, file, {
      access: "public",
    });

    // Update user avatar in database
    await db.user.update({
      where: { id: session.user.id },
      data: {
        image: blob.url,
      },
    });

    revalidatePath("/dashboard/profile");
    return { success: true, url: blob.url };
  } catch (error) {
    console.error("Error uploading avatar:", error);
    return { error: "Đã xảy ra lỗi khi tải lên ảnh đại diện" };
  }
}

export async function uploadCourseImage(formData: FormData) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    return { error: "Bạn không có quyền thực hiện hành động này" };
  }

  try {
    const file = formData.get("file") as File;

    if (!file) {
      return { error: "Không tìm thấy file" };
    }

    // Check file type
    if (!file.type.startsWith("image/")) {
      return { error: "Chỉ chấp nhận file hình ảnh" };
    }

    // Check file size (max 3MB)
    if (file.size > 3 * 1024 * 1024) {
      return { error: "Kích thước file không được vượt quá 3MB" };
    }

    // Generate a unique filename
    const filename = `courses/${Date.now()}-${file.name}`;

    // Upload to Vercel Blob
    const blob = await put(filename, file, {
      access: "public",
    });

    return { success: true, url: blob.url };
  } catch (error) {
    console.error("Error uploading course image:", error);
    return { error: "Đã xảy ra lỗi khi tải lên hình ảnh khóa học" };
  }
}
