/* eslint-disable @typescript-eslint/no-explicit-any */
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string) {
  return new Date(date).toLocaleString("vi-VN", {
    day: "numeric",
    month: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });
}

export function formatDateOnly(date: Date | string) {
  return new Date(date).toLocaleDateString("vi-VN", {
    day: "numeric",
    month: "numeric",
    year: "numeric",
  });
}

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
}

export function getInitials(name: string | null | undefined): string {
  if (!name) return "U";

  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();

  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

export function getFileIcon(fileType: string | null | undefined) {
  if (!fileType) return "file";

  if (fileType.startsWith("image/")) return "image";
  if (fileType.startsWith("video/")) return "video";
  if (fileType.startsWith("audio/")) return "audio";
  if (fileType.includes("pdf")) return "file-text";
  if (fileType.includes("word") || fileType.includes("document"))
    return "file-text";
  if (fileType.includes("excel") || fileType.includes("sheet"))
    return "file-spreadsheet";
  if (fileType.includes("powerpoint") || fileType.includes("presentation"))
    return "file-presentation";
  if (
    fileType.includes("zip") ||
    fileType.includes("rar") ||
    fileType.includes("tar")
  )
    return "archive";

  return "file";
}

export function formatTime(date: Date | string) {
  return new Date(date).toLocaleString("vi-VN", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });
}

// Check if messages are from the same sequence (same sender within timeThreshold)
export function isMessageInSequence(
  currentMsg: any,
  previousMsg: any,
  timeThresholdMinutes: number = 5
) {
  if (!previousMsg) return false;
  if (currentMsg.senderId !== previousMsg.senderId) return false;

  const currentTime = new Date(currentMsg.createdAt).getTime();
  const previousTime = new Date(previousMsg.createdAt).getTime();

  // Check if the messages are within the time threshold
  return currentTime - previousTime < timeThresholdMinutes * 60 * 1000;
}

// Check if messages should have a date divider (time difference > timeThreshold)
export function needsDateDivider(
  currentMsg: any,
  previousMsg: any,
  timeThresholdMinutes: number = 20
) {
  if (!previousMsg) return false;

  const currentTime = new Date(currentMsg.createdAt).getTime();
  const previousTime = new Date(previousMsg.createdAt).getTime();

  // Check if the time difference exceeds the threshold
  return currentTime - previousTime > timeThresholdMinutes * 60 * 1000;
}
